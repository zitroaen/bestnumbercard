/**
 * Sun position – computed locally from latitude / longitude (no request to Home Assistant).
 * Accuracy is well below a degree, i.e. a few minutes for sunrise / sunset – plenty for a graph.
 */

const RAD = Math.PI / 180;

/** Solar altitude in degrees at time `t` (ms) for the given position. */
export function solarAltitude(t: number, lat: number, lon: number): number {
  const d = t / 86_400_000 + 2440587.5 - 2451545.0; // days since J2000
  const g = (357.529 + 0.98560028 * d) * RAD; // mean anomaly
  const q = 280.459 + 0.98564736 * d; // mean longitude
  const L = (q + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g)) * RAD; // ecliptic longitude
  const e = (23.439 - 0.00000036 * d) * RAD; // obliquity
  const ra = Math.atan2(Math.cos(e) * Math.sin(L), Math.cos(L));
  const dec = Math.asin(Math.sin(e) * Math.sin(L));
  const gmst = (18.697374558 + 24.06570982441908 * d) % 24; // hours
  const ha = ((gmst * 15 + lon) * RAD - ra); // hour angle
  const phi = lat * RAD;
  return Math.asin(Math.sin(phi) * Math.sin(dec) + Math.cos(phi) * Math.cos(dec) * Math.cos(ha)) / RAD;
}

/** Sunrise / sunset (upper limb incl. refraction) */
export const HORIZON = -0.833;
/** Darkness is complete at nautical dusk */
export const DARK = -12;

/** 0 = day … 1 = night, smooth in the twilight between HORIZON and DARK. */
export function darkness(altitude: number): number {
  if (altitude >= HORIZON) return 0;
  if (altitude <= DARK) return 1;
  const f = (HORIZON - altitude) / (HORIZON - DARK);
  return f * f * (3 - 2 * f); // smoothstep: soft twilight
}

export interface SunEvent {
  t: number;
  type: "rise" | "set";
}

/** Sunrises and sunsets between `start` and `end` (found by sampling, then refined). */
export function sunEvents(start: number, end: number, lat: number, lon: number): SunEvent[] {
  const step = 10 * 60_000;
  const out: SunEvent[] = [];
  let tPrev = start;
  let aPrev = solarAltitude(tPrev, lat, lon) - HORIZON;
  for (let t = start + step; t <= end + step; t += step) {
    const tt = Math.min(t, end);
    const a = solarAltitude(tt, lat, lon) - HORIZON;
    if ((aPrev < 0) !== (a < 0)) {
      // bisection to ~10 s
      let lo = tPrev;
      let hi = tt;
      let alo = aPrev;
      for (let i = 0; i < 6; i++) {
        const mid = (lo + hi) / 2;
        const am = solarAltitude(mid, lat, lon) - HORIZON;
        if ((alo < 0) === (am < 0)) {
          lo = mid;
          alo = am;
        } else hi = mid;
      }
      out.push({ t: Math.round((lo + hi) / 2), type: a > 0 ? "rise" : "set" });
    }
    tPrev = tt;
    aPrev = a;
    if (tt >= end) break;
  }
  return out;
}

/** Small deterministic random generator (stable star field per card). */
export function seededRandom(seed: number): () => number {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return ((s >>> 0) % 1_000_000) / 1_000_000;
  };
}

const smooth = (x: number) => {
  const f = Math.min(1, Math.max(0, x));
  return f * f * (3 - 2 * f);
};

export interface SkyWeights {
  /** 0…1 night (complete at nautical dusk) */
  night: number;
  /** 0…1 dawn / dusk glow, strongest just below the horizon */
  twilight: number;
  /** 0…1 daylight (full from 8° altitude) */
  day: number;
}

/** How much night, twilight glow and day there is at a given solar altitude. */
export function skyWeights(altitude: number): SkyWeights {
  const twilight =
    altitude <= -1 ? smooth((altitude - DARK) / (-1 - DARK)) : 1 - smooth((altitude + 1) / 9);
  return { night: darkness(altitude), twilight, day: smooth(altitude / 8) };
}
