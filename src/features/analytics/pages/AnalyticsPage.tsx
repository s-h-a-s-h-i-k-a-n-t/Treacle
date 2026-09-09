import { useState } from "react";
import type { CoinId } from "../../../types/market";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { MetricChart } from "../../../components/charts/MetricChart";
import { PageHeading } from "../../../components/ui/PageHeading";
import {
  coins,
  metricInfo,
  metricUnit,
  formatMetric,
} from "../../../config/metrics";
import { formatTime } from "../../../lib/format-time";
import { useDashboardStore } from "../../../stores/dashboard.store";
import { usePreferencesStore } from "../../../stores/preferences.store";

export function AnalyticsPage() {
  const { summary, pollTime } = useDashboardStore();
  const [coin, setCoin] = useState<CoinId>("BTC");
  const market = summary?.markets.find((m) => m.id === coin);
  const interval = usePreferencesStore((s) => s.interval);
  return (
    <>
      <PageHeading
        eyebrow="PATTERNS & PERFORMANCE"
        title="Market analytics"
        description="Per-coin insights from simulated markets, refreshed independently of the live feed."
      >
        <label className="coin-select">
          Coin{" "}
          <select
            value={coin}
            onChange={(e) => setCoin(e.target.value as CoinId)}
          >
            {coins.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.id})
              </option>
            ))}
          </select>
        </label>
        <span className="subtle-badge">Polling every {interval}s</span>
      </PageHeading>
      <div className="section-note">
        Last updated {formatTime(pollTime)} · Current 60 seconds compared with
        the previous 60 seconds
      </div>
      <div className="metric-grid">
        {metricInfo.map((m) => {
          const delta = market?.deltas[m.key] ?? 0;
          return (
            <div className="metric-card" key={m.key}>
              <div className="metric-top">
                Average {m.label.toLowerCase()}
                <m.icon size={19} />
              </div>
              <div className="metric-value">
                {market
                  ? formatMetric(market.averages[m.key], m.key, coin)
                  : "—"}
                <small>{metricUnit(m.key, coin)}</small>
              </div>
              <div className="delta">
                {delta >= 0 ? (
                  <ArrowUpRight size={16} />
                ) : (
                  <ArrowDownRight size={16} />
                )}{" "}
                {delta > 0 ? "+" : ""}
                {formatMetric(delta, m.key, coin)}{" "}
                {m.key === "spread" ? "pp" : metricUnit(m.key, coin)}{" "}
                <span>vs previous window</span>
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
                {coin} only · backend history sampled approximately every 10
                seconds
              </p>
            </div>
            <span className="subtle-badge">{metricUnit(m.key, coin)}</span>
          </div>
          <MetricChart
            data={market?.trends || []}
            metric={m.key}
            coin={coin}
            height={210}
          />
        </section>
      ))}
      <p className="section-note">
        {market?.samples ?? 0} market snapshots in the current aggregation
        window. Volume averages use trailing-minute coin volume; spread deltas
        are percentage points (pp).
      </p>
    </>
  );
}
