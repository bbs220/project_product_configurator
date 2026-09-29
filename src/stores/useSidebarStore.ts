import { create } from "zustand";
import { persist } from "zustand/middleware";

type typeSidebarStore = {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
};

export const useSidebarStore = create<typeSidebarStore>()(
  persist(
    (set) => ({
      isSidebarOpen: true,
      toggleSidebar: () =>
        set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      setSidebarOpen: (open) => set({ isSidebarOpen: open }),
    }),
    { name: "sidebar-store" },
  ),
);
