import { apiRequest } from "../lib/api-client";
import type { Alert, Frame, Summary } from "../types/market";
export const dashboardApi = {
  frame(signal?: AbortSignal) {
    return apiRequest<Frame>("/dashboard/frame", { signal });
  },
  summary(signal?: AbortSignal) {
    return apiRequest<Summary>("/dashboard/summary", { signal });
  },
  alerts(signal?: AbortSignal) {
    return apiRequest<{ timestamp: number; alerts: Alert[] }>(
      "/dashboard/alerts",
      { signal },
    );
  },
  acknowledgeAlert(id: string) {
    return apiRequest<Alert>(`/dashboard/alerts/${encodeURIComponent(id)}`, {
      method: "PATCH",
    });
  },
};
