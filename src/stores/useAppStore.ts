import { create } from "zustand";

type typeAppStore = {
  appVersion: number;
  updateVersion: (newVersion: number) => void;
};

export const useAppStore = create<typeAppStore>()((set) => ({
  appVersion: 0.2,
  updateVersion: (newVersion) => set({ appVersion: newVersion }),
}));
