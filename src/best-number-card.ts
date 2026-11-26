import { LitElement, html, svg, css, nothing, type PropertyValues, type TemplateResult } from "lit";
import pkg from "../package.json";
import { runAction } from "./actions";
import { colorAt, gradientStops, timeGradientStops, parseColor, rgbaToCss, sortStops, type GradientStop, type RGBA } from "./color-scale";
import { DataSource, seriesId } from "./data";
import { aggregate, bandPath, dataRange, quantile, scaleY, timeTicksRange, type YScale, fillPath, linePath, toPoints, valueAtX, type Buckets, type Point } from "./graph";
import { formatNumber, formatTime, localize } from "./localize";
import { defaultColor, jumpValues } from "./presets";
import { seededRandom, skyWeights, solarAltitude, sunEvents } from "./sun";
import { EventSource, stateIntervals } from "./events";
import type { CardConfig, EntityConfig, EventConfig, HassEntity, HomeAssistant } from "./types";
import "./editor";

export const VERSION: string = pkg.version;


const DEFAULTS = {
  hours_to_show: 24,
  detail: 1 as 1 | 2,
  graph: "line",
  statistics_threshold: 6,
  statistics_period: "auto",
  smoothing: true,
  tooltip: true,
  end_labels: "none",
  legend_icon: "dot",
  y_axis: "hover",
  x_axis: "hover",
  peak_percentile: 95,
  peak_margin: 12,
};

interface SeriesModel {
  cfg: EntityConfig;
  index: number;
  buckets: Buckets;
  segs: Point[][];
  lo: number;
  hi: number;
  y: YScale;
  gradId?: string;
  grad?: GradientStop[];
  /** separate horizontal gradient for the fill area (fill_gradient: time) */
  fillGradId?: string;
  fillGrad?: GradientStop[];
  color: string;
  lineWidth: number;
  fill: boolean;
  /** temporarily switched off via the legend */
  off: boolean;
  ext: { min: number; max: number; avg: number };
  band: boolean;
  /** smoothing cuts narrow peaks, so peak-preserving series are drawn exactly */
  smooth: boolean;
}

interface AxisModel {
  lo: number;
  hi: number;
  /** colored labels only when there are several scales */
  colored: boolean;
  entity: EntityConfig;
}

interface ThresholdModel {
  y: number;
  value: number;
  color: string;
  entity: EntityConfig;
}

interface EventMark {
  cfg: EventConfig;
  from: number;
  to: number;
  open: boolean;
  x1: number;
  x2: number;
  color: string;
  /** false when the start lies before the window (only the bar is drawn) */
  pin: boolean;
  /** the pin icon is drawn (pins on, start in the window, enough room to the previous pin) */
  showPin: boolean;
  /** own lane per configured event, so overlapping bars don't mix */
  lane: number;
}

const EVENT_COLORS = ["#f2a53a", "#5fb0ff", "#5fd17a", "#c084fc", "#f87171", "#2dd4bf"];
/** height of the event strip below the graph lines */
const EVENT_STRIP = 24;

interface GraphModel {
  key: string;
  width: number;
  plotW: number;
  height: number;
  start: number;
  end: number;
  series: SeriesModel[];
  axes: AxisModel[];
  thresholds: ThresholdModel[];
  hasData: boolean;
  /** x positions of the time labels (relative hours before now) */
  ticks: Array<{ x: number; hours: number }>;
  events: EventMark[];
  /** px above the graph that peaks reach into (0 = none) */
  room: number;
}

let uid = 0;

const isSet = (x: unknown) => x !== undefined && x !== null && x !== "";

function storageGet(key: string): any {
  try {
    const raw = window.localStorage?.getItem(key);
    return raw ? JSON.parse(raw) : undefined;
  } catch {
    return undefined;
  }
}

function storageSet(key: string, value: unknown): void {
  try {
    window.localStorage?.setItem(key, JSON.stringify(value));
  } catch {
    /* private mode / blocked storage – not important */
  }
}

function hash(s: string): string {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36);
}

