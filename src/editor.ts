import { LitElement, html, css, nothing, type TemplateResult } from "lit";
import { sortStops } from "./color-scale";
import { localize } from "./localize";
import type { CardConfig, ColorStop, EntityConfig, HomeAssistant } from "./types";

const mdiDelete = "M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z";
const mdiArrowUp = "M13,20H11V8L5.5,13.5L4.08,12.08L12,4.16L19.92,12.08L18.5,13.5L13,8V20Z";
const mdiArrowDown = "M11,4H13V16L18.5,10.5L19.92,11.92L12,19.84L4.08,11.92L5.5,10.5L11,16V4Z";

const num = { number: { mode: "box", step: "any" } };

function select(hass: HomeAssistant | undefined, values: Array<string | number>, prefix = "opt."): any {
  return {
    select: {
      mode: "dropdown",
      options: values.map((v) => ({ value: v, label: localize(hass, `${prefix}${v}`) })),
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

export class BestNumberCardEditor extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
    _expanded: { state: true },
  };

  hass?: HomeAssistant;
  private _config?: CardConfig;
  private _expanded = -1;

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

  // ------------------------------------------------------------- card options

  private _cardSchema() {
    const h = this.hass;
    const compactOnTap = this._config?.tap_action?.action === "toggle-compact";
    return [
      {
        type: "expandable",
        flatten: true,
        expanded: true,
        title: this._l("editor.section.general"),
        schema: [
          { type: "grid", name: "", schema: [
            { name: "name", selector: { text: {} } },
            { name: "icon", selector: { icon: {} } },
          ] },
          { name: "value_display", selector: select(h, ["all", "primary", "none"]) },
          { name: "legend_icon", selector: select(h, ["dot", "icon", "none"]) },
          { name: "compact", selector: { boolean: {} } },
          { name: "theme", selector: { theme: {} } },
        ],
      },
      {
        type: "expandable",
        flatten: true,
        title: this._l("editor.section.graph"),
        schema: [
          { type: "grid", name: "", schema: [
            { name: "graph", selector: select(h, ["line", "none"]) },
            { name: "detail", selector: select(h, ["1", "2"], "opt.detail_") },
            { name: "hours_to_show", selector: { number: { mode: "box", min: 0.1, step: "any" } } },
            { name: "height", selector: { number: { mode: "box", min: 20, step: 1 } } },
            { name: "limits_min", selector: num },
            { name: "limits_max", selector: num },
          ] },
          { name: "end_labels", selector: select(h, ["none", "value", "icon", "icon_value"]) },
          { name: "fill_gradient", selector: select(h, ["value", "time"], "opt.fill_") },
          { type: "grid", name: "", schema: [
            { name: "smoothing", selector: { boolean: {} } },
            { name: "tooltip", selector: { boolean: {} } },
          ] },
        ],
      },
      {
        type: "expandable",
        flatten: true,
        title: this._l("editor.section.data"),
        schema: [
          { type: "grid", name: "", schema: [
            { name: "statistics_threshold", selector: { number: { mode: "box", min: 0, step: "any" } } },
            { name: "statistics_period", selector: select(h, ["auto", "5minute", "hour", "day"]) },
          ] },
        ],
      },
      {
        type: "expandable",
        flatten: true,
        title: this._l("editor.section.interactions"),
        schema: [
          { name: "compact_on_tap", selector: { boolean: {} } },
          ...(compactOnTap ? [] : [{ name: "tap_action", selector: { ui_action: {} } }]),
          { name: "hold_action", selector: { ui_action: {} } },
          { name: "double_tap_action", selector: { ui_action: {} } },
        ],
      },
    ];
  }

  private _defaults(): Record<string, unknown> {
    return {
      graph: "line",
      detail: 1,
      hours_to_show: 24,
      smoothing: true,
      tooltip: true,
      compact: false,
      statistics_threshold: 6,
      statistics_period: "auto",
      end_labels: "none",
      legend_icon: "dot",
      fill_gradient: "value",
      value_display: this._config!.entities.length === 1 ? "primary" : "all",
    };
  }

  private _cardData() {
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

  // ------------------------------------------------------------- entities

  private _entitySchema(e: EntityConfig) {
    const h = this.hass;
    return [
      { name: "entity", selector: { entity: {} } },
      { type: "grid", name: "", schema: [
        { name: "name", selector: { text: {} } },
        { name: "icon", selector: { icon: {} } },
        { name: "unit", selector: { text: {} } },
        { name: "decimals", selector: { number: { mode: "box", min: 0, max: 6, step: 1 } } },
        { name: "color", selector: { text: {} } },
        { name: "line_width", selector: { number: { mode: "box", min: 0.5, max: 12, step: 0.5 } } },
        { name: "scale", selector: { text: {} } },
        { name: "color_scale_mode", selector: select(h, ["gradient", "step"]) },
        { name: "fill_gradient", selector: select(h, ["value", "time"], "opt.fill_") },
        { name: "min", selector: num },
        { name: "max", selector: num },
      ] },
      { type: "grid", name: "", schema: [
        { name: "show_value", selector: { boolean: {} } },
        { name: "show_graph", selector: { boolean: {} } },
        { name: "fill", selector: { boolean: {} } },
      ] },
      {
        type: "expandable",
        flatten: true,
        title: this._l("editor.visibility"),
        expanded: e.hide_below !== undefined || e.hide_above !== undefined || !!e.hide_unavailable,
        schema: [
          { type: "grid", name: "", schema: [
            { name: "hide_below", selector: num },
            { name: "hide_above", selector: num },
          ] },
          { name: "hide_unavailable", selector: { boolean: {} } },
        ],
      },
    ];
  }

  private _updateEntity(i: number, patch: EntityConfig | null): void {
    const entities = [...this._config!.entities];
    if (patch === null) entities.splice(i, 1);
    else entities[i] = clean(patch);
    this._emit({ ...this._config!, entities });
  }

  private _move(i: number, dir: -1 | 1): void {
    const entities = [...this._config!.entities];
    const j = i + dir;
    if (j < 0 || j >= entities.length) return;
    [entities[i], entities[j]] = [entities[j], entities[i]];
    this._expanded = j;
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

  private _setStops(i: number, stops: ColorStop[]): void {
    const e = { ...this._config!.entities[i] };
    if (stops.length) e.color_scale = stops;
    else delete e.color_scale;
    this._updateEntity(i, e);
  }

  private _renderStops(i: number, e: EntityConfig): TemplateResult {
    const stops = e.color_scale ?? [];
    const update = (k: number, patch: Partial<ColorStop>) => {
      const next = stops.map((s, idx) => (idx === k ? { ...s, ...patch } : s));
      this._setStops(i, next);
    };
    return html`<div class="stops">
      <div class="stops-title">${this._l("editor.color_scale")}</div>
      <div class="help">${this._l("editor.color_scale_help")}</div>
      ${stops.map(
        (s, k) => html`<div class="stop">
          <input
            type="color"
            .value=${toHex(s.color)}
            @change=${(ev: Event) => update(k, { color: (ev.target as HTMLInputElement).value })}
          />
          <ha-form
            .hass=${this.hass}
            .data=${{ value: s.value, color: s.color }}
            .schema=${[{ type: "grid", name: "", schema: [
              { name: "value", selector: num },
              { name: "color", selector: { text: {} } },
            ] }]}
            .computeLabel=${this._computeLabel}
            @value-changed=${(ev: CustomEvent) => {
              ev.stopPropagation();
              update(k, { value: Number(ev.detail.value.value ?? 0), color: ev.detail.value.color ?? "" });
            }}
          ></ha-form>
          <ha-icon-button
            .label=${this._l("editor.remove")}
            .path=${mdiDelete}
            @click=${() => this._setStops(i, stops.filter((_, idx) => idx !== k))}
          ></ha-icon-button>
        </div>`,
      )}
      <div class="stop-actions">
        <button
          class="text-button"
          @click=${() => {
            const last = stops[stops.length - 1];
            this._setStops(i, [...stops, { value: last ? Number(last.value) + 10 : 0, color: last?.color ?? "#ff0000" }]);
          }}
        >
          + ${this._l("editor.add_stop")}
        </button>
        ${stops.length > 1
          ? html`<button class="text-button" @click=${() => this._setStops(i, sortStops(stops))}>↕ sort</button>`
          : nothing}
      </div>
    </div>`;
  }

  private _renderEntity(e: EntityConfig, i: number): TemplateResult {
    const n = this._config!.entities.length;
    const title = e.name || this.hass?.states[e.entity]?.attributes.friendly_name || e.entity;
    return html`<ha-expansion-panel
      outlined
      .expanded=${this._expanded === i}
      @expanded-changed=${(ev: CustomEvent) => {
        if (ev.detail.expanded) this._expanded = i;
        else if (this._expanded === i) this._expanded = -1;
      }}
    >
      <div slot="header" class="panel-header">
        <span class="swatch" style="background:${e.color_scale?.[0]?.color ?? e.color ?? "var(--accent-color)"}"></span>
        <span class="panel-title">${title}</span>
      </div>
      <div class="panel-body">
        <div class="row-actions">
          <ha-icon-button .label=${this._l("editor.move_up")} .path=${mdiArrowUp} .disabled=${i === 0} @click=${() => this._move(i, -1)}></ha-icon-button>
          <ha-icon-button .label=${this._l("editor.move_down")} .path=${mdiArrowDown} .disabled=${i === n - 1} @click=${() => this._move(i, 1)}></ha-icon-button>
          <ha-icon-button .label=${this._l("editor.remove")} .path=${mdiDelete} @click=${() => this._updateEntity(i, null)}></ha-icon-button>
        </div>
        <ha-form
          .hass=${this.hass}
          .data=${{ show_value: true, show_graph: true, color_scale_mode: "gradient", ...e }}
          .schema=${this._entitySchema(e)}
          .computeLabel=${this._computeLabel}
          @value-changed=${(ev: CustomEvent) => {
            ev.stopPropagation();
            const v = { ...ev.detail.value };
            if (v.color_scale_mode === "gradient" && !e.color_scale_mode) delete v.color_scale_mode;
            if (v.show_value === true && e.show_value === undefined) delete v.show_value;
            if (v.show_graph === true && e.show_graph === undefined) delete v.show_graph;
            if (v.color_scale) v.color_scale = e.color_scale;
            this._updateEntity(i, v);
          }}
        ></ha-form>
        ${this._renderStops(i, e)}
      </div>
    </ha-expansion-panel>`;
  }

  protected render(): TemplateResult | typeof nothing {
    if (!this.hass || !this._config) return nothing;
    return html`
      <ha-form
        .hass=${this.hass}
        .data=${this._cardData()}
        .schema=${this._cardSchema()}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._cardChanged}
      ></ha-form>
      <div class="section-title">${this._l("editor.section.entities")}</div>
      <div class="entities">${this._config.entities.map((e, i) => this._renderEntity(e, i))}</div>
      <ha-form
        class="add"
        .hass=${this.hass}
        .data=${{}}
        .schema=${[{ name: "entity", selector: { entity: {} } }]}
        .computeLabel=${() => this._l("editor.add_entity")}
        @value-changed=${this._addEntity}
      ></ha-form>
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
    .add {
      display: block;
      margin-top: 12px;
    }
    .panel-header {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
    }
    .panel-title {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .swatch {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      flex: none;
    }
    .panel-body {
      padding: 0 4px 12px;
    }
    .row-actions {
      display: flex;
      justify-content: flex-end;
    }
    .stops {
      margin-top: 16px;
      padding-top: 12px;
      border-top: 1px solid var(--divider-color);
    }
    .stops-title {
      font-weight: 500;
    }
    .help {
      color: var(--secondary-text-color);
      font-size: 12px;
      margin: 4px 0 8px;
    }
    .stop {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 4px;
    }
    .stop ha-form {
      flex: 1;
    }
    .stop input[type="color"] {
      width: 36px;
      height: 36px;
      border: none;
      padding: 0;
      background: none;
      cursor: pointer;
      flex: none;
    }
    .stop-actions {
      display: flex;
      gap: 8px;
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
  `;
}

/** Best effort conversion for the native color picker. */
function toHex(color: string): string {
  if (/^#[0-9a-f]{6}$/i.test(color)) return color;
  if (/^#[0-9a-f]{3}$/i.test(color)) return "#" + [...color.slice(1)].map((c) => c + c).join("");
  try {
    const ctx = document.createElement("canvas").getContext("2d")!;
    ctx.fillStyle = "#000";
    ctx.fillStyle = color;
    const v = String(ctx.fillStyle);
    if (v.startsWith("#")) return v;
  } catch {
    /* ignore */
  }
  return "#000000";
}

if (!customElements.get("best-number-card-editor")) {
  customElements.define("best-number-card-editor", BestNumberCardEditor);
}
