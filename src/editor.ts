import { LitElement, html, css, nothing, type TemplateResult } from "lit";
import { gradientStops, parseColor, rgbaToCss, colorAt, sortStops } from "./color-scale";
import { localize, formatNumber } from "./localize";
import { PRESETS, defaultColor, rowsToStops, stopsToRows, type StopRow } from "./presets";
import type { CardConfig, ColorScaleMode, ColorStop, EntityConfig, HomeAssistant } from "./types";

const mdiDelete = "M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z";
const mdiDrag =
  "M7,19V17H9V19H7M11,19V17H13V19H11M15,19V17H17V19H15M7,15V13H9V15H7M11,15V13H13V15H11M15,15V13H17V15H15M7,11V9H9V11H7M11,11V9H13V11H11M15,11V9H17V11H15M7,7V5H9V7H7M11,7V5H13V7H11M15,7V5H17V7H15Z";
const mdiJump = "M3,17H9V7H15V17H21V19H13V9H11V19H3V17Z";
const mdiPlus = "M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z";

const num = { number: { mode: "box", step: "any" } };
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
  };

  hass?: HomeAssistant;
  private _config?: CardConfig;
  private _expanded = -1;
  private _drag?: DragState;
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
      show_thresholds: false,
      show_extrema: false,
      legend_toggle: true,
      value_display: this._config!.entities.length === 1 ? "primary" : "all",
    };
  }

  /** The schema only contains fields that matter for the current configuration. */
  private _cardSchema() {
    const h = this.hass;
    const c = this._config!;
    const data = this._cardData();
    const hasGraph = data.graph !== "none";
    const hasScale = c.entities.some((e) => e.color_scale?.length);
    const multi = c.entities.length > 1;
    const compactOnTap = c.tap_action?.action === "toggle-compact";
    const grid = (schema: any[]) => ({ type: "grid", name: "", schema });

    return [
      {
        type: "expandable",
        flatten: true,
        expanded: true,
        title: this._l("editor.section.general"),
        schema: [
          grid([
            { name: "name", selector: { text: {} } },
            { name: "icon", selector: { icon: {} } },
          ]),
          grid([
            { name: "value_display", selector: select(h, ["all", "primary", "none"]) },
            ...(data.value_display === "all" || multi ? [{ name: "legend_icon", selector: select(h, ["dot", "icon", "none"]) }] : []),
          ]),
          ...(hasGraph ? [{ name: "show_extrema", selector: { boolean: {} } }] : []),
          { name: "compact", selector: { boolean: {} } },
        ],
      },
      {
        type: "expandable",
        flatten: true,
        expanded: true,
        title: this._l("editor.section.graph"),
        schema: [
          grid([
            { name: "graph", selector: select(h, ["line", "none"]) },
            ...(hasGraph ? [{ name: "hours_to_show", selector: { number: { mode: "box", min: 0.1, step: "any" } } }] : []),
          ]),
          ...(hasGraph
            ? [
                grid([
                  { name: "detail", selector: select(h, ["1", "2"], "opt.detail_") },
                  { name: "y_axis", selector: select(h, ["hover", "always", "none"]) },
                ]),
                { name: "end_labels", selector: select(h, ["none", "value", "icon", "icon_value"]) },
                ...(hasScale
                  ? [
                      { name: "fill_gradient", selector: select(h, ["value", "time"], "opt.fill_") },
                      { name: "show_thresholds", selector: { boolean: {} } },
                    ]
                  : []),
                grid([
                  { name: "tooltip", selector: { boolean: {} } },
                  ...(multi ? [{ name: "legend_toggle", selector: { boolean: {} } }] : []),
                ]),
              ]
            : []),
        ],
      },
      {
        type: "expandable",
        flatten: true,
        title: this._l("editor.section.interactions"),
        schema: [
          { name: "compact_on_tap", selector: { boolean: {} } },
          ...(compactOnTap || c.compact ? [{ name: "remember_compact", selector: { boolean: {} } }] : []),
          ...(compactOnTap ? [] : [{ name: "tap_action", selector: { ui_action: {} } }]),
          { name: "hold_action", selector: { ui_action: {} } },
          { name: "double_tap_action", selector: { ui_action: {} } },
        ],
      },
      {
        type: "expandable",
        flatten: true,
        title: this._l("editor.section.advanced"),
        schema: [
          ...(hasGraph
            ? [
                grid([
                  { name: "height", selector: { number: { mode: "box", min: 20, step: 1 } } },
                  { name: "smoothing", selector: { boolean: {} } },
                  { name: "limits_min", selector: num },
                  { name: "limits_max", selector: num },
                  { name: "statistics_threshold", selector: { number: { mode: "box", min: 0, step: "any" } } },
                  ...(this._usesStatistics
                    ? [{ name: "statistics_period", selector: select(h, ["auto", "5minute", "hour", "day"]) }]
                    : []),
                ]),
              ]
            : []),
          { name: "theme", selector: { theme: {} } },
        ],
      },
    ];
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
    const graphOn = this._config!.graph !== "none" && e.show_graph !== false;
    return [
      { name: "entity", selector: { entity: {} } },
      grid([
        { name: "name", selector: { text: {} } },
        { name: "icon", selector: { icon: {} } },
        ...(hasScale ? [] : [{ name: "color", selector: { text: {} } }]),
      ]),
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
        title: this._l("editor.section.advanced"),
        schema: [
          grid([
            { name: "unit", selector: { text: {} } },
            { name: "decimals", selector: { number: { mode: "box", min: 0, max: 6, step: 1 } } },
            ...(graphOn
              ? [
                  { name: "line_width", selector: { number: { mode: "box", min: 0.5, max: 12, step: 0.5 } } },
                  { name: "scale", selector: { text: {} } },
                  { name: "min", selector: num },
                  { name: "max", selector: num },
                ]
              : []),
          ]),
          grid([
            { name: "show_value", selector: { boolean: {} } },
            { name: "show_graph", selector: { boolean: {} } },
            ...(graphOn ? [{ name: "fill", selector: { boolean: {} } }] : []),
          ]),
          ...(graphOn && hasScale && e.fill !== false
            ? [{ name: "fill_gradient", selector: select(h, ["value", "time"], "opt.fill_") }]
            : []),
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
    if (
      st &&
      this._usesStatistics &&
      this._config!.graph !== "none" &&
      e.show_graph !== false &&
      e.entity.startsWith("sensor.") &&
      !st.attributes.state_class
    ) {
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

  private _renderColorInput(value: string, onChange: (c: string) => void, label: string): TemplateResult {
    return html`<span class="color-input" title=${label}>
      <input
        type="color"
        aria-label=${label}
        .value=${toHex(value, this)}
        @change=${(ev: Event) => onChange((ev.target as HTMLInputElement).value)}
      />
      <input
        class="text"
        type="text"
        aria-label=${label}
        .value=${value}
        @change=${(ev: Event) => onChange((ev.target as HTMLInputElement).value.trim())}
      />
    </span>`;
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
              ? html`${this._renderColorInput(r.below, (c) => update(k, { below: c }), this._l("editor.below"))}
                  <span class="arrow">→</span>`
              : nothing}
            ${this._renderColorInput(r.color, (c) => update(k, { color: c }), this._l("editor.above"))}
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

  private _isHiddenNow(e: EntityConfig): boolean {
    const st = this.hass?.states[e.entity];
    const v = st ? Number(st.state) : NaN;
    const numeric = !!st && st.state !== "" && Number.isFinite(v);
    if (e.hide_unavailable && !numeric) return true;
    if (numeric && isSet(e.hide_below) && v < Number(e.hide_below)) return true;
    if (numeric && isSet(e.hide_above) && v > Number(e.hide_above)) return true;
    return false;
  }

  private _renderEntity(e: EntityConfig, i: number): TemplateResult {
    const st = this.hass?.states[e.entity];
    const title = e.name || st?.attributes.friendly_name || e.entity;
    const unit = e.unit ?? st?.attributes.unit_of_measurement ?? "";
    const numeric = !!st && st.state !== "" && Number.isFinite(Number(st.state));
    const value = st ? (numeric ? formatNumber(this.hass, Number(st.state)) : st.state) : "";
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
          <ha-form
            .hass=${this.hass}
            .data=${{ show_value: true, show_graph: true, ...e }}
            .schema=${this._entitySchema(e)}
            .computeLabel=${this._computeLabel}
            @value-changed=${(ev: CustomEvent) => {
              ev.stopPropagation();
              const v = { ...ev.detail.value };
              if (v.show_value === true && e.show_value === undefined) delete v.show_value;
              if (v.show_graph === true && e.show_graph === undefined) delete v.show_graph;
              v.color_scale = e.color_scale;
              v.color_scale_mode = e.color_scale_mode;
              this._updateEntity(i, v);
            }}
          ></ha-form>
          ${this._renderStops(i, e)}
          <div class="panel-actions">
            <button class="text-button danger" @click=${() => this._updateEntity(i, null)}>${this._l("editor.remove")}</button>
          </div>
        </div>
      </ha-expansion-panel>
    </div>`;
  }

  protected render(): TemplateResult | typeof nothing {
    if (!this.hass || !this._config) return nothing;
    const warnings = this._cardWarnings();
    return html`
      ${warnings.map((w) => html`<div class="warning">⚠ ${w}</div>`)}
      <ha-form
        .hass=${this.hass}
        .data=${this._cardData()}
        .schema=${this._cardSchema()}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._cardChanged}
      ></ha-form>
      <div class="section-title">${this._l("editor.section.entities")}</div>
      <div class="entities ${this._drag ? "is-dragging" : ""}">
        ${this._config.entities.map((e, i) => this._renderEntity(e, i))}
      </div>
      <div class="add">
        <svg viewBox="0 0 24 24"><path d=${mdiPlus}></path></svg>
        <ha-form
          .hass=${this.hass}
          .data=${{}}
          .schema=${[{ name: "entity", selector: { entity: {} } }]}
          .computeLabel=${() => this._l("editor.add_entity")}
          @value-changed=${this._addEntity}
        ></ha-form>
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
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
      align-items: center;
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
