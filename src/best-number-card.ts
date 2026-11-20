import { LitElement, html, svg, css, nothing, type PropertyValues, type TemplateResult } from "lit";
import pkg from "../package.json";
import { runAction } from "./actions";
import { colorAt, gradientStops, parseColor, rgbaToCss, sortStops, type GradientStop } from "./color-scale";
import { DataSource } from "./data";
import { aggregate, dataRange, fillPath, linePath, toPoints, valueAtX, type Buckets, type Point } from "./graph";
import { formatNumber, formatTime, localize } from "./localize";
import type { CardConfig, ColorStop, EntityConfig, HassEntity, HomeAssistant } from "./types";
import "./editor";

export const VERSION: string = pkg.version;

const PALETTE = [
  "#44739e", "#984ea3", "#00d2d5", "#ff7f00", "#af8d00", "#7f80cd",
  "#b3e900", "#c42e60", "#a65628", "#f781bf", "#8dd3c7", "#bebada",
];

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
};

interface SeriesModel {
  cfg: EntityConfig;
  index: number;
  buckets: Buckets;
  segs: Point[][];
  lo: number;
  hi: number;
  y: (v: number) => number;
  gradId?: string;
  grad?: GradientStop[];
  color: string;
  lineWidth: number;
  fill: boolean;
}

interface GraphModel {
  key: string;
  width: number;
  plotW: number;
  height: number;
  start: number;
  end: number;
  series: SeriesModel[];
}

let uid = 0;

