import { COINS } from "../config/constants.js";
const round = (value) => Number(value.toFixed(6));
const keys = ["price", "volume", "spread"];
export function summarizeTelemetry(history, coinId) {
  const timestamp = history.at(-1).timestamp;
  const current = history.filter(
    (f) => f.timestamp > timestamp - 60000 && f.timestamp <= timestamp,
  );
  const previous = history.filter(
    (f) => f.timestamp > timestamp - 120000 && f.timestamp <= timestamp - 60000,
  );
  const markets = COINS.filter((c) => !coinId || c.id === coinId).map(
    (coin) => {
      const rows = (frames) =>
        frames.map((f) => f.readings.find((r) => r.id === coin.id));
      const avg = (frames, key) => {
        const readings = rows(frames);
        return (
          readings.reduce((sum, r) => sum + r[key], 0) / (readings.length || 1)
        );
      };
      return {
        id: coin.id,
        name: coin.name,
        averages: Object.fromEntries(
          keys.map((k) => [k, round(avg(current, k))]),
        ),
        deltas: Object.fromEntries(
          keys.map((k) => [k, round(avg(current, k) - avg(previous, k))]),
        ),
        trends: history
          .filter((_, i) => i % 5 === 0)
          .slice(-60)
          .map((f) => {
            const r = f.readings.find((r) => r.id === coin.id);
            return {
              timestamp: f.timestamp,
              price: r.price,
              volume: r.volume,
              spread: r.spread,
            };
          }),
        samples: current.length,
      };
    },
  );
  return {
    timestamp: Date.now(),
    dataTimestamp: timestamp,
    windowSeconds: 60,
    markets,
    coins: history.at(-1).readings,
  };
}
