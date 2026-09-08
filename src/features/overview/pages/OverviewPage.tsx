import { Pause, Play } from "lucide-react";
import { useState } from "react";
import { MetricChart } from "../../../components/charts/MetricChart";
import { Modal } from "../../../components/ui/Modal";
import { PageHeading } from "../../../components/ui/PageHeading";
import { Status } from "../../../components/ui/Status";
import { metricInfo } from "../../../config/metrics";
import { formatTime } from "../../../lib/format-time";
import { useDashboardStore } from "../../../stores/dashboard.store";
import { usePreferencesStore } from "../../../stores/preferences.store";
import type { MetricKey, Reading } from "../../../types/warehouse";
import { LiveMetricCards } from "../components/LiveMetricCards";
import { ZoneHealth } from "../components/ZoneHealth";
import { ZoneTable } from "../components/ZoneTable";

export function OverviewPage() {
  const { frame, frames, summary, connection } = useDashboardStore();
  const prefs = usePreferencesStore();
  const [zone, setZone] = useState("all"),
    [metric, setMetric] = useState("temperature"),
    [detail, setDetail] = useState<Reading | null>(null);
  const rows =
    frame?.readings.filter((r) => zone === "all" || r.id === Number(zone)) ||
    [];
  const average = (key: MetricKey) =>
    rows.length
      ? Math.round((rows.reduce((s, r) => s + r[key], 0) / rows.length) * 10) /
        10
      : null;
  const chart = frames.map((f) => {
    const rs = f.readings.filter(
      (r) => zone === "all" || r.id === Number(zone),
    );
    return {
      timestamp: f.timestamp,
      ...(Object.fromEntries(
        metricInfo.map((m) => [
          m.key,
          Math.round((rs.reduce((s, r) => s + r[m.key], 0) / rs.length) * 10) /
            10,
        ]),
      ) as Record<MetricKey, number>),
    };
  });
  return (
    <>
      <PageHeading
        eyebrow="YOUR OPERATIONS, IN VIEW"
        title="Warehouse overview"
        description="A live pulse of your environment. Everything you need to stay ahead."
      >
        <span className="date">
          {new Date().toLocaleDateString([], {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
        <button onClick={() => prefs.set({ paused: !prefs.paused })}>
          {prefs.paused ? <Play size={15} /> : <Pause size={15} />}{" "}
          {prefs.paused ? "Resume live" : "Pause live"}
        </button>
      </PageHeading>
      <div className="live-bar">
        <div>
          <Status value={connection} />
          <span>Sensor network</span>
          <span className="divider" />
          <small>Last received {formatTime(frame?.timestamp || 0)}</small>
        </div>
        <label className="zone-select">
          Zone
          <select value={zone} onChange={(e) => setZone(e.target.value)}>
            <option value="all">All warehouse zones</option>
            {(frame?.readings || summary?.zones || []).map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <LiveMetricCards chart={chart} average={average} zone={zone} />
      <div className="overview-grid">
        <section className="panel trend-panel">
          <div className="panel-heading">
            <div>
              <h2>Live environmental trends</h2>
              <p>
                Incoming telemetry ·{" "}
                {zone === "all" ? "all zones" : "selected zone"}
              </p>
            </div>
            <span className="subtle-badge">Last 60 readings</span>
          </div>
          <div className="tabs">
            {metricInfo.map((m) => (
              <button
                key={m.key}
                className={metric === m.key ? "selected" : ""}
                onClick={() => setMetric(m.key)}
              >
                {m.label}
              </button>
            ))}
          </div>
          <MetricChart data={chart} metric={metric} />
          <div className="chart-caption">
            <i
              style={{
                background: metricInfo.find((m) => m.key === metric)?.color,
              }}
            />{" "}
            {metricInfo.find((m) => m.key === metric)?.label}
            <span>Updates every 2 seconds</span>
          </div>
        </section>
        <ZoneHealth frame={frame} />
      </div>
      <ZoneTable rows={rows} onSelect={setDetail} />
      {detail && (
        <Modal title={detail.name} onClose={() => setDetail(null)}>
          <p>Sensor snapshot received at {formatTime(detail.timestamp)}.</p>
          <Status value={detail.status} />
          {metricInfo.map((m) => (
            <div className="detail-row" key={m.key}>
              <span>{m.label}</span>
              <strong>
                {detail[m.key]} {m.unit}
              </strong>
            </div>
          ))}
          <p>
            Latest event: {detail.event}. Temperature warning threshold:{" "}
            {detail.id === 1 ? 7 : 26} °C; critical above{" "}
            {detail.id === 1 ? 9 : 28} °C.
          </p>
        </Modal>
      )}
    </>
  );
}
