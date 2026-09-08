import { useDashboardPolling } from "./use-dashboard-polling";
import { useLiveTelemetry } from "./use-live-telemetry";
import { useSessionExpiry } from "./use-session-expiry";

export function useDashboardConnections() {
  useSessionExpiry();
  useLiveTelemetry();
  useDashboardPolling();
}
