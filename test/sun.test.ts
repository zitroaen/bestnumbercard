import { test } from "node:test";
import assert from "node:assert/strict";
import { darkness, solarAltitude, sunEvents } from "../src/sun";

const hhmm = (t: number, tz: string) =>
  new Intl.DateTimeFormat("de-DE", { hour: "2-digit", minute: "2-digit", timeZone: tz }).format(t);

test("Berlin, 22 Nov 2026: sunrise ~07:44, sunset ~15:57 CET (±10 min is plenty for a graph)", () => {
  const start = Date.UTC(2026, 10, 21, 23, 0); // local midnight
  const ev = sunEvents(start, start + 24 * 3600e3, 52.52, 13.405);
  assert.deepEqual(ev.map((e) => e.type), ["rise", "set"]);
  const rise = hhmm(ev[0].t, "Europe/Berlin");
  const set = hhmm(ev[1].t, "Europe/Berlin");
  const min = (s: string) => Number(s.slice(0, 2)) * 60 + Number(s.slice(3));
  assert.ok(Math.abs(min(rise) - (7 * 60 + 44)) <= 10, rise);
  assert.ok(Math.abs(min(set) - (15 * 60 + 57)) <= 10, set);
});

test("New York, 21 Jun 2026: long day", () => {
  const start = Date.UTC(2026, 5, 21, 4, 0); // local midnight EDT
  const ev = sunEvents(start, start + 24 * 3600e3, 40.71, -74.0);
  const rise = hhmm(ev[0].t, "America/New_York");
  const set = hhmm(ev[1].t, "America/New_York");
  assert.match(rise, /^05:2\d$/);
  assert.match(set, /^20:3\d$/);
});

test("polar night: no sunrise in Tromsø mid-December, darkness stays high", () => {
  const start = Date.UTC(2026, 11, 20, 0, 0);
  assert.equal(sunEvents(start, start + 24 * 3600e3, 69.65, 18.96).length, 0);
  assert.ok(solarAltitude(start + 11 * 3600e3, 69.65, 18.96) < 0);
});

test("darkness: 0 by day, 1 at night, smooth in between", () => {
  assert.equal(darkness(10), 0);
  assert.equal(darkness(-20), 1);
  const mid = darkness(-6.4);
  assert.ok(mid > 0.3 && mid < 0.7);
});

test("sky weights: twilight glow peaks around the horizon, day from 8°", async () => {
  const { skyWeights } = await import("../src/sun");
  assert.deepEqual(skyWeights(20), { night: 0, twilight: 0, day: 1 });
  assert.equal(skyWeights(-20).night, 1);
  assert.equal(skyWeights(-20).twilight, 0);
  assert.ok(skyWeights(-1).twilight > 0.99);
  assert.ok(skyWeights(3).twilight > 0.3 && skyWeights(3).day > 0);
});
