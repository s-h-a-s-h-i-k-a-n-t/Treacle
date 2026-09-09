export type CoinId = "BTC" | "ETH" | "DOGE";
export type MetricKey = "price" | "volume" | "spread";
export type TrendPoint = { timestamp: number } & Record<MetricKey, number>;
export type Reading = TrendPoint & {
  id: CoinId;
  name: string;
  tradedVolume: number;
  status: "OK" | "WARN" | "CRITICAL";
  event: "UPDATE" | "ALERT" | "RECOVERY";
};
export type Frame = {
  sequence: number;
  timestamp: number;
  readings: Reading[];
};
export type Alert = {
  id: string;
  coinId: CoinId;
  coin: string;
  severity: "WARN" | "CRITICAL";
  title: string;
  value: number;
  threshold: number;
  timestamp: number;
  acknowledged: boolean;
};
export type MarketSummary = {
  id: CoinId;
  name: string;
  averages: Record<MetricKey, number>;
  deltas: Record<MetricKey, number>;
  trends: TrendPoint[];
  samples: number;
};
export type Summary = {
  timestamp: number;
  dataTimestamp: number;
  windowSeconds: number;
  markets: MarketSummary[];
  coins: Reading[];
};
