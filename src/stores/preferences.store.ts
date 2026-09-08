import { create } from "zustand";
import { persist } from "zustand/middleware";

export const usePreferencesStore = create(
  persist<{
    dark: boolean;
    interval: number;
    paused: boolean;
    set: (
      p: Partial<{ dark: boolean; interval: number; paused: boolean }>,
    ) => void;
  }>(
    (set) => ({ dark: false, interval: 10, paused: false, set: (p) => set(p) }),
    { name: "sentry-preferences" },
  ),
);
