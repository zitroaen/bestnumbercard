import type { HomeAssistant } from "./types";

const en = {
  // card
  "card.no_entities": "No entities configured",
  "card.not_found": "Entity not available",
  "card.all_hidden": "All entities hidden",
  // editor – sections
  "editor.section.general": "General",
  "editor.section.graph": "Graph",
  "editor.section.data": "Data loading",
  "editor.section.entities": "Entities",
  "editor.section.interactions": "Interactions",
  "editor.add_entity": "Add entity",
  "editor.remove": "Remove",
  "editor.move_up": "Move up",
  "editor.move_down": "Move down",
  "editor.color_scale": "Color scale",
  "editor.color_scale_help":
    "Stops are sorted by value. Two stops with the same value create a hard jump (e.g. 95 orange + 95 dark red).",
  "editor.add_stop": "Add color stop",
  "editor.visibility": "Visibility",
  // editor – card fields
  "field.name": "Name",
  "field.icon": "Icon",
  "field.graph": "Graph type",
  "field.detail": "Detail",
  "field.hours_to_show": "Hours to show",
  "field.height": "Graph height (px, empty = automatic)",
  "field.smoothing": "Smooth line",
  "field.value_display": "Values in header",
  "field.legend_icon": "Marker next to values",
  "field.end_labels": "Labels at the end of the line",
  "field.tooltip": "Tooltip on hover",
  "field.compact": "Start in compact mode",
  "field.statistics_threshold": "Use long-term statistics above (hours)",
  "field.statistics_period": "Statistics resolution",
  "field.limits_min": "Minimum (all scales)",
  "field.limits_max": "Maximum (all scales)",
  "field.theme": "Theme",
  "field.tap_action": "Tap action",
  "field.hold_action": "Hold action",
  "field.double_tap_action": "Double tap action",
  // editor – entity fields
  "field.entity": "Entity",
  "field.unit": "Unit",
  "field.decimals": "Decimals",
  "field.color": "Line color (without color scale)",
  "field.color_scale_mode": "Color scale mode",
  "field.scale": "Scale group (same name = shared y-axis)",
  "field.min": "Minimum",
  "field.max": "Maximum",
  "field.fill": "Fill area",
  "field.fill_gradient": "Fill coloring (with color scale)",
  "field.line_width": "Line width",
  "field.show_value": "Show value",
  "field.show_graph": "Show in graph",
  "field.hide_below": "Hide while below",
  "field.hide_above": "Hide while above",
  "field.hide_unavailable": "Hide while unavailable",
  "field.value": "Value",
  // options
  "opt.line": "Line",
  "opt.none": "None",
  "opt.detail_1": "Low (smooth average)",
  "opt.detail_2": "High (keeps every peak)",
  "opt.primary": "First entity only (like sensor card)",
  "opt.all": "All entities",
  "opt.dot": "Colored dot",
  "opt.icon": "Icon",
  "opt.value": "Current value",
  "opt.icon_value": "Icon and value",
  "opt.auto": "Automatic",
  "opt.5minute": "5 minutes",
  "opt.hour": "Hour",
  "opt.day": "Day",
  "opt.gradient": "Gradient",
  "opt.step": "Steps",
  "opt.fill_value": "By value (horizontal color bands)",
  "opt.fill_time": "Along time (vertical color bands)",
};

type Key = keyof typeof en;

