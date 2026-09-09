import { Pause, Play } from "lucide-react";
import { useState } from "react";
import { MetricChart } from "../../../components/charts/MetricChart";
import { Modal } from "../../../components/ui/Modal";
import { PageHeading } from "../../../components/ui/PageHeading";
import { Status } from "../../../components/ui/Status";
import {
  coins,
  metricInfo,
  metricUnit,
  formatMetric,
} from "../../../config/metrics";
import { formatTime } from "../../../lib/format-time";
import { useDashboardStore } from "../../../stores/dashboard.store";
import { usePreferencesStore } from "../../../stores/preferences.store";
import type { CoinId, MetricKey, Reading } from "../../../types/market";
import { LiveMetricCards } from "../components/LiveMetricCards";
import { MarketHealth } from "../components/MarketHealth";
import { MarketTable } from "../components/MarketTable";

export function OverviewPage() {
  const { frame, frames, connection } = useDashboardStore();
  const prefs = usePreferencesStore();
  const [coin, setCoin] = useState<CoinId>("BTC");
  const [metric, setMetric] = useState<MetricKey>("price");
  const [detail, setDetail] = useState<Reading | null>(null);
  const reading = frame?.readings.find((r) => r.id === coin);
  const chart = frames.flatMap((f) => {
    const r = f.readings.find((r) => r.id === coin);
    return r
      ? [
          {
            timestamp: f.timestamp,
            price: r.price,
            volume: r.volume,
            spread: r.spread,
          },
        ]
      : [];
  });
  return (
    <>
      <PageHeading
        eyebrow="THREE COINS. ONE CLEAR VIEW."
        title="Crypto market overview"
        description="Simulated BTC, ETH, and DOGE markets. Prices and activity update every two seconds."
      >
        <button onClick={() => prefs.set({ paused: !prefs.paused })}>
          {prefs.paused ? <Play size={15} /> : <Pause size={15} />}
          {prefs.paused ? "Resume live" : "Pause live"}
        </button>
      </PageHeading>
      <div className="live-bar">
        <div>
          <Status value={connection} />
          <span>Simulated market feed</span>
          <span className="divider" />
          <small>Last received {formatTime(frame?.timestamp || 0)}</small>
        </div>
        <label className="coin-select">
          Coin
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
      </div>
      <LiveMetricCards
        chart={chart}
        reading={reading}
        coin={coin}
        connection={connection}
      />
      <div className="overview-grid">
        <section className="panel trend-panel">
          <div className="panel-heading">
            <div>
              <h2>{coin} live market trends</h2>
              <p>Individual coin measurements · simulated data</p>
            </div>
            <span className="subtle-badge">Last 60 updates</span>
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
          <MetricChart data={chart} metric={metric} coin={coin} />
          <div className="chart-caption">
            <span>
              Volume: coins traded in the trailing 60 seconds. Spread: gap
              between bid and ask as a percentage of price.
            </span>
          </div>
        </section>
        <MarketHealth frame={frame} />
      </div>
      <MarketTable rows={frame?.readings || []} onSelect={setDetail} />
      {detail && (
        <Modal
          title={`${detail.name} (${detail.id})`}
          onClose={() => setDetail(null)}
        >
          <p>Market snapshot at {formatTime(detail.timestamp)}.</p>
          <Status value={detail.status} />
          {metricInfo.map((m) => (
            <div className="detail-row" key={m.key}>
              <span>{m.label}</span>
              <strong>
                {formatMetric(detail[m.key], m.key, detail.id)}{" "}
                {metricUnit(m.key, detail.id)}
              </strong>
            </div>
          ))}
          <p>
            Latest event: {detail.event}. Spread warning above 0.15%; critical
            above 0.20%. These are simulation thresholds.
          </p>
        </Modal>
      )}
    </>
  );
}
