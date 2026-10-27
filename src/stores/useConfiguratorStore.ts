import { create } from "zustand";

export type ConfiguratorModel = "watch" | "keyboard" | "mtBike" | "guitar";

export const MODEL_CAMERA_POSITIONS: Record<
  ConfiguratorModel,
  [number, number, number]
> = {
  watch: [0, 2, -3],
  keyboard: [0, 2.6, -1],
  mtBike: [4, 2, -4],
  guitar: [0, 2, -4],
};

export const MODEL_CAMERA_DISTANCES: Record<
  ConfiguratorModel,
  { min: number; max: number }
> = {
  watch: { min: 1.8, max: 8 },
  keyboard: { min: 1.5, max: 8 },
  mtBike: { min: 2, max: 8 },
  guitar: { min: 1.5, max: 8 },
};

export const MODEL_CAMERA_TARGETS: Record<
  ConfiguratorModel,
  [number, number, number]
> = {
  watch: [0, 1, 0],
  keyboard: [0, 0, 0],
  mtBike: [0, 1, 0],
  guitar: [0, 1, 0],
};

export const MODEL_CAMERA_FOV: Record<ConfiguratorModel, number> = {
  watch: 60,
  keyboard: 40,
  mtBike: 40,
  guitar: 40,
};

export const MODEL_EXPLODED_CAMERA_POSITIONS: Record<
  ConfiguratorModel,
  [number, number, number]
> = {
  watch: [0, 10, -14],
  keyboard: [0, 5.5, -11],
  mtBike: [0, 4, -20],
  guitar: [0, 3, -6.8],
};

export const MODEL_EXPLODED_CAMERA_TARGETS: Record<
  ConfiguratorModel,
  [number, number, number]
> = {
  watch: [0, 2.5, 0],
  keyboard: [0, 2.5, 0],
  mtBike: [-0.4, 3.6, 0],
  guitar: [0.4, 3, 0],
};

// material properties configuration
export type MaterialProperties = {
  color: string;
  roughness: number;
  metalness: number;
};

// watch material categories mapping
export type WatchMaterialCategory = "case" | "band" | "crown" | "face" | "back";

// watch face display style
export type WatchFaceStyle = "modular" | "wayfinder";

// default watch material values
export const DEFAULT_WATCH_MATERIALS: Record<
  WatchMaterialCategory,
  MaterialProperties
> = {
  case: {
    color: "#b0aba4",
    roughness: 0.35,
    metalness: 0.85,
  },
  band: {
    color: "#ffffff",
    roughness: 0.85,
    metalness: 0.05,
  },
  crown: {
    color: "#d47144",
    roughness: 0.3,
    metalness: 0.9,
  },
  face: {
    color: "#0a0a0a",
    roughness: 0.1,
    metalness: 0.1,
  },
  back: {
    color: "#e2ded9",
    roughness: 0.25,
    metalness: 0.4,
  },
};

// keyboard material categories mapping
export type KeyboardMaterialCategory =
  | "base"
  | "keycaps"
  | "switches"
  | "knobs";

// default keyboard material values
export const DEFAULT_KEYBOARD_MATERIALS: Record<
  KeyboardMaterialCategory,
  MaterialProperties
> = {
  base: {
    color: "#B7B7B7",
    roughness: 0.3,
    metalness: 0.8,
  },
  keycaps: {
    color: "#C8C8C8",
    roughness: 0.55,
    metalness: 0.05,
  },
  switches: {
    color: "#272727",
    roughness: 0.35,
    metalness: 0.1,
  },
  knobs: {
    color: "#18181b",
    roughness: 0.25,
    metalness: 0.85,
  },
};

// keyboard display screen style options
export type KeyboardDisplayStyle = "status" | "matrix" | "audio" | "retro";

// keyboard display color theme options
export type KeyboardDisplayTheme =
  | "amber"
  | "cyber"
  | "matrix"
  | "neon"
  | "white";

// mountain bike material categories mapping
export type BikeMaterialCategory =
  | "frame"
  | "wheels"
  | "suspension"
  | "drivetrain";

// default mountain bike material values
export const DEFAULT_BIKE_MATERIALS: Record<
  BikeMaterialCategory,
  MaterialProperties
