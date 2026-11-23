import { test } from "node:test";
import assert from "node:assert/strict";
import { EventSource, stateIntervals } from "../src/events";

test("intervals of the target state, clipped to the window, open at the end", () => {
  const data = { t: [0, 10, 20, 30, 40], s: ["off", "on", "off", "on", "unavailable"] };
  assert.deepEqual(stateIntervals(data, ["on"], 0, 100), [
    { from: 10, to: 20, open: false },
    { from: 30, to: 40, open: false },
  ]);
  const running = { t: [0, 50], s: ["off", "ON"] };
  assert.deepEqual(stateIntervals(running, ["on"], 0, 100), [{ from: 50, to: 100, open: true }]);
});

test("several target states and intervals outside the window", () => {
  const data = { t: [0, 10, 20, 30], s: ["heat", "idle", "cool", "idle"] };
  assert.deepEqual(stateIntervals(data, ["heat", "cool"], 15, 100), [{ from: 20, to: 30, open: false }]);
});

test("EventSource: after a reconnect only the gap is requested, not the whole window again", async () => {
  (globalThis as any).window ??= globalThis;
  const msgs: any[] = [];
  const opts: any[] = [];
  const cbs: Array<(m: any) => void> = [];
  const listeners: Record<string, Array<() => void>> = {};
  const hass: any = {
    connection: {
      subscribeMessage: async (cb: any, msg: any, o: any) => {
        msgs.push(msg);
        opts.push(o);
        cbs.push(cb);
        return async () => undefined;
      },
      addEventListener: (t: string, f: () => void) => (listeners[t] ??= []).push(f),
      removeEventListener: () => undefined,
    },
  };
  const src = new EventSource(hass, ["binary_sensor.window"], 24, () => undefined);
  src.start();
  try {
    await new Promise((r) => setTimeout(r, 0));
    const t = Date.now() - 3_600_000;
    cbs[0]({ states: { "binary_sensor.window": [{ s: "on", lu: t / 1000 }] } });
    listeners.disconnected.forEach((f) => f());
    listeners.ready.forEach((f) => f());
    await new Promise((r) => setTimeout(r, 0));
    assert.equal(msgs.length, 2);
    assert.equal(Date.parse(msgs[1].start_time), t);
    assert.deepEqual(opts[1], { resubscribe: false });
  } finally {
    src.dispose();
  }
});
