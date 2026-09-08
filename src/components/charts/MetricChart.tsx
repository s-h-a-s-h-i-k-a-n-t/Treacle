import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { metricInfo } from "../../config/metrics";
import { formatTime } from "../../lib/format-time";
import type { TrendPoint } from "../../types/warehouse";

export function MetricChart({
  data,
  metric = "temperature",
  height = 240,
}: {
  data: TrendPoint[];
  metric?: string;
  height?: number;
}) {
  const info = metricInfo.find((m) => m.key === metric)!;
  if (!data.length)
    return <div className="empty">Waiting for sensor readings…</div>;
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart
        data={data}
        margin={{ top: 15, right: 12, left: -20, bottom: 0 }}
      >
        <defs>
          <linearGradient id={"fill-" + metric} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={info.color} stopOpacity={0.22} />
            <stop offset="100%" stopColor={info.color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          vertical={false}
          stroke="var(--line)"
          strokeDasharray="4 4"
        />
        <XAxis
          dataKey="timestamp"
          tickFormatter={(v) =>
            new Date(v).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          }
          minTickGap={45}
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 11, fill: "var(--muted)" }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 11, fill: "var(--muted)" }}
          domain={["auto", "auto"]}
        />
        <Tooltip
          contentStyle={{
            background: "var(--card)",
            border: "1px solid var(--line)",
            borderRadius: 10,
          }}
          labelFormatter={(v) => formatTime(Number(v))}
          formatter={(v) => [`${v} ${info.unit}`, info.label]}
        />
        <Area
          type="monotone"
          dataKey={metric}
          stroke={info.color}
          fill={"url(#fill-" + metric + ")"}
          strokeWidth={2.5}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
