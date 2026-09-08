import { Thermometer, Waves, Zap } from "lucide-react";

import type { LucideIcon } from "lucide-react";
import type { MetricKey } from "../types/warehouse";

export const metricInfo: {
  key: MetricKey;
  label: string;
  unit: string;
  icon: LucideIcon;
  color: string;
}[] = [
  {
    key: "temperature",
    label: "Temperature",
    unit: "°C",
    icon: Thermometer,
    color: "#c08143",
  },
  {
    key: "humidity",
    label: "Humidity",
    unit: "%",
    icon: Waves,
    color: "#4b8c9b",
  },
  {
    key: "power",
    label: "Power consumption",
    unit: "kW",
    icon: Zap,
    color: "#7a7bb7",
  },
];
