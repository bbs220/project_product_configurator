import { create } from "zustand"

type typeAppStore = {
  appVersion: number
  updateVersion: (newVersion: number) => void
}

export const useAppStore = create<typeAppStore>()((set) => ({
  appVersion: 0.1,
  updateVersion: (newVersion) => set({ appVersion: newVersion }),
}))
