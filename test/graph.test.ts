import { test } from "node:test";
import assert from "node:assert/strict";
import { aggregate, toPoints, quantile, scaleY } from "../src/graph";

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

test("quantile ignores gaps and interpolates", () => {
  assert.equal(quantile([NaN, 1, 2, 3, 4, 5], 0.5), 3);
  assert.equal(quantile([0, 10], 0.25), 2.5);
  assert.ok(Number.isNaN(quantile([NaN], 0.5)));
});

test("scaleY: peaks rise into the room above, compressed when they do not fit", () => {
  // 0…100 fills 100…0 px
  const plain = scaleY(0, 100, 0, 100);
  assert.equal(plain(50), 50);
  assert.equal(plain(500), 0); // clipped
  // the peak fits into the 40 px room: one linear scale up to the top of the room
  const fits = scaleY(0, 100, 0, 100, { max: 130, room: 40 });
  assert.equal(fits(130), -40);
  assert.equal(fits(65), 30);
  // a much higher peak is squeezed into the room
  const squeezed = scaleY(0, 100, 0, 100, { max: 1100, room: 40 });
  assert.equal(squeezed(1100), -40);
  assert.equal(squeezed(600), -20);
  assert.equal(squeezed(5000), -40);
});

test("scaleY reports the value at the top and the highest drawable value", () => {
  assert.equal(scaleY(0, 100, 0, 100).topValue, 100);
  const fits = scaleY(0, 100, 0, 100, { max: 130, room: 40 });
  assert.equal(fits.maxValue, 130);
  assert.ok(Math.abs(fits.topValue - 130 * (100 / 140)) < 1e-9);
  const squeezed = scaleY(0, 100, 0, 100, { max: 1100, room: 40 });
  assert.equal(squeezed.topValue, 100);
  assert.equal(squeezed.maxValue, 1100);
});

test("detail 2 keeps the peaks of long-term statistics (their min / max columns)", () => {
  // three 5-minute buckets: mean 300, but one had a short spike to 3000
  const data = { t: [0, 300, 600], v: [300, 320, 310], lo: [250, 200, 260], hi: [400, 3000, 380] };
  const b = aggregate(data, 0, 900, 3);
  const pts = toPoints(b, 2, 100, (v) => -v).flat();
  assert.ok(pts.some(([, y]) => y === -3000), "the spike is drawn");
  // detail 1 stays the smooth average
  const smooth = toPoints(b, 1, 100, (v) => -v).flat();
  assert.ok(!smooth.some(([, y]) => y === -3000));
});

test("time ticks for a panned / zoomed range stay at whole steps before now", async () => {
  const { timeTicksRange } = await import("../src/graph");
  const H = 3_600_000;
  const now = 100 * H;
  // 6 h window, 30 h back: ticks at −36 h … −30 h, no "now"
  const t = timeTicksRange(now - 36 * H, now - 30 * H, now, 380);
  assert.ok(t.length >= 2);
  assert.ok(t.every((x) => x.hours >= 30 && x.hours <= 36));
  assert.ok(!t.some((x) => x.hours === 0));
  // zoomed into 30 minutes: minute steps
  const z = timeTicksRange(now - 0.5 * H, now, now, 380);
  assert.equal(z[z.length - 1].hours, 0);
  assert.ok(z.some((x) => x.hours > 0 && x.hours < 0.5));
});

test("clock-aligned buckets: scrolling a bit only moves them, the values don't change (no jitter)", async () => {
  const { aggregateAligned } = await import("../src/graph");
  const t: number[] = [];
  const v: number[] = [];
  for (let i = 0; i < 1000; i++) {
    t.push(i * 7);
    v.push(Math.sin(i) * 100);
  }
  const a = aggregateAligned({ t, v }, 1000, 5000, 100, 400);
  const b = aggregateAligned({ t, v }, 1013, 5013, 100, 400); // scrolled by a third of a bucket
  // same grid: bucket borders at multiples of 40 ms
  assert.equal(a.dx, b.dx);
  const shift = Math.round(((b.x0! - a.x0!) / a.dx!) * 1000) / 1000;
  assert.ok(Math.abs(shift + 13 / 40) < 1e-9, "the grid moves by exactly the scrolled distance");
  for (let i = 0; i < 90; i++) assert.equal(a.mean[i], b.mean[i]);
});
