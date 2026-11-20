import { test } from "node:test";
import assert from "node:assert/strict";
import { colorAt, gradientStops, parseColor, sortStops } from "../src/color-scale";

const resolve = (c: string) => parseColor(c);
const css = (stops: any, mode: any, v: number) => colorAt(sortStops(stops), mode, v, resolve).slice(0, 3).map(Math.round);

test("hard jump with equal values (green below 0, red otherwise)", () => {
  const s = [{ value: 0, color: "#00ff00" }, { value: 0, color: "#ff0000" }];
  assert.deepEqual(css(s, "gradient", -5), [0, 255, 0]);
  assert.deepEqual(css(s, "gradient", -0.001), [0, 255, 0]);
  assert.deepEqual(css(s, "gradient", 0), [255, 0, 0]);
  assert.deepEqual(css(s, "gradient", 12), [255, 0, 0]);
});

test("gradient up to 95, then jump to dark red", () => {
  const s = [
    { value: 20, color: "#0000ff" },
    { value: 95, color: "#ffa500" },
    { value: 95, color: "#8b0000" },
  ];
  assert.deepEqual(css(s, "gradient", 10), [0, 0, 255]);
  assert.deepEqual(css(s, "gradient", 57.5), [128, 83, 128]);
  assert.deepEqual(css(s, "gradient", 94.99).slice(0, 1), [255]);
  assert.deepEqual(css(s, "gradient", 95), [139, 0, 0]);
  assert.deepEqual(css(s, "gradient", 120), [139, 0, 0]);
});

test("step mode", () => {
  const s = [{ value: 10, color: "#0000ff" }, { value: 20, color: "#ff0000" }];
  assert.deepEqual(css(s, "step", 0), [0, 0, 255]);
  assert.deepEqual(css(s, "step", 15), [0, 0, 255]);
  assert.deepEqual(css(s, "step", 20), [255, 0, 0]);
});

test("unsorted input is sorted stably", () => {
  const s = sortStops([{ value: 5, color: "a" }, { value: 1, color: "b" }, { value: 5, color: "c" }]);
  assert.deepEqual(s.map((x) => x.color), ["b", "a", "c"]);
});

test("svg gradient stops contain the jump", () => {
  const s = sortStops([
    { value: 20, color: "#0000ff" },
    { value: 95, color: "#ffa500" },
    { value: 95, color: "#8b0000" },
  ]);
  const g = gradientStops(s, "gradient", 0, 100, resolve);
  assert.deepEqual(g.map((x) => x.offset), [0, 0.2, 0.95, 0.95, 1]);
  assert.equal(g[2].color, "rgb(255,165,0)");
  assert.equal(g[3].color, "rgb(139,0,0)");
  const st = gradientStops(sortStops([{ value: 0, color: "#00ff00" }, { value: 50, color: "#ff0000" }]), "step", 0, 100, resolve);
  assert.deepEqual(st.map((x) => x.offset), [0, 0.5, 0.5, 1]);
});

test("time gradient: vertical bands with a jump between two points", async () => {
  const { timeGradientStops } = await import("../src/color-scale");
  const s = sortStops([{ value: 0, color: "#00ff00" }, { value: 0, color: "#ff0000" }]);
  const g = timeGradientStops(s, "gradient", [-1, -1, -1, 1, 1], resolve);
  assert.deepEqual(g.map((x) => x.offset), [0, 0.625, 0.625, 1]);
  assert.equal(g[1].color, "rgb(0,255,0)");
  assert.equal(g[2].color, "rgb(255,0,0)");
});

test("editor rows: equal values become one row with a jump and back", async () => {
  const { stopsToRows, rowsToStops, jumpValues } = await import("../src/presets");
  const stops = [
    { value: 20, color: "blue" },
    { value: 95, color: "orange" },
    { value: 95, color: "darkred" },
  ];
  const rows = stopsToRows(stops);
  assert.deepEqual(rows, [
    { value: 20, color: "blue" },
    { value: 95, below: "orange", color: "darkred" },
  ]);
  assert.deepEqual(rowsToStops(rows), stops);
  assert.deepEqual(jumpValues(stops), [95]);
  assert.deepEqual(jumpValues([{ value: 0, color: "a" }, { value: 10, color: "b" }], "step"), [10]);
});
