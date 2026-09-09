import { useEffect } from "react";
import { authApi } from "../services/auth.api";
import { dashboardApi } from "../services/dashboard.api";
import { useDashboardStore } from "../stores/dashboard.store";
import { usePreferencesStore } from "../stores/preferences.store";

export function useLiveTelemetry() {
  const { session, set } = useDashboardStore();
  const paused = usePreferencesStore((state) => state.paused);

  useEffect(() => {
    if (!session || paused) {
      set({ connection: paused ? "Paused" : "Offline" });
      return;
    }

    let active = true;
    let fallbackTimer: ReturnType<typeof setInterval> | null = null;
    let stream: EventSource | null = null;

    const startFallback = () => {
      if (fallbackTimer) return;
      const fetchTick = async () => {
        try {
          const frame = await dashboardApi.frame();
          if (!active) return;
          set({
            frame,
            frames: [...useDashboardStore.getState().frames.slice(-59), frame],
            connection: "Live",
          });
        } catch {
          if (active && useDashboardStore.getState().session) {
            set({ connection: "Reconnecting" });
            authApi.session().catch(() => {});
          }
        }
      };
      void fetchTick();
      fallbackTimer = setInterval(fetchTick, 2000);
    };

    try {
      stream = new EventSource("/api/dashboard/stream");
      set({ connection: "Connecting" });

      stream.onmessage = (e) => {
        if (!active) return;
        const frame = JSON.parse(e.data);
        set({
          frame,
          frames: [...useDashboardStore.getState().frames.slice(-59), frame],
          connection: "Live",
        });
      };

      stream.onerror = () => {
        if (!active) return;
        // On serverless environments like Netlify where SSE connections close,
        // seamlessly switch to 2s frame polling so real-time updates never stop.
        if (stream) {
          stream.close();
          stream = null;
        }
        startFallback();
      };

      stream.addEventListener("expired", () =>
        useDashboardStore.getState().clear(),
      );
    } catch {
      startFallback();
    }

    return () => {
      active = false;
      if (stream) stream.close();
      if (fallbackTimer) clearInterval(fallbackTimer);
    };
  }, [session, paused]);
}
