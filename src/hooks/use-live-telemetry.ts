import { useEffect } from "react";
import { authApi } from "../services/auth.api";
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
    const stream = new EventSource("/api/dashboard/stream");
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
      if (active) {
        set({ connection: "Reconnecting" });
        authApi.session().catch(() => {});
      }
    };
    stream.addEventListener("expired", () =>
      useDashboardStore.getState().clear(),
    );
    return () => {
      active = false;
      stream.close();
    };
  }, [session, paused]);
}
