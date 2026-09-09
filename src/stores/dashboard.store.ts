import { create } from "zustand";
import type { Session } from "../types/session";
import type { Alert, Frame, Summary } from "../types/market";

type DashboardState = {
  session: Session | null;
  ready: boolean;
  frame: Frame | null;
  frames: Frame[];
  summary: Summary | null;
  alerts: Alert[];
  pollTime: number;
  connection: string;
  error: string;
  set: (patch: Partial<Omit<DashboardState, "set" | "clear">>) => void;
  clear: () => void;
};

export const useDashboardStore = create<DashboardState>((set) => ({
  session: null,
  ready: false,
  frame: null,
  frames: [],
  summary: null,
  alerts: [],
  pollTime: 0,
  connection: "Connecting",
  error: "",
  set: (p) => set(p),
  clear: () =>
    set({
      session: null,
      frame: null,
      frames: [],
      summary: null,
      alerts: [],
      pollTime: 0,
      connection: "Offline",
      error: "",
    }),
}));
