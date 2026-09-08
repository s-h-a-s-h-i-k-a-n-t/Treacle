import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { MetricChart } from "../../../components/charts/MetricChart";
import { PageHeading } from "../../../components/ui/PageHeading";
import { metricInfo } from "../../../config/metrics";
import { formatTime } from "../../../lib/format-time";
import { useDashboardStore } from "../../../stores/dashboard.store";
import { usePreferencesStore } from "../../../stores/preferences.store";

export function AnalyticsPage() {
  const { summary, pollTime } = useDashboardStore();
  const interval = usePreferencesStore((s) => s.interval);
  return (
    <>
      <PageHeading
        eyebrow="PATTERNS & PERFORMANCE"
        title="Warehouse analytics"
        description="Derived insights from your sensor network, refreshed independently of the live feed."
      >
        <span className="subtle-badge">Polling every {interval}s</span>
      </PageHeading>
      <div className="section-note">
        Last updated {formatTime(pollTime)} · Current 60 seconds compared with
        the previous 60 seconds
      </div>
      <div className="metric-grid">
        {metricInfo.map((m) => {
          const delta = summary?.deltas[m.key] ?? 0;
          return (
            <div className="metric-card" key={m.key}>
              <div className="metric-top">
                Average {m.label.toLowerCase()}
                <m.icon size={19} />
              </div>
              <div className="metric-value">
                {summary?.averages[m.key] ?? "—"}
                <small>{m.unit}</small>
              </div>
              <div className="delta">
                {delta >= 0 ? (
                  <ArrowUpRight size={16} />
                ) : (
                  <ArrowDownRight size={16} />
                )}{" "}
                {delta > 0 ? "+" : ""}
                {delta} {m.unit} <span>vs previous window</span>
              </div>
            </div>
          );
        })}
      </div>
      {metricInfo.map((m) => (
        <section className="panel analytics-chart" key={m.key}>
          <div className="panel-heading">
            <div>
              <h2>{m.label} trend</h2>
              <p>
                Average across warehouse zones · backend history sampled every
                10 seconds
              </p>
            </div>
            <span className="subtle-badge">{m.unit}</span>
          </div>
          <MetricChart
            data={summary?.trends || []}
            metric={m.key}
            height={210}
          />
        </section>
      ))}
      <p className="section-note">
        {summary?.samples ?? 0} sensor readings in the current aggregation
        window.
      </p>
    </>
  );
}
