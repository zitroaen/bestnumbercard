<p align="center"><img src="https://raw.githubusercontent.com/zitroaen/bestnumbercard/main/docs/icon.png" width="128" alt="Best Number Card icon"></p>

# Best Number Card

A Home Assistant dashboard card that looks and behaves like the built-in **sensor card**, but shows **several entities**, adds **color scales**, **day & night**, **event pins** and much more, while putting as little load on your system as possible.

![Best Number Card in dark and light theme](https://raw.githubusercontent.com/zitroaen/bestnumbercard/main/docs/screenshot.png)

## Features

**Graph**
- **Several entities** in one card, each with its own line, optionally on **separate y-axes** (scale groups)
- **Color scales per series**: gradients, hard jumps or steps (e.g. blue → orange up to 95 °C, then dark red). They color the line, the fill, the value and the marker, optionally with **dashed lines at the jumps**.
- **Fill colored along time** (vertical color bands), so you see *when* a threshold was crossed
- **Min/max band** around the line, from the long-term statistics without any extra query
- **Every peak visible**: high detail or "load all details" per entity, drawn without smoothing
- **Attributes** instead of the state, for example a thermostat's target temperature
- **Outages appear as gaps**, both in raw data and in statistics
- The graph uses the **free height of the card** in sections dashboards

**Time**
- **Day & night** behind the whole card, with **starry sky**, **morning and evening glow** and **sunrise / sunset**, computed locally from your HA location
- **Event pins** on the time axis: window open, fireplace burning, heating on…, with duration bars
- **Time axis** ("−6 h … now") and **y-axis labels**, on hover or always
- **Tooltip** with all values and active events. On phones, **swipe across the graph**.

**Values**
- **All values** in the header, or only the first one (like the sensor card)
- **Labels at the end of the lines** (value and/or icon)
- **Min / average / max** of the visible time range
- Adjustable **font sizes** and **text colour**, and an own text for unavailable entities (e.g. "–")
- **Alert glow**: the card glows, pulses or blinks while a value reaches a threshold
- **Hide entities depending on their value**. Their history is not loaded then.
- **Tap a legend entry** to hide a line temporarily

**Compact mode**
- One slim row with the values, either as the default or toggled by **tapping the card**. The state is remembered per device.
- Optionally with the card icon, entity names and a **faint graph in the background**
- Switching is **animated**

**Editor and performance**
- **Visual editor** in English and German: color picker with theme colors, color scale preview with presets, drag & drop, warnings and performance hints
- **Very light on your system** (see [Performance](#performance)): long-term statistics for long ranges, shared subscriptions, gap-only reloads, no polling
- **Staged loading animation**, like the built-in card
- Appears in HA's **card suggestions** for numeric sensors (HA 2026.6+)

## Comparison with the built-in sensor card

| | Sensor card | Best Number Card |
|---|---|---|
| Entities per card | 1 | any number |
| Look (name, icon, big value, graph at the bottom) | ✓ | ✓ same layout |
| `graph`, `detail`, `hours_to_show`, `limits`, `unit`, `name`, `icon`, `theme` | ✓ | ✓ |
| Visual editor | ✓ | ✓ with color scale preview, presets, drag & drop, warnings |
| Line color | fixed | per series, or a **color scale** by value |
| Color scale with gradients and hard jumps | – | ✓ line, fill, value and marker |
| Fill colored along time (vertical bands) | – | ✓ `fill_gradient: time` |
| Dashed lines at color jumps | – | ✓ `show_thresholds` |
| Separate y-axes | – | ✓ scale groups |
| Y-axis and time axis labels | – | ✓ on hover or always |
| Min/max band | – | ✓ from long-term statistics, no extra query |
| Attributes instead of the state | – | ✓ e.g. a thermostat's target temperature |
| Day & night with stars, morning / evening glow, sun times | – | ✓ computed locally, no extra query |
| Event pins (window open, heating on, …) | – | ✓ one lightweight subscription |
| Tooltip | – | ✓ mouse and touch, incl. active events |
| Labels / icons at the end of the lines | – | ✓ |
| Min / avg / max of the time range | – | ✓ `show_extrema` |
| Hide a line by tapping the legend | – | ✓ |
| Hide entities depending on their value | – | ✓ and their history is not loaded |
| Alert: card glows / blinks at a threshold | – | ✓ `alert_above` / `alert_below` |
| Compact mode | – | ✓ with icon, names, background graph, animation |
| Font sizes, text colour, text for unavailable | – | ✓ |
| Tap / hold / double-tap actions | more info on tap | ✓ all standard actions, plus `toggle-compact` |
| Every short peak visible | ✓ (raw history) | ✓ per entity (`raw_history`), statistics as a preview |
| Loading of long time ranges | raw history | **long-term statistics** + short raw tail |
| Several cards / views showing the same entity | each loads separately | shared subscription and cache, only the gap is loaded |
| After a lost connection | full reload | only the gap |
| Redraws with very dense sensors | on every update | throttled to what is visible (about one pixel) |
| Loading animation | ✓ | ✓ flat line → statistics preview → details |
| Number format (e.g. German decimal comma) | ✓ | ✓ follows your HA settings |

## Installation

### HACS (recommended)

1. HACS → ⋮ → *Custom repositories* → add `https://github.com/zitroaen/bestnumbercard`, category **Dashboard**.
2. Install **Best Number Card**.
3. Reload the browser.

HACS registers the dashboard resource for you. It adds a `?hacstag=…` version parameter to the resource URL, so after every update the browser loads the new version automatically. **You never have to clear any cache.** A normal reload is enough.

**No update shown?** HACS checks for new versions only every few hours. Open the card in HACS, then ⋮ → *Update information*. The card writes its version to the browser console (`BEST-NUMBER-CARD vX.Y.Z`), so you can check which version is running.

### Manual

Download `best-number-card.js` from the [latest release](https://github.com/zitroaen/bestnumbercard/releases/latest) into `<config>/www/`. Then add the resource `/local/best-number-card.js?v=X.Y.Z` (type *JavaScript module*), and change `?v=` with every update.

## Configuration

Everything can be configured in the visual editor. A full example:

```yaml
type: custom:best-number-card
name: Heating
hours_to_show: 48
end_labels: icon_value
show_extrema: true
day_night: true
events:
  - entity: binary_sensor.fireplace_burning
    icon: mdi:fireplace
entities:
  - entity: sensor.buffer_tank_temperature
    color_scale:
      - { value: 20, color: blue }
      - { value: 95, color: orange }   # gradient blue → orange …
      - { value: 95, color: darkred }  # … hard jump at 95
    alert_above: 95
  - entity: sensor.outdoor_temperature
    scale: outdoor                     # own y-axis
    color_scale:                       # green below 0, red otherwise
      - { value: 0, color: green }
      - { value: 0, color: red }
  - entity: sensor.fireplace_temperature
    hide_below: 40                     # hidden and not loaded while < 40
```

### Card options

**General**

| Option | Default | Description |
|---|---|---|
| `entities` | – | List of entity ids or entity objects (see [Entity options](#entity-options)) |
| `name` / `icon` | entity's | Header name and icon. With an icon but no name, the icon moves into the values row, so no header row is needed. |
| `value_display` | `primary` (1 entity) / `all` | `primary` = like the sensor card, `all` = all values, `none` |
| `legend_icon` | `dot` | Marker next to the values: `dot`, `icon`, `none` |
| `show_extrema` | `false` | Min / average / max of the visible time range below each value (also per entity) |
| `font_size` | layout default | Font size of the values in px, full and compact mode (also per entity) |
| `text_color` | secondary text colour | Colour of the card name and the entity names |
| `unavailable_text` | HA's text | Text instead of "unavailable" / "unknown", e.g. `"–"`. The unit is hidden then. Also per entity. |
| `theme` | – | Theme for this card |

**Graph**

| Option | Default | Description |
|---|---|---|
| `graph` | `line` | `line` or `none` |
| `hours_to_show` | `24` | Time window |
| `detail` | `1` | `1` = smooth average, `2` = every peak (min/max per pixel, no smoothing) |
| `height` | auto | Graph height in px. By default the graph takes the free height of the card, otherwise the height of the sensor card's graph. |
| `limits` | – | `{min, max}` for all scales |
| `smoothing` | `true` | Smooth curves |
| `fill_gradient` | `value` | Fill coloring with color scales: `value` (horizontal bands) or `time` (vertical bands). Also per entity. |
| `band` | `false` | Min/max band around every line (also per entity) |
| `peak_overflow` | `false` | Single peaks may rise into the header, the highest one up to `peak_margin` below the card's top edge. The scale then follows the bulk of the values instead of the highest spike, so the rest of the graph is not squashed. If the whole graph is high, nothing changes. Also per entity. |
| `peak_percentile` | `95` | With `peak_overflow`: share of the values (in %) that count as normal. They fill the lower 60 % of the graph; everything above counts as a peak and may rise into the header. |
| `peak_margin` | `12` | With `peak_overflow`: space in px kept free between the highest peak and the card's top edge |
| `end_labels` | `none` | Label at the end of each line: `none`, `value`, `icon`, `icon_value` |
| `y_axis` / `x_axis` | `hover` | Axis labels: `hover`, `always`, `none` |
| `show_thresholds` | `false` | Dashed lines with labels at the jumps of the color scales |
| `tooltip` | `true` | Tooltip on hover. On touch screens: swipe horizontally across the graph. |
| `legend_toggle` | `true` | Tap an entity name to hide or show its line |

**Data loading**

| Option | Default | Description |
|---|---|---|
| `statistics_threshold` | `6` | Use long-term statistics if `hours_to_show` is larger than this (hours) |
| `statistics_period` | `auto` | `auto`, `5minute`, `hour`, `day` |

**Day & night**: see [Day & night](#day--night)

| Option | Default | Description |
|---|---|---|
| `day_night` | `false` | Night over the full card height, with soft twilight |
| `stars` | `true` | Starry sky in the night areas |
| `sun_times` | `true` | Sunrise / sunset markers |
| `night_color` / `night_opacity` | dark blue / 55 % (dark), 13 % (light) | Colour and strength of the night |
| `dawn_color` / `dusk_color` | orange / pink | Colour of the morning and evening glow |
| `twilight_opacity` | 30 % (dark), 20 % (light) | Strength of the glow, `0` = off |
| `day_color` / `day_opacity` | – / 8 % (dark), 6 % (light) | Optional tint for the day |
| `stars_brightness` / `stars_twinkle` / `stars_density` | 80 / 50 / 100 % | Brightness, share of twinkling stars, number of stars (up to 300 %) |
| `stars_color` | auto | Star colour. Auto is white in a dark theme and dark blue in a light theme, where white stars would disappear on the bright night. |

**Events**: see [Event pins](#event-pins)

| Option | Default | Description |
|---|---|---|
| `events` | – | List of event pins |
| `event_lines` | `true` | Dotted vertical lines from the pins into the graph |

**Compact mode**

| Option | Default | Description |
|---|---|---|
| `compact` | `false` | Start in compact mode |
| `compact_icon` / `compact_names` | `false` | Show the card icon / the entity names (small, above the values) |
| `compact_graph` | `false` | Faint graph in the background. This loads the history, which compact mode otherwise doesn't. |
| `compact_font_size` | `20` | Font size of the values in px. Order: entity `font_size` > `compact_font_size` > card `font_size` > 20. |
| `compact_name_size` | – | Font size of the card name in px |
| `compact_animation` | `true` | Animate switching (off with *reduce motion*) |
| `remember_compact` | `true` | Remember a toggled compact mode per device |

**Alert and actions**

| Option | Default | Description |
|---|---|---|
| `alert_style` | `glow` | `glow` (pulsing), `blink`, `static`. Thresholds are set per entity (`alert_above` / `alert_below`). |
| `alert_color` | theme error colour | Colour of the alert glow |
| `tap_action` | `more-info` | Standard HA actions, plus `toggle-compact`. With `more-info`, tapping a value opens that value's entity. |
| `hold_action` / `double_tap_action` | – | Standard HA actions, plus `toggle-compact` |

### Entity options

| Option | Description |
|---|---|
| `entity` | Entity id |
| `attribute` | Show this attribute instead of the state, e.g. `temperature` of a `climate` entity. Attributes have no long-term statistics, so their history is always loaded with attributes. |
| `name`, `icon`, `unit` | Overrides |
| `decimals` | Number of decimals (default: the entity's display precision) |
| `font_size` | Font size of this value in px |
| `unavailable_text` | Text while unavailable (overrides the card option) |
| `color` | Line color without a color scale (any CSS color, also `var(--red-color)`) |
| `color_scale` / `color_scale_mode` | List of `{value, color}` stops / `gradient` (default) or `step`, see [Color scales](#color-scales) |
| `scale` | Scale group. Series with the same name share a y-axis (default: all share one). |
| `min` / `max` | Fixed limits for this series' scale |
| `fill` / `fill_gradient` | Fill the area under the line (default: only with a single series) / `value` or `time` |
| `band` / `show_extrema` / `peak_overflow` | Min/max band / min-avg-max / peaks into the header for this entity (override the card options) |
| `line_width` | Line width in px |
| `raw_history` | Always load the **full raw history**, so every short peak is visible. This puts more load on the system. For long ranges the statistics are shown as a quick preview until the details have arrived. |
| `show_value` / `show_graph` | Show this entity in the header / in the graph |
| `hide_below` / `hide_above` / `hide_unavailable` | Hide the entity completely (and don't load it) while its value is below / above a limit, or while it is unavailable |
| `alert_above` / `alert_below` | The whole card glows while the value is at or above / at or below this value |

### Color scales

The stops are sorted by value. The color applies to the line, the fill area, the value and the marker.

- **gradient**: colors are interpolated between neighbouring stops. Two stops with the **same value** form a hard jump, as in CSS gradients. In the editor, use the jump button of a stop and pick the color below and above the value.
- **step**: each stop's color applies from its value upwards. The first color also applies below the first stop.

Below the first stop and above the last stop, the first and last color are used. The editor shows a live preview of the scale and has presets: room temperature, outdoor temperature, heating, humidity, CO₂ and battery.

By default the fill uses the height-based coloring of the line (horizontal bands). With `fill_gradient: time`, every point in time gets the color of its value (vertical bands), so you can see at a glance *when* a threshold was exceeded.

### Day & night

```yaml
day_night: true          # night over the full card height, soft twilight
stars: true              # starry sky (twinkles, off with reduce motion)
sun_times: true          # sunrise / sunset markers
# optional
dawn_color: "#ff8a3d"    # morning glow
dusk_color: "#d9467a"    # evening glow
day_color: "#ffd27a"     # tint for the day
stars_twinkle: 70
```

The sun's altitude is computed in the browser from the latitude and longitude of your Home Assistant installation, so this needs **no request at all** and also works without the `sun` integration. The sky is drawn in three layers:
- the **night**, complete at nautical dusk
- the **morning or evening glow** around the horizon. The card knows whether the sun is rising or setting.
- an optional **day tint**

In a light theme, the night is a soft blue-grey with dark-blue stars. In a dark theme it is a deep blue with white stars.

### Event pins

```yaml
event_lines: true                             # dotted lines into the graph
events:
  - entity: binary_sensor.fireplace_burning   # state "on" is marked by default
    icon: mdi:fireplace
    name: Fireplace
  - entity: binary_sensor.window_living_room
    icon: mdi:window-open-variant
  - entity: climate.living_room
    state: heat                               # any state(s), e.g. [heat, cool]
    color: "#e2533f"
    line: false                               # no vertical line for this event
```

| Event option | Description |
|---|---|
| `entity` | Entity id |
| `state` | State(s) to mark, default `on`. Several as a list, or comma-separated in the editor. |
| `name` / `icon` / `color` | Overrides for tooltip, pin icon and colour |
| `line` | Vertical line for this event (overrides `event_lines`) |

Each event gets a pin with its icon at the start, a bar for its duration (an own lane per event) and a dotted guide line into the graph. Tapping a pin opens the entity, and the tooltip lists the events active at that time.

**Suitable entities:** anything with discrete states, for example `binary_sensor` (window, door, motion, smoke), `switch`, `input_boolean`, `light`, or `climate` / `water_heater` / appliance states such as `heat` or `running`. For "fireplace burning", a template binary sensor (temperature > 40 °C) works well. All event entities share **one** history subscription with only real state changes, so the extra load is small.

### Alert

```yaml
alert_style: glow          # glow | blink | static
alert_color: var(--red-color)
entities:
  - entity: sensor.boiler_temperature
    alert_above: 95
```

The glow is a layer above the card whose opacity is animated. Browsers run this on the GPU, so it costs almost no CPU, even on wall tablets. With *reduce motion*, the card glows steadily instead.

### Compact mode

```yaml
compact: true
tap_action:
  action: toggle-compact   # tap switches between compact and full mode
compact_icon: true
compact_names: true
compact_graph: true        # faint graph behind the values (loads the history)
```

Texts above the background graph get a soft halo in the card colour, so they stay readable.

## Performance

The card is built to put as little load as possible on Home Assistant and the browser:

- **Windows up to `statistics_threshold` (6 h):** one `history/stream` subscription with `minimal_response`, `no_attributes` and `significant_changes_only`. HA sends the history once and then only pushes new values. There is no polling.
- **Longer windows:** HA's **pre-aggregated long-term statistics** (5 min / hourly / daily) in one request, incl. min/max for the band. Raw history is only streamed for the minutes after the last statistics bucket. Entities without statistics fall back to raw history, and the editor warns you about that.
- **Shared per entity:** cards that show the same entity share one subscription, one statistics request and the in-memory cache. When switching views, only the gap since the card was last visible is loaded. The cache lives only in the open tab, so it never becomes stale.
- **Reconnects** (e.g. a tablet waking up) request only the gap, not the whole range.
- **Long-running dashboards:** old points are dropped regularly, so memory stays flat. Background tabs don't redraw.
- **Rendering:** about one point per pixel, time-weighted, in O(n). Redraws are throttled to the time one pixel represents. Header values update immediately.
- **Free extras:** day & night, min/max band, min/avg/max and the alert need no additional request. Event pins share one lightweight subscription.
- Hidden entities and compact mode (without background graph) load no history.
- **Loading in stages:** a flat line with a running glow, then the statistics preview, then the details.

## Troubleshooting

If a graph stays empty or shows "History could not be loaded":

1. Open the browser console (F12 → Console). The card logs failed requests there, together with HA's error message.
2. For details about every request, enable the debug output and reload the page:

   ```js
   localStorage.setItem("best-number-card-debug", "1")
   ```

   The card then logs each subscription and how many states HA sent back. Turn it off with `localStorage.removeItem("best-number-card-debug")`.
3. Check that the entity is recorded, i.e. not excluded in `recorder:`.

Day & night needs latitude and longitude in your HA configuration (*Settings → System → General*).

## Development

```bash
npm install
npm run build      # → dist/best-number-card.js
npm test
npm run watch
```

### Release

Releases are automatic. Every change to the card needs a new version (patch for fixes, minor for features), and a CI check enforces this. Bump `version` in `package.json`, run `npm run build` and commit, including `dist/`. When the change lands on `main`, the release workflow creates the GitHub release `vX.Y.Z` with `best-number-card.js` attached, and HACS then offers the update.
