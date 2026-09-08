import { ZONES } from "../config/constants.js";
import { round } from "../utils/numbers.js";
import { summarizeTelemetry } from "./summary.service.js";

export function createSimulator() {
  let sequence = 0;
  const history = [],
    alerts = [];
  const states = new Map();
  function tick(timestamp = Date.now()) {
    sequence++;
    const readings = ZONES.map((name, index) => {
      const wave = Math.sin(sequence / 9 + index * 1.6);
      const temperature = round(
        (index === 1 ? 5 : 22) + wave * (index === 1 ? 4 : 6) + Math.random(),
      );
      const humidity = round(
        46 + Math.sin(sequence / 13 + index) * 15 + Math.random() * 2,
      );
      const power = round(12 + index * 3 + Math.sin(sequence / 7 + index) * 5);
      const threshold = index === 1 ? 7 : 26;
      const status =
        temperature > threshold + 2
          ? "CRITICAL"
          : temperature > threshold
            ? "WARN"
            : "OK";
      const previous = states.get(index);
      const event =
        status === "OK" && previous && previous !== "OK"
          ? "RECOVERY"
          : status !== "OK"
            ? "ALERT"
            : "UPDATE";
      states.set(index, status);
      const reading = {
        id: index,
        name,
        temperature,
        humidity,
        power,
        status,
        event,
        timestamp,
      };
      if (status !== "OK" && previous !== status)
        alerts.unshift({
          id: `${sequence}-${index}`,
          zoneId: index,
          zone: name,
          severity: status,
          title: "Temperature above operating range",
          value: temperature,
          threshold,
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
  // Seed a real, coherent simulated history so trend views are useful at startup.
  for (let i = 120; i > 0; i--) tick(Date.now() - i * 2000);
  tick();
  const summary = (zoneId) => summarizeTelemetry(history, zoneId);
  return { tick, summary, history, alerts };
}
