import { DollarSign, BarChart3, ArrowLeftRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { CoinId, MetricKey } from "../types/market";
export const coins: { id: CoinId; name: string }[] = [
  { id: "BTC", name: "Bitcoin" },
  { id: "ETH", name: "Ethereum" },
  { id: "DOGE", name: "Dogecoin" },
];
export const metricInfo: {
  key: MetricKey;
  label: string;
  icon: LucideIcon;
  color: string;
}[] = [
  { key: "price", label: "Price", icon: DollarSign, color: "#c08143" },
  {
    key: "volume",
    label: "Volume · last 60s",
    icon: BarChart3,
    color: "#4b8c9b",
  },
  {
    key: "spread",
    label: "Bid–ask spread",
    icon: ArrowLeftRight,
    color: "#7a7bb7",
  },
];
export const metricUnit = (key: MetricKey, coin: CoinId) =>
  key === "price" ? "USD" : key === "volume" ? coin : "%";
export function formatMetric(value: number, key: MetricKey, coin: CoinId) {
  const digits =
    key === "price"
      ? coin === "DOGE"
        ? 6
        : 2
      : key === "spread"
        ? 3
        : coin === "DOGE"
          ? 0
          : 2;
  return value.toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}
