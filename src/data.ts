import type { HomeAssistant, SeriesData } from "./types";

/**
 * Data loading strategy (designed to keep the load on Home Assistant minimal):
 *
 *  - Short windows (<= statistics_threshold): `history/stream` subscriptions
 *    (minimal_response, no_attributes, significant changes only). HA sends the history
 *    once and afterwards only pushes new state changes – no polling.
 *  - Long windows: pre-aggregated long-term statistics (5 min / hour / day) via
 *    ONE `recorder/statistics_during_period` call, plus a `history/stream`
 *    subscription only for the short tail after the last statistics bucket.
 *    Entities without statistics (no state_class) fall back to raw history.
 *  - Data lives in an in-memory store per entity (and time window). Cards showing the
 *    same entity share the store AND the live subscription. Switching dashboard views
 *    only fetches the gap since the card was last visible; after a lost connection only
 *    the gap is fetched as well. A page reload simply starts fresh – nothing ever has to
 *    be cleared manually.
 */

export type StatPeriod = "5minute" | "hour" | "day";

const PERIOD_MS: Record<StatPeriod, number> = {
  "5minute": 5 * 60_000,
  hour: 3_600_000,
  day: 86_400_000,
};

/** How often old points are dropped from the stores (keeps memory flat on wall tablets). */
const MAINTENANCE_MS = 10 * 60_000;

export function choosePeriod(hours: number, configured?: string): StatPeriod {
  if (configured === "5minute" || configured === "hour" || configured === "day") return configured;
  if (hours <= 72) return "5minute";
  if (hours <= 24 * 60) return "hour";
  return "day";
}

export class EntityStore {
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
  statsLoading?: Promise<void>;
  /** the first history message of the current subscription has arrived (or it failed) */
  rawLoaded = false;
  version = 0;
  lastUsed = 0;
  /** data sources showing this store */
  readonly subscribers = new Set<DataSource>();
  /** the data source that holds the live subscription for this store */
  owner?: DataSource;
  /** the owner's subscription is currently active */
  live = false;
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
      const i = lowerBound(t, from) - 1;
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
      // statistics buckets that start before the raw data begins, raw data from there on
      const k = Number.isFinite(this.rawFrom) ? lowerBound(this.statT, this.rawFrom) : this.statT.length;
      const rawStart = k ? lowerBound(this.rawT, Number.isFinite(this.rawFrom) ? this.rawFrom : this.statT[k - 1] + 1) : 0;
      data = {
        t: this.statT.slice(0, k).concat(this.rawT.slice(rawStart)),
        v: this.statV.slice(0, k).concat(this.rawV.slice(rawStart)),
      };
    }
    this.memo = { version: this.version, data };
    return data;
  }

  /** Tell every card that shows this store that the data changed. */
  notifySubscribers(): void {
    for (const ds of this.subscribers) ds.notify();
  }
}

const CACHE = new Map<string, EntityStore>();
const MAX_CACHE_ENTRIES = 60;

export function getStore(key: string): EntityStore {
  let store = CACHE.get(key);
  if (!store) {
    store = new EntityStore();
    CACHE.set(key, store);
    if (CACHE.size > MAX_CACHE_ENTRIES) {
      // evict the least recently used store that no card is showing right now
      const candidates = [...CACHE.entries()].filter(([, s]) => !s.subscribers.size);
      const oldest = candidates.sort((a, b) => a[1].lastUsed - b[1].lastUsed)[0];
      if (oldest) CACHE.delete(oldest[0]);
    }
  }
  store.lastUsed = Date.now();
  return store;
}

