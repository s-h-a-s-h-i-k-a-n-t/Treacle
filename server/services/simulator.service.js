import { COINS } from "../config/constants.js";
import { summarizeTelemetry } from "./summary.service.js";
const precision = (value, digits = 6) => Number(value.toFixed(digits));

export function createSimulator() {
  let sequence = 0;
  const history = [],
    alerts = [];
  const states = new Map();
  function tick(timestamp = Date.now()) {
    sequence++;
    const readings = COINS.map((coin, index) => {
      const price = precision(
        coin.basePrice *
          (1 +
            Math.sin(sequence / 18 + index * 1.7) * 0.025 +
            Math.random() * 0.001),
      );
      const tradedVolume = precision(
        coin.tradeSize * (0.6 + Math.random() * 0.8),
      );
      const recent = history.filter(
        (f) => f.timestamp > timestamp - 60000 && f.timestamp <= timestamp,
      );
      const volume = precision(
        recent.reduce(
          (sum, f) => sum + f.readings[index].tradedVolume,
          tradedVolume,
        ),
      );
      const spread = precision(
        0.04 + (Math.sin(sequence / 9 + index * 1.6) + 1) * 0.1,
        3,
      );
      const threshold = 0.15;
      const status =
        spread > 0.2 ? "CRITICAL" : spread > threshold ? "WARN" : "OK";
      const previous = states.get(coin.id);
      const event =
        status === "OK" && previous && previous !== "OK"
          ? "RECOVERY"
          : status !== "OK"
            ? "ALERT"
            : "UPDATE";
      states.set(coin.id, status);
      const reading = {
        id: coin.id,
        name: coin.name,
        price,
        volume,
        spread,
        tradedVolume,
        status,
        event,
        timestamp,
      };
      if (status !== "OK" && previous !== status)
        alerts.unshift({
          id: `${sequence}-${coin.id}`,
          coinId: coin.id,
          coin: coin.name,
          severity: status,
          title: "Bid–ask spread widened",
          value: spread,
          threshold: status === "CRITICAL" ? 0.2 : threshold,
          timestamp,
          acknowledged: false,
        });
      return reading;
    });
    const frame = { sequence, timestamp, readings };
    history.push(frame);
    if (history.length > 900) history.shift();
    alerts.splice(100);
    return frame;
  }
  const now = Date.now();
  for (let i = 150; i >= 0; i--) tick(now - i * 2000);
  const summary = (coinId) => summarizeTelemetry(history, coinId);
  return { tick, summary, history, alerts };
}