> = {
  frame: {
    color: "#d32f2f",
    roughness: 0.35,
    metalness: 0.15,
  },
  wheels: {
    color: "#18181b",
    roughness: 0.45,
    metalness: 0.6,
  },
  suspension: {
    color: "#ff4b00",
    roughness: 0.35,
    metalness: 0.7,
  },
  drivetrain: {
    color: "#27272a",
    roughness: 0.3,
    metalness: 0.85,
  },
};

// guitar material categories mapping
export type GuitarMaterialCategory =
  | "body"
  | "neck"
  | "hardware"
  | "pickguard";

// default guitar material values
export const DEFAULT_GUITAR_MATERIALS: Record<
  GuitarMaterialCategory,
  MaterialProperties
> = {
  body: {
    color: "#ffffff",
    roughness: 0.25,
    metalness: 0.05,
  },
  neck: {
    color: "#ffffff",
    roughness: 0.35,
    metalness: 0.0,
  },
  hardware: {
    color: "#e5e7eb",
    roughness: 0.2,
    metalness: 0.9,
  },
  pickguard: {
    color: "#f8fafc",
    roughness: 0.4,
    metalness: 0.0,
  },
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

  cameraTarget: [number, number, number];
  setCameraTarget: (pos: [number, number, number]) => void;

  cameraFov: number;
  setCameraFov: (fov: number) => void;

  showLabels: boolean;
  toggleLabels: () => void;
  setLabels: (val: boolean) => void;

  showFloor: boolean;
  toggleFloor: () => void;
  setFloor: (val: boolean) => void;

  focus: boolean;
  toggleFocus: () => void;
  setFocus: (val: boolean) => void;

  // watch customization materials state
  watchMaterials: Record<WatchMaterialCategory, MaterialProperties>;
  // update watch material property
  setWatchMaterialProperty: (
    category: WatchMaterialCategory,
    property: keyof MaterialProperties,
    value: string | number,
  ) => void;
  // reset watch materials to defaults
  resetWatchMaterials: () => void;

  // keyboard customization materials state
  keyboardMaterials: Record<KeyboardMaterialCategory, MaterialProperties>;
  // update keyboard material property
  setKeyboardMaterialProperty: (
    category: KeyboardMaterialCategory,
    property: keyof MaterialProperties,
    value: string | number,
  ) => void;
  // reset keyboard materials to defaults
  resetKeyboardMaterials: () => void;

  // keyboard display screen style
  keyboardDisplayStyle: KeyboardDisplayStyle;
  // update keyboard display screen style
  setKeyboardDisplayStyle: (style: KeyboardDisplayStyle) => void;

  // keyboard display color theme
  keyboardDisplayTheme: KeyboardDisplayTheme;
  // update keyboard display color theme
  setKeyboardDisplayTheme: (theme: KeyboardDisplayTheme) => void;

  // keyboard display brightness level
  keyboardDisplayBrightness: number;
  // update keyboard display brightness
  setKeyboardDisplayBrightness: (brightness: number) => void;

  // mountain bike customization materials state
  bikeMaterials: Record<BikeMaterialCategory, MaterialProperties>;
  // update mountain bike material property
  setBikeMaterialProperty: (
    category: BikeMaterialCategory,
    property: keyof MaterialProperties,
    value: string | number,
  ) => void;
  // reset mountain bike materials to defaults
  resetBikeMaterials: () => void;

  // guitar customization materials state
  guitarMaterials: Record<GuitarMaterialCategory, MaterialProperties>;
  // update guitar material property
  setGuitarMaterialProperty: (
    category: GuitarMaterialCategory,
    property: keyof MaterialProperties,
    value: string | number,
  ) => void;
  // reset guitar materials to defaults
  resetGuitarMaterials: () => void;

  // watch face display style
  watchFaceStyle: WatchFaceStyle;
  // update watch face display style
  setWatchFaceStyle: (style: WatchFaceStyle) => void;
  // toggle between digital and analog watch face styles
  toggleWatchFaceStyle: () => void;
  // watch display night mode state
  watchNightMode: boolean;
  // toggle watch display night mode
  toggleWatchNightMode: () => void;
};

