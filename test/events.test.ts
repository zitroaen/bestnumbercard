import { test } from "node:test";
import assert from "node:assert/strict";
import { stateIntervals } from "../src/events";

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