export class BestNumberCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
    _compact: { state: true },
    _width: { state: true },
    _graphH: { state: true },
    _room: { state: true },
    _view: { state: true },
    _hoverX: { state: true },
    _tick: { state: true },
    _off: { state: true },
  };

  hass?: HomeAssistant;
  private _config?: CardConfig;
  private _compact = false;
  private _width = 0;
  /** measured height of the graph area (fills the card in grid layouts) */
  private _graphH = 0;
  /** free space between the card's top edge and the graph (for peak_overflow) */
  private _room = 0;
  /**
   * zoom: the visible range when the user panned or zoomed (null = the normal live window).
   * `live` keeps the right edge at "now" (it moves with time), otherwise `end` is fixed.
   */
  private _view: { span: number; end: number; live: boolean } | null = null;
  /** running touch / mouse gesture on the graph (zoom) */
  private _gesture?: {
    kind: "pending" | "pan" | "pinch" | "scrub" | "done";
    x0: number;
    y0: number;
    start0: number;
    span0: number;
    dist0?: number;
    mid0?: number;
    timer?: number;
  };
  private _pointers = new Map<number, { x: number; y: number }>();
  private _viewFrame?: number;
  private _hoverX: number | null = null;
  private _tick = 0;
  /** entities switched off via the legend (session only) */
  private _off = new Set<string>();

  private _uid = `bnc${++uid}`;
  private _cfgVersion = 0;
  private _ds?: DataSource;
  private _dsKey = "";
  /** redraw without throttling until then (right after loading starts or the view changes) */
  private _fastUntil = 0;
  /** when the pending throttled redraw will run */
  private _tickDue = 0;
  private _lastTick = 0;
  private _tickTimer?: number;
  private _ticker?: number;
  private _ro?: ResizeObserver;
  private _graphEl?: Element;
  private _model?: GraphModel;
  private _holdTimer?: number;
  private _held = false;
  private _down?: { x: number; y: number };
  private _clickTimer?: number;
  private _scrub?: { x: number; y: number; active: boolean };
  private _suppressClick = false;
  private _hideTimer?: number;
  private _dnCache?: { key: string; tpl: TemplateResult };
  private _twinkleTimer?: number;
  private _twinkleTpl?: TemplateResult;
  private _twinkleStars: SVGElement[] = [];
  private _io?: IntersectionObserver;
  private _onScreen = true;
  private _ev?: EventSource;
  private _evKey = "";
  /** true while the card animates between compact and full mode */
  private _animating = false;
  private _storageKey = "";
  private _colorCache = new Map<string, RGBA>();
  private _resolve = (c: string): RGBA => {
    let v = this._colorCache.get(c);
    if (!v) {
      v = parseColor(c, this);
      this._colorCache.set(c, v);
    }
    return v;
  };
  private _themeVars: string[] = [];

  // ---------------------------------------------------------------- HA API

  static getConfigElement(): HTMLElement {
    return document.createElement("best-number-card-editor");
  }

  static getStubConfig(hass: HomeAssistant): Partial<CardConfig> {
    const ids = Object.keys(hass.states).filter((id) => isNumericSensor(hass, id));
    return { entities: ids.slice(0, 2).map((entity) => ({ entity })) };
  }

  setConfig(config: CardConfig): void {
    if (!config) throw new Error("Invalid configuration");
    const raw: any[] = Array.isArray(config.entities) ? config.entities : (config as any).entity ? [(config as any).entity] : [];
    const entities: EntityConfig[] = raw
      .map((e) => (typeof e === "string" ? { entity: e } : { ...e }))
      .filter((e) => e && typeof e.entity === "string");
    if (!entities.length) throw new Error("Please define at least one entity");
    for (const e of entities) if (e.color_scale) e.color_scale = sortStops(e.color_scale);
    const prev = this._config;
    this._cfgVersion++;
    this._config = { ...config, entities };
    this._storageKey = `best-number-card:compact:${hash(JSON.stringify([config.name, entities.map((e) => e.entity)]))}`;
    if (!prev || prev.compact !== config.compact) {
      this._compact = !!config.compact;
      // restore the state toggled on this device (only while the configured default is unchanged)
      if (config.remember_compact !== false) {
        const saved = storageGet(this._storageKey);
        if (saved && saved.d === !!config.compact) this._compact = !!saved.v;
      }
    }
  }

  getCardSize(): number {
    return this._compact ? 1 : 3;
  }

  getGridOptions() {
    return { columns: 6, min_columns: 3, min_rows: 1 };
  }

  // ---------------------------------------------------------------- lifecycle

  connectedCallback(): void {
    super.connectedCallback();
    document.addEventListener("visibilitychange", this._onVisibility);
    this._syncDataSource();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._stopTwinkle();
    if (this._viewFrame !== undefined) cancelAnimationFrame(this._viewFrame);
    this._viewFrame = undefined;
    clearTimeout(this._gesture?.timer);
    this._gesture = undefined;
    this._pointers.clear();
    this._io?.disconnect();
    this._io = undefined;
    document.removeEventListener("visibilitychange", this._onVisibility);
    this._disposeDataSource();
    this._ro?.disconnect();
    this._ro = undefined;
    this._graphEl = undefined;
    clearTimeout(this._hideTimer);
    clearTimeout(this._holdTimer);
    clearTimeout(this._clickTimer);
    this._clickTimer = undefined;
  }

  protected shouldUpdate(changed: PropertyValues): boolean {
    if (!this._config) return false;
    if (changed.size > 1 || !changed.has("hass")) return true;
    const old = changed.get("hass") as HomeAssistant | undefined;
    if (!old || !this.hass) return true;
    if (old.themes !== this.hass.themes || old.locale !== this.hass.locale || old.language !== this.hass.language) return true;
    // only re-render when one of OUR entities changed
    return this._config.entities.some((e) => old.states[e.entity] !== this.hass!.states[e.entity]);
  }

  protected willUpdate(changed: PropertyValues): void {
    if (changed.has("hass") || changed.has("_config") || changed.has("_compact")) {
      this._syncDataSource();
      this._syncEvents();
    }
    const old = changed.get("hass") as HomeAssistant | undefined;
    const themeChanged = changed.has("_config") || !old || old.themes !== this.hass?.themes;
    if (themeChanged) {
      this._applyTheme();
      this._colorCache.clear();
      this._model = undefined;
    }
  }

  protected updated(changed: Map<string, unknown>): void {
    this._updateAlert();
    this._syncTwinkle();
    if (changed.has("_config") || changed.has("_compact")) this._measureRoom();
    const el = this.renderRoot.querySelector(".graph");
    if (el !== this._graphEl) {
      this._ro?.disconnect();
      this._graphEl = el ?? undefined;
      if (el) {
        this._ro ??= new ResizeObserver((entries) => {
          const w = Math.round(entries[0].contentRect.width);
          const h = Math.round(entries[0].contentRect.height);
          if (w && w !== this._width) this._width = w;
          if (h && h !== this._graphH && !this._animating) this._graphH = h;
          this._measureRoom();
        });
        this._ro.observe(el);
      }
    }
  }

  /**
   * Twinkling stars: instead of a CSS animation per star (which makes the browser redraw the
   * card 60 times a second – heavy on wall tablets), a light timer changes the brightness of a
   * few random stars twice a second. Only these tiny spots are redrawn, and nothing runs
   * while the card is off screen or the tab is hidden.
   */
  private _syncTwinkle(): void {
    const tpl = this._dnCache?.tpl;
    if (tpl === this._twinkleTpl) return;
    this._twinkleTpl = tpl;
    this._twinkleStars = [...this.renderRoot.querySelectorAll<SVGElement>(".daynight .star.tw")];
    const reduced = !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (!this._twinkleStars.length || reduced) {
      this._stopTwinkle();
      return;
    }
    if (!this._io && typeof IntersectionObserver === "function") {
      this._io = new IntersectionObserver((entries) => (this._onScreen = entries[entries.length - 1].isIntersecting));
      this._io.observe(this);
    }
    this._twinkleTimer ??= window.setInterval(() => {
      if (!this._onScreen || document.visibilityState === "hidden") return;
      const stars = this._twinkleStars;
      // a few stars at a time, small steps in brightness: a calm, gentle twinkle
      const k = Math.max(1, Math.round(stars.length * 0.05));
      for (let i = 0; i < k; i++) {
        const el = stars[Math.floor(Math.random() * stars.length)];
        el.style.opacity = (0.55 + Math.random() * 0.45).toFixed(2);
      }
    }, 500);
  }

  private _stopTwinkle(): void {
    clearInterval(this._twinkleTimer);
    this._twinkleTimer = undefined;
    this._twinkleTpl = undefined;
    this._twinkleStars = [];
  }

  /** Only needed with peak_overflow: the distance from the card's top edge to the graph. */
  private _measureRoom(): void {
    const el = this._graphEl as HTMLElement | undefined;
    const card = this.renderRoot.querySelector("ha-card");
    const on = !!this._config?.peak_overflow || !!this._config?.entities.some((e) => e.peak_overflow);
    if (!on || !el || !card || el.classList.contains("bg")) {
      if (this._room) this._room = 0;
      return;
    }
    const room = Math.max(0, Math.round(el.getBoundingClientRect().top - card.getBoundingClientRect().top));
    if (Math.abs(room - this._room) > 1) this._room = room;
  }

  // ---------------------------------------------------------------- data

  private _visible(): EntityConfig[] {
    return this._config!.entities.filter((e) => !this._isHidden(e));
  }

  private _isHidden(e: EntityConfig): boolean {
    const v = this._current(e);
    const numeric = Number.isFinite(v);
    if (e.hide_unavailable && !numeric) return true;
    if (numeric && isSet(e.hide_below) && v < Number(e.hide_below)) return true;
    if (numeric && isSet(e.hide_above) && v > Number(e.hide_above)) return true;
    return false;
  }

  private get _hours(): number {
    const h = Number(this._config?.hours_to_show ?? DEFAULTS.hours_to_show);
    return h > 0 ? h : DEFAULTS.hours_to_show;
  }

  /** zoom: how far back the user can scroll – that much history is loaded (default 7 days) */
  private get _loadHours(): number {
    if (!this._config?.zoom) return this._hours;
    const z = Number(this._config.zoom_hours);
    return Math.max(this._hours, z > 0 ? z : 168);
  }

  private get _zoomOn(): boolean {
    return !!this._config?.zoom && !this._compact && (this._config.graph ?? DEFAULTS.graph) !== "none";
  }

  /** visible time range in ms */
  private _range(now = Date.now()): { start: number; end: number } {
    const v = this._view;
    if (!v || !this._zoomOn) return { start: now - this._hours * 3_600_000, end: now };
    const end = v.live ? now : v.end;
    return { start: end - v.span, end };
  }

  /** Set the visible range (clamped to the loaded history); the right edge snaps back to "now". */
  private _setView(start: number, span: number): void {
    const now = Date.now();
    const maxSpan = this._loadHours * 3_600_000;
    span = Math.min(maxSpan, Math.max(10 * 60_000, span));
    start = Math.max(now - maxSpan, Math.min(start, now - span));
    const end = start + span;
    const live = now - end < span * 0.01;
    const next = live && Math.abs(span - this._hours * 3_600_000) < 1_000 ? null : { span, end, live };
    // render at most once per frame while the fingers move
    this._view = next;
    if (this._viewFrame === undefined) {
      this._viewFrame = requestAnimationFrame(() => {
        this._viewFrame = undefined;
        this._tick++;
      });
    }
  }

  private _resetView = (ev: Event) => {
    ev.stopPropagation();
    this._view = null;
    this._tick++;
  };

  private _graphEntities(): EntityConfig[] {
    return this._visible().filter((e) => e.show_graph !== false);
  }

  private _syncDataSource(): void {
    const cfg = this._config;
    if (!cfg || !this.hass || !this.isConnected) return;
    // compact mode loads history only if its background graph is wanted
    const needed = (!this._compact || !!cfg.compact_graph) && (cfg.graph ?? DEFAULTS.graph) !== "none";
    const ids = needed ? [...new Set(this._graphEntities().map((e) => this._sid(e)))] : [];
    const threshold = Number(cfg.statistics_threshold ?? DEFAULTS.statistics_threshold);
    const detail = needed ? this._graphEntities().filter((e) => e.raw_history).map((e) => this._sid(e)) : [];
    // zoom: fine 5-minute statistics for the whole scrollable range (HA keeps them for 10 days)
    const period =
      cfg.zoom && (!cfg.statistics_period || cfg.statistics_period === "auto") && this._loadHours <= 240
        ? "5minute"
        : cfg.statistics_period;
    const key = ids.length ? JSON.stringify([ids, detail, this._loadHours, threshold, period ?? "auto"]) : "";
    if (key === this._dsKey) {
      this._ds?.setHass(this.hass);
      return;
    }
    this._disposeDataSource();
    this._dsKey = key;
    if (!key) return;
    this._ds = new DataSource(this.hass, {
      entities: ids,
      hoursToShow: this._loadHours,
      statisticsThreshold: threshold,
      statisticsPeriod: period,
      detail,
      onChange: () => this._scheduleTick(),
    });
    this._fastUntil = Date.now() + 5_000;
    this._ds.start().catch((err) => console.warn("best-number-card:", err));
    // let the graph scroll with time even if no new values arrive
    const pxMs = (this._hours * 3_600_000) / Math.max(this._width || 400, 100);
    this._ticker = window.setInterval(() => this._scheduleTick(), Math.min(Math.max(pxMs * 2, 5_000), 300_000));
  }

  private _eventConfigs(): EventConfig[] {
    return (this._config?.events ?? []).filter((e) => e && typeof e.entity === "string" && e.entity);
  }

  /** event pins: one lightweight state-history subscription, only in full mode with a graph */
  private _syncEvents(): void {
    const cfg = this._config;
    if (!cfg || !this.hass || !this.isConnected) return;
    const needed = !this._compact && (cfg.graph ?? DEFAULTS.graph) !== "none";
    const ids = needed ? [...new Set(this._eventConfigs().map((e) => e.entity))] : [];
    const key = ids.length ? JSON.stringify([ids, this._loadHours]) : "";
    if (key === this._evKey) return;
    this._ev?.dispose();
    this._ev = undefined;
    this._evKey = key;
    if (!key) return;
    this._ev = new EventSource(this.hass, ids, this._loadHours, () => this._scheduleTick());
    this._ev.start();
    // the first answer must show up right away, not after the throttled interval
    this._fastUntil = Date.now() + 5_000;
  }

  private _disposeDataSource(): void {
    this._ev?.dispose();
    this._ev = undefined;
    this._evKey = "";
    this._ds?.dispose();
    this._ds = undefined;
    this._dsKey = "";
    clearInterval(this._ticker);
    clearTimeout(this._tickTimer);
    this._tickTimer = undefined;
  }

  private _onVisibility = () => {
    if (document.visibilityState === "visible" && this._ds) this._scheduleTick();
  };

  /** Throttled graph refresh: dense data must not cause a re-render for every single value. */
  private _scheduleTick(): void {
    // nothing to draw in a background tab – catch up when it becomes visible again
    if (document.visibilityState === "hidden") return;
    const now = Date.now();
    const bucketMs = (this._hours * 3_600_000) / Math.max(this._width || 400, 100);
    const minInterval = now < this._fastUntil ? 100 : Math.min(Math.max(bucketMs, 1_000), 30_000);
    const due = Math.max(now, this._lastTick + minInterval);
    if (this._tickTimer !== undefined) {
      // a slow redraw is already planned – only bring it forward if this one is due earlier
      if (due >= this._tickDue) return;
      clearTimeout(this._tickTimer);
    }
    this._tickDue = due;
    this._tickTimer = window.setTimeout(() => {
      this._tickTimer = undefined;
      this._lastTick = Date.now();
      this._tick++;
    }, due - now);
  }

  // ---------------------------------------------------------------- helpers

  private _state(e: EntityConfig): HassEntity | undefined {
    return this.hass?.states[e.entity];
  }

  /** series id: the entity, or entity + attribute */
  private _sid(e: EntityConfig): string {
    return seriesId(e.entity, e.attribute);
  }

  /** raw value as string (state or attribute) */
  private _raw(e: EntityConfig): string | undefined {
    const st = this._state(e);
    if (!st) return undefined;
    if (!e.attribute) return st.state;
    const a = st.attributes[e.attribute];
    return a === undefined || a === null ? "" : String(a);
  }

  private _name(e: EntityConfig): string {
    if (e.name) return e.name;
    const st = this._state(e);
    const base = st?.attributes.friendly_name ?? e.entity;
    if (!e.attribute) return base;
    const attr = st ? (this.hass as any)?.formatEntityAttributeName?.(st, e.attribute) : undefined;
    return `${base} · ${attr ?? e.attribute}`;
  }

  private _unit(e: EntityConfig): string {
    if (e.unit !== undefined) return e.unit;
    if (!e.attribute) return this._state(e)?.attributes.unit_of_measurement ?? "";
    // e.g. the target temperature of a thermostat uses the system's temperature unit
    return /temp/i.test(e.attribute) ? (this.hass?.config?.unit_system?.temperature ?? "") : "";
  }

  private _decimals(e: EntityConfig, raw?: string): number | undefined {
    if (isSet(e.decimals)) return Number(e.decimals);
    const p = e.attribute ? undefined : this.hass?.entities?.[e.entity]?.display_precision;
    if (typeof p === "number") return p;
    if (raw !== undefined) {
      const m = /\.(\d+)$/.exec(raw);
      return m ? Math.min(m[1].length, 4) : 0;
    }
    return undefined;
  }

  private _formatState(e: EntityConfig): string {
    const st = this._state(e);
    // own text for unavailable / unknown / missing entities, e.g. "–"
    const custom = e.unavailable_text ?? this._config?.unavailable_text;
    if (!st) return custom ?? localize(this.hass, "card.not_found");
    const raw = this._raw(e) ?? "";
    const v = Number(raw);
    if (raw === "" || !Number.isFinite(v)) {
      if (custom !== undefined) return custom;
      if (e.attribute) return raw || "–";
      return (this.hass as any)?.formatEntityState?.(st) ?? st.state;
    }
    return formatNumber(this.hass, v, this._decimals(e, raw));
  }

  /** unit next to the current value – hidden while there is no number ("Unavailable W") */
  private _valueUnit(e: EntityConfig): string {
    return Number.isFinite(this._current(e)) ? this._unit(e) : "";
  }

  private _formatValue(e: EntityConfig, v: number): string {
    const d = this._decimals(e, this._raw(e));
    return formatNumber(this.hass, v, d === undefined ? 1 : d);
  }

  private _baseColor(e: EntityConfig): string {
    if (e.color) return e.color;
    return defaultColor(this._config!.entities.indexOf(e));
  }

  /** Color of a series at a given value (color scale aware). */
  private _colorFor(e: EntityConfig, v: number): string {
    if (e.color_scale?.length && Number.isFinite(v)) {
      return rgbaToCss(colorAt(e.color_scale, e.color_scale_mode ?? "gradient", v, this._resolve));
    }
    return this._baseColor(e);
  }

  private _current(e: EntityConfig): number {
    const raw = this._raw(e);
    return raw !== undefined && raw !== "" ? Number(raw) : NaN;
  }

  private _applyTheme(): void {
    for (const k of this._themeVars) this.style.removeProperty(k);
    this._themeVars = [];
    const themes = this.hass?.themes;
    const theme: Record<string, any> | undefined = this._config?.theme ? themes?.themes?.[this._config.theme] : undefined;
    if (!theme) return;
    const mode = (theme as any).modes?.[themes?.darkMode ? "dark" : "light"] ?? {};
    for (const [k, v] of Object.entries({ ...theme, ...mode })) {
      if (typeof v !== "string") continue;
      const name = `--${k}`;
      this.style.setProperty(name, v);
      this._themeVars.push(name);
    }
  }

  /** True while any entity reaches its alert threshold (independent of value-based hiding). */
  private _alertActive(): boolean {
    return this._config!.entities.some((e) => {
      const v = this._current(e);
      if (!Number.isFinite(v)) return false;
      return (isSet(e.alert_above) && v >= Number(e.alert_above)) || (isSet(e.alert_below) && v <= Number(e.alert_below));
    });
  }

  /**
   * The glow is a pseudo element on the host whose opacity is animated – this runs on the
   * compositor and costs (almost) no CPU, even on wall tablets.
   */
  private _updateAlert(): void {
    const active = !!this._config && this._alertActive();
    this.toggleAttribute("alert", active);
    if (active) {
      this.setAttribute("alert-style", this._config!.alert_style ?? "glow");
      if (this._config!.alert_color) this.style.setProperty("--bnc-alert-color", this._config!.alert_color);
      else this.style.removeProperty("--bnc-alert-color");
    }
  }

  private _bandOn(e: EntityConfig): boolean {
    return e.band ?? this._config?.band ?? false;
  }

  private _setCompact(value: boolean): void {
    const card = this.renderRoot.querySelector("ha-card") as HTMLElement | null;
    const animate =
      this._config?.compact_animation !== false &&
      !!card &&
      typeof card.animate === "function" &&
      !window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const from = animate ? card!.getBoundingClientRect().height : 0;
    this._compact = value;
    this._hoverX = null;
    if (this._config?.remember_compact !== false) {
      storageSet(this._storageKey, { v: value, d: !!this._config?.compact });
    }
    if (animate) this.updateComplete.then(() => this._animateHeight(card!, from));
  }

  /**
   * Smoothly resize the card between compact and full mode (FLIP: measure, switch, animate).
   * The graph keeps its final size meanwhile – only the visible part of the card grows or shrinks.
   */
  private async _animateHeight(card: HTMLElement, from: number): Promise<void> {
    const to = card.getBoundingClientRect().height;
    // the card has its final size right now (nothing painted yet): take the graph's final
    // height before animating, so the graph does not jump at the end
    const g = this.renderRoot.querySelector(".graph");
    const gh = g ? Math.round(g.getBoundingClientRect().height) : 0;
    if (gh && gh !== this._graphH) {
      this._graphH = gh;
      await this.updateComplete;
    }
    if (Math.abs(to - from) < 2) return; // e.g. fixed height in a grid layout
    this._animating = true;
    const anim = card.animate([{ height: `${from}px` }, { height: `${to}px` }], {
      duration: 280,
      easing: "cubic-bezier(0.2, 0, 0, 1)",
    });
    const done = () => {
      this._animating = false;
      const g = this.renderRoot.querySelector(".graph");
      const h = g ? Math.round(g.getBoundingClientRect().height) : 0;
      if (h && h !== this._graphH) this._graphH = h;
      this._measureRoom();
    };
    anim.onfinish = done;
    anim.oncancel = done;
  }

  private _toggleSeries(entity: string): void {
    const next = new Set(this._off);
    if (next.has(entity)) next.delete(entity);
    else next.add(entity);
    this._off = next;
  }

  // ---------------------------------------------------------------- graph model

  /** natural graph height (like the sensor card), used when the card height is not fixed */
  private _baseGraphHeight(): number {
    const h = Number(this._config?.height);
    if (h > 0) return h;
    return Math.round(Math.min(Math.max((this._width || 400) / 5, 56), 140));
  }

  /** actual height: in grid layouts with a fixed card height the graph takes all free space */
  private _graphHeight(): number {
    if (Number(this._config?.height) > 0) return Number(this._config!.height);
    return this._graphH > 0 ? this._graphH : this._baseGraphHeight();
  }

  private _labelMargin(series: EntityConfig[]): number {
    const mode = this._config?.end_labels ?? DEFAULTS.end_labels;
    if (mode === "none" || this._compact) return 0;
    let max = 0;
    for (const e of series) {
      let w = 8;
      if (mode === "icon" || mode === "icon_value") w += 20;
      if (mode === "value" || mode === "icon_value") {
        const text = `${this._formatState(e)} ${this._valueUnit(e)}`;
        w += text.length * 7 + 4;
      }
      max = Math.max(max, w);
    }
    return max;
  }

  private _buildModel(): GraphModel | undefined {
    const cfg = this._config!;
    if (!this._ds || !this._width) return undefined;
    const ents = this._graphEntities();
    const height = this._graphHeight();
    const plotW = Math.max(20, this._width - this._labelMargin(ents.filter((e) => !this._off.has(this._sid(e)))));
    const detail = (Number(cfg.detail) === 2 ? 2 : 1) as 1 | 2;
    const key = JSON.stringify([
      this._tick, this._cfgVersion, this._dsKey, this._width, height, this._room, plotW, detail, [...this._off], this._ds.loaded, this._compact, this._ev?.version ?? -1,
      this._view,
    ]);
    if (this._model?.key === key) return this._model;

    const now = Date.now();
    const { start, end } = this._range(now);
    const n = Math.max(2, Math.round(plotW / (detail === 2 ? 2 : 8)));
    const shown = ents.filter((e) => !this._off.has(this._sid(e)));
    const multi = shown.length > 1;

    // aggregate first, then build shared scales per group (only from series that are switched on)
    // series with all details are always drawn peak-preserving (otherwise loading them would be pointless)
    const nFor = (e: EntityConfig) => (e.raw_history ? Math.max(2, Math.round(plotW / 2)) : n);
    const detailFor = (e: EntityConfig): 1 | 2 => (e.raw_history ? 2 : detail);
    const agg = ents.map((e) => {
      const data = this._ds!.series(this._sid(e)) ?? { t: [], v: [] };
      return { e, b: aggregate(data, start, end, nFor(e)) };
    });
    const groups = new Map<string, { lo: number; hi: number; first?: EntityConfig; peaks: number[]; peak?: number }>();
    const room = this._compact ? 0 : this._room;
    for (const { e, b } of agg) {
      const g = e.scale || "default";
      const cur = groups.get(g) ?? { lo: Infinity, hi: -Infinity, peaks: [] as number[] };
      const off = this._off.has(this._sid(e));
      if (!off || !groups.has(g)) {
        // with a band the scale must also fit the real minimum / maximum
        // with a band or peak-preserving lines the scale must fit the real minimum / maximum
        const [lo, hi] = this._bandOn(e) || detailFor(e) === 2 ? bandRange(b) : dataRange([b]);
        if (!off) {
          cur.lo = Math.min(cur.lo, lo);
          cur.hi = Math.max(cur.hi, hi);
          cur.first ??= e;
          if (room > 0 && (e.peak_overflow ?? cfg.peak_overflow)) {
            // time-weighted means: a short spike counts with its real duration
            for (let i = 0; i < b.mean.length; i++) cur.peaks.push(b.mean[i]);
          }
        }
      }
      groups.set(g, cur);
    }
    for (const [g, r] of groups) {
      // explicit limits: entity min/max > card limits
      const members = ents.filter((e) => (e.scale || "default") === g);
      const mins = members.map((e) => e.min).filter(isSet).map(Number);
      const maxs = members.map((e) => e.max).filter(isSet).map(Number);
      const lmin = mins.length ? Math.min(...mins) : cfg.limits?.min;
      const lmax = maxs.length ? Math.max(...maxs) : cfg.limits?.max;
      if (isSet(lmin)) r.lo = Number(lmin);
      if (isSet(lmax)) r.hi = Number(lmax);
      else if (r.peaks.length && Number.isFinite(r.lo)) {
        // peaks may rise into the header: the scale follows the bulk of the values, not single spikes
        const share = Math.min(100, Math.max(50, Number(cfg.peak_percentile) || DEFAULTS.peak_percentile)) / 100;
        // the bulk of the values fills the lower 60 %, so the spikes still clearly stand out above it
        const hi = r.lo + (quantile(r.peaks, share) - r.lo) / 0.6;
        // only worth it if the spikes stick out clearly
        if (hi > r.lo && r.hi - hi > 0.1 * (r.hi - r.lo)) {
          r.peak = r.hi;
          r.hi = hi;
        }
      }
      if (!Number.isFinite(r.lo) || !Number.isFinite(r.hi)) {
        r.lo = 0;
        r.hi = 1;
      }
      if (r.hi <= r.lo) {
        r.hi = r.lo + 1;
        r.lo -= 1;
      }
    }

    const xOf = (t: number) => ((t - start) / (end - start)) * plotW;
    const events: EventMark[] = [];
    if (this._ev && !this._compact) {
      this._eventConfigs().forEach((ec, i) => {
        const targets = ec.state === undefined ? ["on"] : Array.isArray(ec.state) ? ec.state.map(String) : [String(ec.state)];
        for (const iv of stateIntervals(this._ev!.series(ec.entity), targets, start, end)) {
          events.push({
            cfg: ec,
            ...iv,
            x1: Math.max(0, xOf(iv.from)),
            x2: Math.min(plotW, xOf(iv.to)),
            color: ec.color || EVENT_COLORS[i % EVENT_COLORS.length],
            pin: iv.from >= start,
            showPin: false,
            lane: i,
          });
        }
      });
    }

    // pins (optional): keep the row calm – a pin needs some room, closer events only show their
    // bar (and their guide line)
    let lastPin = -Infinity;
    for (const ev of [...events].sort((a, b) => a.x1 - b.x1)) {
      if (!ev.pin || (ev.cfg.pin ?? cfg.event_pins) === false || ev.x1 - lastPin < 44) continue;
      ev.showPin = true;
      lastPin = ev.x1;
    }

    let hasData = false;
    let peaked = false;
    const series: SeriesModel[] = agg.map(({ e, b }, index) => {
      const { lo, hi } = groups.get(e.scale || "default")!;
      const lineWidth = Number(e.line_width) > 0 ? Number(e.line_width) : multi ? 3 : 4;
      const inset = this._compact ? 8 : 2; // background graph: keep the lines off the edges
      const top = lineWidth / 2 + inset;
      // with event pins the lines keep clear of the event strip
      const bottom = height - lineWidth / 2 - inset - (events.length ? EVENT_STRIP : 0);
      const peak = groups.get(e.scale || "default")!.peak;
      // the lines may rise up to peak_margin px below the card's top edge
      const margin = Math.max(0, isSet(cfg.peak_margin) ? Number(cfg.peak_margin) || 0 : DEFAULTS.peak_margin);
      const y = scaleY(lo, hi, top, bottom, peak !== undefined ? { max: peak, room: Math.max(0, room + top - margin) } : undefined);
      if (peak !== undefined) peaked = true;
      let sum = 0;
      let cnt = 0;
      for (const v of b.mean) if (Number.isFinite(v)) (sum += v), cnt++;
      const [mn, mx] = bandRange(b);
      if (cnt) hasData = true;
      const m: SeriesModel = {
        cfg: e,
        index,
        buckets: b,
        segs: toPoints(b, detailFor(e), plotW, y),
        lo,
        hi,
        y,
        color: this._baseColor(e),
        lineWidth,
        fill: e.fill ?? !multi,
        off: this._off.has(this._sid(e)),
        ext: { min: mn, max: mx, avg: cnt ? sum / cnt : NaN },
        band: this._bandOn(e),
        smooth: (cfg.smoothing ?? DEFAULTS.smoothing) && detailFor(e) === 1,
      };
      if (e.color_scale?.length) {
        m.gradId = `${this._uid}-g${index}`;
        const mode = e.color_scale_mode ?? "gradient";
        // with peak_overflow the scale continues above hi (piecewise linear) up to y.maxValue
        const top = y.maxValue;
        const y0 = y(lo);
        const span = y0 - y(top);
        m.grad = gradientStops(e.color_scale, mode, lo, top, this._resolve, top > hi && span > 0
          ? { offset: (v) => (y0 - y(v)) / span, breaks: [hi] }
          : undefined);
        if (m.fill && (e.fill_gradient ?? cfg.fill_gradient) === "time") {
          m.fillGradId = `${this._uid}-f${index}`;
          m.fillGrad = timeGradientStops(e.color_scale, mode, b.mean, this._resolve);
        }
      }
      return m;
    });

    const axes: AxisModel[] = [];
    for (const r of groups.values()) {
      if (!r.first) continue;
      // the label at the top shows the value drawn there (differs from hi with peak_overflow)
      const top = series.find((s) => s.cfg === r.first)?.y.topValue ?? r.hi;
      axes.push({ lo: r.lo, hi: top, entity: r.first, colored: axesCount(groups) > 1 });
    }

    const thresholds: ThresholdModel[] = [];
    if (cfg.show_thresholds && !this._compact) {
      const seen = new Set<number>();
      for (const s of series) {
        if (s.off) continue;
        for (const v of jumpValues(s.cfg.color_scale, s.cfg.color_scale_mode)) {
          // also in the peak zone, but only inside the graph area
          if (v <= s.lo || v >= s.y.maxValue || s.y(v) < 0) continue;
          const yy = Math.round(s.y(v));
          if (seen.has(yy)) continue;
          seen.add(yy);
          thresholds.push({ y: yy, value: v, entity: s.cfg, color: this._colorFor(s.cfg, v) });
        }
      }
    }

    const ticks = this._compact ? [] : timeTicksRange(start, end, now, plotW);
    this._model = { key, width: this._width, plotW, height, start, end, series, axes, thresholds, hasData, ticks, events, room: peaked ? room : 0 };
    return this._model;
  }

  // ---------------------------------------------------------------- interactions

  private _fromEvent(ev: Event, attr: "entity" | "toggle"): string | undefined {
    for (const el of ev.composedPath()) {
      const id = (el as HTMLElement)?.dataset?.[attr];
      if (id) return id;
    }
    return undefined;
  }

  private _onPointerDown = (ev: PointerEvent) => {
    this._held = false;
    this._down = { x: ev.clientX, y: ev.clientY };
    if (!this._config?.hold_action || this._config.hold_action.action === "none") return;
    clearTimeout(this._holdTimer);
    this._holdTimer = window.setTimeout(() => {
      this._held = true;
      this._doAction("hold", ev);
    }, 500);
  };

  private _onPointerUp = () => clearTimeout(this._holdTimer);

  private _onKeyDown = (ev: KeyboardEvent) => {
    if (ev.key === "Enter" || ev.key === " ") {
      ev.preventDefault();
      this._doAction("tap", ev);
    }
  };

  private _onClick = (ev: MouseEvent) => {
    clearTimeout(this._holdTimer);
    if (this._suppressClick) {
      this._suppressClick = false;
      return;
    }
    if (this._held) {
      this._held = false;
      return;
    }
    if (this._down && Math.hypot(ev.clientX - this._down.x, ev.clientY - this._down.y) > 10) return;
    const toggle = this._fromEvent(ev, "toggle");
    if (toggle && this._config?.legend_toggle !== false) {
      this._toggleSeries(toggle);
      return;
    }
    const dbl = this._config?.double_tap_action;
    if (dbl && dbl.action !== "none") {
      if (this._clickTimer) {
        clearTimeout(this._clickTimer);
        this._clickTimer = undefined;
        this._doAction("double_tap", ev);
        return;
      }
      this._clickTimer = window.setTimeout(() => {
        this._clickTimer = undefined;
        this._doAction("tap", ev);
      }, 250);
      return;
    }
    this._doAction("tap", ev);
  };

  private _doAction(kind: "tap" | "hold" | "double_tap", ev: Event): void {
    const cfg = this._config!;
    const action = cfg[`${kind}_action` as const] ?? (kind === "tap" ? { action: "more-info" } : undefined);
    if (!action || !this.hass) return;
    if (action.action === "toggle-compact") {
      this._setCompact(!this._compact);
      return;
    }
    // a click on a value opens that entity (unless an explicit entity is configured)
    let entity = this._visible()[0]?.entity ?? cfg.entities[0].entity;
    if (action.action === "more-info" && !(action as any).entity) entity = this._fromEvent(ev, "entity") ?? entity;
    runAction(this, this.hass, action, entity);
  }

  private _setHoverFromEvent(ev: PointerEvent): void {
    if (!this._model) return;
    const el = (ev.currentTarget as HTMLElement | null) ?? (this._graphEl as HTMLElement | undefined);
    if (!el) return;
    const x = ev.clientX - el.getBoundingClientRect().left;
    this._hoverX = x >= 0 && x <= this._model.plotW ? x : null;
  }

  // Mouse: tooltip follows the pointer. Touch: swipe horizontally over the graph to
  // scrub through the history – a short tap still triggers the card action.
  // With zoom: one finger / mouse drag scrolls, two fingers zoom, press and hold shows the tooltip.
  private _onGraphDown = (ev: PointerEvent) => {
    if (this._zoomOn) {
      this._zoomDown(ev);
      return;
    }
    if (ev.pointerType === "mouse") return;
    this._scrub = { x: ev.clientX, y: ev.clientY, active: false };
  };

  private _onMove = (ev: PointerEvent) => {
    if (this._zoomOn && this._zoomMove(ev)) return;
    if (this._config?.tooltip === false) return;
    if (ev.pointerType === "mouse") {
      this._setHoverFromEvent(ev);
      return;
    }
    if (this._zoomOn) return;
    const s = this._scrub;
    if (!s) return;
    if (!s.active) {
      const dx = Math.abs(ev.clientX - s.x);
      const dy = Math.abs(ev.clientY - s.y);
      if (dx < 8 || dx < dy) return;
      s.active = true;
      clearTimeout(this._holdTimer);
      clearTimeout(this._hideTimer);
    }
    this._setHoverFromEvent(ev);
  };

  private _onGraphUp = (ev: PointerEvent) => {
    if (this._zoomOn) {
      this._zoomUp(ev);
      return;
    }
    if (ev.pointerType === "mouse") return;
    if (this._scrub?.active) {
      this._suppressNextClick();
      clearTimeout(this._hideTimer);
      this._hideTimer = window.setTimeout(() => (this._hoverX = null), 2_000);
    }
    this._scrub = undefined;
  };

  private _suppressNextClick(): void {
    this._suppressClick = true;
    // a click event may not follow – reset the flag shortly after
    setTimeout(() => (this._suppressClick = false), 400);
  }

  private _onLeave = (ev: PointerEvent) => {
    if (ev.pointerType === "mouse" && !this._gesture) this._hoverX = null;
  };

  // ---------------------------------------------------------------- zoom gestures

  private _graphX(clientX: number): number {
    const rect = this._graphEl?.getBoundingClientRect();
    return rect ? clientX - rect.left : 0;
  }

  private _zoomDown(ev: PointerEvent): void {
    if (ev.pointerType === "mouse" && ev.button !== 0) return;
    try {
      // keep getting the moves when the finger / mouse leaves the graph
      (ev.currentTarget as HTMLElement).setPointerCapture?.(ev.pointerId);
    } catch {
      /* not supported for this pointer – the gesture still works inside the graph */
    }
    this._pointers.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
    const { start, end } = this._range();
    clearTimeout(this._gesture?.timer);
    if (this._pointers.size === 2) {
      // second finger: pinch around the middle between both fingers
      const [a, b] = [...this._pointers.values()];
      this._gesture = {
        kind: "pinch",
        x0: 0,
        y0: 0,
        start0: start,
        span0: end - start,
        dist0: Math.max(10, Math.abs(a.x - b.x)),
        mid0: this._graphX((a.x + b.x) / 2),
      };
      clearTimeout(this._holdTimer);
      this._hoverX = null;
      return;
    }
    if (this._pointers.size > 2) return;
    const g: NonNullable<typeof this._gesture> = { kind: "pending", x0: ev.clientX, y0: ev.clientY, start0: start, span0: end - start };
    // touch: press and hold (without moving) shows the tooltip, then slide to scrub
    if (ev.pointerType !== "mouse" && this._config?.tooltip !== false) {
      g.timer = window.setTimeout(() => {
        if (this._gesture !== g || g.kind !== "pending") return;
        g.kind = "scrub";
        clearTimeout(this._holdTimer);
        clearTimeout(this._hideTimer);
        this._setHoverFromEvent(ev);
      }, 350);
    }
    this._gesture = g;
  }

  /** true when the move was used by a zoom gesture */
  private _zoomMove(ev: PointerEvent): boolean {
    if (!this._pointers.has(ev.pointerId)) return false;
    this._pointers.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
    const g = this._gesture;
    const plotW = this._model?.plotW;
    if (!g || !plotW) return false;
    if (g.kind === "pinch") {
      const [a, b] = [...this._pointers.values()];
      if (!b) return true;
      const dist = Math.max(10, Math.abs(a.x - b.x));
      const mid = this._graphX((a.x + b.x) / 2);
      const span = (g.span0 * g.dist0!) / dist;
      // the moment under the fingers stays under the fingers (also moves with them)
      const tMid = g.start0 + (g.mid0! / plotW) * g.span0;
      this._setView(tMid - (mid / plotW) * span, span);
      return true;
    }
    const dx = ev.clientX - g.x0;
    const dy = ev.clientY - g.y0;
    if (g.kind === "pending") {
      if (Math.abs(dx) < 6 || Math.abs(dx) < Math.abs(dy)) return ev.pointerType !== "mouse";
      g.kind = "pan";
      clearTimeout(g.timer);
      clearTimeout(this._holdTimer);
      this._hoverX = null;
    }
    if (g.kind === "pan") {
      this._setView(g.start0 - (dx / plotW) * g.span0, g.span0);
      return true;
    }
    if (g.kind === "scrub") {
      this._setHoverFromEvent(ev);
      return true;
    }
    return false;
  }

  private _zoomUp(ev: PointerEvent): void {
    this._pointers.delete(ev.pointerId);
    const g = this._gesture;
    if (!g) return;
    clearTimeout(g.timer);
    if (g.kind !== "pending") this._suppressNextClick();
    if (g.kind === "scrub") {
      clearTimeout(this._hideTimer);
      this._hideTimer = window.setTimeout(() => (this._hoverX = null), 2_000);
    }
    // the gesture ends when the last finger is lifted; a remaining finger is ignored
    if (!this._pointers.size) this._gesture = undefined;
    else g.kind = "done";
  }

  /** Ctrl + wheel and trackpad pinch zoom around the pointer, horizontal wheel scrolls. */
  private _onWheel = (ev: WheelEvent) => {
    if (!this._zoomOn || !this._model) return;
    const { start, end } = this._range();
    const span = end - start;
    const plotW = this._model.plotW;
    if (ev.ctrlKey) {
      ev.preventDefault();
      const x = Math.min(plotW, Math.max(0, this._graphX(ev.clientX)));
      const t = start + (x / plotW) * span;
      const next = span * Math.exp(ev.deltaY * 0.01);
      this._setView(t - (x / plotW) * next, next);
    } else if (Math.abs(ev.deltaX) > Math.abs(ev.deltaY)) {
      ev.preventDefault();
      this._setView(start + (ev.deltaX / plotW) * span, span);
    }
  };

  // ---------------------------------------------------------------- render

  protected render(): TemplateResult | typeof nothing {
    const cfg = this._config;
    if (!cfg || !this.hass) return nothing;
    const visible = this._visible();
    const graphOn = (cfg.graph ?? DEFAULTS.graph) !== "none";
    const showGraph = !this._compact && graphOn;
    const bgGraph = this._compact && graphOn && !!cfg.compact_graph;
    const model = showGraph || bgGraph ? this._buildModel() : undefined;
    // colour of the card name and entity names, in both modes (compact_text_color: older name)
    const textColor = cfg.text_color ?? cfg.compact_text_color;

    return html`
      <ha-card
        class=${this._compact ? "compact" : showGraph && model?.room ? "peaks" : ""}
        style=${textColor ? `--bnc-cnc:${textColor}` : ""}
        @pointerdown=${this._onPointerDown}
        @pointerup=${this._onPointerUp}
        @pointercancel=${this._onPointerUp}
        @click=${this._onClick}
        @keydown=${this._onKeyDown}
        tabindex="0"
        role="button"
        aria-label=${cfg.name ?? this._name(visible[0] ?? cfg.entities[0])}
      >
        ${model && visible.length && cfg.day_night ? this._renderDayNight(model) : nothing}
        ${bgGraph && visible.length
          ? html`<div class="graph bg" aria-hidden="true">${model ? this._renderSvg(model, !this._ds?.loaded) : nothing}</div>`
          : nothing}
        ${this._compact ? this._renderCompact(visible) : this._renderHeader(visible, model)}
        ${showGraph && visible.length ? this._renderGraph(model) : nothing}
      </ha-card>
    `;
  }

  private _renderIcon(e: EntityConfig | undefined, icon?: string): TemplateResult {
    const st = e ? this._state(e) : undefined;
    return html`<ha-state-icon .hass=${this.hass} .stateObj=${st} .icon=${icon ?? e?.icon}></ha-state-icon>`;
  }

  private _renderMarker(e: EntityConfig): TemplateResult | typeof nothing {
    const mode = this._config!.legend_icon ?? DEFAULTS.legend_icon;
    if (mode === "none") return nothing;
    const color = this._colorFor(e, this._current(e));
    if (mode === "icon") return html`<span class="marker icon" style="color:${color}">${this._renderIcon(e)}</span>`;
    return html`<span class="marker dot" style="background:${color}"></span>`;
  }

  /** font size of the value (entity > card > default of the layout) */
  private _sizeStyle(e?: EntityConfig): string {
    const fs = Number(e?.font_size ?? this._config!.font_size);
    return fs > 0 ? `--bnc-fs:${fs}px` : "";
  }

  private _valueStyle(e: EntityConfig): string {
    return e.color_scale?.length ? `color:${this._colorFor(e, this._current(e))}` : "";
  }

  private _renderExtrema(e: EntityConfig, model?: GraphModel): TemplateResult | typeof nothing {
    if (!(e.show_extrema ?? this._config!.show_extrema) || !model) return nothing;
    const s = model.series.find((x) => x.cfg === e);
    if (!s || !Number.isFinite(s.ext.min)) return nothing;
    const l = (k: string) => localize(this.hass, k);
    return html`<div class="extrema">
      <span title=${l("card.min")}>↓ ${this._formatValue(e, s.ext.min)}</span>
      <span title=${l("card.avg")}>Ø ${this._formatValue(e, s.ext.avg)}</span>
      <span title=${l("card.max")}>↑ ${this._formatValue(e, s.ext.max)}</span>
    </div>`;
  }

  private _renderHeader(visible: EntityConfig[], model?: GraphModel): TemplateResult {
    const cfg = this._config!;
    const single = cfg.entities.length === 1;
    const first = visible[0] ?? cfg.entities[0];
    const display = cfg.value_display ?? (single ? "primary" : "all");
    const name = cfg.name ?? (single || display === "primary" ? this._name(first) : undefined);
    const icon = cfg.icon ?? (single || display === "primary" ? undefined : null);
    // only an icon and several values: no extra header row, the icon goes into the values row
    const inlineIcon = name === undefined && icon !== null && display === "all";
    const showHeader = (name !== undefined || icon !== null) && !inlineIcon;

    const header = showHeader
      ? html`<div class="header ${display === "all" && !single ? "tight" : ""}">
          <div class="name">${name ?? ""}</div>
          ${icon !== null ? html`<div class="icon">${this._renderIcon(first, icon)}</div>` : nothing}
        </div>`
      : nothing;

    if (!visible.length) {
      return html`${header}<div class="info empty">${localize(this.hass, "card.all_hidden")}</div>`;
    }

    if (display === "none") return html`${header}`;

    if (display === "primary") {
      return html`${header}
        <div class="info fade" data-entity=${first.entity} style=${this._sizeStyle(first)}>
          <span class="value" style=${this._valueStyle(first)}>${this._formatState(first)}</span>
          <span class="measurement">${this._valueUnit(first)}</span>
          ${this._renderExtrema(first, model)}
        </div>`;
    }

    const items = visible.filter((e) => e.show_value !== false);
    const many = items.length > 1;
    const toggle = many && cfg.legend_toggle !== false && cfg.graph !== "none";
    return html`${header}
      <div class="values fade ${many ? "multi" : ""} ${showHeader ? "" : "noheader"}">
        ${items.map((e) => {
          const off = this._off.has(this._sid(e));
          return html`<div class="item ${off ? "off" : ""}" data-entity=${e.entity} style=${this._sizeStyle(e)}>
            ${many
              ? html`<div
                  class="item-name ${toggle ? "toggle" : ""}"
                  data-toggle=${toggle ? this._sid(e) : ""}
                  title=${toggle ? localize(this.hass, "card.toggle_series") : ""}
                >
                  ${this._renderMarker(e)}<span>${this._name(e)}</span>
                </div>`
              : nothing}
            <div class="item-value">
              <span class="value" style=${this._valueStyle(e)}>${this._formatState(e)}</span>
              <span class="measurement">${this._valueUnit(e)}</span>
            </div>
            ${this._renderExtrema(e, model)}
          </div>`;
        })}
        ${inlineIcon ? html`<div class="icon corner-icon">${this._renderIcon(first, icon ?? undefined)}</div>` : nothing}
      </div>`;
  }

  private _renderCompact(visible: EntityConfig[]): TemplateResult {
    const cfg = this._config!;
    const items = visible.filter((e) => e.show_value !== false);
    const first = visible[0] ?? cfg.entities[0];
    const vars = [
      // card-wide size in compact mode: compact_font_size, else the card's font_size
      Number(cfg.compact_font_size ?? cfg.font_size) > 0 ? `--bnc-cfs:${Number(cfg.compact_font_size ?? cfg.font_size)}px` : "",
      Number(cfg.compact_name_size) > 0 ? `--bnc-cns:${Number(cfg.compact_name_size)}px` : "",
    ].filter(Boolean).join(";");
    const over = cfg.compact_graph && cfg.graph !== "none";
    return html`<div class="compact-row fade ${over ? "over-graph" : ""} ${over && cfg.day_night ? "soft-halo" : ""}" style=${vars}>
      ${cfg.compact_icon ? html`<span class="icon compact-icon">${this._renderIcon(first, cfg.icon)}</span>` : nothing}
      ${cfg.name ? html`<span class="compact-name">${cfg.name}</span>` : nothing}
      <div class="compact-values">
        ${items.length
          ? items.map(
              (e) => html`<span
                class="compact-item"
                data-entity=${e.entity}
                title=${this._name(e)}
                style=${Number(e.font_size) > 0 ? `--bnc-cfs:${Number(e.font_size)}px` : ""}
              >
                ${items.length > 1 || cfg.legend_icon === "icon" ? this._renderMarker(e) : nothing}
                <span class="compact-text">
                  ${cfg.compact_names ? html`<span class="compact-label">${this._name(e)}</span>` : nothing}
                  <span class="vm">
                    <span class="value" style=${this._valueStyle(e)}>${this._formatState(e)}</span>
                    <span class="measurement">${this._valueUnit(e)}</span>
                  </span>
                </span>
              </span>`,
            )
          : html`<span class="empty">${localize(this.hass, "card.all_hidden")}</span>`}
      </div>
    </div>`;
  }

  private _renderGraph(model?: GraphModel): TemplateResult {
    const height = this._graphHeight();
    // stages: flat line → statistics preview → details; the glow runs until everything is loaded
    const loading = !this._ds?.loaded;
    const yAxis = this._config!.y_axis ?? DEFAULTS.y_axis;
    const xAxis = this._config!.x_axis ?? DEFAULTS.x_axis;
    // while scrolled / zoomed the time labels stay visible, so you know where you are
    const zoomed = this._zoomOn && !!this._view;
    return html`<div
      class="graph fade ${this._hoverX !== null ? "active" : ""} ${xAxis === "always" || zoomed ? "xa-always" : ""} ${this._zoomOn ? "zoom" : ""}"
      style=${Number(this._config!.height) > 0
        ? `height:${height}px;flex:none`
        : `flex:1 1 ${this._baseGraphHeight()}px;min-height:${Math.min(40, this._baseGraphHeight())}px`}
      @pointerdown=${this._onGraphDown}
      @pointermove=${this._onMove}
      @pointerup=${this._onGraphUp}
      @pointercancel=${this._onGraphUp}
      @pointerleave=${this._onLeave}
      @wheel=${this._onWheel}
    >
      ${!model
        ? nothing
        : html`${this._renderSvg(model, loading)}
          ${this._view && !this._view.live && this._zoomOn ? nothing : this._renderEndLabels(model)}
          ${loading ? html`<span class="sr-only" role="status">${localize(this.hass, "card.loading")}</span>` : nothing}
          ${model.hasData || loading
            ? nothing
            : html`<div class="nodata">
                ${this._ds?.errors().length
                  ? html`${localize(this.hass, "card.load_error")}<small>${this._ds.errors().join(" · ")}</small>`
                  : localize(this.hass, "card.no_data")}
              </div>`}
          ${yAxis !== "none" && model.hasData ? this._renderAxes(model, yAxis) : nothing}
          ${xAxis !== "none" && model.hasData ? this._renderTimeAxis(model, zoomed ? "always" : xAxis) : nothing}
          ${model.hasData ? this._renderSunTimes(model) : nothing} ${this._renderEventPins(model)}
          ${this._renderTooltip(model)}
          ${zoomed
            ? html`<button
                class="now-btn"
                style="right:${model.width - model.plotW + 6}px"
                @pointerdown=${(e: Event) => e.stopPropagation()}
                @click=${this._resetView}
              >
                ${localize(this.hass, "card.back_to_now")}
              </button>`
            : nothing}`}
    </div>`;
  }

  private _renderAxes(m: GraphModel, mode: string): TemplateResult {
    const fmt = (e: EntityConfig, v: number) => `${this._formatValue(e, v)} ${this._unit(e)}`.trim();
    return html`<div class="axes ${mode === "hover" ? "hover" : ""}" style=${m.events.length ? `bottom:${EVENT_STRIP}px` : ""}>
      ${m.axes.map((a) => {
        const c = (v: number) => (a.colored ? `color:${this._colorFor(a.entity, v)}` : "");
        return html`<div class="axis">
          <span style=${c(a.hi)}>${fmt(a.entity, a.hi)}</span><span style=${c(a.lo)}>${fmt(a.entity, a.lo)}</span>
        </div>`;
      })}
    </div>`;
  }

  private _isDark(): boolean {
    return !!this.hass?.themes?.darkMode;
  }

  /**
   * Night shading over the full card height, computed from the sun's altitude (twilight is a
   * soft transition), with an optional star field that only shows where it is night.
   */
  private _renderDayNight(m: GraphModel): TemplateResult | typeof nothing {
    const lat = Number(this.hass?.config?.latitude);
    const lon = Number(this.hass?.config?.longitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) return nothing;
    const cfg = this._config!;
    const dark = this._isDark();
    const stars = cfg.stars !== false;
    const key = JSON.stringify([
      m.key, dark, lat, lon, stars, cfg.night_color, cfg.night_opacity, cfg.dawn_color, cfg.dusk_color, cfg.day_color,
      cfg.twilight_opacity, cfg.day_opacity, cfg.stars_brightness, cfg.stars_twinkle, cfg.stars_density, cfg.stars_color,
      cfg.stars_style, cfg.sky_top,
    ]);
    if (this._dnCache?.key === key) return this._dnCache.tpl;

    const pct = (v: unknown, def: number) => (isSet(v) && Number.isFinite(Number(v)) ? Math.max(0, Number(v)) / 100 : def);
    const nightColor = cfg.night_color || (dark ? "#03061a" : "#2b3d80");
    const nightOpacity = pct(cfg.night_opacity, dark ? 0.55 : 0.13);
    const dawnColor = cfg.dawn_color || "#ff8a3d";
    const duskColor = cfg.dusk_color || "#d9467a";
    const twilightOpacity = pct(cfg.twilight_opacity, dark ? 0.3 : 0.2);
    const dayColor = cfg.day_color || "";
    const dayOpacity = pct(cfg.day_opacity, dark ? 0.08 : 0.06);

    // sample the sky every ~4 px: night, dawn/dusk glow and day as three layers
    const cols = Math.max(2, Math.round(m.plotW / 4));
    const smp: Array<{ o: number; n: number; tw: number; d: number; rising: boolean }> = [];
    for (let i = 0; i <= cols; i++) {
      const t = m.start + (i / cols) * (m.end - m.start);
      const alt = solarAltitude(t, lat, lon);
      const w = skyWeights(alt);
      smp.push({ o: i / cols, n: w.night, tw: w.twilight, d: w.day, rising: solarAltitude(t + 600_000, lat, lon) > alt });
    }
    // keep only the stops where something changes
    const compact = <T,>(vals: T[], same: (a: T, b: T) => boolean) =>
      vals.filter((v, i) => i === 0 || i === vals.length - 1 || !same(v, vals[i - 1]) || !same(v, vals[i + 1]));
    const id = `${this._uid}-dn`;
    const layer = (name: string, stops: Array<[number, string, number]>) => {
      const st = compact(stops, (a, b) => a[1] === b[1] && a[2] === b[2]);
      if (!st.some(([, , op]) => op > 0.001)) return { def: nothing, rect: nothing };
      return {
        def: svg`<linearGradient id=${`${id}-${name}`} gradientUnits="userSpaceOnUse" x1="0" x2=${m.plotW} y1="0" y2="0">
          ${st.map(([o, c, op]) => svg`<stop offset=${o} stop-color=${c} stop-opacity=${op.toFixed(3)}></stop>`)}</linearGradient>`,
        rect: svg`<rect width=${m.width} height="100%" fill=${`url(#${id}-${name})`}></rect>`,
      };
    };
    const night = layer("n", smp.map((p) => [p.o, nightColor, p.n * nightOpacity]));
    const twil = layer("t", smp.map((p) => [p.o, p.rising ? dawnColor : duskColor, p.tw * twilightOpacity]));
    const day = dayColor ? layer("d", smp.map((p) => [p.o, dayColor, p.d * dayOpacity])) : { def: nothing, rect: nothing };
    if (night.rect === nothing && twil.rect === nothing && day.rect === nothing) {
      this._dnCache = { key, tpl: html`` };
      return this._dnCache.tpl;
    }
    // sky_top (default): the night is strongest at the top and lighter towards the bottom,
    // the stars only appear in the upper part – the area behind the lines stays calm
    const top = cfg.sky_top !== false;
    const vMask = top
      ? svg`<linearGradient id=${`${id}-v`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stop-color="#fff"></stop><stop offset="1" stop-color="#fff" stop-opacity="0.5"></stop>
          </linearGradient>
          <mask id=${`${id}-vm`}><rect width=${m.width} height="100%" fill=${`url(#${id}-v)`}></rect></mask>`
      : nothing;
    const nightRect = top && night.rect !== nothing ? svg`<g mask=${`url(#${id}-vm)`}>${night.rect}</g>` : night.rect;

    // stars: stable field per card, masked by the night. Like a real sky: many tiny faint
    // stars and only a few bright ones, slightly tinted, fewer towards the horizon.
    let starField: TemplateResult | typeof nothing = nothing;
    let starMask: TemplateResult | typeof nothing = nothing;
    const brightness = pct(cfg.stars_brightness, 0.8);
    const twinkle = pct(cfg.stars_twinkle, 0.5);
    const density = pct(cfg.stars_density, 1);
    const style = cfg.stars_style ?? "glow";
    if (stars && night.rect !== nothing && brightness > 0 && density > 0) {
      const rnd = seededRandom(parseInt(hash(this._uid + m.width), 36));
      const count = Math.round(m.width * (top ? 0.24 : 0.28) * density);
      // light theme: darker stars, otherwise they disappear on the bright card
      const tints = cfg.stars_color
        ? [cfg.stars_color]
        : dark
          ? ["#ffffff", "#ffffff", "#ffffff", "#d6e4ff", "#fff0d4"]
          : ["#26367a", "#26367a", "#3b4f9e", "#45376f"];
      const dots = [];
      const glows = [];
      // no SVG masks (expensive to redraw on weak devices): each star gets its brightness
      // directly from how much night there is at its position and how high it is
      const nightAt = (x: number) => smp[Math.min(cols, Math.max(0, Math.round((x / m.plotW) * cols)))].n;
      for (let i = 0; i < count; i++) {
        const mag = Math.pow(rnd(), 3.2); // 0 = faint … 1 = bright, most stars are faint
        const x = rnd() * m.width;
        const yf = top ? Math.pow(rnd(), 1.5) * 0.72 : Math.pow(rnd(), 1.4);
        const colorPick = rnd();
        const twPick = rnd();
        const fade = top ? (yf < 0.2 ? 1 : Math.max(0, 1 - (yf - 0.2) / 0.52)) : 1 - yf * 0.6;
        const night = nightAt(x);
        // stars outside the night are not created at all (fewer elements)
        if (night * fade < 0.02) continue;
        const r = (dark ? 0.35 : 0.5) + mag * 1.7;
        const o = Math.min(1, (0.3 + 0.7 * mag) * brightness * fade * night * (dark ? 1 : 0.9));
        const color = tints[Math.floor(colorPick * tints.length)];
        const tw = twPick < twinkle * (0.3 + mag);
        const cy = `${(yf * 100).toFixed(2)}%`;
        // the brighter stars get a soft glow (or a sparkle)
        if (style !== "dot" && mag > 0.5) {
          glows.push(svg`<circle cx=${x.toFixed(1)} cy=${cy} r=${(r * 4.5).toFixed(1)} fill=${`url(#${id}-glow)`} opacity=${(o * 0.7).toFixed(2)}></circle>`);
        }
        if (style === "sparkle" && mag > 0.62) {
          // small four-pointed sparkle for the brightest stars
          const L = r * 3.2;
          const d = `M${-L},0Q0,0 0,${-L}Q0,0 ${L},0Q0,0 0,${L}Q0,0 ${-L},0Z`;
          dots.push(svg`<svg x=${x.toFixed(1)} y=${cy} overflow="visible"><path class=${tw ? "star tw" : "star"} d=${d} fill=${color} fill-opacity=${o.toFixed(2)}></path></svg>`);
          continue;
        }
        dots.push(
          svg`<circle class=${tw ? "star tw" : "star"} cx=${x.toFixed(1)} cy=${cy} r=${r.toFixed(2)} fill=${color} fill-opacity=${o.toFixed(2)}></circle>`,
        );
      }
      starMask = svg`<radialGradient id=${`${id}-glow`}>
          <stop offset="0" stop-color=${tints[0]} stop-opacity="0.8"></stop>
          <stop offset="0.3" stop-color=${tints[0]} stop-opacity="0.25"></stop>
          <stop offset="1" stop-color=${tints[0]} stop-opacity="0"></stop>
        </radialGradient>`;
      starField = svg`${glows}${dots}`;
    }
    const tpl = html`<div class="daynight" aria-hidden="true">
      <svg width=${m.width} height="100%">
        <defs>${day.def} ${twil.def} ${night.def} ${vMask} ${starMask}</defs>
        ${day.rect} ${twil.rect} ${nightRect} ${starField}
      </svg>
    </div>`;
    this._dnCache = { key, tpl };
    return tpl;
  }

  /** Sunrise / sunset markers at the top of the graph */
  private _renderSunTimes(m: GraphModel): TemplateResult | typeof nothing {
    const cfg = this._config!;
    if (!cfg.day_night || cfg.sun_times === false) return nothing;
    const lat = Number(this.hass?.config?.latitude);
    const lon = Number(this.hass?.config?.longitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) return nothing;
    const x = (t: number) => ((t - m.start) / (m.end - m.start)) * m.plotW;
    return html`${sunEvents(m.start, m.end, lat, lon)
      .filter((e) => x(e.t) > 18 && x(e.t) < m.plotW - 18)
      .map(
        (e) => html`<div class="sun-mark ${e.type}" style="left:${x(e.t)}px">
          <ha-icon .icon=${e.type === "rise" ? "mdi:weather-sunset-up" : "mdi:weather-sunset-down"}></ha-icon>
          <span>${formatTime(this.hass, e.t, false)}</span>
        </div>`,
      )}`;
  }

  private _eventName(ec: EventConfig): string {
    return ec.name ?? this.hass?.states[ec.entity]?.attributes.friendly_name ?? ec.entity;
  }

  private _eventTimeText(ev: EventMark): string {
    const withDate = this._loadHours > 24;
    const a = formatTime(this.hass, ev.from, withDate);
    return ev.open ? `${localize(this.hass, "card.since")} ${a}` : `${a}–${formatTime(this.hass, ev.to, false)}`;
  }

  /** dotted guide line and duration bar (svg, below the lines) */
  private _renderEventShapes(m: GraphModel): TemplateResult | typeof nothing {
    if (!m.events.length) return nothing;
    const cy = m.height - EVENT_STRIP / 2;
    // one thin lane per configured event (max. 4 visible lanes), centred in the strip
    const lanes = Math.min(4, Math.max(...m.events.map((e) => e.lane)) + 1);
    const h = lanes > 2 ? 3 : 4;
    const gap = 2;
    const top = cy - (lanes * h + (lanes - 1) * gap) / 2;
    return svg`${m.events.map((ev) => {
      const y = top + (ev.lane % lanes) * (h + gap);
      return svg`
        ${ev.pin && (ev.cfg.line ?? this._config!.event_lines) !== false ? svg`<line class="ev-guide" x1=${ev.x1} x2=${ev.x1} y1="0" y2=${cy - 10} style="stroke:${ev.color}"></line>` : nothing}
        ${ev.x2 - ev.x1 > 1 ? svg`<rect class="ev-bar" x=${ev.x1} y=${y} width=${ev.x2 - ev.x1} height=${h} rx=${h / 2} style="fill:${ev.color}"></rect>` : nothing}`;
    })}`;
  }

  /** pins (html, so HA icons can be used); overlapping pins are left out, their bars stay */
  private _renderEventPins(m: GraphModel): TemplateResult | typeof nothing {
    if (!m.events.length) return nothing;
    const pins = m.events.filter((e) => e.showPin);
    return html`${pins.map((ev) => {
      const st = this.hass?.states[ev.cfg.entity];
      return html`<div
        class="ev-pin"
        data-entity=${ev.cfg.entity}
        title=${`${this._eventName(ev.cfg)} · ${this._eventTimeText(ev)}`}
        style="left:${ev.x1}px;bottom:${EVENT_STRIP / 2}px;--c:${ev.color}"
      >
        <ha-state-icon .hass=${this.hass} .stateObj=${st} .icon=${ev.cfg.icon}></ha-state-icon>
      </div>`;
    })}`;
  }

  private _renderTimeAxis(m: GraphModel, mode: string): TemplateResult {
    const l = (k: string) => localize(this.hass, k);
    const label = (h: number) => {
      if (h === 0) return l("card.now");
      if (h < 1) return `−${Math.round(h * 60)} min`;
      if (h < 48) return `−${+h.toFixed(1)} h`;
      return `−${+(h / 24).toFixed(1)} d`;
    };
    return html`<div class="xaxis ${mode === "hover" ? "hover" : ""}" style=${m.events.length ? `bottom:${EVENT_STRIP + 1}px` : ""}>
      ${m.ticks.map(
        (t) => html`<span class=${t.hours === 0 ? "now" : ""} style="left:${t.x}px">${label(t.hours)}</span>`,
      )}
    </div>`;
  }

  private _renderSvg(m: GraphModel, loading = false): TemplateResult {
    const hover = this._hoverX;
    const shown = m.series.filter((s) => !s.off);
    // while nothing is there yet: a flat line per series, like the built-in sensor card
    const flatY = (s: SeriesModel) => m.height - s.lineWidth / 2 - 2;
    const shapes = (s: SeriesModel) =>
      m.hasData ? s.segs.map((seg) => linePath(seg, s.smooth)) : [`M0,${flatY(s)}L${m.plotW},${flatY(s)}`];
    const glowW = Math.max(60, m.plotW * 0.35);
    return html`<svg width=${m.width} height=${m.height} viewBox="0 0 ${m.width} ${m.height}">
      <defs>
        ${loading
          ? svg`<linearGradient id=${`${this._uid}-glow`} x1="0" x2="1" y1="0" y2="0">
                <stop offset="0" stop-color="#fff" stop-opacity="0"></stop>
                <stop offset="0.5" stop-color="#fff" stop-opacity="0.9"></stop>
                <stop offset="1" stop-color="#fff" stop-opacity="0"></stop>
              </linearGradient>
              <mask id=${`${this._uid}-glowmask`}>
                ${shown.map((s) =>
                  shapes(s).map(
                    (d) => svg`<path d=${d} fill="none" stroke="#fff" stroke-width=${s.lineWidth + 3} stroke-linecap="round"></path>`,
                  ),
                )}
              </mask>`
          : nothing}
        ${shown.map((s) =>
          s.gradId
            ? svg`<linearGradient id=${s.gradId} gradientUnits="userSpaceOnUse" x1="0" x2="0" y1=${s.y(s.lo)} y2=${s.y(s.y.maxValue)}>
                ${s.grad!.map((g) => svg`<stop offset=${g.offset} stop-color=${g.color}></stop>`)}
              </linearGradient>`
            : nothing,
        )}
        ${shown.map((s) =>
          s.fillGradId
            ? svg`<linearGradient id=${s.fillGradId} gradientUnits="userSpaceOnUse" x1="0" x2=${m.plotW} y1="0" y2="0">
                ${s.fillGrad!.map((g) => svg`<stop offset=${g.offset} stop-color=${g.color}></stop>`)}
              </linearGradient>`
            : nothing,
        )}
        ${m.room
          ? svg`<linearGradient id=${`${this._uid}-pkg`} gradientUnits="userSpaceOnUse" x1="0" x2="0" y1=${-m.room} y2="0">
                <stop offset="0" stop-color="#fff" stop-opacity="0.6"></stop>
                <stop offset="1" stop-color="#fff" stop-opacity="1"></stop>
              </linearGradient>
              <mask id=${`${this._uid}-pk`} maskUnits="userSpaceOnUse" x="0" y=${-m.room} width=${m.width} height=${m.height + m.room}>
                <rect x="0" y=${-m.room} width=${m.width} height=${m.height + m.room} fill=${`url(#${this._uid}-pkg)`}></rect>
              </mask>`
          : nothing}
      </defs>
      ${m.thresholds.map(
        (t) => svg`<line class="threshold" x1="0" x2=${m.plotW} y1=${t.y} y2=${t.y} style="stroke:${t.color}"></line>`,
      )}
      ${m.ticks.map(
        (t) => (t.hours === 0 ? nothing : svg`<line class="tick" x1=${t.x} x2=${t.x} y1="0" y2=${m.height}></line>`),
      )}
      ${this._renderEventShapes(m)}
      <g mask=${m.room ? `url(#${this._uid}-pk)` : nothing}>
      ${shown.map((s) => {
        const paint = s.gradId ? `url(#${s.gradId})` : s.color;
        const fillPaint = s.fillGradId ? `url(#${s.fillGradId})` : paint;
        return svg`<g>
          ${s.band ? svg`<path class="band" d=${bandPath(s.buckets, m.plotW, s.y)} style="fill:${paint}"></path>` : nothing}
          ${s.fill
            ? s.segs.map((seg) => svg`<path class="fill" d=${fillPath(seg, s.smooth, m.height)} style="fill:${fillPaint}"></path>`)
            : nothing}
          ${s.segs.map(
            (seg) =>
              svg`<path class="line" d=${linePath(seg, s.smooth)} style="stroke:${paint};stroke-width:${s.lineWidth}px"></path>`,
          )}
        </g>`;
      })}
      </g>
      ${!m.hasData && loading
        ? shown.map(
            (s) =>
              svg`<path class="line placeholder" d=${shapes(s)[0]} style="stroke:${s.color};stroke-width:${s.lineWidth}px"></path>`,
          )
        : nothing}
      ${loading
        ? svg`<g mask=${`url(#${this._uid}-glowmask)`}>
            <rect class="glow" x=${-glowW} y="0" width=${glowW} height=${m.height} fill=${`url(#${this._uid}-glow)`}
              style=${`--sweep:${m.plotW + glowW}px`}></rect>
          </g>`
        : nothing}
      ${hover !== null
        ? svg`<line class="cursor" x1=${hover} x2=${hover} y1="0" y2=${m.height}></line>
          ${shown.map((s) => {
            const v = valueAtX(s.buckets, hover, m.plotW);
            return Number.isFinite(v)
              ? svg`<circle class="dot" cx=${hover} cy=${s.y(v)} r="4" style="fill:${this._colorFor(s.cfg, v)}"></circle>`
              : nothing;
          })}`
        : nothing}
    </svg>
    ${m.thresholds.map(
      (t) => html`<div class="threshold-label" style="top:${t.y}px;right:${m.width - m.plotW + 4}px;color:${t.color}">
        ${this._formatValue(t.entity, t.value)}
      </div>`,
    )}`;
  }

  private _renderEndLabels(m: GraphModel): TemplateResult | typeof nothing {
    const mode = this._config!.end_labels ?? DEFAULTS.end_labels;
    if (mode === "none") return nothing;
    const labels = m.series
      .filter((s) => !s.off)
      .map((s) => {
        const v = this._current(s.cfg);
        const last = lastFinite(s.buckets.mean);
        const y = s.y(Number.isFinite(v) ? v : last);
        return { s, v, y: Number.isFinite(y) ? y : m.height / 2 };
      })
      .sort((a, b) => a.y - b.y);
    // avoid overlapping labels
    const gap = 18;
    for (let i = 1; i < labels.length; i++) labels[i].y = Math.max(labels[i].y, labels[i - 1].y + gap);
    // keep clear of the card's rounded bottom corner
    const overflow = labels.length ? labels[labels.length - 1].y - (m.height - gap / 2 - 12) : 0;
    if (overflow > 0) for (const l of labels) l.y -= overflow;
    for (const l of labels) l.y = Math.max(l.y, gap / 2);
    return html`${labels.map(({ s, v, y }) => {
      const color = this._colorFor(s.cfg, v);
      return html`<div class="end-label" data-entity=${s.cfg.entity} style="left:${m.plotW + 4}px;top:${y}px;color:${color}">
        ${mode === "icon" || mode === "icon_value" ? this._renderIcon(s.cfg) : nothing}
        ${mode === "value" || mode === "icon_value"
          ? html`<span>${this._formatState(s.cfg)}<small>${this._valueUnit(s.cfg) ? ` ${this._valueUnit(s.cfg)}` : ""}</small></span>`
          : nothing}
      </div>`;
    })}`;
  }

  private _renderTooltip(m: GraphModel): TemplateResult | typeof nothing {
    const x = this._hoverX;
    if (x === null) return nothing;
    const ts = m.start + (x / m.plotW) * (m.end - m.start);
    const rows = m.series.filter((s) => !s.off).map((s) => ({ s, v: valueAtX(s.buckets, x, m.plotW) }));
    const left = x > m.width / 2;
    return html`<div class="tooltip" style="${left ? `right:${m.width - x + 10}px` : `left:${x + 10}px`}">
      <div class="tt-time">${formatTime(this.hass, ts, this._loadHours > 24)}</div>
      ${rows.map(
        ({ s, v }) => html`<div class="tt-row">
          <span class="marker dot" style="background:${this._colorFor(s.cfg, v)}"></span>
          ${rows.length > 1 ? html`<span class="tt-name">${this._name(s.cfg)}</span>` : nothing}
          <span class="tt-value">${Number.isFinite(v) ? this._formatValue(s.cfg, v) : "–"} ${this._unit(s.cfg)}</span>
        </div>`,
      )}
      ${m.events
        .filter((ev) => ts >= ev.from && ts <= ev.to)
        .map(
          (ev) => html`<div class="tt-row tt-event">
            <span class="marker dot" style="background:${ev.color}"></span>
            <span class="tt-name">${this._eventName(ev.cfg)}</span>
            <span class="tt-value">${this._eventTimeText(ev)}</span>
          </div>`,
        )}
    </div>`;
  }

  static styles = css`
    :host {
      display: block;
      position: relative;
    }
    :host([alert])::after {
      --c: var(--bnc-alert-color, var(--error-color, #db4437));
      content: "";
      position: absolute;
      inset: 0;
      z-index: 1;
      pointer-events: none;
      border-radius: var(--ha-card-border-radius, 12px);
      box-shadow:
        0 0 0 2px var(--c),
        0 0 18px 4px color-mix(in srgb, var(--c) 55%, transparent),
        inset 0 0 28px color-mix(in srgb, var(--c) 28%, transparent);
      /* a few steps per second instead of 60 frames: costs (almost) nothing on wall tablets */
      animation: bnc-glow 2.4s steps(12) infinite;
    }
    :host([alert-style="blink"])::after {
      animation: bnc-blink 1s steps(1, end) infinite;
    }
    :host([alert-style="static"])::after {
      animation: none;
    }
    @keyframes bnc-glow {
      0%,
      100% {
        opacity: 0.3;
      }
      50% {
        opacity: 1;
      }
    }
    @keyframes bnc-blink {
      50% {
        opacity: 0;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      :host([alert])::after {
        animation: none;
      }
    }
    ha-card {
      height: 100%;
      position: relative;
      isolation: isolate; /* the day/night layer sits behind the content but above the card background */
      overflow: hidden;
      display: flex;
      flex-direction: column;
      cursor: pointer;
      outline: none;
      box-sizing: border-box;
    }
    ha-card:focus-visible {
      box-shadow: 0 0 0 2px var(--primary-color);
    }
    .fade {
      animation: bnc-in 0.2s ease-out;
    }
    @keyframes bnc-in {
      from {
        opacity: 0;
        transform: translateY(3px);
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .fade {
        animation: none;
      }
    }
    .header {
      display: flex;
      padding: 8px 16px 0;
      justify-content: space-between;
    }
    /* peak_overflow: the peaks rise behind the header – keep the text on top and readable */
    .peaks .header,
    .peaks .values,
    .peaks .info {
      position: relative;
      z-index: 1;
      pointer-events: none;
      text-shadow:
        0 0 4px var(--ha-card-background, var(--card-background-color, #fff)),
        0 0 8px var(--ha-card-background, var(--card-background-color, #fff));
    }
    .peaks .header > *,
    .peaks .values > *,
    .peaks .info > * {
      pointer-events: auto;
    }
    .header.tight {
      padding-top: 6px;
    }
    .header.tight .name,
    .header.tight .icon {
      line-height: 34px;
    }
    .name {
      color: var(--bnc-cnc, var(--secondary-text-color));
      line-height: 40px;
      font-weight: 500;
      font-size: 16px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .icon {
      color: var(--state-icon-color, var(--paper-item-icon-color));
      line-height: 40px;
    }
    .info {
      padding: 0 16px 16px;
      margin-top: -4px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      line-height: max(28px, calc(var(--bnc-fs, 28px) * 1.1));
    }
    .info.empty {
      color: var(--secondary-text-color);
      padding-top: 12px;
    }
    .value {
      font-size: var(--bnc-fs, 28px);
      margin-right: 4px;
      margin-inline-end: 4px;
    }
    .measurement {
      font-size: calc(var(--bnc-fs, 28px) * 0.64);
      color: var(--secondary-text-color);
    }
    .extrema {
      display: flex;
      gap: 10px;
      font-size: 12px;
      line-height: 16px;
      color: var(--secondary-text-color);
      white-space: nowrap;
    }
    .values {
      display: flex;
      flex-wrap: wrap;
      gap: 4px 20px;
      padding: 0 16px 16px;
      margin-top: -4px;
    }
    .values.noheader {
      padding-top: 12px;
      margin-top: 0;
    }
    .corner-icon {
      margin-left: auto;
      align-self: flex-start;
      line-height: 24px;
    }
    .values.multi .value {
      font-size: var(--bnc-fs, 24px);
    }
    .values.multi .measurement {
      font-size: calc(var(--bnc-fs, 24px) * 0.62);
    }
    .item {
      min-width: 0;
      transition: opacity 0.2s;
    }
    .item.off {
      opacity: 0.45;
    }
    .item.off .item-name span {
      text-decoration: line-through;
    }
    .item-value {
      line-height: max(28px, calc(var(--bnc-fs, 24px) * 1.15));
      white-space: nowrap;
    }
    .item-name {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      line-height: 16px;
      color: var(--bnc-cnc, var(--secondary-text-color));
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .item-name.toggle {
      border-radius: 4px;
    }
    @media (hover: hover) {
      .item-name.toggle:hover {
        color: var(--primary-text-color);
      }
    }
    .marker.dot {
      display: inline-block;
      flex: none;
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }
    .marker.icon {
      --mdc-icon-size: 18px;
      display: inline-flex;
      align-items: center;
      line-height: 0;
    }
    .marker.icon ha-state-icon {
      display: flex;
    }
    .graph {
      position: relative;
      width: 100%;
      touch-action: pan-y;
    }
    /* zoom: the page may still scroll vertically, everything else belongs to the graph */
    .graph.zoom {
      cursor: grab;
      user-select: none;
      -webkit-user-select: none;
    }
    .now-btn {
      position: absolute;
      top: 4px;
      z-index: 3;
      font: inherit;
      font-size: 12px;
      line-height: 20px;
      padding: 0 10px;
      border: 0;
      border-radius: 10px;
      color: var(--text-primary-color, #fff);
      background: var(--primary-color, #03a9f4);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
      cursor: pointer;
    }
    /* the svg must not influence the layout – its size follows the measured area */
    .graph svg {
      position: absolute;
      left: 0;
      top: 0;
    }
    svg {
      display: block;
      overflow: visible;
    }
    .line {
      fill: none;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    .fill {
      opacity: 0.15;
      stroke: none;
    }
    .band {
      opacity: 0.16;
      stroke: none;
    }
    .tick {
      stroke: var(--divider-color, rgba(0, 0, 0, 0.12));
      stroke-width: 1;
      opacity: 0;
      transition: opacity 0.2s;
    }
    .graph:hover .tick,
    .graph.active .tick,
    .graph.xa-always .tick {
      opacity: 1;
    }
    .xaxis {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 1px;
      height: 12px;
      pointer-events: none;
      transition: opacity 0.2s;
      font-size: 10px;
      line-height: 12px;
      color: var(--secondary-text-color);
    }
    .xaxis.hover {
      opacity: 0;
    }
    .graph:hover .xaxis.hover,
    .graph.active .xaxis.hover {
      opacity: 1;
    }
    .xaxis span {
      position: absolute;
      bottom: 0;
      transform: translateX(-50%);
      white-space: nowrap;
      padding: 0 2px;
      border-radius: 3px;
      background: color-mix(in srgb, var(--card-background-color, #fff) 75%, transparent);
    }
    .xaxis span.now {
      transform: translateX(-100%);
    }
    .threshold {
      stroke-width: 1;
      stroke-dasharray: 4 4;
      opacity: 0.7;
    }
    .threshold-label {
      position: absolute;
      transform: translateY(-100%);
      font-size: 10px;
      line-height: 12px;
      padding-bottom: 1px;
      pointer-events: none;
      opacity: 0.9;
    }
    .cursor {
      stroke: var(--secondary-text-color);
      stroke-width: 1;
      stroke-dasharray: 3 3;
      opacity: 0.7;
    }
    .dot {
      stroke: var(--card-background-color, #fff);
      stroke-width: 2;
    }
    .axes {
      position: absolute;
      inset: 0 auto 0 0;
      display: flex;
      gap: 6px;
      padding: 2px 6px;
      pointer-events: none;
      transition: opacity 0.2s;
    }
    .axes.hover {
      opacity: 0;
    }
    .graph:hover .axes.hover,
    .graph.active .axes.hover {
      opacity: 1;
    }
    .axis {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      font-size: 10px;
      line-height: 12px;
      color: var(--secondary-text-color);
    }
    .axis span {
      background: color-mix(in srgb, var(--card-background-color, #fff) 75%, transparent);
      border-radius: 3px;
      padding: 0 2px;
    }
    .end-label {
      position: absolute;
      transform: translateY(-50%);
      display: flex;
      align-items: center;
      gap: 2px;
      font-size: 13px;
      font-weight: 500;
      line-height: 16px;
      white-space: nowrap;
      pointer-events: auto;
      --mdc-icon-size: 18px;
    }
    .end-label small {
      font-size: 11px;
      opacity: 0.8;
    }
    .placeholder {
      opacity: 0.35;
    }
    .glow {
      animation: bnc-sweep 1.6s ease-in-out infinite;
    }
    @keyframes bnc-sweep {
      from {
        transform: translateX(0);
      }
      to {
        transform: translateX(var(--sweep));
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .glow {
        animation: none;
        opacity: 0;
      }
    }
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip: rect(0 0 0 0);
    }
    .nodata {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      text-align: center;
      padding: 0 16px;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .tooltip {
      position: absolute;
      top: 4px;
      z-index: 1;
      pointer-events: none;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      border-radius: 8px;
      padding: 6px 8px;
      font-size: 12px;
      line-height: 18px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
      white-space: nowrap;
    }
    .tt-time {
      color: var(--secondary-text-color);
    }
    .tt-row {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .tt-value {
      margin-left: auto;
      font-weight: 500;
    }
    .ev-guide {
      stroke-width: 1;
      stroke-dasharray: 2 3;
      opacity: 0.45;
    }
    .ev-bar {
      opacity: 0.75;
    }
    .ev-pin {
      position: absolute;
      transform: translate(-50%, 50%);
      width: 17px;
      height: 17px;
      box-sizing: border-box;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--c);
      background: color-mix(in srgb, var(--c) 18%, var(--card-background-color, #fff));
      border: 1px solid color-mix(in srgb, var(--c) 70%, transparent);
      --mdc-icon-size: 11px;
      pointer-events: auto;
      z-index: 1;
    }
    .ev-pin ha-state-icon {
      display: flex;
    }
    .tt-event .tt-value {
      font-weight: 400;
      color: var(--secondary-text-color);
    }
    .daynight {
      position: absolute;
      inset: 0;
      z-index: -1;
      pointer-events: none;
    }
    .daynight svg {
      position: absolute;
      left: 0;
      top: 0;
    }
    .sun-mark {
      position: absolute;
      top: 2px;
      transform: translateX(-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 9.5px;
      line-height: 11px;
      pointer-events: none;
      --mdc-icon-size: 15px;
      opacity: 0.85;
    }
    .sun-mark.rise {
      color: #e0a43a;
    }
    .sun-mark.set {
      color: #9aa6e6;
    }
    .graph.bg {
      position: absolute;
      inset: 0;
      pointer-events: none;
      opacity: 0.28;
      overflow: hidden;
      border-radius: inherit;
    }
    .compact-icon {
      flex: none;
      line-height: 0;
    }
    /* text above the background graph: a soft halo in the card colour keeps it readable */
    .compact-row.over-graph {
      --bnc-halo: var(--ha-card-background, var(--card-background-color, #fff));
      text-shadow:
        0 0 2px var(--bnc-halo),
        0 0 4px var(--bnc-halo),
        0 0 8px var(--bnc-halo),
        0 0 12px var(--bnc-halo);
    }
    /* above the night shading a strong halo would show as light boxes */
    .compact-row.over-graph.soft-halo {
      text-shadow: 0 0 3px var(--bnc-halo);
    }
    .compact-row.over-graph ha-state-icon,
    .compact-row.over-graph .marker.dot {
      filter: drop-shadow(0 0 3px var(--bnc-halo)) drop-shadow(0 0 6px var(--bnc-halo));
    }
    .compact-text {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }
    .compact-label {
      color: var(--bnc-cnc, var(--secondary-text-color));
      font-size: max(11px, calc(var(--bnc-cfs, 20px) * 0.55));
      line-height: 1.2;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 12em;
    }
    .compact-row {
      position: relative;
      z-index: 1;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 16px;
      min-height: 40px;
      box-sizing: border-box;
    }
    .compact-name {
      min-width: 3em;
      color: var(--bnc-cnc, var(--secondary-text-color));
      font-size: var(--bnc-cns, inherit);
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      flex: 0 1 auto;
    }
    .compact-values {
      display: flex;
      flex-wrap: wrap;
      gap: 2px 16px;
      margin-left: auto;
      justify-content: flex-end;
    }
    .compact-item {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      white-space: nowrap;
    }
    .compact-item .vm {
      display: inline-flex;
      align-items: baseline;
      gap: 3px;
      line-height: max(24px, calc(var(--bnc-cfs, 20px) * 1.2));
    }
    .compact-item .value {
      font-size: var(--bnc-cfs, 20px);
      margin: 0;
    }
    .compact-item .measurement {
      font-size: calc(var(--bnc-cfs, 20px) * 0.7);
    }
    .empty {
      color: var(--secondary-text-color);
    }
  `;
}

/** Real minimum / maximum of the buckets (incl. statistics min/max). */
function bandRange(b: Buckets): [number, number] {
  let lo = Infinity;
  let hi = -Infinity;
  for (let i = 0; i < b.bandLo.length; i++) {
    if (b.bandLo[i] < lo) lo = b.bandLo[i];
    if (b.bandHi[i] > hi) hi = b.bandHi[i];
  }
  return [lo, hi];
}

function axesCount(groups: Map<string, { first?: EntityConfig }>): number {
  let n = 0;
  for (const g of groups.values()) if (g.first) n++;
  return n;
}

function lastFinite(arr: Float64Array): number {
  for (let i = arr.length - 1; i >= 0; i--) if (Number.isFinite(arr[i])) return arr[i];
  return NaN;
}

/** Numeric sensors that make sense in this card (used for the stub config and card suggestions). */
export function isNumericSensor(hass: HomeAssistant, entityId: string): boolean {
  const domain = entityId.split(".")[0];
  if (!["sensor", "number", "input_number"].includes(domain)) return false;
  const st = hass.states[entityId];
  if (!st) return false;
  const a = st.attributes;
  if (domain === "sensor" && !a.unit_of_measurement && !a.state_class) return false;
  return st.state === "unavailable" || st.state === "unknown" || Number.isFinite(Number(st.state));
}

if (!customElements.get("best-number-card")) {
  customElements.define("best-number-card", BestNumberCard);
  console.info(`%c BEST-NUMBER-CARD %c v${VERSION} `, "color:#fff;background:#03a9f4;font-weight:700", "color:#03a9f4");
}

(window as any).customCards = (window as any).customCards || [];
if (!(window as any).customCards.some((c: any) => c.type === "best-number-card")) {
  (window as any).customCards.push({
    type: "best-number-card",
    name: "Best Number Card",
    description: "Sensor card for multiple entities with color scales and efficient history loading.",
    preview: true,
    documentationURL: "https://github.com/zitroaen/bestnumbercard",
    // Home Assistant 2026.6+: offer the card in the "add card by entity" picker
    getEntitySuggestion: (hass: HomeAssistant, entityId: string) =>
      isNumericSensor(hass, entityId) ? { config: { type: "custom:best-number-card", entities: [{ entity: entityId }] } } : null,
  });
}

declare global {
  interface HTMLElementTagNameMap {
    "best-number-card": BestNumberCard;
  }
}
