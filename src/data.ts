import type { HomeAssistant, SeriesData } from "./types";

/**
 * Data loading strategy (designed to keep the load on Home Assistant minimal):
 *
 *  - Short windows (<= statistics_threshold): ONE `history/stream` subscription
 *    for all entities (minimal_response, no_attributes). HA sends the history once
 *    and afterwards only pushes new state changes – no polling.
 *  - Long windows: pre-aggregated long-term statistics (5 min / hour / day) via
 *    ONE `recorder/statistics_during_period` call, plus a `history/stream`
 *    subscription only for the short tail after the last statistics bucket.
 *    Entities without statistics (no state_class) fall back to raw history.
 *  - Everything is kept in an in-memory cache (per browser tab, per card setup).
 *    Switching dashboard views re-uses it and only fetches the gap since the card
 *    was last visible. A page reload simply starts fresh – nothing ever has to be
 *    cleared manually.
 */

export type StatPeriod = "5minute" | "hour" | "day";

const PERIOD_MS: Record<StatPeriod, number> = {
  "5minute": 5 * 60_000,
  hour: 3_600_000,
  day: 86_400_000,
};

export function choosePeriod(hours: number, configured?: string): StatPeriod {
  if (configured === "5minute" || configured === "hour" || configured === "day") return configured;
  if (hours <= 72) return "5minute";
  if (hours <= 24 * 60) return "hour";
  return "day";
}

class EntityStore {
  statT: number[] = [];
  statV: number[] = [];
  statsEnd = NaN; // end of the last statistics bucket
  rawT: number[] = [];
  rawV: number[] = [];
  /** raw data is complete from this time on … */
  rawFrom = NaN;
  /** … up to this time (NaN while a live subscription is running) */
  rawUntil = NaN;
  statsLoaded = false;
  version = 0;
  private memo?: { version: number; data: SeriesData };

  appendRaw(t: number, v: number): boolean {
    const n = this.rawT.length;
    if (n && t <= this.rawT[n - 1]) {
      // duplicate (resubscribe / start-time state) – only accept a changed value at the same time
      if (t === this.rawT[n - 1] && !Object.is(v, this.rawV[n - 1])) {
        this.rawV[n - 1] = v;
        this.version++;
        return true;
      }
      return false;
    }
    if (n && Object.is(v, this.rawV[n - 1])) return false; // unchanged value adds no information
    this.rawT.push(t);
    this.rawV.push(v);
    this.version++;
    return true;
  }

  /** Drop everything older than `from`, but keep one point before it (carry-forward). */
  prune(from: number): void {
    const cut = (t: number[], v: number[]) => {
      let i = lowerBound(t, from) - 1;
      if (i > 0) {
        t.splice(0, i);
        v.splice(0, i);
        this.version++;
      }
    };
    cut(this.statT, this.statV);
    cut(this.rawT, this.rawV);
  }

  /** Combined series: statistics up to `rawFrom`, raw history afterwards. */
  series(): SeriesData {
    if (this.memo?.version === this.version) return this.memo.data;
    let data: SeriesData;
    if (!this.statT.length) data = { t: this.rawT, v: this.rawV };
    else if (!this.rawT.length) data = { t: this.statT, v: this.statV };
    else {
      const k = Number.isFinite(this.rawFrom) ? lowerBound(this.statT, this.rawFrom) : this.statT.length;
      const r = lowerBound(this.rawT, k ? this.statT[k - 1] + 1 : -Infinity);
      data = {
        t: this.statT.slice(0, k).concat(this.rawT.slice(r)),
        v: this.statV.slice(0, k).concat(this.rawV.slice(r)),
      };
    }
    this.memo = { version: this.version, data };
    return data;
  }
}

const CACHE = new Map<string, EntityStore & { lastUsed?: number }>();
const MAX_CACHE_ENTRIES = 60;

function getStore(key: string): EntityStore {
  let store = CACHE.get(key);
  if (!store) {
    store = new EntityStore();
    CACHE.set(key, store);
    if (CACHE.size > MAX_CACHE_ENTRIES) {
      const oldest = [...CACHE.entries()].sort((a, b) => (a[1].lastUsed ?? 0) - (b[1].lastUsed ?? 0))[0];
      CACHE.delete(oldest[0]);
    }
  }
  store.lastUsed = Date.now();
  return store;
}

