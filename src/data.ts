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

/** Debug output in the browser console: localStorage.setItem("best-number-card-debug", "1") */
const DEBUG = (() => {
  try {
    return globalThis.localStorage?.getItem("best-number-card-debug") === "1";
  } catch {
    return false;
  }
})();
const debug = (...args: unknown[]) => DEBUG && console.info("[best-number-card]", ...args);

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
  statLo: number[] = [];
  statHi: number[] = [];
  statsEnd = NaN; // end of the last statistics bucket
  rawT: number[] = [];
  rawV: number[] = [];
  /** raw data is complete from this time on … */
  rawFrom = NaN;
  /** … up to this time (NaN while a live subscription is running) */
  rawUntil = NaN;
  statsLoaded = false;
  statsLoading?: Promise<void>;
  /** detail store: the full raw history replaces the statistics preview once it has arrived */
  preferRaw = false;
  /** last error of the history subscription (shown in the card instead of "no data") */
  error?: string;
  /** start of a subscription whose first answer has not arrived yet */
  pendingFrom?: number;

  /** Remember up to where the data is complete when the live subscription stops. */
  stopLive(now: number): void {
    this.live = false;
    // if the answer was still outstanding, nothing after `pendingFrom` is known yet
    if (this.pendingFrom !== undefined) this.rawUntil = this.pendingFrom;
    else if (!Number.isFinite(this.rawUntil)) this.rawUntil = now;
    this.pendingFrom = undefined;
  }
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
    const i = lowerBound(this.statT, from) - 1;
    if (i > 0) {
      this.statLo.splice(0, i);
      this.statHi.splice(0, i);
    }
    cut(this.statT, this.statV);
    cut(this.rawT, this.rawV);
  }

  /** Combined series: statistics up to `rawFrom`, raw history afterwards. */
  series(): SeriesData {
    if (this.memo?.version === this.version) return this.memo.data;
    let data: SeriesData;
    if (this.preferRaw) {
      // statistics are only a quick preview until the detailed history is there
      // … and stays if the raw history came back empty (never worse than without details)
      data = (this.rawLoaded && this.rawT.length) || !this.statT.length
        ? { t: this.rawT, v: this.rawV }
        : { t: this.statT, v: this.statV, lo: this.statLo, hi: this.statHi };
    } else if (!this.statT.length) data = { t: this.rawT, v: this.rawV };
    else if (!this.rawT.length) data = { t: this.statT, v: this.statV, lo: this.statLo, hi: this.statHi };
    else {
      // statistics buckets that start before the raw data begins, raw data from there on
      const k = Number.isFinite(this.rawFrom) ? lowerBound(this.statT, this.rawFrom) : this.statT.length;
      const rawStart = k ? lowerBound(this.rawT, Number.isFinite(this.rawFrom) ? this.rawFrom : this.statT[k - 1] + 1) : 0;
      const rawV = this.rawV.slice(rawStart);
      data = {
        t: this.statT.slice(0, k).concat(this.rawT.slice(rawStart)),
        v: this.statV.slice(0, k).concat(rawV),
        lo: this.statLo.slice(0, k).concat(rawV),
        hi: this.statHi.slice(0, k).concat(rawV),
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

/** A series is an entity's state ("sensor.x") or one of its attributes ("climate.y::temperature"). */
export const seriesId = (entity: string, attribute?: string) => (attribute ? `${entity}::${attribute}` : entity);
const entityOf = (sid: string) => sid.split("::")[0];
const attributeOf = (sid: string): string | undefined => sid.split("::")[1];

interface StreamMessage {
  states?: Record<string, { s: string; a?: Record<string, unknown>; lu?: number; lc?: number }[]>;
}

interface StatRow {
  start: number | string;
  end?: number | string;
  mean?: number | null;
  min?: number | null;
  max?: number | null;
  state?: number | null;
}

export interface DataSourceOptions {
  /** series ids, see `seriesId()` */
  entities: string[];
  hoursToShow: number;
  statisticsThreshold: number;
  statisticsPeriod?: string;
  /** series that always load the full raw history (statistics only as a quick preview) */
  detail?: string[];
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
    this.detail = new Set(opts.detail ?? []);
    for (const e of this.entities) {
      // attributes have no long-term statistics
      const mode = this.statsFor(e) ? this.period : this.previewFor(e) ? "detail" : "raw";
      const store = getStore(`${e}|${opts.hoursToShow}|${mode}`);
      store.preferRaw = mode === "detail";
      this.stores.set(e, store);
    }
  }

  private readonly detail: Set<string>;

  /** statistics + short raw tail */
  private statsFor(sid: string): boolean {
    return this.useStatistics && !attributeOf(sid) && !this.detail.has(sid);
  }

  /** full raw history, with statistics as a quick preview while it loads */
  private previewFor(sid: string): boolean {
    return this.useStatistics && !attributeOf(sid) && this.detail.has(sid);
  }

  get windowStart(): number {
    return Date.now() - this.opts.hoursToShow * 3_600_000;
  }

  /** true once statistics and the first history message for every entity are there */
  get loaded(): boolean {
    for (const [sid, s] of this.stores) {
      if (this.statsFor(sid) && !s.statsLoaded) return false;
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

  /** errors of the history subscriptions, e.g. "sensor.x: Timeout" */
  errors(): string[] {
    const out: string[] = [];
    for (const [sid, s] of this.stores) if (s.error) out.push(`${sid}: ${s.error}`);
    return out;
  }

  async start(): Promise<void> {
    const windowStart = this.windowStart;
    for (const s of this.stores.values()) {
      s.subscribers.add(this);
      s.prune(windowStart);
    }
    this.listenToConnection();

    // detail series: show the (fast) statistics as a preview, don't wait for them
    const preview = this.entities.filter((e) => {
      const st = this.stores.get(e)!;
      return this.previewFor(e) && !st.statsLoaded && !st.statsLoading && !st.rawLoaded;
    });
    if (preview.length) {
      const p = this.loadStatistics(preview, windowStart).then(() => {
        for (const e of preview) this.stores.get(e)!.notifySubscribers();
      });
      for (const e of preview) this.stores.get(e)!.statsLoading = p;
    }

    if (this.useStatistics) {
      const waits: Promise<void>[] = [];
      const missing: string[] = [];
      for (const e of this.entities) {
        const s = this.stores.get(e)!;
        if (!this.statsFor(e) || s.statsLoaded) continue;
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
      if (s.owner === this && s.live) return false; // already adopted while we were starting
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
    const groups = new Map<string, string[]>();
    for (const e of entities) {
      const s = this.stores.get(e)!;
      let from: number;
      if (s.rawT.length || Number.isFinite(s.rawUntil)) {
        // resume after the last known point (the stream also delivers the state at `from`)
        from = Number.isFinite(s.rawUntil) ? s.rawUntil : s.rawT[s.rawT.length - 1];
      } else {
        from = Number.isFinite(s.statsEnd) && !s.preferRaw ? s.statsEnd : windowStart;
        s.rawFrom = from;
      }
      // round down to the minute so that cards started at the same time share groups
      from = floorMinute(Math.max(from, windowStart));
      const key = `${from}|${attributeOf(e) ? "a" : "s"}`;
      const g = groups.get(key) ?? [];
      g.push(e);
      groups.set(key, g);
    }
    for (const [key, ents] of groups) this.subscribe(Number(key.split("|")[0]), ents, key.endsWith("|a"));
  }

  private subscribe(from: number, entityIds: string[], attributes = false): void {
    const sub: { entities: string[]; unsub?: () => Promise<void> } = { entities: entityIds };
    this.subs.push(sub);
    let first = true;
    for (const e of entityIds) {
      const s = this.stores.get(e)!;
      s.rawUntil = NaN;
      s.pendingFrom = from;
      s.live = true;
      s.rawLoaded = s.rawLoaded && s.rawT.length > 0;
    }
    const request = {
      entities: entityIds,
      from: new Date(from).toISOString(),
      attributes,
    };
    debug("subscribe history/stream", request);
    const markLoaded = () => {
      if (!first) return;
      first = false;
      for (const e of entityIds) {
        const s = this.stores.get(e)!;
        s.pendingFrom = undefined;
        s.rawLoaded = true;
        s.version++; // a detail store switches from the preview to the raw history
        s.notifySubscribers();
      }
    };
    this.hass.connection
      .subscribeMessage<StreamMessage>(
        (msg) => {
          if (DEBUG) {
            const counts = Object.fromEntries(Object.entries(msg?.states ?? {}).map(([k, v]) => [k, v.length]));
            debug(first ? "history (initial)" : "history (update)", counts, request);
          }
          markLoaded();
          this.onStream(msg, entityIds);
        },
        attributes
          ? {
              // attributes need the full states (heavier – only used for attribute series)
              type: "history/stream",
              entity_ids: [...new Set(entityIds.map(entityOf))],
              start_time: new Date(from).toISOString(),
              minimal_response: false,
              no_attributes: false,
              significant_changes_only: false,
            }
          : {
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
          for (const e of entityIds) this.stores.get(e)!.error = undefined;
          if (this.disposed || !this.subs.includes(sub)) unsub().catch(() => undefined);
          else sub.unsub = unsub;
        },
        (err) => {
          const text = err?.message ?? err?.code ?? String(err);
          console.warn("best-number-card: history subscription failed", request, err);
          for (const e of entityIds) {
            const st = this.stores.get(e)!;
            st.live = false;
            st.error = String(text);
          }
          markLoaded();
        },
      );
  }

  private onStream(msg: StreamMessage, sids: string[]): void {
    if (!msg?.states) return;
    for (const sid of sids) {
      const states = msg.states[entityOf(sid)];
      const store = this.stores.get(sid);
      if (!states || !store) continue;
      const attr = attributeOf(sid);
      let changed = false;
      for (const st of states) {
        const t = toMs(st.lu ?? st.lc);
        if (!Number.isFinite(t)) continue;
        if (attr && !st.a) continue; // no attributes in this message – keep the previous value
        const v = attr ? toNumber(st.a![attr]) : toNumber(st.s);
        changed = store.appendRaw(t, v) || changed;
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
      s.stopLive(now);
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
      types: ["mean", "min", "max", "state"],
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
    debug("statistics", this.period, Object.fromEntries(ids.map((id) => [id, result[id]?.length ?? 0])));
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
      // HA creates no statistics rows while a sensor is unavailable → mark the gap
      if (s.statT.length && Number.isFinite(s.statsEnd) && t > s.statsEnd) {
        s.statT.push(s.statsEnd);
        s.statV.push(NaN);
        s.statLo.push(NaN);
        s.statHi.push(NaN);
      }
      const v = toNumber(row.mean ?? row.state ?? NaN);
      s.statT.push(t);
      s.statV.push(v);
      s.statLo.push(row.min != null ? toNumber(row.min) : v);
      s.statHi.push(row.max != null ? toNumber(row.max) : v);
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
      return s.owner === this && this.statsFor(e) && Number.isFinite(s.statsEnd);
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
      s.stopLive(now);
      if (s.subscribers.size) handOver.push([e, s]);
    }
    for (const sub of this.subs) sub.unsub?.().catch(() => undefined);
    this.subs = [];
    // other cards still show these entities: one of them continues the live subscription.
    // Deferred, so that cards removed together (view change, editor rebuild) don't hand over to each other.
    if (handOver.length) {
      queueMicrotask(() => {
        for (const [e, s] of handOver) if (!s.owner) [...s.subscribers][0]?.adopt(e);
      });
    }
  }

  /** @internal */
  get isDisposed(): boolean {
    return this.disposed;
  }
}
