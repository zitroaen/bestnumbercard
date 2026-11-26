import { LitElement, html, css, nothing, type TemplateResult } from "lit";
import { gradientStops, parseColor, rgbaToCss, colorAt, sortStops } from "./color-scale";
import { localize, formatNumber } from "./localize";
import { PRESETS, defaultColor, rowsToStops, stopsToRows, type StopRow } from "./presets";
import type { CardConfig, ColorScaleMode, ColorStop, EntityConfig, EventConfig, HomeAssistant } from "./types";

const mdiDelete = "M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z";
const mdiDrag =
  "M7,19V17H9V19H7M11,19V17H13V19H11M15,19V17H17V19H15M7,15V13H9V15H7M11,15V13H13V15H11M15,15V13H17V15H15M7,11V9H9V11H7M11,11V9H13V11H11M15,11V9H17V11H15M7,7V5H9V7H7M11,7V5H13V7H11M15,7V5H17V7H15Z";
const mdiJump = "M3,17H9V7H15V17H21V19H13V9H11V19H3V17Z";
const mdiPlus = "M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z";

const num = { number: { mode: "box", step: "any" } };

/** Home Assistant theme colors (CSS variable name, default value). */
const THEME_COLORS: Array<[string, string]> = [
  ["red", "#f44336"], ["pink", "#e91e63"], ["purple", "#926bc7"], ["deep-purple", "#6e41ab"],
  ["indigo", "#3f51b5"], ["blue", "#2196f3"], ["light-blue", "#03a9f4"], ["cyan", "#00bcd4"],
  ["teal", "#009688"], ["green", "#4caf50"], ["light-green", "#8bc34a"], ["lime", "#cddc39"],
  ["yellow", "#ffeb3b"], ["amber", "#ffc107"], ["orange", "#ff9800"], ["deep-orange", "#ff6f22"],
  ["brown", "#795548"], ["grey", "#9e9e9e"], ["blue-grey", "#607d8b"], ["black", "#000000"],
];
const isSet = (x: unknown) => x !== undefined && x !== null && x !== "";

function select(hass: HomeAssistant | undefined, values: Array<string | number>, prefix = "opt."): any {
  return {
    select: {
      mode: "dropdown",
      options: values.map((v) => ({ value: String(v), label: localize(hass, `${prefix}${v}`) })),
    },
  };
}

/** Remove empty values so the YAML stays clean. */
function clean<T extends Record<string, any>>(obj: T): T {
  const out: Record<string, any> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null || v === "") continue;
    out[k] = v;
  }
  return out as T;
}

interface DragState {
  from: number;
  to: number;
  startY: number;
  dy: number;
  rects: DOMRect[];
}

