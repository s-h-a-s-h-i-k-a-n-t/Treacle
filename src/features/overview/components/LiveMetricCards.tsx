import { metricInfo, metricUnit, formatMetric } from "../../../config/metrics";
import type { CoinId, Reading, TrendPoint } from "../../../types/market";
export function LiveMetricCards({
  chart,
  reading,
  coin,
  connection,
}: {
  chart: TrendPoint[];
  reading?: Reading;
  coin: CoinId;
  connection: string;
}) {
  return (
    <div className="metric-grid">
      {metricInfo.map(({ key, label, icon: Icon, color }) => {
        const points = chart.slice(-20);
        const values = points.map((p) => p[key]);
        const min = Math.min(...values),
          max = Math.max(...values);
        return (
          <div className="metric-card" key={key}>
            <div className="metric-top">
              <span>{label}</span>
              <Icon size={19} style={{ color }} />
            </div>
            <div className="metric-value">
              {reading ? formatMetric(reading[key], key, coin) : "—"}
              <small>{metricUnit(key, coin)}</small>
              <svg viewBox="0 0 110 35" aria-hidden="true">
                <polyline
                  points={points
                    .map(
                      (p, i) =>
                        `${(i * 110) / Math.max(1, points.length - 1)},${30 - ((p[key] - min) / (max - min || 1)) * 25}`,
                    )
                    .join(" ")}
                  fill="none"
                  stroke={color}
                  strokeWidth="2"
                />
              </svg>
            </div>
            <div className="metric-note">
              <i style={{ background: color }} />
              {coin} · simulated<span>{connection}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
