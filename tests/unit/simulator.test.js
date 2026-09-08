import test from "node:test";
import assert from "node:assert/strict";
import { createSimulator } from "../../server/services/simulator.service.js";
test("simulator produces numeric telemetry and derived summaries from the same readings", () => {
  const s = createSimulator();
  const before = s.history.at(-1),
    after = s.tick();
  assert.notDeepEqual(before.readings, after.readings);
  for (const r of after.readings) {
    for (const k of ["temperature", "humidity", "power"])
      assert.equal(typeof r[k], "number");
    assert.ok(["OK", "WARN", "CRITICAL"].includes(r.status));
    assert.ok(["UPDATE", "ALERT", "RECOVERY"].includes(r.event));
    assert.ok(r.timestamp);
  }
  const summary = s.summary(1),
    rows = s.history.slice(-30).map((f) => f.readings[1]);
  assert.equal(
    summary.averages.temperature,
    Math.round(
      (rows.reduce((a, r) => a + r.temperature, 0) / rows.length) * 10,
    ) / 10,
  );
  assert.equal(summary.samples, 30);
  assert.ok(summary.trends.length > 0);
  assert.equal(typeof summary.deltas.power, "number");
  assert.ok(s.alerts.length);
  assert.ok(s.alerts.every((a) => a.value > a.threshold));
});