export function lowerBound(arr: number[], x: number): number {
  let lo = 0;
  let hi = arr.length;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (arr[mid] < x) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

const toNumber = (s: unknown): number => {
  if (typeof s === "number") return s;
  if (typeof s !== "string" || s === "") return NaN;
  const n = Number(s);
  return Number.isFinite(n) ? n : NaN;
};

const toMs = (x: unknown): number => (typeof x === "number" ? (x < 1e11 ? x * 1000 : x) : Date.parse(String(x)));

interface StreamMessage {
  states?: Record<string, { s: string; lu: number; lc?: number }[]>;
}

interface StatRow {
  start: number | string;
  end?: number | string;
  mean?: number | null;
  state?: number | null;
}

export interface DataSourceOptions {
  entities: string[];
  hoursToShow: number;
  statisticsThreshold: number;
  statisticsPeriod?: string;
  onChange: () => void;
}

export class DataSource {
  readonly entities: string[];
  readonly useStatistics: boolean;
  readonly period: StatPeriod;
  private stores = new Map<string, EntityStore>();
  private unsubs: Array<() => Promise<void>> = [];
  private timer?: number;
  private disposed = false;
  private changeScheduled = false;
  private pendingGroups = 0;
  /** true once statistics and the first history message of every subscription arrived */
  loaded = false;

  constructor(private hass: HomeAssistant, private opts: DataSourceOptions) {
    this.entities = [...new Set(opts.entities)];
    this.useStatistics = opts.hoursToShow > opts.statisticsThreshold;
    this.period = choosePeriod(opts.hoursToShow, opts.statisticsPeriod);
    const mode = this.useStatistics ? this.period : "raw";
    for (const e of this.entities) this.stores.set(e, getStore(`${e}|${opts.hoursToShow}|${mode}`));
  }

  get windowStart(): number {
    return Date.now() - this.opts.hoursToShow * 3_600_000;
  }

  setHass(hass: HomeAssistant): void {
    this.hass = hass;
  }

  series(entity: string): SeriesData | undefined {
    return this.stores.get(entity)?.series();
  }

  version(): number {
    let v = 0;
    for (const s of this.stores.values()) v += s.version;
    return v;
  }

  async start(): Promise<void> {
    const windowStart = this.windowStart;
    for (const s of this.stores.values()) s.prune(windowStart);

    if (this.useStatistics) {
      const missing = this.entities.filter((e) => !this.stores.get(e)!.statsLoaded);
      if (missing.length) {
        await this.loadStatistics(missing, windowStart);
        if (this.disposed) return;
      }
    }

    // group entities by the time from which raw history is needed
    const groups = new Map<number, string[]>();
    for (const e of this.entities) {
      const s = this.stores.get(e)!;
      let from: number;
      if (s.rawT.length || Number.isFinite(s.rawUntil)) {
        // resume after the last known point (the stream also delivers the state at `from`)
        from = Number.isFinite(s.rawUntil) ? s.rawUntil : s.rawT[s.rawT.length - 1];
      } else {
        from = Number.isFinite(s.statsEnd) ? s.statsEnd : windowStart;
        s.rawFrom = from;
      }
      from = Math.max(from, windowStart);
      // round down to the minute so that cards started at the same time share groups
      from = Math.floor(from / 60_000) * 60_000;
      const g = groups.get(from) ?? [];
      g.push(e);
      groups.set(from, g);
    }
    this.pendingGroups = groups.size;
    if (!groups.size) this.loaded = true;
    for (const [from, ents] of groups) this.subscribe(from, ents);

    if (this.useStatistics) {
      // periodically replace the growing raw tail by fresh statistics
      const every = Math.max(PERIOD_MS[this.period], 15 * 60_000);
      this.timer = window.setInterval(() => this.compact(), every);
    }
    this.notify();
  }

  private subscribe(from: number, entityIds: string[]): void {
    let first = true;
    const p = this.hass.connection.subscribeMessage<StreamMessage>((msg) => {
      if (first) {
        first = false;
        if (--this.pendingGroups <= 0) {
          this.loaded = true;
          this.notify();
        }
      }
      this.onStream(msg);
    }, {
      type: "history/stream",
      entity_ids: entityIds,
      start_time: new Date(from).toISOString(),
      minimal_response: true,
      no_attributes: true,
      significant_changes_only: false,
    });
    p.then(
      (unsub) => {
        if (this.disposed) unsub().catch(() => undefined);
        else this.unsubs.push(unsub);
      },
      (err) => {
        console.warn("best-number-card: history subscription failed", err);
        if (--this.pendingGroups <= 0) {
          this.loaded = true;
          this.notify();
        }
      },
    );
    for (const e of entityIds) this.stores.get(e)!.rawUntil = NaN;
  }

  private onStream(msg: StreamMessage): void {
    if (!msg?.states) return;
    let changed = false;
    for (const [eid, states] of Object.entries(msg.states)) {
      const store = this.stores.get(eid);
      if (!store) continue;
      for (const st of states) {
        const t = toMs(st.lu ?? st.lc);
        if (Number.isFinite(t)) changed = store.appendRaw(t, toNumber(st.s)) || changed;
      }
    }
    if (changed) this.notify();
  }

  private async fetchStatistics(ids: string[], start: number): Promise<Record<string, StatRow[]>> {
    return this.hass.callWS<Record<string, StatRow[]>>({
      type: "recorder/statistics_during_period",
      start_time: new Date(start).toISOString(),
      statistic_ids: ids,
      period: this.period,
      types: ["mean", "state"],
    });
  }

  private async loadStatistics(ids: string[], windowStart: number): Promise<void> {
    // align to the period so buckets are complete
    const start = Math.floor(windowStart / PERIOD_MS[this.period]) * PERIOD_MS[this.period];
    let result: Record<string, StatRow[]> = {};
    try {
      result = await this.fetchStatistics(ids, start);
    } catch (err) {
      console.warn("best-number-card: statistics unavailable, using history", err);
    }
    for (const e of ids) {
      this.applyStats(e, result[e]);
      this.stores.get(e)!.statsLoaded = true;
    }
  }

  private applyStats(entity: string, rows: StatRow[] | undefined): void {
    const s = this.stores.get(entity);
    if (!s || !rows?.length) return;
    const len = PERIOD_MS[this.period];
    for (const row of rows) {
      const t = toMs(row.start);
      if (!Number.isFinite(t) || (s.statT.length && t <= s.statT[s.statT.length - 1])) continue;
      const v = toNumber(row.mean ?? row.state ?? NaN);
      s.statT.push(t);
      s.statV.push(v);
      const end = row.end !== undefined ? toMs(row.end) : t + len;
      s.statsEnd = Number.isFinite(end) ? end : t + len;
    }
    s.version++;
  }

  /** Fetch only the new statistics buckets and drop the raw points they cover. */
  private async compact(): Promise<void> {
    const ids = this.entities.filter((e) => Number.isFinite(this.stores.get(e)!.statsEnd));
    if (!ids.length || document.visibilityState === "hidden") return;
    const from = Math.min(...ids.map((e) => this.stores.get(e)!.statsEnd));
    let result: Record<string, StatRow[]>;
    try {
      result = await this.fetchStatistics(ids, from);
    } catch {
      return;
    }
    if (this.disposed) return;
    for (const e of ids) {
      const s = this.stores.get(e)!;
      this.applyStats(e, result[e]);
      // keep raw data after the statistics; one point before as carry-forward
      const cut = lowerBound(s.rawT, s.statsEnd) - 1;
      if (cut > 0) {
        s.rawT.splice(0, cut);
        s.rawV.splice(0, cut);
      }
      s.rawFrom = s.statsEnd;
      s.prune(this.windowStart);
      s.version++;
    }
    this.notify();
  }

  private notify(): void {
    if (this.changeScheduled || this.disposed) return;
    this.changeScheduled = true;
    queueMicrotask(() => {
      this.changeScheduled = false;
      if (!this.disposed) this.opts.onChange();
    });
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    if (this.timer) clearInterval(this.timer);
    const now = Date.now();
    for (const s of this.stores.values()) if (!Number.isFinite(s.rawUntil)) s.rawUntil = now;
    for (const u of this.unsubs) u().catch(() => undefined);
    this.unsubs = [];
  }
}
