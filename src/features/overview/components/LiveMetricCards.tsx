import { metricInfo } from "../../../config/metrics";
import type { MetricKey, TrendPoint } from "../../../types/warehouse";
export function LiveMetricCards({
  chart,
  average,
  zone,
}: {
  chart: TrendPoint[];
  average: (key: MetricKey) => number | null;
  zone: string;
}) {
  return (
    <div className="metric-grid">
      {metricInfo.map(({ key, label, unit, icon: Icon, color }) => (
        <div className="metric-card" key={key}>
          <div className="metric-top">
            <span>{label}</span>
            <Icon size={19} style={{ color }} />
          </div>
          <div className="metric-value">
            {average(key) ?? "—"}
            <small>{unit}</small>
            <svg viewBox="0 0 110 35" aria-hidden="true">
              <polyline
                points={chart
                  .slice(-20)
                  .map((p, i, arr) => {
                    const values = arr.map((v) => v[key]);
                    const min = Math.min(...values),
                      max = Math.max(...values);
                    return `${(i * 110) / Math.max(1, arr.length - 1)},${30 - ((p[key] - min) / Math.max(1, max - min)) * 25}`;
                  })
                  .join(" ")}
                fill="none"
                stroke={color}
                strokeWidth="2"
              />
            </svg>
          </div>
          <div className="metric-note">
            <i style={{ background: color }} />{" "}
            {zone === "all"
              ? "Average across 4 zones"
              : "Selected zone reading"}
            <span>LIVE</span>
          </div>
        </div>
      ))}
    </div>
  );
}