const de: Partial<Record<Key, string>> = {
  "card.no_entities": "Keine Entitäten konfiguriert",
  "card.not_found": "Entität nicht verfügbar",
  "card.all_hidden": "Alle Entitäten ausgeblendet",
  "editor.section.general": "Allgemein",
  "editor.section.graph": "Diagramm",
  "editor.section.data": "Datenabfrage",
  "editor.section.entities": "Entitäten",
  "editor.section.interactions": "Interaktionen",
  "editor.add_entity": "Entität hinzufügen",
  "editor.remove": "Entfernen",
  "editor.move_up": "Nach oben",
  "editor.move_down": "Nach unten",
  "editor.color_scale": "Farbskala",
  "editor.color_scale_help":
    "Die Stufen werden nach Wert sortiert. Zwei Stufen mit gleichem Wert erzeugen einen harten Sprung (z. B. 95 orange + 95 dunkelrot).",
  "editor.add_stop": "Farbstufe hinzufügen",
  "editor.visibility": "Sichtbarkeit",
  "field.name": "Name",
  "field.icon": "Symbol",
  "field.graph": "Diagrammtyp",
  "field.detail": "Detailgrad",
  "field.hours_to_show": "Angezeigte Stunden",
  "field.height": "Diagrammhöhe (px, leer = automatisch)",
  "field.smoothing": "Linie glätten",
  "field.value_display": "Werte in der Kopfzeile",
  "field.legend_icon": "Markierung neben den Werten",
  "field.end_labels": "Beschriftung am Linienende",
  "field.tooltip": "Tooltip beim Überfahren",
  "field.compact": "Im Kompaktmodus starten",
  "field.statistics_threshold": "Langzeitstatistik verwenden ab (Stunden)",
  "field.statistics_period": "Auflösung der Statistik",
  "field.limits_min": "Minimum (alle Skalen)",
  "field.limits_max": "Maximum (alle Skalen)",
  "field.theme": "Design",
  "field.tap_action": "Aktion beim Tippen",
  "field.hold_action": "Aktion beim Halten",
  "field.double_tap_action": "Aktion bei Doppeltippen",
  "field.entity": "Entität",
  "field.unit": "Einheit",
  "field.decimals": "Nachkommastellen",
  "field.color": "Linienfarbe (ohne Farbskala)",
  "field.color_scale_mode": "Art der Farbskala",
  "field.scale": "Skalengruppe (gleicher Name = gemeinsame Y-Achse)",
  "field.min": "Minimum",
  "field.max": "Maximum",
  "field.fill": "Fläche füllen",
  "field.fill_gradient": "Färbung der Füllung (mit Farbskala)",
  "field.line_width": "Linienstärke",
  "field.show_value": "Wert anzeigen",
  "field.show_graph": "Im Diagramm anzeigen",
  "field.hide_below": "Ausblenden, solange unter",
  "field.hide_above": "Ausblenden, solange über",
  "field.hide_unavailable": "Ausblenden, solange nicht verfügbar",
  "field.value": "Wert",
  "opt.line": "Linie",
  "opt.none": "Keine",
  "opt.detail_1": "Niedrig (geglätteter Mittelwert)",
  "opt.detail_2": "Hoch (alle Spitzen bleiben erhalten)",
  "opt.primary": "Nur erste Entität (wie Sensorkarte)",
  "opt.all": "Alle Entitäten",
  "opt.dot": "Farbiger Punkt",
  "opt.icon": "Symbol",
  "opt.value": "Aktueller Wert",
  "opt.icon_value": "Symbol und Wert",
  "opt.auto": "Automatisch",
  "opt.5minute": "5 Minuten",
  "opt.hour": "Stunde",
  "opt.day": "Tag",
  "opt.gradient": "Verlauf",
  "opt.step": "Stufen",
  "opt.fill_value": "Nach Wert (horizontale Farbbänder)",
  "opt.fill_time": "Entlang der Zeit (vertikale Farbbänder)",
};

const LANGS: Record<string, Partial<Record<Key, string>>> = { en, de };

export function localize(hass: HomeAssistant | undefined, key: Key | string): string {
  const lang = (hass?.locale?.language ?? hass?.language ?? "en").split("-")[0];
  return LANGS[lang]?.[key as Key] ?? en[key as Key] ?? key;
}

export function numberLocale(hass?: HomeAssistant): string | undefined {
  const lang = hass?.locale?.language ?? hass?.language ?? "en";
  switch (hass?.locale?.number_format) {
    case "comma_decimal":
      return "en-US";
    case "decimal_comma":
      return "de-DE";
    case "space_comma":
      return "fr-FR";
    case "system":
      return undefined;
    default:
      return lang;
  }
}

const fmtCache = new Map<string, Intl.NumberFormat>();

export function formatNumber(hass: HomeAssistant | undefined, value: number, decimals?: number): string {
  if (!Number.isFinite(value)) return "–";
  const loc = numberLocale(hass);
  const noGrouping = hass?.locale?.number_format === "none";
  const key = `${loc}|${decimals}|${noGrouping}`;
  let f = fmtCache.get(key);
  if (!f) {
    f = new Intl.NumberFormat(loc, {
      useGrouping: !noGrouping,
      ...(decimals !== undefined
        ? { minimumFractionDigits: decimals, maximumFractionDigits: decimals }
        : { maximumFractionDigits: 2 }),
    });
    fmtCache.set(key, f);
  }
  return f.format(value);
}

export function formatTime(hass: HomeAssistant | undefined, ts: number, withDate: boolean): string {
  const lang = hass?.locale?.language ?? hass?.language ?? "en";
  const tf = hass?.locale?.time_format;
  const hour12 = tf === "12" ? true : tf === "24" ? false : undefined;
  return new Intl.DateTimeFormat(lang, {
    ...(withDate ? { day: "2-digit", month: "2-digit" } : {}),
    hour: "2-digit",
    minute: "2-digit",
    hour12,
  }).format(ts);
}
