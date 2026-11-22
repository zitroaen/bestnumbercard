import type { HomeAssistant } from "./types";

/**
 * Discrete state history for event pins (binary sensors, switches, …): ONE history/stream
 * subscription for all event entities, only real state changes, no attributes.
 */

export interface StateSeries {
  t: number[];
  s: string[];
}

export interface StateInterval {
  from: number;
  to: number;
  /** still active (to = window end) */
  open: boolean;
}

/** Periods in which the state is one of `targets` (case-insensitive), clipped to [start, end]. */
export function stateIntervals(data: StateSeries, targets: string[], start: number, end: number): StateInterval[] {
  const want = new Set(targets.map((x) => x.toLowerCase()));
  const out: StateInterval[] = [];
  let from: number | null = null;
  for (let i = 0; i < data.t.length; i++) {
    const on = want.has(String(data.s[i]).toLowerCase());
    if (on && from === null) from = data.t[i];
    else if (!on && from !== null) {
      out.push({ from, to: data.t[i], open: false });
      from = null;
    }
  }
  if (from !== null) out.push({ from, to: end, open: true });
  return out.filter((iv) => iv.to > start && iv.from < end);
}

const toMs = (x: unknown): number => (typeof x === "number" ? (x < 1e11 ? x * 1000 : x) : Date.parse(String(x)));

export class EventSource {
  private data = new Map<string, StateSeries>();
  private unsub?: () => Promise<void>;
  private timer?: number;
  private disposed = false;
  private scheduled = false;
  version = 0;

  constructor(
    private hass: HomeAssistant,
    private entities: string[],
    private hours: number,
    private onChange: () => void,
  ) {
    for (const e of entities) this.data.set(e, { t: [], s: [] });
  }

  series(entity: string): StateSeries {
    return this.data.get(entity) ?? { t: [], s: [] };
  }

  start(): void {
    if (!this.entities.length) return;
    const from = Date.now() - this.hours * 3_600_000;
    this.hass.connection
      .subscribeMessage<{ states?: Record<string, { s: string; lu?: number; lc?: number }[]> }>(
        (msg) => this.onMessage(msg),
        {
          type: "history/stream",
          entity_ids: this.entities,
          start_time: new Date(from).toISOString(),
          minimal_response: true,
          no_attributes: true,
          significant_changes_only: true,
        },
      )
      .then(
        (unsub) => {
          if (this.disposed) unsub().catch(() => undefined);
          else this.unsub = unsub;
        },
        (err) => console.warn("best-number-card: event history failed", err),
      );
    this.timer = window.setInterval(() => this.prune(), 10 * 60_000);
  }

  private onMessage(msg: { states?: Record<string, { s: string; lu?: number; lc?: number }[]> }): void {
    if (!msg?.states) return;
    let changed = false;
    for (const [eid, states] of Object.entries(msg.states)) {
      const d = this.data.get(eid);
      if (!d) continue;
      for (const st of states) {
        const t = toMs(st.lu ?? st.lc);
        if (!Number.isFinite(t)) continue;
        const n = d.t.length;
        if (n && t <= d.t[n - 1]) continue; // already known (resubscribe after a reconnect)
        if (n && d.s[n - 1] === st.s) continue;
        d.t.push(t);
        d.s.push(st.s);
        changed = true;
      }
    }
    if (changed) {
      this.version++;
      if (!this.scheduled) {
        this.scheduled = true;
        queueMicrotask(() => {
          this.scheduled = false;
          if (!this.disposed) this.onChange();
        });
      }
    }
  }

  /** drop states that ended before the window (keep the one valid at the window start) */
  private prune(): void {
    const from = Date.now() - this.hours * 3_600_000;
    for (const d of this.data.values()) {
      let i = 0;
      while (i + 1 < d.t.length && d.t[i + 1] <= from) i++;
      if (i > 0) {
        d.t.splice(0, i);
        d.s.splice(0, i);
      }
    }
  }

  dispose(): void {
    this.disposed = true;
    clearInterval(this.timer);
    this.unsub?.().catch(() => undefined);
  }
}