/** Only for tests. */
export function clearCache(): void {
  CACHE.clear();
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

const floorMinute = (t: number) => Math.floor(t / 60_000) * 60_000;

interface StreamMessage {
  states?: Record<string, { s: string; lu?: number; lc?: number }[]>;
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
  private subs: Array<{ entities: string[]; unsub?: () => Promise<void> }> = [];
  private timers: number[] = [];
  private disposed = false;
  private changeScheduled = false;
  private wasDisconnected = false;
  private conn?: HomeAssistant["connection"];

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

  /** true once statistics and the first history message for every entity are there */
  get loaded(): boolean {
    for (const s of this.stores.values()) {
      if (this.useStatistics && !s.statsLoaded) return false;
      if (!s.rawLoaded) return false;
    }
    return true;
  }

  setHass(hass: HomeAssistant): void {
    this.hass = hass;
  }

  series(entity: string): SeriesData | undefined {
    return this.stores.get(entity)?.series();
  }

  async start(): Promise<void> {
    const windowStart = this.windowStart;
    for (const s of this.stores.values()) {
      s.subscribers.add(this);
      s.prune(windowStart);
    }
    this.listenToConnection();

    if (this.useStatistics) {
      const waits: Promise<void>[] = [];
      const missing: string[] = [];
      for (const e of this.entities) {
        const s = this.stores.get(e)!;
        if (s.statsLoaded) continue;
        if (s.statsLoading) waits.push(s.statsLoading);
        else missing.push(e);
      }
      if (missing.length) {
        const p = this.loadStatistics(missing, windowStart);
        for (const e of missing) this.stores.get(e)!.statsLoading = p;
        waits.push(p);
      }
      if (waits.length) {
        await Promise.all(waits);
        if (this.disposed) return;
      }
    }

    // take over every store that has no live subscription yet; others are shared
    const own = this.entities.filter((e) => {
      const s = this.stores.get(e)!;
      if (s.owner && s.owner !== this && !s.owner.isDisposed) return false;
      s.owner = this;
      return true;
    });
    this.subscribeGrouped(own, windowStart);

    // periodically drop old points, and replace the growing raw tail by fresh statistics
    this.timers.push(window.setInterval(() => this.maintain(), MAINTENANCE_MS));
    if (this.useStatistics) {
      const every = Math.max(PERIOD_MS[this.period], 15 * 60_000);
      this.timers.push(window.setInterval(() => this.compact(), every));
    }
    this.notify();
  }

  /** Subscribe the given (owned) entities, grouped by the time from which data is missing. */
  private subscribeGrouped(entities: string[], windowStart = this.windowStart): void {
    const groups = new Map<number, string[]>();
    for (const e of entities) {
      const s = this.stores.get(e)!;
      let from: number;
      if (s.rawT.length || Number.isFinite(s.rawUntil)) {
        // resume after the last known point (the stream also delivers the state at `from`)
        from = Number.isFinite(s.rawUntil) ? s.rawUntil : s.rawT[s.rawT.length - 1];
      } else {
        from = Number.isFinite(s.statsEnd) ? s.statsEnd : windowStart;
        s.rawFrom = from;
      }
      // round down to the minute so that cards started at the same time share groups
      from = floorMinute(Math.max(from, windowStart));
      const g = groups.get(from) ?? [];
      g.push(e);
      groups.set(from, g);
    }
    for (const [from, ents] of groups) this.subscribe(from, ents);
  }

  private subscribe(from: number, entityIds: string[]): void {
    const sub: { entities: string[]; unsub?: () => Promise<void> } = { entities: entityIds };
    this.subs.push(sub);
    let first = true;
    for (const e of entityIds) {
      const s = this.stores.get(e)!;
      s.rawUntil = NaN;
      s.live = true;
      s.rawLoaded = s.rawLoaded && s.rawT.length > 0;
    }
    const markLoaded = () => {
      if (!first) return;
      first = false;
      for (const e of entityIds) {
        const s = this.stores.get(e)!;
        s.rawLoaded = true;
        s.notifySubscribers();
      }
    };
    this.hass.connection
      .subscribeMessage<StreamMessage>(
        (msg) => {
          markLoaded();
          this.onStream(msg);
        },
        {
          type: "history/stream",
          entity_ids: entityIds,
          start_time: new Date(from).toISOString(),
          minimal_response: true,
          no_attributes: true,
          // only real state changes – attribute-only updates are filtered out by HA already
          significant_changes_only: true,
        },
        // we resubscribe ourselves after a reconnect, asking only for the gap
        { resubscribe: false },
      )
      .then(
        (unsub) => {
          if (this.disposed || !this.subs.includes(sub)) unsub().catch(() => undefined);
          else sub.unsub = unsub;
        },
        (err) => {
          console.warn("best-number-card: history subscription failed", err);
          for (const e of entityIds) this.stores.get(e)!.live = false;
          markLoaded();
        },
      );
  }

  private onStream(msg: StreamMessage): void {
    if (!msg?.states) return;
    for (const [eid, states] of Object.entries(msg.states)) {
      const store = this.stores.get(eid);
      if (!store) continue;
      let changed = false;
      for (const st of states) {
        const t = toMs(st.lu ?? st.lc);
        if (Number.isFinite(t)) changed = store.appendRaw(t, toNumber(st.s)) || changed;
      }
      if (changed) store.notifySubscribers();
    }
  }

  // ------------------------------------------------------------- connection handling

  private onDisconnected = () => {
    this.wasDisconnected = true;
    const now = Date.now();
    for (const s of this.stores.values()) {
      if (s.owner !== this) continue;
      s.live = false;
      if (!Number.isFinite(s.rawUntil)) s.rawUntil = now;
    }
    // the subscriptions are gone with the connection
    this.subs = [];
  };

  private onReady = () => {
    if (!this.wasDisconnected || this.disposed) return;
    this.wasDisconnected = false;
    this.subscribeGrouped(this.entities.filter((e) => this.stores.get(e)!.owner === this && !this.stores.get(e)!.live));
  };

  private listenToConnection(): void {
    const conn = this.hass.connection;
    if (typeof conn?.addEventListener !== "function") return;
    this.conn = conn;
    conn.addEventListener("disconnected", this.onDisconnected);
    conn.addEventListener("ready", this.onReady);
  }

  /** Another card that held the live subscription for this entity went away – take over. */
  adopt(entity: string): void {
    const s = this.stores.get(entity);
    if (this.disposed || !s || (s.owner && !s.owner.isDisposed)) return;
    s.owner = this;
    this.subscribeGrouped([entity]);
  }

  // ------------------------------------------------------------- statistics

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
      result = (await this.fetchStatistics(ids, start)) ?? {};
    } catch (err) {
      console.warn("best-number-card: statistics unavailable, using history", err);
    }
    for (const e of ids) {
      const s = this.stores.get(e)!;
      this.applyStats(s, result[e]);
      s.statsLoaded = true;
      s.statsLoading = undefined;
    }
  }

  private applyStats(s: EntityStore, rows: StatRow[] | undefined): void {
    if (!rows?.length) return;
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
    // only the owner compacts, so a shared store is not fetched twice
    const ids = this.entities.filter((e) => {
      const s = this.stores.get(e)!;
      return s.owner === this && Number.isFinite(s.statsEnd);
    });
    if (!ids.length || document.visibilityState === "hidden") return;
    const from = Math.min(...ids.map((e) => this.stores.get(e)!.statsEnd));
    let result: Record<string, StatRow[]>;
    try {
      result = (await this.fetchStatistics(ids, from)) ?? {};
    } catch {
      return;
    }
    if (this.disposed) return;
    for (const e of ids) {
      const s = this.stores.get(e)!;
      this.applyStats(s, result[e]);
      // keep raw data after the statistics; one point before as carry-forward
      const cut = lowerBound(s.rawT, s.statsEnd) - 1;
      if (cut > 0) {
        s.rawT.splice(0, cut);
        s.rawV.splice(0, cut);
      }
      s.rawFrom = s.statsEnd;
      s.prune(this.windowStart);
      s.version++;
      s.notifySubscribers();
    }
  }

  /** Drop points that scrolled out of the window – memory stays flat even after days. */
  maintain(): void {
    const from = this.windowStart;
    for (const s of this.stores.values()) if (s.owner === this) s.prune(from);
  }

  notify(): void {
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
    for (const t of this.timers) clearInterval(t);
    this.timers = [];
    if (this.conn?.removeEventListener) {
      this.conn.removeEventListener("disconnected", this.onDisconnected);
      this.conn.removeEventListener("ready", this.onReady);
    }
    const now = Date.now();
    const handOver: Array<[string, EntityStore]> = [];
    for (const [e, s] of this.stores) {
      s.subscribers.delete(this);
      if (s.owner !== this) continue;
      s.owner = undefined;
      s.live = false;
      if (!Number.isFinite(s.rawUntil)) s.rawUntil = now;
      if (s.subscribers.size) handOver.push([e, s]);
    }
    for (const sub of this.subs) sub.unsub?.().catch(() => undefined);
    this.subs = [];
    // other cards still show these entities: one of them continues the live subscription
    for (const [e, s] of handOver) [...s.subscribers][0]?.adopt(e);
  }

  /** @internal */
  get isDisposed(): boolean {
    return this.disposed;
  }
}
