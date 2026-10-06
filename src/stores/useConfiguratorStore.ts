import { create } from "zustand";

export type ConfiguratorModel = "watch" | "keyboard" | "mtBike" | "guitar";

export const MODEL_CAMERA_POSITIONS: Record<
  ConfiguratorModel,
  [number, number, number]
> = {
  watch: [0, 2, -5],
  keyboard: [0, 2, -0.1], // Placeholders that we can tune later
  mtBike: [4, 2, -4],
  guitar: [0, 2, -3],
};

export const MODEL_CAMERA_DISTANCES: Record<
  ConfiguratorModel,
  { min: number; max: number }
> = {
  watch: { min: 1.8, max: 10 },
  keyboard: { min: 1.5, max: 5 }, // Placeholders that we can tune later
  mtBike: { min: 2, max: 10 },
  guitar: { min: 1.5, max: 10 },
};

type ConfiguratorState = {
  activeModel: ConfiguratorModel;
  setActiveModel: (model: ConfiguratorModel) => void;

  isExploded: boolean;
  toggleExploded: () => void;
  setExploded: (val: boolean) => void;

  cameraPosition: [number, number, number];
  setCameraPosition: (pos: [number, number, number]) => void;

  cameraMinDistance: number;
  cameraMaxDistance: number;
};

export const useConfiguratorStore = create<ConfiguratorState>((set) => ({
  activeModel: "watch",
  setActiveModel: (model) =>
    set({
      activeModel: model,
      cameraPosition: MODEL_CAMERA_POSITIONS[model],
      cameraMinDistance: MODEL_CAMERA_DISTANCES[model].min,
      cameraMaxDistance: MODEL_CAMERA_DISTANCES[model].max,
      isExploded: false, // Reset explosion state on model change
    }),

  isExploded: false,
  toggleExploded: () => set((state) => ({ isExploded: !state.isExploded })),
  setExploded: (val) => set({ isExploded: val }),

  cameraPosition: MODEL_CAMERA_POSITIONS["watch"],
  setCameraPosition: (pos) => set({ cameraPosition: pos }),

  cameraMinDistance: MODEL_CAMERA_DISTANCES["watch"].min,
  cameraMaxDistance: MODEL_CAMERA_DISTANCES["watch"].max,
}));
