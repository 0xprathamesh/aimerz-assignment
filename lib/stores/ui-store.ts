import { create } from "zustand";
import { persist } from "zustand/middleware";

type DashboardBg = "none" | "slate" | "zinc" | "gradient" | "dots";

interface UiState {
  dashboardBackground: DashboardBg;
  setDashboardBackground: (bg: DashboardBg) => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      dashboardBackground: "none",
      setDashboardBackground: (dashboardBackground) =>
        set({ dashboardBackground }),
    }),
    { name: "ui-preferences" }
  )
);
