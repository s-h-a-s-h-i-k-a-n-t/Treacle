import { useEffect } from "react";
import { dashboardApi } from "../services/dashboard.api";
import { useDashboardStore } from "../stores/dashboard.store";
import { usePreferencesStore } from "../stores/preferences.store";

export function useDashboardPolling() {
  const { session, set } = useDashboardStore();
  const interval = usePreferencesStore((state) => state.interval);
  useEffect(() => {
    if (!session) return;
    let active = true;
    const controller = new AbortController();
    const poll = async () => {
      try {
        const [summary, alerts] = await Promise.all([
          dashboardApi.summary(controller.signal),
          dashboardApi.alerts(controller.signal),
        ]);
        if (active && useDashboardStore.getState().session === session) {
          const currentFrame = useDashboardStore.getState().frame;
          const patch: Parameters<typeof set>[0] = {
            summary,
            alerts: alerts.alerts,
            pollTime: alerts.timestamp,
            error: "",
          };
          if (!currentFrame && summary.coins) {
            patch.frame = {
              sequence: 1,
              timestamp: summary.dataTimestamp,
              readings: summary.coins,
            };
          }
          set(patch);
        }
      } catch (e) {
        if (active && useDashboardStore.getState().session)
          set({ error: (e as Error).message });
      }
    };
    void poll();
    const timer = setInterval(poll, interval * 1000);
    return () => {
      active = false;
      controller.abort();
      clearInterval(timer);
    };
  }, [session, interval]);
}
