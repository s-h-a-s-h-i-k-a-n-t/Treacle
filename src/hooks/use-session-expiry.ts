import { useEffect } from "react";
import { useDashboardStore } from "../stores/dashboard.store";

export function useSessionExpiry() {
  const session = useDashboardStore((state) => state.session);
  useEffect(() => {
    if (!session) return;
    const timer = setTimeout(
      () => useDashboardStore.getState().clear(),
      Math.max(0, session.expiresAt - Date.now()),
    );
    return () => clearTimeout(timer);
  }, [session]);
}
