// Minimal Home Assistant typings – only what this card actually uses.

export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, any>;
  last_changed: string;
  last_updated: string;
}

export interface HassEntityRegistryDisplayEntry {
  entity_id: string;
  display_precision?: number;
}

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  entities?: Record<string, HassEntityRegistryDisplayEntry>;
  language: string;
  locale?: {
    language: string;
    number_format?: string;
    time_format?: string;
  };
  themes?: { themes: Record<string, Record<string, string>>; darkMode?: boolean };
  connection: {
    subscribeMessage<T>(
      callback: (msg: T) => void,
      msg: Record<string, any>,
      options?: { resubscribe?: boolean },
    ): Promise<() => Promise<void>>;
    addEventListener?(event: "ready" | "disconnected" | "reconnect-error", cb: () => void): void;
    removeEventListener?(event: "ready" | "disconnected" | "reconnect-error", cb: () => void): void;
  };
  callWS<T>(msg: Record<string, any>): Promise<T>;
  callService(domain: string, service: string, data?: Record<string, any>, target?: Record<string, any>): Promise<any>;
}

export type ActionConfig =
  | { action: "none" }
  | { action: "more-info"; entity?: string }
  | { action: "toggle" }
  | { action: "toggle-compact" }
  | { action: "navigate"; navigation_path: string }
  | { action: "url"; url_path: string }
  | {
      action: "perform-action" | "call-service";
      perform_action?: string;
      service?: string;
      data?: Record<string, any>;
      service_data?: Record<string, any>;
      target?: Record<string, any>;
    }
  | { action: string; [key: string]: any };

export interface ColorStop {
  value: number;
  color: string;
}

export type FillGradient = "value" | "time";
export type ColorScaleMode = "gradient" | "step";
export type ValueDisplay = "primary" | "all" | "none";
export type LegendIcon = "dot" | "icon" | "none";
export type EndLabels = "none" | "value" | "icon" | "icon_value";

export interface EntityConfig {
  entity: string;
  name?: string;
  icon?: string;
  unit?: string;
  decimals?: number;
  color?: string;
  color_scale?: ColorStop[];
  color_scale_mode?: ColorScaleMode;
  /** Series with the same scale id share their y-axis. */
  scale?: string;
  min?: number;
  max?: number;
  fill?: boolean;
  /** Fill coloring with a color scale: `value` = by height (horizontal bands), `time` = by the value at each point in time (vertical bands). */
  fill_gradient?: FillGradient;
  line_width?: number;
  show_value?: boolean;
  show_graph?: boolean;
  /** Hide the entity completely (and do not load its history) while its value is below … */
  hide_below?: number;
  /** … or above this value. */
  hide_above?: number;
  hide_unavailable?: boolean;
  /** Alert (card glows) while the value is >= this … */
  alert_above?: number;
  /** … or <= this value. */
  alert_below?: number;
}

export interface CardConfig {
  type: string;
  entities: EntityConfig[];
  name?: string;
  icon?: string;
  graph?: "line" | "none";
  detail?: 1 | 2;
  hours_to_show?: number;
  height?: number;
  smoothing?: boolean;
  /** Default `fill_gradient` for all entities. */
  fill_gradient?: FillGradient;
  value_display?: ValueDisplay;
  legend_icon?: LegendIcon;
  end_labels?: EndLabels;
  tooltip?: boolean;
  /** Start in compact mode (values only, no graph, no history loaded). */
  compact?: boolean;
  /** Remember a toggled compact state on this device (default true). */
  remember_compact?: boolean;
  /** Min/max labels of the y-axis: on hover (default), always or never. */
  y_axis?: "hover" | "always" | "none";
  /** Dashed lines at the hard jumps of the color scales. */
  show_thresholds?: boolean;
  /** Show min / average / max of the visible window below the values. */
  show_extrema?: boolean;
  /** Tap a legend entry to hide/show its line (default true). */
  legend_toggle?: boolean;
  /** How the card signals an alert: pulsing glow (default), hard blinking or a steady glow. */
  alert_style?: "glow" | "blink" | "static";
  /** Alert color (default: the theme's error color). */
  alert_color?: string;
  statistics_threshold?: number;
  statistics_period?: "auto" | "5minute" | "hour" | "day";
  /** Card-wide limits (like `limits` of the sensor card). */
  limits?: { min?: number; max?: number };
  theme?: string;
  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
  double_tap_action?: ActionConfig;
}

/** One time series kept as parallel arrays (fast, low GC pressure). */
export interface SeriesData {
  t: number[]; // ms epoch
  v: number[]; // NaN = unavailable / gap
}
