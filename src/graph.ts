import { lowerBound } from "./data";
import type { SeriesData } from "./types";

export interface Buckets {
  start: number;
  end: number;
  mean: Float64Array;
  min: Float64Array;
  max: Float64Array;
  /** true when the minimum occurred before the maximum inside the bucket */
  minFirst: Uint8Array;
}

/**
 * Aggregate a step-function time series into `n` equal buckets in O(points + n).
 * A sensor keeps its value until the next state change, so the mean is
 * time-weighted and empty buckets carry the previous value forward.
 * Non-numeric states (unavailable/unknown) become gaps (NaN).
 */
export function aggregate(data: SeriesData, start: number, end: number, n: number): Buckets {
  const mean = new Float64Array(n).fill(NaN);
  const min = new Float64Array(n).fill(NaN);
  const max = new Float64Array(n).fill(NaN);
  const minFirst = new Uint8Array(n);
  const { t, v } = data;
  const len = t.length;
  const bw = (end - start) / n;
  let idx = lowerBound(t, start);
  let cur = idx > 0 ? v[idx - 1] : NaN;

  for (let b = 0; b < n; b++) {
    const bStart = start + b * bw;
    const bEnd = b === n - 1 ? end : bStart + bw;
    let segStart = bStart;
    let sum = 0;
    let dur = 0;
    let mn = Infinity;
    let mx = -Infinity;
    let tMin = 0;
    let tMax = 0;
    const take = (val: number, from: number, to: number) => {
      if (!Number.isFinite(val)) return;
      const d = to - from;
      if (d > 0) {
        sum += val * d;
        dur += d;
      }
      if (val < mn) {
        mn = val;
        tMin = from;
      }
      if (val > mx) {
        mx = val;
        tMax = from;
      }
    };
    while (idx < len && t[idx] < bEnd) {
      take(cur, segStart, t[idx]);
      cur = v[idx];
      segStart = Math.max(t[idx], bStart);
      idx++;
    }
    take(cur, segStart, bEnd);
    if (mn !== Infinity) {
      mean[b] = dur > 0 ? sum / dur : (mn + mx) / 2;
      min[b] = mn;
      max[b] = mx;
      minFirst[b] = tMin <= tMax ? 1 : 0;
    }
  }
  return { start, end, mean, min, max, minFirst };
}

export type Point = [number, number];

/**
 * Turn buckets into polyline segments (split at gaps).
 * detail 1: one averaged point per bucket (smooth, like the sensor card)
 * detail 2: min and max per bucket in time order – no spike gets lost.
 */
export function toPoints(
  b: Buckets,
  detail: 1 | 2,
  width: number,
  y: (v: number) => number,
): Point[][] {
  const n = b.mean.length;
  const segs: Point[][] = [];
  let seg: Point[] = [];
  const step = n > 1 ? width / (n - 1) : 0;
  for (let i = 0; i < n; i++) {
    const x = n > 1 ? i * step : width;
    if (Number.isNaN(b.mean[i])) {
      if (seg.length) segs.push(seg);
      seg = [];
      continue;
    }
    if (detail === 2 && b.max[i] - b.min[i] > 0) {
      const dx = step / 4;
      const first = b.minFirst[i] ? b.min[i] : b.max[i];
      const second = b.minFirst[i] ? b.max[i] : b.min[i];
      seg.push([Math.max(0, x - dx), y(first)], [Math.min(width, x + dx), y(second)]);
    } else {
      seg.push([x, y(b.mean[i])]);
    }
  }
  if (seg.length) segs.push(seg);
  return segs;
}

const r = (x: number) => Math.round(x * 10) / 10;

/** SVG path; smoothing uses quadratic curves through midpoints like the HA sensor card. */
export function linePath(seg: Point[], smooth: boolean): string {
  if (!seg.length) return "";
  if (seg.length === 1) return `M${r(seg[0][0])},${r(seg[0][1])}h0.01`;
  let d = `M${r(seg[0][0])},${r(seg[0][1])}`;
  if (!smooth || seg.length < 3) {
    for (let i = 1; i < seg.length; i++) d += `L${r(seg[i][0])},${r(seg[i][1])}`;
    return d;
  }
  for (let i = 1; i < seg.length - 1; i++) {
    const [x, y] = seg[i];
    const mx = (x + seg[i + 1][0]) / 2;
    const my = (y + seg[i + 1][1]) / 2;
    d += `Q${r(x)},${r(y)} ${r(mx)},${r(my)}`;
  }
  const last = seg[seg.length - 1];
  d += `L${r(last[0])},${r(last[1])}`;
  return d;
}

export function fillPath(seg: Point[], smooth: boolean, bottom: number): string {
  if (seg.length < 2) return "";
  return `${linePath(seg, smooth)}L${r(seg[seg.length - 1][0])},${bottom}L${r(seg[0][0])},${bottom}Z`;
}

/** Find the bucket value at x (for tooltips). */
export function valueAtX(b: Buckets, x: number, width: number): number {
  const n = b.mean.length;
  if (!n) return NaN;
  const i = Math.min(n - 1, Math.max(0, Math.round((x / width) * (n - 1))));
  return b.mean[i];
}

/** Range of the visible data incl. min/max and padding. */
export function dataRange(list: Buckets[]): [number, number] {
  let lo = Infinity;
  let hi = -Infinity;
  for (const b of list)
    for (let i = 0; i < b.min.length; i++) {
      if (b.min[i] < lo) lo = b.min[i];
      if (b.max[i] > hi) hi = b.max[i];
    }
  return [lo, hi];
}
