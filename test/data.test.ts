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

test("taking over while still loading statistics does not subscribe twice", async () => {
  const now = Date.now();
  const rows = [{ start: now - 30 * 60_000, end: now - 25 * 60_000, mean: 1 }];
  const { hass, subs } = fakeHass({ "sensor.a": rows });
  const ds1 = new DataSource(hass, opts(["sensor.a"], () => {}, 24));
  await ds1.start();
  const ds2 = new DataSource(hass, opts(["sensor.a"], () => {}, 24));
  const starting = ds2.start(); // registers as subscriber, then awaits nothing (stats cached)
  ds1.dispose(); // ds2 adopts the entity
  await starting;
  const active = subs.filter((s) => s.active);
  assert.equal(active.length, 1, "exactly one live subscription");
  ds2.dispose();
});

test("attributes: full states are streamed, the attribute value is used, no statistics", async () => {
  const { hass, subs, ws } = fakeHass({});
  const { seriesId } = await import("../src/data");
  const sid = seriesId("climate.living", "temperature");
  const ds = new DataSource(hass, opts([sid, "sensor.a"], () => {}, 24));
  await ds.start();
  // statistics only for the state series
  assert.deepEqual(ws[0].statistic_ids, ["sensor.a"]);
  const attrSub = subs.find((s) => s.msg.no_attributes === false)!;
  assert.ok(attrSub, "separate subscription with attributes");
  assert.deepEqual(attrSub.msg.entity_ids, ["climate.living"]);
  const now = Date.now() / 1000;
  attrSub.cb({
    states: {
      "climate.living": [
        { s: "heat", a: { temperature: 21 }, lu: now - 100 },
        { s: "heat", a: { temperature: 21.5 }, lu: now - 50 },
      ],
    },
  });
  assert.deepEqual(ds.series(sid)!.v, [21, 21.5]);
  ds.dispose();
});

test("statistics min/max are kept for the band", async () => {
  const now = Date.now();
  const t0 = Math.floor((now - 20 * H) / 300_000) * 300_000;
  const { hass } = fakeHass({ "sensor.a": [{ start: t0, end: t0 + 300_000, mean: 10, min: 5, max: 15 }] });
  const ds = new DataSource(hass, opts(["sensor.a"], () => {}, 24));
  await ds.start();
  const s = ds.series("sensor.a")!;
  assert.deepEqual([s.v[0], s.lo![0], s.hi![0]], [10, 5, 15]);
  ds.dispose();
});

test("missing statistics rows (sensor unavailable) become a gap", async () => {
  const now = Date.now();
  const t0 = Math.floor((now - 20 * H) / 300_000) * 300_000;
  const P = 300_000;
  const rows = [
    { start: t0, end: t0 + P, mean: 1 },
    // t0+P … t0+3P: no rows → sensor was unavailable
    { start: t0 + 3 * P, end: t0 + 4 * P, mean: 2 },
  ];
  const { hass } = fakeHass({ "sensor.a": rows });
  const ds = new DataSource(hass, opts(["sensor.a"], () => {}, 24));
  await ds.start();
  const s = ds.series("sensor.a")!;
  assert.deepEqual(s.t.slice(0, 3), [t0, t0 + P, t0 + 3 * P]);
  assert.ok(Number.isNaN(s.v[1]));
  ds.dispose();
});

test("detail series: statistics are a preview, then the full raw history replaces them", async () => {
  const now = Date.now();
  const t0 = Math.floor((now - 20 * H) / 300_000) * 300_000;
  const { hass, subs, ws } = fakeHass({ "sensor.power": [{ start: t0, end: t0 + 300_000, mean: 100, min: 50, max: 900 }] });
  const ds = new DataSource(hass, { ...opts(["sensor.power"], () => {}, 24), detail: ["sensor.power"] });
  await ds.start();
  await flush();
  // raw history is requested for the WHOLE window, statistics only once as a preview
  assert.ok(now - Date.parse(subs[0].msg.start_time) > 23.9 * H);
  assert.equal(ws.length, 1);
  assert.deepEqual(ds.series("sensor.power")!.v, [100], "preview from statistics");
  assert.equal(ds.loaded, false, "still loading the details");
  subs[0].cb({
    states: {
      "sensor.power": [
        { s: "120", lu: (now - 10 * H) / 1000 },
        { s: "2500", lu: (now - 10 * H + 20_000) / 1000 },
        { s: "130", lu: (now - 10 * H + 40_000) / 1000 },
      ],
    },
  });
  assert.deepEqual(ds.series("sensor.power")!.v, [120, 2500, 130], "the short peak is there");
  assert.equal(ds.loaded, true);
  ds.dispose();
});

test("detail series: an empty raw history keeps the statistics preview", async () => {
  const now = Date.now();
  const t0 = Math.floor((now - 20 * H) / 300_000) * 300_000;
  const { hass, subs } = fakeHass({ "sensor.power": [{ start: t0, end: t0 + 300_000, mean: 100 }] });
  const ds = new DataSource(hass, { ...opts(["sensor.power"], () => {}, 24), detail: ["sensor.power"] });
  await ds.start();
  await flush();
  subs[0].cb({ states: {} }); // HA answers, but without any states
  assert.equal(ds.loaded, true);
  assert.deepEqual(ds.series("sensor.power")!.v, [100]);
  ds.dispose();
});

test("a failing history subscription is reported instead of silently showing no data", async () => {
  const { hass } = fakeHass();
  hass.connection.subscribeMessage = async () => {
    throw { code: "unknown_error", message: "Database timeout" };
  };
  const ds = new DataSource(hass, opts(["sensor.a"]));
  await ds.start();
  await flush();
  assert.equal(ds.loaded, true);
  assert.deepEqual(ds.errors(), ["sensor.a: Database timeout"]);
  ds.dispose();
});
