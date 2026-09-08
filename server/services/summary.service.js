import { round } from "../utils/numbers.js";

export function summarizeTelemetry(history, zoneId) {
  const current = history.slice(-30),
    previous = history.slice(-60, -30);
  const selected = (frames) =>
    frames.flatMap((f) =>
      f.readings.filter((r) => zoneId == null || r.id === zoneId),
    );
  const avg = (frames, key) => {
    const rows = selected(frames);
    return round(rows.reduce((s, r) => s + r[key], 0) / (rows.length || 1));
  };
  return {
    timestamp: Date.now(),
    windowSeconds: 60,
    averages: Object.fromEntries(
      ["temperature", "humidity", "power"].map((k) => [k, avg(current, k)]),
    ),
    deltas: Object.fromEntries(
      ["temperature", "humidity", "power"].map((k) => [
        k,
        round(avg(current, k) - avg(previous, k)),
      ]),
    ),
    trends: history
      .filter((_, i) => i % 5 === 0)
      .slice(-60)
      .map((f) => ({
        timestamp: f.timestamp,
        ...Object.fromEntries(
          ["temperature", "humidity", "power"].map((k) => [k, avg([f], k)]),
        ),
      })),
    zones: history.at(-1).readings,
    samples: selected(current).length,
  };
}
