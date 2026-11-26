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
  /** real minimum / maximum incl. statistics min/max (for the band and min/avg/max) */
  bandLo: Float64Array;
  bandHi: Float64Array;
  /**
   * Optional pixel position of bucket 0 and the distance between buckets. Set when the buckets
   * are aligned to the clock (they then move smoothly with the time instead of being re-cut).
   */
  x0?: number;
  dx?: number;
}

/** x of bucket i: from the clock-aligned grid if present, else spread evenly over the width */
function bucketX(b: Buckets, i: number, width: number): number {
  const n = b.mean.length;
  if (b.dx !== undefined && b.x0 !== undefined) return Math.min(width, Math.max(0, b.x0 + i * b.dx));
  return n > 1 ? (i * width) / (n - 1) : width;
}

/**
 * Buckets on a grid aligned to the clock: their borders sit at whole multiples of the bucket
 * width, so scrolling or the passing time only moves them – no re-cutting, no jitter.
 */
export function aggregateAligned(data: SeriesData, start: number, end: number, n: number, width: number): Buckets {
  const bw = (end - start) / n;
  const a0 = Math.floor(start / bw) * bw;
  const count = Math.max(2, Math.ceil((end - a0) / bw - 1e-9));
  const b = aggregate(data, a0, a0 + count * bw, count);
  b.x0 = ((a0 + bw / 2 - start) / (end - start)) * width;
  b.dx = width / n;
  return b;
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
  const bandLo = new Float64Array(n).fill(NaN);
  const bandHi = new Float64Array(n).fill(NaN);
  const { t, v } = data;
  const loArr = data.lo ?? v;
  const hiArr = data.hi ?? v;
  const len = t.length;
  const bw = (end - start) / n;
  let idx = lowerBound(t, start);
  let cur = idx > 0 ? v[idx - 1] : NaN;
  let curLo = idx > 0 ? loArr[idx - 1] : NaN;
  let curHi = idx > 0 ? hiArr[idx - 1] : NaN;

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
    let bLo = Infinity;
    let bHi = -Infinity;
    let gap = 0; // time without a valid value (unavailable / unknown / no data)
    const take = (val: number, lo: number, hi: number, from: number, to: number) => {
      // a value that ends exactly where this bucket starts belongs to the previous bucket
      if (to <= bStart && b > 0) return;
      if (!Number.isFinite(val)) {
        gap += Math.max(0, to - from);
        return;
      }
      if (lo < bLo) bLo = lo;
      if (hi > bHi) bHi = hi;
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
      take(cur, curLo, curHi, segStart, t[idx]);
      cur = v[idx];
      curLo = loArr[idx];
      curHi = hiArr[idx];
      segStart = Math.max(t[idx], bStart);
      idx++;
    }
    take(cur, curLo, curHi, segStart, bEnd);
    // mostly unavailable → gap, so outages stay visible instead of being averaged away
    if (mn !== Infinity && gap * 2 < bEnd - bStart) {
      mean[b] = dur > 0 ? sum / dur : (mn + mx) / 2;
      min[b] = mn;
      max[b] = mx;
      minFirst[b] = tMin <= tMax ? 1 : 0;
      bandLo[b] = Math.min(bLo, mn);
      bandHi[b] = Math.max(bHi, mx);
    }
  }
  return { start, end, mean, min, max, minFirst, bandLo, bandHi };
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
  const step = b.dx ?? (n > 1 ? width / (n - 1) : 0);
  for (let i = 0; i < n; i++) {
    const x = bucketX(b, i, width);
    if (Number.isNaN(b.mean[i])) {
      if (seg.length) segs.push(seg);
      seg = [];
      continue;
    }
    // detail 2: the real minimum / maximum of the bucket – for raw data the extremes of the
    // values, for long-term statistics their min / max columns (so peaks survive without
    // loading the full history)
    const lo = Number.isFinite(b.bandLo[i]) ? b.bandLo[i] : b.min[i];
    const hi = Number.isFinite(b.bandHi[i]) ? b.bandHi[i] : b.max[i];
    if (detail === 2 && hi - lo > 0) {
      const dx = step / 4;
      const first = b.minFirst[i] ? lo : hi;
      const second = b.minFirst[i] ? hi : lo;
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

/** Closed area between the band's upper and lower edge, split at gaps. */
export function bandPath(b: Buckets, width: number, y: (v: number) => number): string {
  const n = b.mean.length;
  let d = "";
  let seg: number[] = [];
  const flush = () => {
    if (seg.length > 1) {
      const top = seg.map((i) => `${r(bucketX(b, i, width))},${r(y(b.bandHi[i]))}`);
      const bottom = seg.map((i) => `${r(bucketX(b, i, width))},${r(y(b.bandLo[i]))}`).reverse();
      d += `M${top.join("L")}L${bottom.join("L")}Z`;
    }
    seg = [];
  };
  for (let i = 0; i < n; i++) {
    if (Number.isFinite(b.bandLo[i]) && Number.isFinite(b.bandHi[i])) seg.push(i);
    else flush();
  }
  flush();
  return d;
}

/** Find the bucket value at x (for tooltips). */
export function valueAtX(b: Buckets, x: number, width: number): number {
  const n = b.mean.length;
  if (!n) return NaN;
  const pos = b.dx !== undefined && b.x0 !== undefined ? (x - b.x0) / b.dx : (x / width) * (n - 1);
  const i = Math.min(n - 1, Math.max(0, Math.round(pos)));
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

const NICE_HOURS = [1 / 12, 1 / 6, 0.25, 0.5, 1, 2, 3, 6, 12, 24, 48, 72, 168, 336, 720, 2160];

/**
 * Relative time labels ("−6 h … now") at nice steps, about one per 90 px, for any visible range
 * [start, end] (ms). Ticks sit at whole steps before `now`, so they stay put while panning.
 */
export function timeTicksRange(start: number, end: number, now: number, plotW: number): Array<{ x: number; hours: number }> {
  const spanH = (end - start) / 3_600_000;
  const target = Math.max(1, Math.floor(plotW / 90));
  const step = NICE_HOURS.find((h) => h >= spanH / target) ?? spanH;
  const stepMs = step * 3_600_000;
  const ticks: Array<{ x: number; hours: number }> = [];
  const kFrom = Math.floor((now - start) / stepMs + 1e-9);
  const kTo = Math.max(0, Math.ceil((now - end) / stepMs - 1e-9));
  for (let k = kFrom; k >= kTo; k--) {
    const x = ((now - k * stepMs - start) / (end - start)) * plotW;
    if (x > plotW + 0.5) continue;
    // keep clear of the y-axis labels; the right edge keeps its exact position
    if (k === 0 && Math.abs(x - plotW) < 0.5) ticks.push({ x: plotW, hours: 0 });
    else if (x >= 70) ticks.push({ x: Math.round(x), hours: +(k * step).toFixed(4) });
  }
  return ticks;
}

/** Ticks for the live window ending now. */
export function timeTicks(hours: number, plotW: number): Array<{ x: number; hours: number }> {
  const end = hours * 3_600_000;
  return timeTicksRange(0, end, end, plotW);
}

/** Value below which the share `q` (0…1) of the finite values lies (linear interpolation). */
export function quantile(values: ArrayLike<number>, q: number): number {
  const v: number[] = [];
  for (let i = 0; i < values.length; i++) if (Number.isFinite(values[i])) v.push(values[i]);
  if (!v.length) return NaN;
  v.sort((a, b) => a - b);
  const p = Math.min(1, Math.max(0, q)) * (v.length - 1);
  const i = Math.floor(p);
  return i + 1 < v.length ? v[i] + (v[i + 1] - v[i]) * (p - i) : v[i];
}

export interface PeakZone {
  /** highest value that has to fit */
  max: number;
  /** pixels available above `top` */
  room: number;
}

export interface YScale {
  (v: number): number;
  /** value drawn at `top` (for the axis label) */
  topValue: number;
  /** highest value that can be drawn (top of the room) */
  maxValue: number;
}

/**
 * Value → y. lo…hi fills bottom…top. With a peak zone, values above hi rise into the `room`
 * above top. If the highest value fits on the same scale, the whole scale is stretched so it reaches the
 * top of the room; otherwise the part above hi is compressed into the room.
 */
export function scaleY(lo: number, hi: number, top: number, bottom: number, peak?: PeakZone): YScale {
  const k = (bottom - top) / (hi - lo);
  const make = (f: (v: number) => number, topValue: number, maxValue: number): YScale =>
    Object.assign(f, { topValue, maxValue });
  if (!peak || !(peak.max > hi) || !(peak.room > 0)) {
    return make((v) => bottom - (Math.min(Math.max(v, lo), hi) - lo) * k, hi, hi);
  }
  const roof = top - peak.room;
  if (k * (peak.max - hi) <= peak.room) {
    // the highest peak fits: stretch the whole scale so it reaches the top of the room
    const kAll = (bottom - roof) / (peak.max - lo);
    return make((v) => bottom - (Math.min(Math.max(v, lo), peak.max) - lo) * kAll, lo + (bottom - top) / kAll, peak.max);
  }
  const kPeak = peak.room / (peak.max - hi);
  return make(
    (v) => {
      const c = Math.min(Math.max(v, lo), peak.max);
      return c <= hi ? bottom - (c - lo) * k : top - (c - hi) * kPeak;
    },
    hi,
    peak.max,
  );
}
