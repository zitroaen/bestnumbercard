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

test("band uses the real min/max of the statistics", async () => {
  const { bandPath } = await import("../src/graph");
  const b = aggregate({ t: [0, 50], v: [10, 20], lo: [5, 18], hi: [15, 30] }, 0, 100, 2);
  assert.deepEqual([...b.bandLo], [5, 18]);
  assert.deepEqual([...b.bandHi], [15, 30]);
  assert.deepEqual([...b.mean], [10, 20]);
  assert.match(bandPath(b, 100, (v) => v), /^M0,15L100,30L100,18L0,5Z$/);
});

test("time ticks: nice steps, 'now' on the right, nothing next to the y-axis labels", async () => {
  const { timeTicks } = await import("../src/graph");
  const t = timeTicks(24, 380);
  assert.deepEqual(t.map((x) => x.hours), [18, 12, 6, 0]);
  assert.equal(t[t.length - 1].x, 380);
  assert.ok(t.every((x) => x.x >= 70));
  // one week on 380 px: steps of two days, labels in hours from now
  assert.deepEqual(timeTicks(168, 380).map((x) => x.hours), [96, 48, 0]); // −144 h would collide with the y-axis labels
});

test("outages: a mostly unavailable pixel is a gap, a short blip is not", () => {
  // 0..100 valid, 100..160 unavailable, 160.. valid again; buckets of 100
  const b = aggregate({ t: [0, 100, 160], v: [5, NaN, 6] }, 0, 300, 3);
  assert.equal(b.mean[0], 5);
  assert.ok(Number.isNaN(b.mean[1]), "60 % unavailable → gap");
  assert.equal(b.mean[2], 6);
  const c = aggregate({ t: [0, 100, 110], v: [5, NaN, 6] }, 0, 200, 2);
  assert.ok(Number.isFinite(c.mean[1]), "10 % unavailable → no gap");
});
