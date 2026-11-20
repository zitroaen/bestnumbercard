<p align="center"><img src="https://raw.githubusercontent.com/zitroaen/bestnumbercard/main/docs/icon.png" width="128" alt="Best Number Card icon"></p>

# Best Number Card

A Home Assistant dashboard card that looks and behaves like the built-in **sensor card**, with these additions:

![Best Number Card](https://raw.githubusercontent.com/zitroaen/bestnumbercard/main/docs/screenshot.png)

- **Multiple entities** in one card, each with its own line
- **Color scales per series**: gradients, hard steps, or both (e.g. gradient up to 95 °C, then a jump to dark red)
- **Separate y-axes** (scale groups) for series with different units or ranges
- **Labels at the end of each line** (current value and/or icon) that move with the latest value
- **Hide entities depending on their value**. A hidden entity is not shown and its history is not loaded at all.
- **Compact mode**: values only, minimal height, no history loaded. It can be the default, or you can toggle it by tapping the card.
- **Tooltip** on hover
- **Visual editor** in English and German. The language follows your Home Assistant language.
- **Very light on your system**, even for long windows of dense data (see [Performance](#performance))

## Installation

### HACS (recommended)

1. HACS → ⋮ → *Custom repositories* → add `https://github.com/zitroaen/bestnumbercard`, category **Dashboard**.
2. Install **Best Number Card**.
3. Reload the browser.

HACS registers the dashboard resource for you. It adds a `?hacstag=…` version parameter to the resource URL, so after every update the browser loads the new version automatically. **You never have to clear any cache.** A normal reload of the page is enough. The card writes its version to the browser console (`BEST-NUMBER-CARD vX.Y.Z`), so you can check which version is running.

### Manual

Copy `dist/best-number-card.js` to `<config>/www/` and add the resource `/local/best-number-card.js?v=0.1.0` (type *JavaScript module*). Increase `?v=` with every update.

## Configuration

Everything can be configured in the visual editor. YAML example:

```yaml
type: custom:best-number-card
name: Heating
hours_to_show: 24
end_labels: icon_value
entities:
  - entity: sensor.boiler_temperature
    color_scale:
      - { value: 20, color: blue }
      - { value: 95, color: orange }   # gradient blue → orange …
      - { value: 95, color: darkred }  # … hard jump at 95
  - entity: sensor.outdoor_temperature
    scale: outdoor                     # own y-axis
    color_scale:                       # green below 0, red otherwise
      - { value: 0, color: green }
      - { value: 0, color: red }
  - entity: sensor.fireplace_temperature
    hide_below: 40                     # hidden and not loaded while < 40
```

### Card options

| Option | Default | Description |
|---|---|---|
| `entities` | – | List of entity ids or entity objects (see below) |
| `name` / `icon` | entity's | Header name and icon |
| `graph` | `line` | `line` or `none` |
| `detail` | `1` | `1` = smooth average, `2` = high detail, keeps every peak (min/max per pixel) |
| `hours_to_show` | `24` | Time window |
| `height` | auto | Graph height in px |
| `limits` | – | `{min, max}` for all scales (like the sensor card) |
| `smoothing` | `true` | Smooth curves |
| `fill_gradient` | `value` | Default for all entities, see `fill_gradient` below |
| `value_display` | `primary` (1 entity) / `all` | `primary` = like the sensor card, `all` = all values, `none` |
| `legend_icon` | `dot` | Marker next to the values: `dot`, `icon`, `none` |
| `end_labels` | `none` | Label at the end of each line: `none`, `value`, `icon`, `icon_value` |
| `tooltip` | `true` | Tooltip on hover |
| `compact` | `false` | Start in compact mode |
| `statistics_threshold` | `6` | Use long-term statistics if `hours_to_show` is larger than this |
| `statistics_period` | `auto` | `auto`, `5minute`, `hour`, `day` |
| `theme` | – | Theme for this card |
| `tap_action` | `more-info` | Standard HA actions, plus `toggle-compact` |
| `hold_action` / `double_tap_action` | – | Standard HA actions, plus `toggle-compact` |

When the tap action is `more-info`, tapping a value opens that value's entity.

### Entity options

| Option | Description |
|---|---|
| `entity` | Entity id |
| `name`, `icon`, `unit` | Overrides |
| `decimals` | Number of decimals (default: the entity's display precision) |
| `color` | Line color without a color scale (any CSS color, also `var(--red-color)`) |
| `color_scale` | List of `{value, color}` stops |
| `color_scale_mode` | `gradient` (default) or `step` |
| `scale` | Scale group. Series with the same name share a y-axis (default: all share one) |
| `min` / `max` | Fixed limits for this series' scale |
| `fill` | Fill the area under the line (default: only with a single series) |
| `fill_gradient` | How the color scale colors the fill: `value` = by height (horizontal color bands), `time` = each point in time gets the color of its value (vertical color bands) |
| `line_width` | Line width in px |
| `show_value` / `show_graph` | Show this entity in the header / in the graph |
| `hide_below` / `hide_above` | Hide the entity completely while its value is below / above this value |
| `hide_unavailable` | Hide the entity while it is unavailable |

#### Color scales

The stops are sorted by value. The color applies to the line, the fill area, the value and the marker.

- **gradient**: colors are interpolated between neighbouring stops. Two stops with the **same value** form a hard jump, just like in CSS gradients.
- **step**: each stop's color applies from its value upwards. The first color also applies below the first stop.

Below the first stop and above the last stop, the first and last color are used.

By default the fill area uses the same height-based coloring as the line, which gives horizontal color bands. With `fill_gradient: time`, the fill below the line is colored along the time axis instead, so you can see at a glance *when* a threshold was exceeded.

## Performance

The card is built to put as little load as possible on Home Assistant and the browser:

- **Windows up to `statistics_threshold` (6 h):** a single `history/stream` subscription for all entities, with `minimal_response` and `no_attributes`. Home Assistant sends the history once and then only pushes new values. There is no polling.
- **Longer windows:** the card uses Home Assistant's **pre-aggregated long-term statistics** (5 min / hourly / daily), fetched in one request. Raw history is only streamed for the few minutes after the last statistics bucket. Entities without statistics (no `state_class`) automatically fall back to raw history.
- **In-memory cache per entity:** when you switch dashboard views or open the same entity in several cards, nothing is fetched twice. Only the gap since the card was last visible is loaded. The cache lives only in the open browser tab, so it can never become stale across updates.
- **Rendering:** data is aggregated to about one point per pixel in O(n), with time-weighted means and no lost peaks in `detail: 2`. Redraws are throttled to the time span one pixel represents, so even very dense sensors do not cause constant redraws. Header values update immediately.
- Hidden entities and cards in compact mode do not load any history.

## Development

```bash
npm install
npm run build      # → dist/best-number-card.js
npm test
npm run watch
```

### Release

Releases are automatic. Bump `version` in `package.json`, run `npm run build` and commit, including `dist/`. When the change lands on `main`, the release workflow creates the GitHub release `vX.Y.Z` with `best-number-card.js` attached, and HACS then offers the update. You can also start the workflow by hand under *Actions → Release → Run workflow*.
