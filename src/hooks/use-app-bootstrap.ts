import { useEffect } from "react";
import { authApi } from "../services/auth.api";
import { useDashboardStore } from "../stores/dashboard.store";
import { usePreferencesStore } from "../stores/preferences.store";
export function useAppBootstrap() {
  const { ready, set } = useDashboardStore();
  const dark = usePreferencesStore((s) => s.dark);
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  }, [dark]);
  useEffect(() => {
    let active = true;
    authApi
      .session()
      .then((session) => {
        if (active) set({ session });
      })
      .catch(() => {})
      .finally(() => {
        if (active) set({ ready: true });
      });
    return () => {
      active = false;
    };
  }, []);

  return ready;
}