export const useConfiguratorStore = create<ConfiguratorState>((set) => ({
  watchMaterials: DEFAULT_WATCH_MATERIALS,
  setWatchMaterialProperty: (category, property, value) =>
    set((state) => ({
      watchMaterials: {
        ...state.watchMaterials,
        [category]: {
          ...state.watchMaterials[category],
          [property]: value,
        },
      },
    })),
  resetWatchMaterials: () => set({ watchMaterials: DEFAULT_WATCH_MATERIALS }),

  keyboardMaterials: DEFAULT_KEYBOARD_MATERIALS,
  setKeyboardMaterialProperty: (category, property, value) =>
    set((state) => ({
      keyboardMaterials: {
        ...state.keyboardMaterials,
        [category]: {
          ...state.keyboardMaterials[category],
          [property]: value,
        },
      },
    })),
  resetKeyboardMaterials: () =>
    set({ keyboardMaterials: DEFAULT_KEYBOARD_MATERIALS }),

  bikeMaterials: DEFAULT_BIKE_MATERIALS,
  setBikeMaterialProperty: (category, property, value) =>
    set((state) => ({
      bikeMaterials: {
        ...state.bikeMaterials,
        [category]: {
          ...state.bikeMaterials[category],
          [property]: value,
        },
      },
    })),
  resetBikeMaterials: () => set({ bikeMaterials: DEFAULT_BIKE_MATERIALS }),

  guitarMaterials: DEFAULT_GUITAR_MATERIALS,
  setGuitarMaterialProperty: (category, property, value) =>
    set((state) => ({
      guitarMaterials: {
        ...state.guitarMaterials,
        [category]: {
          ...state.guitarMaterials[category],
          [property]: value,
        },
      },
    })),
  resetGuitarMaterials: () =>
    set({ guitarMaterials: DEFAULT_GUITAR_MATERIALS }),

  keyboardDisplayStyle: "status",
  setKeyboardDisplayStyle: (style) => set({ keyboardDisplayStyle: style }),
  keyboardDisplayTheme: "amber",
  setKeyboardDisplayTheme: (theme) => set({ keyboardDisplayTheme: theme }),
  keyboardDisplayBrightness: 1.0,
  setKeyboardDisplayBrightness: (brightness) =>
    set({ keyboardDisplayBrightness: brightness }),

  watchFaceStyle: "wayfinder",
  setWatchFaceStyle: (style) => set({ watchFaceStyle: style }),
  toggleWatchFaceStyle: () =>
    set((state) => ({
      watchFaceStyle:
        state.watchFaceStyle === "modular" ? "wayfinder" : "modular",
    })),
  watchNightMode: false,
  toggleWatchNightMode: () =>
    set((state) => ({ watchNightMode: !state.watchNightMode })),

  activeModel: "watch",
  setActiveModel: (model) =>
    set({
      activeModel: model,
      cameraPosition: MODEL_CAMERA_POSITIONS[model],
      cameraTarget: MODEL_CAMERA_TARGETS[model],
      cameraFov: MODEL_CAMERA_FOV[model],
      cameraMinDistance: MODEL_CAMERA_DISTANCES[model].min,
      cameraMaxDistance: MODEL_CAMERA_DISTANCES[model].max,
      isExploded: false,
      showLabels: false,
      focus: false,
    }),

  isExploded: false,
  toggleExploded: () => set((state) => ({ isExploded: !state.isExploded })),
  setExploded: (val) => set({ isExploded: val }),

  showLabels: false,
  toggleLabels: () => set((state) => ({ showLabels: !state.showLabels })),
  setLabels: (val) => set({ showLabels: val }),

  showFloor: false,
  toggleFloor: () => set((state) => ({ showFloor: !state.showFloor })),
  setFloor: (val) => set({ showFloor: val }),

  focus: false,
  toggleFocus: () => set((state) => ({ focus: !state.focus })),
  setFocus: (val) => set({ focus: val }),

  cameraTarget: MODEL_CAMERA_TARGETS["watch"],
  setCameraTarget: (target) => set({ cameraTarget: target }),

  cameraFov: MODEL_CAMERA_FOV["watch"],
  setCameraFov: (fov) => set({ cameraFov: fov }),

  cameraPosition: MODEL_CAMERA_POSITIONS["watch"],
  setCameraPosition: (pos) => set({ cameraPosition: pos }),

  cameraMinDistance: MODEL_CAMERA_DISTANCES["watch"].min,
  cameraMaxDistance: MODEL_CAMERA_DISTANCES["watch"].max,
}));
