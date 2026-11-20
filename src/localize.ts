import type { HomeAssistant } from "./types";

const en = {
  // card
  "card.no_entities": "No entities configured",
  "card.not_found": "Entity not available",
  "card.all_hidden": "All entities hidden",
  "card.loading": "Loading history…",
  "card.no_data": "No data in this time range",
  "card.min": "Minimum",
  "card.max": "Maximum",
  "card.avg": "Average",
  "card.toggle_series": "Show/hide line",
  "editor.section.advanced": "Advanced",
  "editor.preset": "Apply preset…",
  "editor.jump": "Hard jump",
  "editor.jump_help": "Color below / above this value",
  "editor.below": "below",
  "editor.above": "above",
  "editor.drag": "Drag to reorder",
  "editor.hidden_now": "currently hidden",
  "editor.warn_no_statistics":
    "This sensor has no long-term statistics (no state_class). For time ranges above the statistics threshold, the raw history is loaded instead, which puts more load on the system.",
  "editor.warn_min_max": "Minimum must be lower than maximum.",
  "editor.warn_hide_range": "With these values the entity is always hidden.",
  "editor.warn_hours": "Hours to show must be greater than 0.",
  "preset.temperature": "Room temperature",
  "preset.outdoor": "Outdoor temperature (jump at 0)",
  "preset.heating": "Heating (jump at 95)",
  "preset.humidity": "Humidity",
  "preset.co2": "CO₂",
  "preset.battery": "Battery",
  "field.y_axis": "Y-axis labels",
  "field.show_thresholds": "Lines at color jumps",
  "field.show_extrema": "Show min / avg / max",
  "field.legend_toggle": "Tap legend to hide lines",
  "field.remember_compact": "Remember compact mode on this device",
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
    "Colors blend smoothly between the stops. Use the jump button on a stop to switch abruptly at that value (separate colors below / above).",
  "editor.color_scale_help_step": "Each color applies from its value upwards; the first color also applies below.",
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
  "opt.hover": "On hover",
  "opt.always": "Always",
  "opt.fill_time": "Along time (vertical color bands)",
};

type Key = keyof typeof en;

const de: Partial<Record<Key, string>> = {
  "card.no_entities": "Keine Entitäten konfiguriert",
  "card.not_found": "Entität nicht verfügbar",
  "card.all_hidden": "Alle Entitäten ausgeblendet",
  "card.loading": "Verlauf wird geladen …",
  "card.no_data": "Keine Daten in diesem Zeitraum",
  "card.min": "Minimum",
  "card.max": "Maximum",
  "card.avg": "Durchschnitt",
  "card.toggle_series": "Linie ein-/ausblenden",
  "editor.section.advanced": "Erweitert",
  "editor.preset": "Vorlage anwenden …",
  "editor.jump": "Harter Sprung",
  "editor.jump_help": "Farbe unter / über diesem Wert",
  "editor.below": "unter",
  "editor.above": "über",
  "editor.drag": "Zum Sortieren ziehen",
  "editor.hidden_now": "gerade ausgeblendet",
  "editor.warn_no_statistics":
    "Dieser Sensor hat keine Langzeitstatistik (keine state_class). Bei Zeiträumen über der Statistik-Schwelle wird stattdessen die Roh-History geladen – das belastet das System stärker.",
  "editor.warn_min_max": "Das Minimum muss kleiner als das Maximum sein.",
  "editor.warn_hide_range": "Mit diesen Werten ist die Entität immer ausgeblendet.",
  "editor.warn_hours": "Die angezeigten Stunden müssen größer als 0 sein.",
  "preset.temperature": "Raumtemperatur",
  "preset.outdoor": "Außentemperatur (Sprung bei 0)",
  "preset.heating": "Heizung (Sprung bei 95)",
  "preset.humidity": "Luftfeuchte",
  "preset.co2": "CO₂",
  "preset.battery": "Akku",
  "field.y_axis": "Y-Achsen-Beschriftung",
  "field.show_thresholds": "Linien an Farbsprüngen",
  "field.show_extrema": "Min / Ø / Max anzeigen",
  "field.legend_toggle": "Legende antippen blendet Linien aus",
  "field.remember_compact": "Kompaktmodus auf diesem Gerät merken",
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
    "Zwischen den Stufen gehen die Farben fließend ineinander über. Mit dem Sprung-Knopf an einer Stufe wechselt die Farbe bei diesem Wert hart (getrennte Farben darunter / darüber).",
  "editor.color_scale_help_step": "Jede Farbe gilt ab ihrem Wert aufwärts; die erste Farbe gilt auch darunter.",
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
  "opt.hover": "Beim Überfahren",
  "opt.always": "Immer",
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
