import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";

// minimal browser globals for the data layer
(globalThis as any).window ??= globalThis;
(globalThis as any).document ??= { visibilityState: "visible" };

const { DataSource, clearCache } = await import("../src/data");

const H = 3_600_000;
const flush = () => new Promise((r) => setTimeout(r, 0));

interface Sub {
  msg: any;
  options: any;
  cb: (m: any) => void;
  active: boolean;
}

function fakeHass(stats: Record<string, any[]> = {}) {
  const subs: Sub[] = [];
  const listeners: Record<string, Array<() => void>> = {};
  const ws: any[] = [];
  const hass: any = {
    states: {},
    language: "en",
    connection: {
      subscribeMessage: async (cb: any, msg: any, options: any) => {
        const sub: Sub = { msg, options, cb, active: true };
        subs.push(sub);
        return async () => {
          sub.active = false;
        };
      },
      addEventListener: (ev: string, cb: () => void) => (listeners[ev] ??= []).push(cb),
      removeEventListener: (ev: string, cb: () => void) => {
        listeners[ev] = (listeners[ev] ?? []).filter((x) => x !== cb);
      },
    },
    callWS: async (msg: any) => {
      ws.push(msg);
      return stats;
    },
    callService: async () => undefined,
  };
  const emit = (ev: string) => (listeners[ev] ?? []).forEach((cb) => cb());
  return { hass, subs, ws, emit, listeners };
}

const opts = (entities: string[], onChange = () => {}, hours = 2) => ({
  entities,
  hoursToShow: hours,
  statisticsThreshold: 6,
  onChange,
});

beforeEach(() => clearCache());

test("history/stream asks only for real state changes and handles reconnects itself", async () => {
  const { hass, subs } = fakeHass();
  const ds = new DataSource(hass, opts(["sensor.a"]));
  await ds.start();
  assert.equal(subs.length, 1);
  assert.equal(subs[0].msg.significant_changes_only, true);
  assert.equal(subs[0].msg.no_attributes, true);
  assert.deepEqual(subs[0].options, { resubscribe: false });
  ds.dispose();
});

test("two cards with the same entity share one subscription", async () => {
  const { hass, subs } = fakeHass();
  let a = 0;
  let b = 0;
  const ds1 = new DataSource(hass, opts(["sensor.a"], () => a++));
  const ds2 = new DataSource(hass, opts(["sensor.a"], () => b++));
  await ds1.start();
  await ds2.start();
  assert.equal(subs.length, 1, "only one history/stream subscription");
  await flush();
  a = b = 0;
  subs[0].cb({ states: { "sensor.a": [{ s: "21.5", lu: Date.now() / 1000 }] } });
  await flush();
  assert.ok(a > 0 && b > 0, "both cards are notified");
  assert.deepEqual(ds2.series("sensor.a")!.v, [21.5]);
  assert.ok(ds1.loaded && ds2.loaded);

  // the owner goes away: the other card takes over, asking only for the gap
  ds1.dispose();
  assert.equal(subs[0].active, false);
  assert.equal(subs.length, 2);
  const from = Date.parse(subs[1].msg.start_time);
  assert.ok(Date.now() - from < 2 * 60_000, "resumes near now, not from the window start");
  ds2.dispose();
});

test("after a lost connection only the gap is requested", async () => {
  const { hass, subs, emit, listeners } = fakeHass();
  const ds = new DataSource(hass, opts(["sensor.a", "sensor.b"]));
  await ds.start();
  const windowStart = Date.parse(subs[0].msg.start_time);
  assert.ok(Date.now() - windowStart > 1.9 * H);
  emit("disconnected");
  emit("ready");
  assert.equal(subs.length, 2);
  assert.deepEqual(subs[1].msg.entity_ids, ["sensor.a", "sensor.b"]);
  assert.ok(Date.now() - Date.parse(subs[1].msg.start_time) < 2 * 60_000);
  ds.dispose();
  assert.equal(listeners.ready.length, 0, "listeners are removed");
});

test("long windows: statistics first, raw history only for the tail", async () => {
  const now = Date.now();
  const start = Math.floor((now - 24 * H) / 300_000) * 300_000;
  const rows = [];
  for (let t = start; t < now - 10 * 60_000; t += 300_000) rows.push({ start: t, end: t + 300_000, mean: 10 });
  const { hass, subs, ws } = fakeHass({ "sensor.a": rows });
  const ds = new DataSource(hass, opts(["sensor.a"], () => {}, 24));
  await ds.start();
  assert.equal(ws.length, 1);
  assert.equal(ws[0].type, "recorder/statistics_during_period");
  const statsEnd = rows[rows.length - 1].end;
  assert.ok(Date.parse(subs[0].msg.start_time) >= statsEnd - 60_000, "raw stream starts at the end of the statistics");
  subs[0].cb({ states: { "sensor.a": [{ s: "42", lu: (statsEnd + 1000) / 1000 }] } });
  const s = ds.series("sensor.a")!;
  assert.equal(s.v[0], 10);
  assert.equal(s.v[s.v.length - 1], 42);
  assert.ok(s.t.every((t, i) => i === 0 || t > s.t[i - 1]), "timestamps are strictly increasing");

  // a second card with the same window does not fetch the statistics again
  const ds2 = new DataSource(hass, opts(["sensor.a"], () => {}, 24));
  await ds2.start();
  assert.equal(ws.length, 1);
  ds.dispose();
  ds2.dispose();
});

test("old points are dropped while the dashboard stays open", async () => {
  const { hass, subs } = fakeHass();
  const ds = new DataSource(hass, opts(["sensor.a"], () => {}, 1));
  await ds.start();
  const now = Date.now();
  subs[0].cb({
    states: { "sensor.a": [3, 2, 1.5, 0.5].map((h, i) => ({ s: String(i), lu: (now - h * H) / 1000 })) },
  });
  ds.maintain();
  // 3 h and 2 h are gone, 1.5 h stays as carry-forward value, 0.5 h is inside the window
  assert.deepEqual(ds.series("sensor.a")!.v, [2, 3]);
  ds.dispose();
});
