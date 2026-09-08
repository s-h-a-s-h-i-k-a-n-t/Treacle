export type MetricKey = "temperature" | "humidity" | "power";
export type TrendPoint = { timestamp: number } & Record<MetricKey, number>;

export type Reading = {
  id: number;
  name: string;
  temperature: number;
  humidity: number;
  power: number;
  status: string;
  event: string;
  timestamp: number;
};

export type Frame = {
  sequence: number;
  timestamp: number;
  readings: Reading[];
};

export type Alert = {
  id: string;
  zoneId: number;
  zone: string;
  severity: string;
  title: string;
  value: number;
  threshold: number;
  timestamp: number;
  acknowledged: boolean;
};

export type Summary = {
  timestamp: number;
  windowSeconds: number;
  averages: Record<MetricKey, number>;
  deltas: Record<MetricKey, number>;
  trends: TrendPoint[];
  zones: Reading[];
  samples: number;
};
