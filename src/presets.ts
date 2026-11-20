import type { ColorScaleMode, ColorStop } from "./types";

export interface ColorPreset {
  id: string;
  stops: ColorStop[];
  mode?: ColorScaleMode;
}

/** Ready-made color scales. Users can apply them in the editor and adapt them afterwards. */
export const PRESETS: ColorPreset[] = [
  {
    id: "temperature",
    stops: [
      { value: 0, color: "#2196f3" },
      { value: 18, color: "#4caf50" },
      { value: 24, color: "#ff9800" },
      { value: 30, color: "#f44336" },
    ],
  },
  {
    id: "outdoor",
    stops: [
      { value: 0, color: "#2196f3" },
      { value: 0, color: "#4caf50" },
      { value: 25, color: "#ff9800" },
      { value: 35, color: "#f44336" },
    ],
  },
  {
    id: "heating",
    stops: [
      { value: 20, color: "#2196f3" },
      { value: 95, color: "#ff9800" },
      { value: 95, color: "#8b0000" },
    ],
  },
  {
    id: "humidity",
    mode: "step",
    stops: [
      { value: 0, color: "#ff9800" },
      { value: 40, color: "#4caf50" },
      { value: 60, color: "#2196f3" },
      { value: 70, color: "#3f51b5" },
    ],
  },
  {
    id: "co2",
    stops: [
      { value: 400, color: "#4caf50" },
      { value: 800, color: "#4caf50" },
      { value: 1200, color: "#ffc107" },
      { value: 1600, color: "#ff9800" },
      { value: 2000, color: "#f44336" },
    ],
  },
  {
    id: "battery",
    stops: [
      { value: 15, color: "#f44336" },
      { value: 15, color: "#ff9800" },
      { value: 40, color: "#ffc107" },
      { value: 60, color: "#4caf50" },
    ],
  },
];

/** Values at which the color changes abruptly (for threshold lines). */
export function jumpValues(stops: ColorStop[] | undefined, mode: ColorScaleMode = "gradient"): number[] {
  if (!stops?.length) return [];
  const out: number[] = [];
  if (mode === "step") {
    for (let i = 1; i < stops.length; i++) if (stops[i].color !== stops[i - 1].color) out.push(Number(stops[i].value));
  } else {
    for (let i = 0; i + 1 < stops.length; i++) {
      if (Number(stops[i].value) === Number(stops[i + 1].value) && stops[i].color !== stops[i + 1].color) {
        out.push(Number(stops[i].value));
      }
    }
  }
  return [...new Set(out)];
}

/** Editor rows: two stops with the same value are shown as ONE row with a "hard jump". */
export interface StopRow {
  value: number;
  color: string;
  below?: string;
}

export function stopsToRows(stops: ColorStop[]): StopRow[] {
  const rows: StopRow[] = [];
  for (let i = 0; i < stops.length; i++) {
    const s = stops[i];
    const n = stops[i + 1];
    if (n && Number(n.value) === Number(s.value)) {
      rows.push({ value: Number(s.value), below: s.color, color: n.color });
      i++;
    } else rows.push({ value: Number(s.value), color: s.color });
  }
  return rows;
}

export function rowsToStops(rows: StopRow[]): ColorStop[] {
  return rows.flatMap((r) =>
    r.below !== undefined
      ? [
          { value: r.value, color: r.below },
          { value: r.value, color: r.color },
        ]
      : [{ value: r.value, color: r.color }],
  );
}

const PALETTE = [
  "#44739e", "#984ea3", "#00d2d5", "#ff7f00", "#af8d00", "#7f80cd",
  "#b3e900", "#c42e60", "#a65628", "#f781bf", "#8dd3c7", "#bebada",
];

/** Default line color of the i-th entity (first = accent color like the sensor card). */
export function defaultColor(i: number): string {
  if (i <= 0) return "var(--accent-color)";
  return `var(--graph-color-${i + 1}, ${PALETTE[(i - 1) % PALETTE.length]})`;
}