export class BestNumberCardEditor extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
    _expanded: { state: true },
    _drag: { state: true },
    _picker: { state: true },
  };

  hass?: HomeAssistant;
  private _config?: CardConfig;
  private _expanded = -1;
  private _drag?: DragState;
  /** key of the color field whose palette is open */
  private _picker: string | null = null;
  private _resolve = (c: string) => parseColor(c, this);

  setConfig(config: CardConfig): void {
    const entities = (config.entities ?? []).map((e: any) => (typeof e === "string" ? { entity: e } : e));
    this._config = { ...config, entities };
  }

  connectedCallback(): void {
    super.connectedCallback();
    // make sure HA's form elements are loaded (they are lazy-loaded by HA)
    const load = (tag: string) => (customElements.get(tag) as any)?.getConfigElement?.();
    if (!customElements.get("ha-form")) load("hui-button-card");
    if (!customElements.get("ha-entity-picker")) load("hui-entities-card");
  }

  private _l = (key: string) => localize(this.hass, key);

  private _computeLabel = (s: { name: string }) => this._l(`field.${s.name}`);

  private _emit(config: CardConfig): void {
    this._config = config;
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config }, bubbles: true, composed: true }));
  }

  private get _hours(): number {
    return Number(this._config?.hours_to_show ?? 24);
  }

  private get _usesStatistics(): boolean {
    return this._hours > Number(this._config?.statistics_threshold ?? 6);
  }

  // ------------------------------------------------------------- card options

  private _defaults(): Record<string, unknown> {
    const dark = !!this.hass?.themes?.darkMode;
    return {
      graph: "line",
      detail: 1,
      hours_to_show: 24,
      smoothing: true,
      tooltip: true,
      compact: false,
      remember_compact: true,
      statistics_threshold: 6,
      statistics_period: "auto",
      end_labels: "none",
      legend_icon: "dot",
      fill_gradient: "value",
      y_axis: "hover",
      x_axis: "hover",
      band: false,
      peak_overflow: false,
      peak_percentile: 95,
      zoom: false,
      zoom_hours: 168,
      show_thresholds: false,
      show_extrema: false,
      legend_toggle: true,
      compact_icon: false,
      compact_names: false,
      compact_graph: false,
      compact_animation: true,
      day_night: false,
      stars: true,
      sun_times: true,
      sky_top: true,
      stars_style: "glow",
      // show the real defaults on the sliders (they depend on the theme, like in the card)
      night_opacity: dark ? 55 : 13,
      twilight_opacity: dark ? 30 : 20,
      day_opacity: dark ? 8 : 6,
      stars_brightness: 80,
      stars_twinkle: 50,
      stars_density: 100,
      peak_margin: 12,
      value_display: this._config!.entities.length === 1 ? "primary" : "all",
    };
  }

  /**
   * Card options, split into sections. Each section is its own ha-form inside an expansion
   * panel, so custom fields (colours, event list …) can sit in the section they belong to.
   * The schemas only contain fields that matter for the current configuration.
   */
  private _sections() {
    const h = this.hass;
    const c = this._config!;
    const data = this._cardData();
    const hasGraph = data.graph !== "none";
    const hasScale = c.entities.some((e) => e.color_scale?.length);
    const multi = c.entities.length > 1;
    const compactOnTap = c.tap_action?.action === "toggle-compact";
    const grid = (schema: any[]) => ({ type: "grid", name: "", schema });
    const px = (min: number, max: number) => ({ number: { mode: "box", min, max, step: 1, unit_of_measurement: "px" } });
    const pct = (min: number, max: number, step = 1) => ({ number: { mode: "slider", min, max, step, unit_of_measurement: "%" } });

    return {
      general: [
        grid([
          { name: "name", selector: { text: {} } },
          { name: "icon", selector: { icon: {} } },
        ]),
        { name: "value_display", selector: select(h, ["all", "primary", "none"]) },
        ...(data.value_display === "all" || multi ? [{ name: "legend_icon", selector: select(h, ["dot", "icon", "none"]) }] : []),
        grid([
          { name: "font_size", selector: px(8, 96) },
          { name: "unavailable_text", selector: { text: {} } },
        ]),
        ...(hasGraph ? [{ name: "show_extrema", selector: { boolean: {} } }] : []),
      ],
      graph: [
        grid([
          { name: "graph", selector: select(h, ["line", "none"]) },
          ...(hasGraph ? [{ name: "hours_to_show", selector: { number: { mode: "box", min: 0.1, step: "any", unit_of_measurement: "h" } } }] : []),
        ]),
        ...(hasGraph
          ? [
              { name: "detail", selector: select(h, ["1", "2"], "opt.detail_") },
              grid([
                { name: "y_axis", selector: select(h, ["hover", "always", "none"]) },
                { name: "x_axis", selector: select(h, ["hover", "always", "none"]) },
              ]),
              { name: "end_labels", selector: select(h, ["none", "value", "icon", "icon_value"]) },
              { name: "zoom", selector: { boolean: {} } },
              ...(c.zoom
                ? [{ name: "zoom_hours", selector: { number: { mode: "box", min: 1, max: 2160, step: 1, unit_of_measurement: "h" } } }]
                : []),
              grid([
                { name: "smoothing", selector: { boolean: {} } },
                { name: "band", selector: { boolean: {} } },
                { name: "tooltip", selector: { boolean: {} } },
                ...(multi ? [{ name: "legend_toggle", selector: { boolean: {} } }] : []),
              ]),
              ...(hasScale
                ? [
                    { name: "fill_gradient", selector: select(h, ["value", "time"], "opt.fill_") },
                    { name: "show_thresholds", selector: { boolean: {} } },
                  ]
                : []),
              {
                type: "expandable",
                flatten: true,
                title: this._l("editor.section.scale"),
                expanded: !!c.peak_overflow || isSet(c.limits?.min) || isSet(c.limits?.max) || isSet(c.height),
                schema: [
                  { name: "peak_overflow", selector: { boolean: {} } },
                  ...(c.peak_overflow
                    ? [
                        { name: "peak_percentile", selector: pct(80, 100) },
                        { name: "peak_margin", selector: px(0, 200) },
                      ]
                    : []),
                  grid([
                    { name: "limits_min", selector: num },
                    { name: "limits_max", selector: num },
                  ]),
                  { name: "height", selector: { number: { mode: "box", min: 20, step: 1, unit_of_measurement: "px" } } },
                ],
              },
            ]
          : []),
      ],
      daynight: [
        { name: "day_night", selector: { boolean: {} } },
        ...(c.day_night
          ? [
              grid([
                { name: "stars", selector: { boolean: {} } },
                { name: "sun_times", selector: { boolean: {} } },
              ]),
              { name: "sky_top", selector: { boolean: {} } },
              ...(c.stars !== false ? [{ name: "stars_style", selector: select(h, ["dot", "glow", "sparkle"], "opt.stars_") }] : []),
              { name: "night_opacity", selector: pct(5, 90) },
              { name: "twilight_opacity", selector: pct(0, 80) },
              ...(c.day_color ? [{ name: "day_opacity", selector: pct(0, 50) }] : []),
              ...(c.stars !== false
                ? [
                    { name: "stars_brightness", selector: pct(10, 100) },
                    { name: "stars_twinkle", selector: pct(0, 100) },
                    { name: "stars_density", selector: pct(10, 300, 5) },
                  ]
                : []),
            ]
          : []),
      ],
      compact: [
        { name: "compact", selector: { boolean: {} } },
        { name: "compact_on_tap", selector: { boolean: {} } },
        ...(c.compact || compactOnTap
          ? [
              ...(compactOnTap ? [{ name: "compact_animation", selector: { boolean: {} } }] : []),
              { name: "remember_compact", selector: { boolean: {} } },
              grid([
                { name: "compact_icon", selector: { boolean: {} } },
                { name: "compact_names", selector: { boolean: {} } },
              ]),
              ...(hasGraph ? [{ name: "compact_graph", selector: { boolean: {} } }] : []),
              grid([
                { name: "compact_font_size", selector: px(8, 72) },
                { name: "compact_name_size", selector: px(8, 72) },
              ]),
            ]
          : []),
      ],
      interactions: [
        ...(compactOnTap ? [] : [{ name: "tap_action", selector: { ui_action: {} } }]),
        { name: "hold_action", selector: { ui_action: {} } },
        { name: "double_tap_action", selector: { ui_action: {} } },
      ],
      advanced: [
        ...(hasGraph
          ? [
              { name: "statistics_threshold", selector: { number: { mode: "box", min: 0, step: "any", unit_of_measurement: "h" } } },
              ...(this._usesStatistics ? [{ name: "statistics_period", selector: select(h, ["auto", "5minute", "hour", "day"]) }] : []),
            ]
          : []),
        { name: "theme", selector: { theme: {} } },
      ],
    };
  }

  /** Helper text below a field (only where the label alone does not explain it). */
  private _computeHelper = (s: { name: string }) => {
    const key = `helper.${s.name}`;
    const text = this._l(key);
    return text === key ? undefined : text;
  };

  /** One section of card options: expansion panel with a form and optional custom content. */
  private _section(
    icon: string,
    title: string,
    schema: any[],
    extra: TemplateResult | typeof nothing = nothing,
    expanded = false,
  ): TemplateResult {
    return html`<ha-expansion-panel outlined .header=${title} .expanded=${expanded} class="section">
      <ha-icon slot="leading-icon" .icon=${icon}></ha-icon>
      <div class="section-body">
        ${schema.length
          ? html`<ha-form
              .hass=${this.hass}
              .data=${this._cardData()}
              .schema=${schema}
              .computeLabel=${this._computeLabel}
              .computeHelper=${this._computeHelper}
              @value-changed=${this._cardChanged}
            ></ha-form>`
          : nothing}
        ${extra}
      </div>
    </ha-expansion-panel>`;
  }

  private _cardData(): Record<string, any> {
    const c = this._config!;
    return {
      ...this._defaults(),
      ...c,
      detail: String(c.detail ?? 1),
      limits_min: c.limits?.min,
      limits_max: c.limits?.max,
      compact_on_tap: c.tap_action?.action === "toggle-compact",
    };
  }

  private _cardChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    const { limits_min, limits_max, compact_on_tap, entities: _e, ...rest } = ev.detail.value;
    const config: any = { ...rest, entities: this._config!.entities };
    const limits = clean({ min: limits_min, max: limits_max });
    if (Object.keys(limits).length) config.limits = limits;
    else delete config.limits;
    if (compact_on_tap) config.tap_action = { action: "toggle-compact" };
    else if (config.tap_action?.action === "toggle-compact") delete config.tap_action;
    if (config.detail !== undefined) config.detail = Number(config.detail);
    // keep the YAML short: drop untouched default values
    for (const [k, v] of Object.entries(this._defaults())) {
      if (config[k] === v && !(k in this._config!)) delete config[k];
    }
    this._emit(clean(config));
  }

  private _cardWarnings(): string[] {
    const c = this._config!;
    const w: string[] = [];
    if (isSet(c.hours_to_show) && !(Number(c.hours_to_show) > 0)) w.push(this._l("editor.warn_hours"));
    if (isSet(c.limits?.min) && isSet(c.limits?.max) && Number(c.limits!.min) >= Number(c.limits!.max)) {
      w.push(this._l("editor.warn_min_max"));
    }
    return w;
  }

  // ------------------------------------------------------------- entities

  private _entitySchema(e: EntityConfig) {
    const h = this.hass;
    const grid = (schema: any[]) => ({ type: "grid", name: "", schema });
    const hasScale = !!e.color_scale?.length;
    const cardGraph = this._config!.graph !== "none";
    const graphOn = cardGraph && e.show_graph !== false;
    const tri = select(h, ["inherit", "on", "off"], "opt.tri_");
    return [
      { name: "entity", selector: { entity: {} } },
      grid([
        { name: "name", selector: { text: {} } },
        { name: "icon", selector: { icon: {} } },
      ]),
      {
        type: "expandable",
        flatten: true,
        title: this._l("editor.section.entity_display"),
        expanded: e.show_value === false || isSet(e.font_size) || isSet(e.unit) || isSet(e.decimals) || !!e.attribute,
        schema: [
          grid([
            { name: "show_value", selector: { boolean: {} } },
            ...(cardGraph ? [{ name: "show_extrema", selector: tri }] : []),
          ]),
          grid([
            { name: "font_size", selector: { number: { mode: "box", min: 8, max: 96, step: 1, unit_of_measurement: "px" } } },
            { name: "decimals", selector: { number: { mode: "box", min: 0, max: 6, step: 1 } } },
            { name: "unit", selector: { text: {} } },
            { name: "unavailable_text", selector: { text: {} } },
          ]),
          { name: "attribute", selector: { attribute: { entity_id: e.entity } } },
        ],
      },
      ...(cardGraph
        ? [
            {
              type: "expandable",
              flatten: true,
              title: this._l("editor.section.entity_graph"),
              expanded: e.show_graph === false || !!e.raw_history,
              schema: [
                { name: "show_graph", selector: { boolean: {} } },
                ...(graphOn
                  ? [
                      ...(!e.attribute ? [{ name: "raw_history", selector: { boolean: {} } }] : []),
                      grid([
                        { name: "band", selector: tri },
                        { name: "peak_overflow", selector: tri },
                        { name: "line_width", selector: { number: { mode: "box", min: 0.5, max: 12, step: 0.5, unit_of_measurement: "px" } } },
                        { name: "fill", selector: { boolean: {} } },
                      ]),
                      ...(hasScale && e.fill !== false
                        ? [{ name: "fill_gradient", selector: select(h, ["value", "time"], "opt.fill_") }]
                        : []),
                      { name: "scale", selector: { text: {} } },
                      grid([
                        { name: "min", selector: num },
                        { name: "max", selector: num },
                      ]),
                    ]
                  : []),
              ],
            },
          ]
        : []),
    ];
  }

  /** visibility and alert rules – below the colours in the entity panel */
  private _entityRulesSchema(e: EntityConfig) {
    const grid = (schema: any[]) => ({ type: "grid", name: "", schema });
    return [
      {
        type: "expandable",
        flatten: true,
        title: this._l("editor.visibility"),
        expanded: isSet(e.hide_below) || isSet(e.hide_above) || !!e.hide_unavailable,
        schema: [
          grid([
            { name: "hide_below", selector: num },
            { name: "hide_above", selector: num },
          ]),
          { name: "hide_unavailable", selector: { boolean: {} } },
        ],
      },
      {
        type: "expandable",
        flatten: true,
        title: this._l("editor.section.alert"),
        expanded: isSet(e.alert_above) || isSet(e.alert_below),
        schema: [
          grid([
            { name: "alert_above", selector: num },
            { name: "alert_below", selector: num },
          ]),
        ],
      },
    ];
  }

  private _entityWarnings(e: EntityConfig): string[] {
    const w: string[] = [];
    if (isSet(e.min) && isSet(e.max) && Number(e.min) >= Number(e.max)) w.push(this._l("editor.warn_min_max"));
    if (isSet(e.hide_below) && isSet(e.hide_above) && Number(e.hide_below) >= Number(e.hide_above)) {
      w.push(this._l("editor.warn_hide_range"));
    }
    const st = this.hass?.states[e.entity];
    const graphed = this._usesStatistics && this._config!.graph !== "none" && e.show_graph !== false;
    if (st && graphed && e.attribute) w.push(this._l("editor.warn_attribute"));
    else if (st && graphed && e.entity.startsWith("sensor.") && !st.attributes.state_class) {
      w.push(this._l("editor.warn_no_statistics"));
    }
    return w;
  }

  private _updateEntity(i: number, patch: EntityConfig | null): void {
    const entities = [...this._config!.entities];
    if (patch === null) entities.splice(i, 1);
    else entities[i] = clean(patch);
    if (this._expanded >= entities.length) this._expanded = -1;
    this._emit({ ...this._config!, entities });
  }

  private _move(from: number, to: number): void {
    const entities = [...this._config!.entities];
    if (to < 0 || to >= entities.length || from === to) return;
    const open = this._expanded >= 0 ? entities[this._expanded] : undefined;
    const [item] = entities.splice(from, 1);
    entities.splice(to, 0, item);
    // keep the open panel attached to its entity
    this._expanded = open ? entities.indexOf(open) : -1;
    this._emit({ ...this._config!, entities });
  }

  private _addEntity(ev: CustomEvent): void {
    ev.stopPropagation();
    const entity = ev.detail.value?.entity;
    if (!entity) return;
    const entities = [...this._config!.entities, { entity }];
    this._expanded = entities.length - 1;
    this._emit({ ...this._config!, entities });
    (ev.target as any).data = {};
  }

  // ------------------------------------------------------------- drag & drop (pointer based: mouse + touch)

  private _dragStart(ev: PointerEvent, i: number): void {
    if (ev.button !== 0) return;
    ev.preventDefault();
    (ev.currentTarget as HTMLElement).setPointerCapture?.(ev.pointerId);
    const rows = [...this.renderRoot.querySelectorAll(".entity-row")] as HTMLElement[];
    this._drag = { from: i, to: i, startY: ev.clientY, dy: 0, rects: rows.map((r) => r.getBoundingClientRect()) };
  }

  private _dragMove(ev: PointerEvent): void {
    const d = this._drag;
    if (!d) return;
    const dy = ev.clientY - d.startY;
    const r = d.rects[d.from];
    const center = r.top + r.height / 2 + dy;
    const to = d.rects.filter((x, k) => k !== d.from && x.top + x.height / 2 < center).length;
    this._drag = { ...d, dy, to };
  }

  private _dragEnd(): void {
    const d = this._drag;
    this._drag = undefined;
    if (d && d.from !== d.to) this._move(d.from, d.to);
  }

  private _dragKey(ev: KeyboardEvent, i: number): void {
    let to: number;
    if (ev.key === "ArrowUp") to = i - 1;
    else if (ev.key === "ArrowDown") to = i + 1;
    else return;
    ev.preventDefault();
    this._move(i, to);
    this.updateComplete.then(() => {
      const handles = this.renderRoot.querySelectorAll<HTMLElement>(".handle");
      handles[Math.max(0, Math.min(handles.length - 1, to))]?.focus();
    });
  }

  private _rowStyle(i: number): string {
    const d = this._drag;
    if (!d) return "";
    if (i === d.from) return `transform:translateY(${d.dy}px);z-index:2;position:relative;transition:none`;
    const h = d.rects[d.from].height + 8;
    if (d.from < d.to && i > d.from && i <= d.to) return `transform:translateY(${-h}px)`;
    if (d.to < d.from && i >= d.to && i < d.from) return `transform:translateY(${h}px)`;
    return "";
  }

  // ------------------------------------------------------------- color scale

  private _setScale(i: number, stops: ColorStop[], mode?: ColorScaleMode | null): void {
    const e: EntityConfig = { ...this._config!.entities[i] };
    if (stops.length) e.color_scale = stops;
    else delete e.color_scale;
    if (mode === null || mode === "gradient") delete e.color_scale_mode;
    else if (mode) e.color_scale_mode = mode;
    this._updateEntity(i, e);
  }

  private _applyPreset(i: number, id: string): void {
    const p = PRESETS.find((x) => x.id === id);
    if (p) this._setScale(i, p.stops.map((s) => ({ ...s })), p.mode ?? null);
  }

  /** Horizontal preview of the scale incl. jumps and value ticks. */
  private _renderPreview(stops: ColorStop[], mode: ColorScaleMode, small = false): TemplateResult | typeof nothing {
    const sorted = sortStops(stops);
    if (!sorted.length) return nothing;
    const lo0 = sorted[0].value;
    const hi0 = sorted[sorted.length - 1].value;
    const pad = (hi0 - lo0) * 0.12 || 5;
    const lo = lo0 - pad;
    const hi = hi0 + pad;
    const g = gradientStops(sorted, mode, lo, hi, this._resolve);
    const bg = `linear-gradient(to right, ${g.map((s) => `${s.color} ${(s.offset * 100).toFixed(2)}%`).join(", ")})`;
    if (small) return html`<span class="mini-scale" style="background:${bg}"></span>`;
    const ticks = [...new Set(sorted.map((s) => s.value))];
    return html`<div class="preview">
      <div class="preview-bar" style="background:${bg}"></div>
      <div class="preview-ticks">
        ${ticks.map(
          (v) => html`<span style="left:${(((v - lo) / (hi - lo)) * 100).toFixed(2)}%">${formatNumber(this.hass, v)}</span>`,
        )}
      </div>
    </div>`;
  }

  /**
   * Color field: swatch + text input. The swatch opens a palette with the Home Assistant
   * theme colors (stored as CSS variables, so they follow the theme) and a free color picker.
   */
  private _renderColorField(
    key: string,
    value: string | undefined,
    onChange: (c: string | undefined) => void,
    label: string,
    placeholder = "",
  ): TemplateResult {
    const open = this._picker === key;
    const pick = (c: string | undefined) => {
      this._picker = null;
      onChange(c);
    };
    return html`<div class="cf ${open ? "open" : ""}">
      <div class="cf-row">
        <button
          class="cf-swatch"
          type="button"
          style="background:${value || placeholder || "transparent"}"
          aria-label=${label}
          aria-expanded=${open ? "true" : "false"}
          title=${label}
          @click=${() => (this._picker = open ? null : key)}
        ></button>
        <input
          class="text"
          type="text"
          aria-label=${label}
          placeholder=${placeholder}
          .value=${value ?? ""}
          @change=${(ev: Event) => pick((ev.target as HTMLInputElement).value.trim() || undefined)}
        />
      </div>
      ${open
        ? html`<div class="cf-pop" @keydown=${(ev: KeyboardEvent) => ev.key === "Escape" && (this._picker = null)}>
            <div class="cf-label">${this._l("editor.theme_colors")}</div>
            <div class="cf-grid">
              ${THEME_COLORS.map(([name, hex]) => {
                const v = `var(--${name}-color, ${hex})`;
                return html`<button
                  type="button"
                  class="cf-chip ${value === v ? "sel" : ""}"
                  style="background:${v}"
                  title=${name}
                  aria-label=${name}
                  @click=${() => pick(v)}
                ></button>`;
              })}
            </div>
            <label class="cf-custom">
              <input
                type="color"
                .value=${toHex(value || placeholder || "#ff0000", this)}
                @change=${(ev: Event) => pick((ev.target as HTMLInputElement).value)}
              />
              ${this._l("editor.custom_color")}
            </label>
          </div>`
        : nothing}
    </div>`;
  }

  private _renderStops(i: number, e: EntityConfig): TemplateResult {
    const stops = e.color_scale ?? [];
    const mode = e.color_scale_mode ?? "gradient";
    const rows = stopsToRows(stops);
    const commit = (next: StopRow[]) => this._setScale(i, rowsToStops(next));
    const update = (k: number, patch: Partial<StopRow>) => commit(rows.map((r, idx) => (idx === k ? { ...r, ...patch } : r)));
    const toggleJump = (k: number) => {
      const r = rows[k];
      if (r.below !== undefined) {
        const { below: _b, ...rest } = r;
        commit(rows.map((x, idx) => (idx === k ? rest : x)));
      } else {
        // start with the color the scale shows just below the value today
        const eps = Math.max(1, Math.abs(r.value)) * 1e-9;
        const below = rgbaToCss(colorAt(sortStops(stops), "gradient", r.value - eps, this._resolve));
        update(k, { below: toHex(below, this) });
      }
    };

    return html`<div class="stops">
      <div class="stops-head">
        <span class="stops-title">${this._l("editor.color_scale")}</span>
        ${stops.length
          ? html`<select
              class="native"
              aria-label=${this._l("field.color_scale_mode")}
              @change=${(ev: Event) => this._setScale(i, stops, (ev.target as HTMLSelectElement).value as ColorScaleMode)}
            >
              <option value="gradient" ?selected=${mode === "gradient"}>${this._l("opt.gradient")}</option>
              <option value="step" ?selected=${mode === "step"}>${this._l("opt.step")}</option>
            </select>`
          : nothing}
        <select
          class="native"
          aria-label=${this._l("editor.preset")}
          @change=${(ev: Event) => {
            const sel = ev.target as HTMLSelectElement;
            this._applyPreset(i, sel.value);
            sel.value = "";
          }}
        >
          <option value="" selected>${this._l("editor.preset")}</option>
          ${PRESETS.map((p) => html`<option value=${p.id}>${this._l(`preset.${p.id}`)}</option>`)}
        </select>
      </div>
      ${this._renderPreview(stops, mode)}
      ${rows.map(
        (r, k) => html`<div class="stop">
          <input
            class="num"
            type="number"
            step="any"
            aria-label=${this._l("field.value")}
            .value=${String(r.value)}
            @change=${(ev: Event) => {
              const v = parseFloat((ev.target as HTMLInputElement).value);
              if (Number.isFinite(v)) update(k, { value: v });
            }}
          />
          <div class="stop-colors">
            ${r.below !== undefined
              ? html`${this._renderColorField(`s${i}-${k}-b`, r.below, (c) => update(k, { below: c ?? r.below }), this._l("editor.below"))}
                  <span class="arrow">→</span>`
              : nothing}
            ${this._renderColorField(`s${i}-${k}`, r.color, (c) => update(k, { color: c ?? r.color }), this._l("editor.above"))}
          </div>
          ${mode === "gradient"
            ? html`<ha-icon-button
                class="jump ${r.below !== undefined ? "on" : ""}"
                .label=${`${this._l("editor.jump")} – ${this._l("editor.jump_help")}`}
                title=${`${this._l("editor.jump")} – ${this._l("editor.jump_help")}`}
                .path=${mdiJump}
                @click=${() => toggleJump(k)}
              ></ha-icon-button>`
            : nothing}
          <ha-icon-button
            .label=${this._l("editor.remove")}
            .path=${mdiDelete}
            @click=${() => commit(rows.filter((_, idx) => idx !== k))}
          ></ha-icon-button>
        </div>`,
      )}
      <button
        class="text-button"
        @click=${() => {
          const last = rows[rows.length - 1];
          commit([...rows, { value: last ? last.value + 10 : 0, color: last?.color ?? "#ff0000" }]);
        }}
      >
        + ${this._l("editor.add_stop")}
      </button>
      ${stops.length ? html`<div class="help">${this._l(mode === "step" ? "editor.color_scale_help_step" : "editor.color_scale_help")}</div>` : nothing}
    </div>`;
  }

  // ------------------------------------------------------------- entity panel

  private _rawValue(e: EntityConfig): string | undefined {
    const st = this.hass?.states[e.entity];
    if (!st) return undefined;
    if (!e.attribute) return st.state;
    const a = st.attributes[e.attribute];
    return a === undefined || a === null ? "" : String(a);
  }

  private _isHiddenNow(e: EntityConfig): boolean {
    const raw = this._rawValue(e);
    const v = raw ? Number(raw) : NaN;
    const numeric = Number.isFinite(v);
    if (e.hide_unavailable && !numeric) return true;
    if (numeric && isSet(e.hide_below) && v < Number(e.hide_below)) return true;
    if (numeric && isSet(e.hide_above) && v > Number(e.hide_above)) return true;
    return false;
  }

  private _renderEntity(e: EntityConfig, i: number): TemplateResult {
    const st = this.hass?.states[e.entity];
    const title = (e.name || st?.attributes.friendly_name || e.entity) + (e.attribute && !e.name ? ` · ${e.attribute}` : "");
    const unit = e.unit ?? (e.attribute ? "" : (st?.attributes.unit_of_measurement ?? ""));
    const raw = this._rawValue(e) ?? "";
    const numeric = raw !== "" && Number.isFinite(Number(raw));
    const value = numeric ? formatNumber(this.hass, Number(raw)) : raw;
    const warnings = this._entityWarnings(e);
    const hidden = this._isHiddenNow(e);
    return html`<div class="entity-row ${this._drag?.from === i ? "dragging" : ""}" style=${this._rowStyle(i)}>
      <div
        class="handle"
        tabindex="0"
        role="button"
        aria-label=${this._l("editor.drag")}
        title=${this._l("editor.drag")}
        @pointerdown=${(ev: PointerEvent) => this._dragStart(ev, i)}
        @pointermove=${(ev: PointerEvent) => this._dragMove(ev)}
        @pointerup=${() => this._dragEnd()}
        @pointercancel=${() => this._dragEnd()}
        @keydown=${(ev: KeyboardEvent) => this._dragKey(ev, i)}
      >
        <svg viewBox="0 0 24 24"><path d=${mdiDrag}></path></svg>
      </div>
      <ha-expansion-panel
        outlined
        .expanded=${this._expanded === i}
        @expanded-changed=${(ev: CustomEvent) => {
          if (ev.detail.expanded) this._expanded = i;
          else if (this._expanded === i) this._expanded = -1;
        }}
      >
        <div slot="header" class="panel-header">
          <ha-state-icon .hass=${this.hass} .stateObj=${st} .icon=${e.icon}></ha-state-icon>
          <span class="panel-title">${title}</span>
          ${hidden ? html`<span class="badge">${this._l("editor.hidden_now")}</span>` : nothing}
          ${warnings.length ? html`<span class="badge warn-badge">⚠</span>` : nothing}
          <span class="panel-value">${value} ${unit}</span>
          ${e.color_scale?.length
            ? this._renderPreview(e.color_scale, e.color_scale_mode ?? "gradient", true)
            : html`<span class="swatch" style="background:${e.color ?? defaultColor(i)}"></span>`}
        </div>
        <div class="panel-body">
          ${warnings.map((w) => html`<div class="warning">⚠ ${w}</div>`)}
          ${this._entityForm(e, i, this._entitySchema(e))}
          <div class="sub-title">${this._l("editor.section.colors")}</div>
          ${e.color_scale?.length
            ? nothing
            : html`<div class="field-row">
                <span class="field-label">${this._l("editor.line_color")}</span>
                ${this._renderColorField(
                  `l${i}`,
                  e.color,
                  (c) => this._updateEntity(i, { ...e, color: c }),
                  this._l("editor.line_color"),
                  defaultColor(i),
                )}
              </div>`}
          ${this._renderStops(i, e)}
          ${this._entityForm(e, i, this._entityRulesSchema(e))}
          <div class="panel-actions">
            <button class="text-button danger" @click=${() => this._updateEntity(i, null)}>${this._l("editor.remove")}</button>
          </div>
        </div>
      </ha-expansion-panel>
    </div>`;
  }

  private _entityForm(e: EntityConfig, i: number, schema: any[]): TemplateResult {
    return html`<ha-form
            .hass=${this.hass}
            .data=${{ show_value: true, show_graph: true, ...e, band: toTri(e.band), show_extrema: toTri(e.show_extrema), peak_overflow: toTri(e.peak_overflow) }}
            .schema=${schema}
            .computeLabel=${this._computeLabel}
            .computeHelper=${this._computeHelper}
            @value-changed=${(ev: CustomEvent) => {
              ev.stopPropagation();
              const v = { ...ev.detail.value, band: fromTri(ev.detail.value.band), show_extrema: fromTri(ev.detail.value.show_extrema), peak_overflow: fromTri(ev.detail.value.peak_overflow) };
              if (v.show_value === true && e.show_value === undefined) delete v.show_value;
              if (v.show_graph === true && e.show_graph === undefined) delete v.show_graph;
              v.color_scale = e.color_scale;
              v.color_scale_mode = e.color_scale_mode;
              this._updateEntity(i, v);
            }}
          ></ha-form>`;
  }

  private _renderSkyColors(): TemplateResult {
    const c = this._config!;
    const field = (key: "night_color" | "dawn_color" | "dusk_color" | "day_color" | "stars_color", placeholder: string) => html`<div class="field-row">
      <span class="field-label">${this._l(`field.${key}`)}</span>
      ${this._renderColorField(
        key,
        c[key],
        (col) => this._emit(clean({ ...c, [key]: col }) as CardConfig),
        this._l(`field.${key}`),
        placeholder,
      )}
    </div>`;
    return html`<div class="sub-title">${this._l("editor.section.sky")}</div>
      ${field("night_color", this.hass?.themes?.darkMode ? "#03061a" : "#2b3d80")} ${field("dawn_color", "#ff8a3d")} ${field("dusk_color", "#d9467a")}
      ${field("day_color", "")}
      ${c.stars !== false ? field("stars_color", this.hass?.themes?.darkMode ? "#ffffff" : "#26367a") : nothing}`;
  }

  private _renderAlertSection(): TemplateResult {
    const c = this._config!;
    const used = c.entities.some((e) => isSet(e.alert_above) || isSet(e.alert_below));
    const set = (patch: Partial<CardConfig>) => this._emit(clean({ ...c, ...patch }) as CardConfig);
    return html`<div class="help">${this._l("editor.alert_hint")}</div>
      ${used
        ? html`<ha-form
              .hass=${this.hass}
              .data=${{ alert_style: c.alert_style ?? "glow" }}
              .schema=${[{ name: "alert_style", selector: select(this.hass, ["glow", "blink", "static"]) }]}
              .computeLabel=${this._computeLabel}
              @value-changed=${(ev: CustomEvent) => {
                ev.stopPropagation();
                const v = ev.detail.value.alert_style;
                set({ alert_style: v === "glow" ? undefined : v });
              }}
            ></ha-form>
            <div class="field-row">
              <span class="field-label">${this._l("field.alert_color")}</span>
              ${this._renderColorField("alert", c.alert_color, (col) => set({ alert_color: col }), this._l("field.alert_color"), "var(--error-color, #db4437)")}
            </div>`
        : nothing}`;
  }

  protected render(): TemplateResult | typeof nothing {
    if (!this.hass || !this._config) return nothing;
    const c = this._config;
    const warnings = this._cardWarnings();
    const sec = this._sections();
    const hasGraph = c.graph !== "none";
    const l = this._l;
    return html`
      ${warnings.map((w) => html`<div class="warning">⚠ ${w}</div>`)}
      <div class="section-title">${l("editor.section.entities")}</div>
      <div class="help">${l("editor.entities_help")}</div>
      <div class="entities ${this._drag ? "is-dragging" : ""}">
        ${c.entities.map((e, i) => this._renderEntity(e, i))}
      </div>
      <div class="add">
        <svg viewBox="0 0 24 24"><path d=${mdiPlus}></path></svg>
        <ha-form
          .hass=${this.hass}
          .data=${{}}
          .schema=${[{ name: "entity", selector: { entity: {} } }]}
          .computeLabel=${() => l("editor.add_entity")}
          @value-changed=${this._addEntity}
        ></ha-form>
      </div>
      <div class="sections">
        ${this._section("mdi:card-text-outline", l("editor.section.general"), sec.general, this._renderTextColor(), true)}
        ${this._section("mdi:chart-line", l("editor.section.graph"), sec.graph)}
        ${hasGraph ? this._section("mdi:map-marker-outline", l("editor.section.events"), [], this._renderEvents()) : nothing}
        ${hasGraph
          ? this._section("mdi:weather-night", l("editor.section.daynight"), sec.daynight, c.day_night ? this._renderSkyColors() : nothing)
          : nothing}
        ${this._section("mdi:arrow-collapse-vertical", l("editor.section.compact"), sec.compact)}
        ${this._section("mdi:alert-circle-outline", l("editor.section.alert"), [], this._renderAlertSection())}
        ${this._section("mdi:gesture-tap", l("editor.section.interactions"), sec.interactions)}
        ${this._section("mdi:cog-outline", l("editor.section.advanced"), sec.advanced)}
      </div>
    `;
  }

  private _renderTextColor(): TemplateResult {
    return html`<div class="field-row">
      <span class="field-label">${this._l("field.text_color")}</span>
      ${this._renderColorField(
        "text-color",
        this._config!.text_color ?? this._config!.compact_text_color,
        (col) => {
          const { compact_text_color: _old, ...rest } = this._config!;
          this._emit(clean({ ...rest, text_color: col }) as CardConfig);
        },
        this._l("field.text_color"),
        "var(--secondary-text-color)",
      )}
    </div>`;
  }

  // ------------------------------------------------------------- event pins

  private _setEvents(events: EventConfig[]): void {
    const c: CardConfig = { ...this._config!, events };
    if (!events.length) delete c.events;
    this._emit(c);
  }

  private _renderEvents(): TemplateResult {
    const events = this._config!.events ?? [];
    const update = (i: number, patch: Partial<EventConfig> | null) => {
      const next = [...events];
      if (patch === null) next.splice(i, 1);
      else next[i] = clean({ ...next[i], ...patch }) as EventConfig;
      this._setEvents(next);
    };
    return html`<div class="help">${this._l("editor.events_help")}</div>
      ${events.length
        ? html`<ha-form
            .hass=${this.hass}
            .data=${{ event_pins: this._config!.event_pins !== false, event_lines: this._config!.event_lines !== false }}
            .schema=${[
              {
                type: "grid",
                name: "",
                schema: [
                  { name: "event_pins", selector: { boolean: {} } },
                  { name: "event_lines", selector: { boolean: {} } },
                ],
              },
            ]}
            .computeLabel=${this._computeLabel}
            .computeHelper=${this._computeHelper}
            @value-changed=${(e: CustomEvent) => {
              e.stopPropagation();
              const c: any = { ...this._config!, event_pins: e.detail.value.event_pins, event_lines: e.detail.value.event_lines };
              if (c.event_pins !== false) delete c.event_pins;
              if (c.event_lines !== false) delete c.event_lines;
              this._emit(c);
            }}
          ></ha-form>`
        : nothing}
      <div class="events">
        ${events.map(
          (ev, i) => html`<div class="event-row">
            <ha-form
              .hass=${this.hass}
              .data=${{ ...ev, state: Array.isArray(ev.state) ? ev.state.join(", ") : ev.state, event_line: toTri(ev.line), event_pin: toTri(ev.pin) }}
              .schema=${[
                { name: "entity", selector: { entity: {} } },
                {
                  type: "grid",
                  name: "",
                  schema: [
                    { name: "event_state", selector: { text: {} } },
                    { name: "name", selector: { text: {} } },
                    { name: "icon", selector: { icon: {} } },
                    { name: "event_pin", selector: select(this.hass, ["inherit", "on", "off"], "opt.tri_") },
                    { name: "event_line", selector: select(this.hass, ["inherit", "on", "off"], "opt.tri_") },
                  ],
                },
              ]}
              .computeLabel=${(sch: { name: string }) =>
                sch.name === "event_state"
                  ? this._l("field.event_state")
                  : sch.name === "event_line" || sch.name === "event_pin"
                    ? this._l(`field.${sch.name}`)
                    : this._computeLabel(sch)}
              .computeHelper=${(sch: { name: string }) => this._computeHelper(sch)}
              @value-changed=${(e: CustomEvent) => {
                e.stopPropagation();
                const v = e.detail.value;
                const raw = v.event_state ?? v.state;
                const states = typeof raw === "string" ? raw.split(",").map((x: string) => x.trim()).filter(Boolean) : raw;
                update(i, {
                  entity: v.entity,
                  name: v.name,
                  icon: v.icon,
                  line: fromTri(v.event_line),
                  pin: fromTri(v.event_pin),
                  state: !states || !states.length ? undefined : states.length === 1 ? states[0] : states,
                });
              }}
            ></ha-form>
            <div class="field-row">
              <span class="field-label">${this._l("field.event_color")}</span>
              ${this._renderColorField(`ev${i}`, ev.color, (c) => update(i, { color: c }), this._l("field.event_color"))}
              <ha-icon-button .label=${this._l("editor.remove")} .path=${mdiDelete} @click=${() => update(i, null)}></ha-icon-button>
            </div>
          </div>`,
        )}
      </div>
      <div class="add">
        <svg viewBox="0 0 24 24"><path d=${mdiPlus}></path></svg>
        <ha-form
          .hass=${this.hass}
          .data=${{}}
          .schema=${[{ name: "entity", selector: { entity: {} } }]}
          .computeLabel=${() => this._l("editor.add_event")}
          @value-changed=${(e: CustomEvent) => {
            e.stopPropagation();
            const entity = e.detail.value?.entity;
            if (!entity) return;
            this._setEvents([...events, { entity }]);
            (e.target as any).data = {};
          }}
        ></ha-form>
      </div>`;
  }

  static styles = css`
    :host {
      display: block;
    }
    .sections {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-top: 24px;
    }
    .section ha-icon[slot="leading-icon"] {
      color: var(--secondary-text-color);
    }
    .section-body {
      padding: 0 0 8px;
    }
    .sub-title {
      margin: 16px 0 4px;
      font-weight: 500;
      font-size: 14px;
      color: var(--secondary-text-color);
    }
    .section-title {
      margin: 24px 0 8px;
      font-weight: 500;
      font-size: 16px;
    }
    .entities {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .entity-row {
      display: flex;
      align-items: flex-start;
      gap: 4px;
      transition: transform 0.15s ease;
    }
    .entities.is-dragging .entity-row {
      user-select: none;
    }
    .entity-row.dragging ha-expansion-panel {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      background: var(--card-background-color);
      border-radius: 12px;
    }
    .entity-row ha-expansion-panel {
      flex: 1;
      min-width: 0;
    }
    .handle {
      flex: none;
      width: 32px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: grab;
      touch-action: none;
      color: var(--secondary-text-color);
      border-radius: 8px;
    }
    .handle:active {
      cursor: grabbing;
    }
    .handle:focus-visible {
      outline: 2px solid var(--primary-color);
    }
    .handle svg,
    .add svg {
      width: 22px;
      height: 22px;
      fill: currentColor;
    }
    .events {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .event-row {
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 12px;
      padding: 8px 12px;
    }
    .add {
      display: flex;
      align-items: center;
      gap: 4px;
      margin-top: 12px;
      color: var(--secondary-text-color);
    }
    .add svg {
      width: 32px;
      flex: none;
    }
    .add ha-form {
      flex: 1;
    }
    .panel-header {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
      width: 100%;
      --mdc-icon-size: 20px;
    }
    .panel-header ha-state-icon {
      color: var(--state-icon-color, var(--secondary-text-color));
      flex: none;
    }
    .panel-title {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      min-width: 0;
    }
    .panel-value {
      margin-left: auto;
      color: var(--secondary-text-color);
      white-space: nowrap;
      font-size: 14px;
    }
    .badge {
      flex: none;
      font-size: 11px;
      line-height: 16px;
      padding: 1px 6px;
      border-radius: 8px;
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.06));
      color: var(--secondary-text-color);
      white-space: nowrap;
    }
    .warn-badge {
      color: var(--warning-color, #ff9800);
    }
    .swatch {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      flex: none;
    }
    .mini-scale {
      width: 40px;
      height: 8px;
      border-radius: 4px;
      flex: none;
    }
    .panel-body {
      padding: 0 4px 12px;
    }
    .panel-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 8px;
    }
    .warning {
      margin: 8px 0;
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 13px;
      line-height: 18px;
      color: var(--primary-text-color);
      background: color-mix(in srgb, var(--warning-color, #ff9800) 15%, transparent);
      border-left: 3px solid var(--warning-color, #ff9800);
    }
    .stops {
      margin-top: 16px;
      padding-top: 12px;
      border-top: 1px solid var(--divider-color);
    }
    .stops-head {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
      margin-bottom: 8px;
    }
    .stops-title {
      font-weight: 500;
      margin-right: auto;
    }
    .preview {
      margin: 4px 0 12px;
    }
    .preview-bar {
      height: 14px;
      border-radius: 7px;
    }
    .preview-ticks {
      position: relative;
      height: 16px;
      font-size: 11px;
      color: var(--secondary-text-color);
    }
    .preview-ticks span {
      position: absolute;
      top: 2px;
      transform: translateX(-50%);
      white-space: nowrap;
    }
    .preview-ticks span::before {
      content: "";
      position: absolute;
      left: 50%;
      top: -6px;
      height: 5px;
      border-left: 1px solid var(--secondary-text-color);
    }
    .help {
      color: var(--secondary-text-color);
      font-size: 12px;
      margin-top: 4px;
    }
    .stop {
      display: flex;
      align-items: flex-start;
      gap: 6px;
      margin-bottom: 6px;
      flex-wrap: wrap;
    }
    .stop-colors {
      display: flex;
      align-items: center;
      gap: 4px;
      flex: 1;
      min-width: 160px;
    }
    .arrow {
      color: var(--secondary-text-color);
    }
    input.num,
    input.text,
    select.native {
      height: 36px;
      box-sizing: border-box;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 6px;
      padding: 0 8px;
      background: var(--card-background-color, transparent);
      color: var(--primary-text-color);
      font: inherit;
      font-size: 14px;
    }
    input.num {
      width: 84px;
    }
    .cf {
      display: flex;
      flex-direction: column;
      gap: 6px;
      flex: 1;
      min-width: 0;
    }
    .cf-row {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .cf-row input.text {
      flex: 1;
      min-width: 60px;
      width: 0;
    }
    .cf-swatch {
      flex: none;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 2px solid var(--card-background-color, #fff);
      box-shadow: 0 0 0 1px var(--divider-color, #ccc);
      cursor: pointer;
      padding: 0;
    }
    .cf.open .cf-swatch {
      box-shadow: 0 0 0 2px var(--primary-color);
    }
    .cf-pop {
      padding: 10px;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 10px;
      background: var(--card-background-color, #fff);
    }
    .cf-label {
      font-size: 12px;
      color: var(--secondary-text-color);
      margin-bottom: 6px;
    }
    .cf-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(26px, 1fr));
      gap: 6px;
    }
    .cf-chip {
      aspect-ratio: 1;
      border-radius: 50%;
      border: 2px solid var(--card-background-color, #fff);
      box-shadow: 0 0 0 1px var(--divider-color, #ccc);
      cursor: pointer;
      padding: 0;
    }
    .cf-chip.sel {
      box-shadow: 0 0 0 2px var(--primary-color);
    }
    .cf-custom {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 10px;
      font-size: 14px;
      cursor: pointer;
    }
    .cf-custom input[type="color"] {
      width: 32px;
      height: 32px;
      border: none;
      padding: 0;
      background: none;
      cursor: pointer;
    }
    .field-row {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      margin-top: 8px;
    }
    .field-label {
      flex: none;
      width: 120px;
      line-height: 36px;
      font-size: 14px;
      color: var(--secondary-text-color);
    }
    .color-input {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      flex: 1;
      min-width: 0;
    }
    .color-input input.text {
      flex: 1;
      min-width: 60px;
      width: 0;
    }
    .color-input input[type="color"] {
      width: 32px;
      height: 32px;
      border: none;
      padding: 0;
      background: none;
      cursor: pointer;
      flex: none;
    }
    ha-icon-button.jump {
      color: var(--secondary-text-color);
      opacity: 0.6;
    }
    ha-icon-button.jump.on {
      color: var(--primary-color);
      opacity: 1;
    }
    .text-button {
      background: none;
      border: none;
      color: var(--primary-color);
      font: inherit;
      font-weight: 500;
      cursor: pointer;
      padding: 8px 4px;
    }
    .text-button.danger {
      color: var(--error-color, #db4437);
    }
  `;
}

/** "inherit / on / off" selects for options that can also be set for the whole card */
const toTri = (v: boolean | undefined) => (v === undefined ? "inherit" : v ? "on" : "off");
const fromTri = (v: string | undefined) => (v === "on" ? true : v === "off" ? false : undefined);

/** Best effort conversion for the native color picker. */
function toHex(color: string, el?: Element): string {
  if (/^#[0-9a-f]{6}$/i.test(color)) return color;
  const [r, g, b] = parseColor(color, el);
  const h = (x: number) => Math.round(x).toString(16).padStart(2, "0");
  return `#${h(r)}${h(g)}${h(b)}`;
}

if (!customElements.get("best-number-card-editor")) {
  customElements.define("best-number-card-editor", BestNumberCardEditor);
}
