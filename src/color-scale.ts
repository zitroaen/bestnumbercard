import type { ColorScaleMode, ColorStop } from "./types";

export type RGBA = [number, number, number, number];

/**
 * Resolve any CSS color (hex, rgb(), names, var(--x), hsl …) to RGBA.
 * Pure parsing for hex / rgb(); everything else goes through the browser.
 */
const cache = new Map<string, RGBA>();
let ctx: CanvasRenderingContext2D | null | undefined;

export function parseColor(input: string, el?: Element): RGBA {
  let color = input.trim();
  const varMatch = /^var\(\s*(--[^,)\s]+)\s*(?:,\s*([^)]+))?\)$/.exec(color);
  if (varMatch) {
    const resolved = el ? getComputedStyle(el).getPropertyValue(varMatch[1]).trim() : "";
    color = resolved || varMatch[2]?.trim() || "#000";
    // not cached: theme variables may change
    return parseColor(color);
  }
  const hit = cache.get(color);
  if (hit) return hit;
  let rgba = parseSimple(color);
  if (!rgba && typeof document !== "undefined") {
    ctx ??= document.createElement("canvas").getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#000";
      ctx.fillStyle = color;
      rgba = parseSimple(String(ctx.fillStyle));
    }
  }
  rgba ??= [0, 0, 0, 1];
  cache.set(color, rgba);
  return rgba;
}

function parseSimple(c: string): RGBA | null {
  let m = /^#([0-9a-f]{3,8})$/i.exec(c);
  if (m) {
    let h = m[1];
    if (h.length === 3 || h.length === 4) h = [...h].map((x) => x + x).join("");
    if (h.length !== 6 && h.length !== 8) return null;
    const n = (i: number) => parseInt(h.slice(i, i + 2), 16);
    return [n(0), n(2), n(4), h.length === 8 ? n(6) / 255 : 1];
  }
  m = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:[\s,/]+([\d.]+%?))?\s*\)$/i.exec(c);
  if (m) {
    let a = 1;
    if (m[4] !== undefined) a = m[4].endsWith("%") ? parseFloat(m[4]) / 100 : parseFloat(m[4]);
    return [+m[1], +m[2], +m[3], a];
  }
  return null;
}

export function rgbaToCss([r, g, b, a]: RGBA): string {
  const f = (x: number) => Math.round(x);
  return a >= 1 ? `rgb(${f(r)},${f(g)},${f(b)})` : `rgba(${f(r)},${f(g)},${f(b)},${+a.toFixed(3)})`;
}

function mix(a: RGBA, b: RGBA, f: number): RGBA {
  return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f, a[3] + (b[3] - a[3]) * f];
}

/** Stable sort by value; equal values keep their order (= hard jump, like CSS gradients). */
export function sortStops(stops: ColorStop[]): ColorStop[] {
  return stops
    .filter((s) => s && Number.isFinite(Number(s.value)) && s.color)
    .map((s, i) => ({ s: { value: Number(s.value), color: String(s.color) }, i }))
    .sort((a, b) => a.s.value - b.s.value || a.i - b.i)
    .map((x) => x.s);
}

/**
 * Color for a value.
 * gradient: linear interpolation between neighbouring stops; two stops with the
 *           same value form a hard jump.
 * step:     each stop's color applies from its value upwards (first stop also below).
 */
export function colorAt(
  stops: ColorStop[],
  mode: ColorScaleMode,
  value: number,
  resolve: (c: string) => RGBA,
): RGBA {
  const n = stops.length;
  if (!n || !Number.isFinite(value)) return resolve(stops[0]?.color ?? "#000");
  if (value < stops[0].value) return resolve(stops[0].color);
  // index of the LAST stop with stop.value <= value
  let i = 0;
  while (i + 1 < n && stops[i + 1].value <= value) i++;
  if (mode === "step" || i === n - 1) return resolve(stops[i].color);
  const a = stops[i];
  const b = stops[i + 1];
  const f = (value - a.value) / (b.value - a.value);
  return mix(resolve(a.color), resolve(b.color), f);
}

export interface GradientStop {
  /** 0 = value `lo` (bottom), 1 = value `hi` (top) */
  offset: number;
  color: string;
}

/**
 * Build SVG gradient stops for the value range [lo, hi]. Because the SVG engine
 * interpolates linearly in sRGB (same as `colorAt`), only the breakpoints are needed.
 */
export function gradientStops(
  stops: ColorStop[],
  mode: ColorScaleMode,
  lo: number,
  hi: number,
  resolve: (c: string) => RGBA,
): GradientStop[] {
  const span = hi - lo;
  if (!stops.length || !(span > 0)) {
    const c = rgbaToCss(colorAt(stops, mode, lo, resolve));
    return [{ offset: 0, color: c }, { offset: 1, color: c }];
  }
  const off = (v: number) => (v - lo) / span;
  const out: GradientStop[] = [{ offset: 0, color: rgbaToCss(colorAt(stops, mode, lo, resolve)) }];
  let current = colorAt(stops, mode, lo, resolve);
  for (const s of stops) {
    if (s.value <= lo || s.value >= hi) continue;
    const o = off(s.value);
    if (mode === "step") {
      out.push({ offset: o, color: rgbaToCss(current) });
      current = resolve(s.color);
      out.push({ offset: o, color: rgbaToCss(current) });
    } else {
      out.push({ offset: o, color: rgbaToCss(resolve(s.color)) });
    }
  }
  out.push({ offset: 1, color: rgbaToCss(colorAt(stops, mode, hi, resolve)) });
  return out;
}

/** True if the color changes abruptly somewhere between the values a and b. */
function hasJump(stops: ColorStop[], mode: ColorScaleMode, a: number, b: number): boolean {
  const lo = Math.min(a, b);
  const hi = Math.max(a, b);
  if (lo === hi) return false;
  if (mode === "step") return stops.some((s) => s.value > lo && s.value <= hi);
  for (let k = 0; k + 1 < stops.length; k++) {
    if (stops[k].value === stops[k + 1].value && stops[k].value > lo && stops[k].value <= hi) return true;
  }
  return false;
}

/**
 * Horizontal gradient along the time axis: each x position gets the color of the
 * value at that time (vertical color bands). `values` are equally spaced from 0 to 1.
 * Hard jumps between two neighbouring points are placed in the middle between them.
 */
export function timeGradientStops(
  stops: ColorStop[],
  mode: ColorScaleMode,
  values: ArrayLike<number>,
  resolve: (c: string) => RGBA,
): GradientStop[] {
  const n = values.length;
  const color = (v: number) => rgbaToCss(colorAt(stops, mode, v, resolve));
  const out: GradientStop[] = [];
  let prevV = NaN;
  let prevOff = 0;
  for (let i = 0; i < n; i++) {
    const v = values[i];
    if (!Number.isFinite(v)) continue;
    const off = n > 1 ? i / (n - 1) : 0;
    if (Number.isFinite(prevV) && hasJump(stops, mode, prevV, v)) {
      const mid = (prevOff + off) / 2;
      out.push({ offset: mid, color: color(prevV) }, { offset: mid, color: color(v) });
    }
    out.push({ offset: off, color: color(v) });
    prevV = v;
    prevOff = off;
  }
  if (!out.length) {
    const c = color(NaN);
    return [{ offset: 0, color: c }, { offset: 1, color: c }];
  }
  // drop stops in the middle of runs with the same color (keeps the DOM small)
  return out.filter((s, k) => k === 0 || k === out.length - 1 || s.color !== out[k - 1].color || s.color !== out[k + 1].color);
}
