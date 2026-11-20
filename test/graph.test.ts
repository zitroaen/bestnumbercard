import { test } from "node:test";
import assert from "node:assert/strict";
import { aggregate, toPoints } from "../src/graph";

test("time-weighted mean with carry-forward", () => {
  // value 0 before the window, 10 from t=50
  const b = aggregate({ t: [-100, 50], v: [0, 10] }, 0, 100, 2);
  assert.deepEqual([...b.mean], [0, 10]);
  const c = aggregate({ t: [-100, 25], v: [0, 10] }, 0, 100, 1);
  assert.equal(c.mean[0], 7.5);
});

test("spikes are kept in min/max", () => {
  const b = aggregate({ t: [0, 10, 11], v: [1, 100, 1] }, 0, 100, 1);
  assert.equal(b.max[0], 100);
  assert.equal(b.min[0], 1);
  const pts = toPoints(b, 2, 100, (v) => v);
  assert.ok(pts[0].some(([, y]) => y === 100));
});

test("no data before first point and unavailable produce gaps", () => {
  const b = aggregate({ t: [50, 60, 80], v: [1, NaN, 2] }, 0, 100, 10);
  assert.ok(Number.isNaN(b.mean[0]));
  assert.ok(Number.isNaN(b.mean[7]));
  const segs = toPoints(b, 1, 100, (v) => v);
  assert.equal(segs.length, 2);
});

test("large input is fast", () => {
  const n = 500_000;
  const t = Array.from({ length: n }, (_, i) => i * 1000);
  const v = t.map((x) => Math.sin(x / 1e6));
  const s = performance.now();
  aggregate({ t, v }, 0, n * 1000, 200);
  assert.ok(performance.now() - s < 200, "aggregation too slow");
});