export class BestNumberCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
    _compact: { state: true },
    _width: { state: true },
    _hoverX: { state: true },
    _tick: { state: true },
  };

  hass?: HomeAssistant;
  private _config?: CardConfig;
  private _compact = false;
  private _width = 0;
  private _hoverX: number | null = null;
  private _tick = 0;

  private _uid = `bnc${++uid}`;
  private _cfgVersion = 0;
  private _ds?: DataSource;
  private _dsKey = "";
  private _dsStarted = 0;
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
  private _resolve = (c: string) => parseColor(c, this);

  // ---------------------------------------------------------------- HA API

  static getConfigElement(): HTMLElement {
    return document.createElement("best-number-card-editor");
  }

  static getStubConfig(hass: HomeAssistant): Partial<CardConfig> {
    const ids = Object.keys(hass.states).filter(
      (id) => id.startsWith("sensor.") && hass.states[id].attributes.unit_of_measurement && !isNaN(Number(hass.states[id].state)),
    );
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
    if (!prev || prev.compact !== config.compact) this._compact = !!config.compact;
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
    this._syncDataSource();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._disposeDataSource();
    this._ro?.disconnect();
    this._ro = undefined;
    this._graphEl = undefined;
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
    if (changed.has("hass") || changed.has("_config") || changed.has("_compact")) this._syncDataSource();
    if (this.hass && this._config?.theme && (changed.has("_config") || changed.has("hass"))) this._applyTheme();
  }

  protected updated(): void {
    const el = this.renderRoot.querySelector(".graph");
    if (el !== this._graphEl) {
      this._ro?.disconnect();
      this._graphEl = el ?? undefined;
      if (el) {
        this._ro ??= new ResizeObserver((entries) => {
          const w = Math.round(entries[0].contentRect.width);
          if (w && w !== this._width) this._width = w;
        });
        this._ro.observe(el);
      }
    }
  }

  // ---------------------------------------------------------------- data

  private _visible(): EntityConfig[] {
    const cfg = this._config!;
    return cfg.entities.filter((e) => !this._isHidden(e));
  }

  private _isHidden(e: EntityConfig): boolean {
    const st = this.hass?.states[e.entity];
    const v = st ? Number(st.state) : NaN;
    const numeric = st !== undefined && st.state !== "" && Number.isFinite(v);
    if (e.hide_unavailable && !numeric) return true;
    if (numeric && e.hide_below !== undefined && e.hide_below !== null && v < Number(e.hide_below)) return true;
    if (numeric && e.hide_above !== undefined && e.hide_above !== null && v > Number(e.hide_above)) return true;
    return false;
  }

  private get _hours(): number {
    const h = Number(this._config?.hours_to_show ?? DEFAULTS.hours_to_show);
    return h > 0 ? h : DEFAULTS.hours_to_show;
  }

  private _graphEntities(): EntityConfig[] {
    return this._visible().filter((e) => e.show_graph !== false);
  }

  private _syncDataSource(): void {
    const cfg = this._config;
    if (!cfg || !this.hass || !this.isConnected) return;
    const needed = !this._compact && (cfg.graph ?? DEFAULTS.graph) !== "none";
    const ids = needed ? this._graphEntities().map((e) => e.entity) : [];
    const threshold = Number(cfg.statistics_threshold ?? DEFAULTS.statistics_threshold);
    const key = ids.length ? JSON.stringify([ids, this._hours, threshold, cfg.statistics_period ?? "auto"]) : "";
    if (key === this._dsKey) {
      this._ds?.setHass(this.hass);
      return;
    }
    this._disposeDataSource();
    this._dsKey = key;
    if (!key) return;
    this._ds = new DataSource(this.hass, {
      entities: ids,
      hoursToShow: this._hours,
      statisticsThreshold: threshold,
      statisticsPeriod: cfg.statistics_period,
      onChange: () => this._scheduleTick(),
    });
    this._dsStarted = Date.now();
    this._ds.start().catch((err) => console.warn("best-number-card:", err));
    // let the graph scroll with time even if no new values arrive
    const pxMs = (this._hours * 3_600_000) / Math.max(this._width || 400, 100);
    this._ticker = window.setInterval(() => this._scheduleTick(), Math.min(Math.max(pxMs * 2, 5_000), 300_000));
  }

  private _disposeDataSource(): void {
    this._ds?.dispose();
    this._ds = undefined;
    this._dsKey = "";
    clearInterval(this._ticker);
    clearTimeout(this._tickTimer);
    this._tickTimer = undefined;
  }

  /** Throttled graph refresh: dense data must not cause a re-render for every single value. */
  private _scheduleTick(): void {
    if (this._tickTimer !== undefined) return;
    const now = Date.now();
    const bucketMs = (this._hours * 3_600_000) / Math.max(this._width || 400, 100);
    const minInterval = now - this._dsStarted < 5_000 ? 100 : Math.min(Math.max(bucketMs, 1_000), 30_000);
    const delay = Math.max(0, this._lastTick + minInterval - now);
    this._tickTimer = window.setTimeout(() => {
      this._tickTimer = undefined;
      this._lastTick = Date.now();
      this._tick++;
    }, delay);
  }

  // ---------------------------------------------------------------- helpers

  private _state(e: EntityConfig): HassEntity | undefined {
    return this.hass?.states[e.entity];
  }

  private _name(e: EntityConfig): string {
    const st = this._state(e);
    return e.name ?? st?.attributes.friendly_name ?? e.entity;
  }

  private _unit(e: EntityConfig): string {
    return e.unit ?? this._state(e)?.attributes.unit_of_measurement ?? "";
  }

  private _decimals(e: EntityConfig, raw?: string): number | undefined {
    if (e.decimals !== undefined && e.decimals !== null && (e.decimals as any) !== "") return Number(e.decimals);
    const p = this.hass?.entities?.[e.entity]?.display_precision;
    if (typeof p === "number") return p;
    if (raw !== undefined) {
      const m = /\.(\d+)$/.exec(raw);
      return m ? Math.min(m[1].length, 4) : 0;
    }
    return undefined;
  }

  private _formatState(e: EntityConfig): string {
    const st = this._state(e);
    if (!st) return localize(this.hass, "card.not_found");
    const v = Number(st.state);
    if (st.state === "" || !Number.isFinite(v)) {
      return (this.hass as any)?.formatEntityState?.(st) ?? st.state;
    }
    return formatNumber(this.hass, v, this._decimals(e, st.state));
  }

  private _formatValue(e: EntityConfig, v: number): string {
    const d = this._decimals(e, this._state(e)?.state);
    return formatNumber(this.hass, v, d === undefined ? 1 : d);
  }

  private _baseColor(e: EntityConfig): string {
    if (e.color) return e.color;
    const i = this._config!.entities.indexOf(e);
    if (i <= 0) return "var(--accent-color)";
    const fallback = PALETTE[(i - 1) % PALETTE.length];
    return `var(--graph-color-${i + 1}, ${fallback})`;
  }

  /** Color of a series at a given value (color scale aware). */
  private _colorFor(e: EntityConfig, v: number): string {
    if (e.color_scale?.length && Number.isFinite(v)) {
      return rgbaToCss(colorAt(e.color_scale, e.color_scale_mode ?? "gradient", v, this._resolve));
    }
    return this._baseColor(e);
  }

  private _current(e: EntityConfig): number {
    const st = this._state(e);
    return st && st.state !== "" ? Number(st.state) : NaN;
  }

  private _applyTheme(): void {
    const theme = this.hass?.themes?.themes?.[this._config!.theme!];
    if (!theme) return;
    for (const [k, v] of Object.entries(theme)) {
      if (typeof v === "string") this.style.setProperty(`--${k}`, v);
    }
  }

  // ---------------------------------------------------------------- graph model

  private _graphHeight(): number {
    const h = Number(this._config?.height);
    if (h > 0) return h;
    return Math.round(Math.min(Math.max((this._width || 400) / 5, 56), 140));
  }

  private _labelMargin(series: EntityConfig[]): number {
    const mode = this._config?.end_labels ?? DEFAULTS.end_labels;
    if (mode === "none") return 0;
    let max = 0;
    for (const e of series) {
      let w = 8;
      if (mode === "icon" || mode === "icon_value") w += 20;
      if (mode === "value" || mode === "icon_value") {
        const text = `${this._formatState(e)} ${this._unit(e)}`;
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
    const plotW = Math.max(20, this._width - this._labelMargin(ents));
    const detail = (Number(cfg.detail) === 2 ? 2 : 1) as 1 | 2;
    const key = JSON.stringify([this._tick, this._cfgVersion, this._dsKey, this._width, height, plotW, detail]);
    if (this._model?.key === key) return this._model;

    const end = Date.now();
    const start = end - this._hours * 3_600_000;
    const n = Math.max(2, Math.round(plotW / (detail === 2 ? 2 : 8)));
    const multi = ents.length > 1;

    // aggregate first, then build shared scales per group
    const agg = ents.map((e) => {
      const data = this._ds!.series(e.entity) ?? { t: [], v: [] };
      return { e, b: aggregate(data, start, end, n) };
    });
    const groups = new Map<string, { lo: number; hi: number }>();
    for (const { e, b } of agg) {
      const g = e.scale || "default";
      const [lo, hi] = dataRange([b]);
      const cur = groups.get(g) ?? { lo: Infinity, hi: -Infinity };
      cur.lo = Math.min(cur.lo, lo);
      cur.hi = Math.max(cur.hi, hi);
      groups.set(g, cur);
    }
    // explicit limits: entity min/max > card limits
    for (const [g, r] of groups) {
      const members = ents.filter((e) => (e.scale || "default") === g);
      const mins = members.map((e) => e.min).filter((x) => x !== undefined && x !== null && (x as any) !== "") as number[];
      const maxs = members.map((e) => e.max).filter((x) => x !== undefined && x !== null && (x as any) !== "") as number[];
      const lmin = mins.length ? Math.min(...mins.map(Number)) : cfg.limits?.min;
      const lmax = maxs.length ? Math.max(...maxs.map(Number)) : cfg.limits?.max;
      if (lmin !== undefined && lmin !== null) r.lo = Number(lmin);
      if (lmax !== undefined && lmax !== null) r.hi = Number(lmax);
      if (!Number.isFinite(r.lo) || !Number.isFinite(r.hi)) {
        r.lo = 0;
        r.hi = 1;
      }
      if (r.hi <= r.lo) {
        r.hi = r.lo + 1;
        r.lo -= 1;
      }
    }

    const series: SeriesModel[] = agg.map(({ e, b }, index) => {
      const { lo, hi } = groups.get(e.scale || "default")!;
      const lineWidth = Number(e.line_width) > 0 ? Number(e.line_width) : multi ? 3 : 4;
      const top = lineWidth / 2 + 2;
      const bottom = height - lineWidth / 2 - 2;
      const y = (v: number) => {
        const c = Math.min(Math.max(v, lo), hi);
        return bottom - ((c - lo) / (hi - lo)) * (bottom - top);
      };
      const m: SeriesModel = {
        cfg: e,
        index,
        buckets: b,
        segs: toPoints(b, detail, plotW, y),
        lo,
        hi,
        y,
        color: this._baseColor(e),
        lineWidth,
        fill: e.fill ?? !multi,
      };
      if (e.color_scale?.length) {
        m.gradId = `${this._uid}-g${index}`;
        m.grad = gradientStops(e.color_scale, e.color_scale_mode ?? "gradient", lo, hi, this._resolve);
      }
      return m;
    });
    this._model = { key, width: this._width, plotW, height, start, end, series };
    return this._model;
  }

  // ---------------------------------------------------------------- interactions

  private _entityFromEvent(ev: Event): string | undefined {
    for (const el of ev.composedPath()) {
      const id = (el as HTMLElement)?.dataset?.entity;
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

  private _onClick = (ev: MouseEvent) => {
    clearTimeout(this._holdTimer);
    if (this._held) {
      this._held = false;
      return;
    }
    if (this._down && Math.hypot(ev.clientX - this._down.x, ev.clientY - this._down.y) > 10) return;
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
      this._compact = !this._compact;
      return;
    }
    // a click on a value opens that entity (unless an explicit entity is configured)
    let entity = this._visible()[0]?.entity ?? cfg.entities[0].entity;
    if (action.action === "more-info" && !(action as any).entity) entity = this._entityFromEvent(ev) ?? entity;
    runAction(this, this.hass, action, entity);
  }

  private _onMove = (ev: PointerEvent) => {
    if (this._config?.tooltip === false || !this._model) return;
    const rect = (ev.currentTarget as HTMLElement).getBoundingClientRect();
    const x = ev.clientX - rect.left;
    this._hoverX = x >= 0 && x <= this._model.plotW ? x : null;
  };

  private _onLeave = () => {
    this._hoverX = null;
  };

  // ---------------------------------------------------------------- render

  protected render(): TemplateResult | typeof nothing {
    const cfg = this._config;
    if (!cfg || !this.hass) return nothing;
    const visible = this._visible();
    const showGraph = !this._compact && (cfg.graph ?? DEFAULTS.graph) !== "none";

    return html`
      <ha-card
        class=${this._compact ? "compact" : ""}
        @pointerdown=${this._onPointerDown}
        @pointerup=${this._onPointerUp}
        @pointercancel=${this._onPointerUp}
        @click=${this._onClick}
        tabindex="0"
      >
        ${this._compact ? this._renderCompact(visible) : this._renderHeader(visible)}
        ${showGraph && visible.length ? this._renderGraph() : nothing}
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

  private _valueStyle(e: EntityConfig): string {
    return e.color_scale?.length ? `color:${this._colorFor(e, this._current(e))}` : "";
  }

  private _renderHeader(visible: EntityConfig[]): TemplateResult {
    const cfg = this._config!;
    const single = cfg.entities.length === 1;
    const first = visible[0] ?? cfg.entities[0];
    const display = cfg.value_display ?? (single ? "primary" : "all");
    const name = cfg.name ?? (single || display === "primary" ? this._name(first) : undefined);
    const icon = cfg.icon ?? (single || display === "primary" ? undefined : null);
    const showHeader = name !== undefined || icon !== null;

    const header = showHeader
      ? html`<div class="header">
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
        <div class="info" data-entity=${first.entity}>
          <span class="value" style=${this._valueStyle(first)}>${this._formatState(first)}</span>
          <span class="measurement">${this._unit(first)}</span>
        </div>`;
    }

    const items = visible.filter((e) => e.show_value !== false);
    const many = items.length > 1;
    return html`${header}
      <div class="values ${many ? "multi" : ""} ${showHeader ? "" : "noheader"}">
        ${items.map(
          (e) => html`<div class="item" data-entity=${e.entity}>
            ${many ? html`<div class="item-name">${this._renderMarker(e)}<span>${this._name(e)}</span></div>` : nothing}
            <div class="item-value">
              <span class="value" style=${this._valueStyle(e)}>${this._formatState(e)}</span>
              <span class="measurement">${this._unit(e)}</span>
            </div>
          </div>`,
        )}
      </div>`;
  }

  private _renderCompact(visible: EntityConfig[]): TemplateResult {
    const cfg = this._config!;
    const items = visible.filter((e) => e.show_value !== false);
    return html`<div class="compact-row">
      ${cfg.name ? html`<span class="compact-name">${cfg.name}</span>` : nothing}
      <div class="compact-values">
        ${items.length
          ? items.map(
              (e) => html`<span class="compact-item" data-entity=${e.entity} title=${this._name(e)}>
                ${items.length > 1 || cfg.legend_icon === "icon" ? this._renderMarker(e) : nothing}
                <span class="value" style=${this._valueStyle(e)}>${this._formatState(e)}</span>
                <span class="measurement">${this._unit(e)}</span>
              </span>`,
            )
          : html`<span class="empty">${localize(this.hass, "card.all_hidden")}</span>`}
      </div>
    </div>`;
  }

  private _renderGraph(): TemplateResult {
    const model = this._buildModel();
    const height = this._graphHeight();
    return html`<div
      class="graph"
      style="height:${height}px"
      @pointermove=${this._onMove}
      @pointerleave=${this._onLeave}
    >
      ${model ? this._renderSvg(model) : nothing} ${model ? this._renderEndLabels(model) : nothing}
      ${model ? this._renderTooltip(model) : nothing}
    </div>`;
  }

  private _renderSvg(m: GraphModel): TemplateResult {
    const smooth = this._config!.smoothing ?? DEFAULTS.smoothing;
    const hover = this._hoverX;
    return html`<svg width=${m.width} height=${m.height} viewBox="0 0 ${m.width} ${m.height}">
      <defs>
        ${m.series.map((s) =>
          s.gradId
            ? svg`<linearGradient id=${s.gradId} gradientUnits="userSpaceOnUse" x1="0" x2="0" y1=${s.y(s.lo)} y2=${s.y(s.hi)}>
                ${s.grad!.map((g) => svg`<stop offset=${g.offset} stop-color=${g.color}></stop>`)}
              </linearGradient>`
            : nothing,
        )}
      </defs>
      ${m.series.map((s) => {
        const paint = s.gradId ? `url(#${s.gradId})` : s.color;
        return svg`<g>
          ${s.fill
            ? s.segs.map((seg) => svg`<path class="fill" d=${fillPath(seg, smooth, m.height)} style="fill:${paint}"></path>`)
            : nothing}
          ${s.segs.map(
            (seg) =>
              svg`<path class="line" d=${linePath(seg, smooth)} style="stroke:${paint};stroke-width:${s.lineWidth}px"></path>`,
          )}
        </g>`;
      })}
      ${hover !== null
        ? svg`<line class="cursor" x1=${hover} x2=${hover} y1="0" y2=${m.height}></line>
          ${m.series.map((s) => {
            const v = valueAtX(s.buckets, hover, m.plotW);
            return Number.isFinite(v)
              ? svg`<circle class="dot" cx=${hover} cy=${s.y(v)} r="4" style="fill:${this._colorFor(s.cfg, v)}"></circle>`
              : nothing;
          })}`
        : nothing}
    </svg>`;
  }

  private _renderEndLabels(m: GraphModel): TemplateResult | typeof nothing {
    const mode = this._config!.end_labels ?? DEFAULTS.end_labels;
    if (mode === "none") return nothing;
    const labels = m.series
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
    const overflow = labels.length ? labels[labels.length - 1].y - (m.height - gap / 2) : 0;
    if (overflow > 0) for (const l of labels) l.y -= overflow;
    for (const l of labels) l.y = Math.max(l.y, gap / 2);
    return html`${labels.map(({ s, v, y }) => {
      const color = this._colorFor(s.cfg, v);
      return html`<div class="end-label" data-entity=${s.cfg.entity} style="left:${m.plotW + 4}px;top:${y}px;color:${color}">
        ${mode === "icon" || mode === "icon_value" ? this._renderIcon(s.cfg) : nothing}
        ${mode === "value" || mode === "icon_value"
          ? html`<span>${this._formatState(s.cfg)}<small>${this._unit(s.cfg) ? ` ${this._unit(s.cfg)}` : ""}</small></span>`
          : nothing}
      </div>`;
    })}`;
  }

  private _renderTooltip(m: GraphModel): TemplateResult | typeof nothing {
    const x = this._hoverX;
    if (x === null) return nothing;
    const ts = m.start + (x / m.plotW) * (m.end - m.start);
    const rows = m.series.map((s) => ({ s, v: valueAtX(s.buckets, x, m.plotW) }));
    const left = x > m.width / 2;
    return html`<div class="tooltip" style="${left ? `right:${m.width - x + 10}px` : `left:${x + 10}px`}">
      <div class="tt-time">${formatTime(this.hass, ts, this._hours > 24)}</div>
      ${rows.map(
        ({ s, v }) => html`<div class="tt-row">
          <span class="marker dot" style="background:${this._colorFor(s.cfg, v)}"></span>
          ${m.series.length > 1 ? html`<span class="tt-name">${this._name(s.cfg)}</span>` : nothing}
          <span class="tt-value">${Number.isFinite(v) ? this._formatValue(s.cfg, v) : "–"} ${this._unit(s.cfg)}</span>
        </div>`,
      )}
    </div>`;
  }

  static styles = css`
    :host {
      display: block;
    }
    ha-card {
      height: 100%;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      cursor: pointer;
      outline: none;
      box-sizing: border-box;
    }
    .header {
      display: flex;
      padding: 8px 16px 0;
      justify-content: space-between;
    }
    .name {
      color: var(--secondary-text-color);
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
      line-height: 28px;
    }
    .info.empty {
      color: var(--secondary-text-color);
      padding-top: 12px;
    }
    .value {
      font-size: 28px;
      margin-right: 4px;
      margin-inline-end: 4px;
    }
    .measurement {
      font-size: 18px;
      color: var(--secondary-text-color);
    }
    .values {
      display: flex;
      flex-wrap: wrap;
      gap: 4px 20px;
      padding: 0 16px 16px;
      margin-top: -4px;
    }
    .values.noheader {
      padding-top: 16px;
      margin-top: 0;
    }
    .values.multi .value {
      font-size: 24px;
    }
    .values.multi .measurement {
      font-size: 15px;
    }
    .item {
      min-width: 0;
    }
    .item-value {
      line-height: 28px;
      white-space: nowrap;
    }
    .item-name {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      line-height: 16px;
      color: var(--secondary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .marker.dot {
      display: inline-block;
      flex: none;
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }
    .marker.icon {
      --mdc-icon-size: 16px;
      display: inline-flex;
    }
    .graph {
      position: relative;
      margin-top: auto;
      width: 100%;
      flex: none;
      touch-action: pan-y;
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
    .compact-row {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 16px;
      min-height: 40px;
      box-sizing: border-box;
    }
    .compact-name {
      color: var(--secondary-text-color);
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
      align-items: baseline;
      gap: 4px;
      white-space: nowrap;
    }
    .compact-item .marker {
      align-self: center;
    }
    .compact-item .value {
      font-size: 20px;
      margin: 0;
    }
    .compact-item .measurement {
      font-size: 14px;
    }
    .empty {
      color: var(--secondary-text-color);
    }
  `;
}

function lastFinite(arr: Float64Array): number {
  for (let i = arr.length - 1; i >= 0; i--) if (Number.isFinite(arr[i])) return arr[i];
  return NaN;
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
  });
}

declare global {
  interface HTMLElementTagNameMap {
    "best-number-card": BestNumberCard;
  }
}

export type { ColorStop };
