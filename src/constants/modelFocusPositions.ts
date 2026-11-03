import { ConfiguratorModel } from "@/stores/useConfiguratorStore";

// focus target definition for model component framing
export type FocusCameraTarget = {
  position: [number, number, number];
  target: [number, number, number];
};

// default part focus camera coordinates for all product models
export const MODEL_FOCUS_TARGETS: Record<
  ConfiguratorModel,
  Record<string, FocusCameraTarget>
> = {
  watch: {
    case: { position: [0.8, 1.8, -2.4], target: [0, 1.0, 0] },
    band: { position: [-1.4, 1.2, -2.0], target: [-0.3, 0.9, 0] },
    crown: { position: [-0.9, 1.15, -1.3], target: [-0.15, 1.0, 0] },
    face: { position: [0, 2.4, -1.4], target: [0, 1.05, 0] },
    back: { position: [0.1, 1.1, 2.2], target: [0, 1.0, 0] },
  },
  keyboard: {
    base: { position: [0, 2.2, -2.0], target: [0, 0, 0] },
    keycaps: { position: [0, 2.4, -1.0], target: [0, 0.1, 0] },
    switches: { position: [0.9, 1.8, -0.9], target: [0.2, 0.1, 0] },
    knobs: { position: [-1.2, 1.5, -0.6], target: [-0.6, 0.2, 0] },
    display: { position: [-0.7, 1.7, -0.8], target: [-0.3, 0.2, 0] },
  },
  mtBike: {
    frame: { position: [3.2, 1.8, -3.0], target: [0, 1.0, 0] },
    fork: { position: [2.2, 1.6, 1.2], target: [1.2, 0.9, 0.3] },
    rims: { position: [2.4, 1.1, 1.5], target: [1.3, 0.6, 0.4] },
    handlebar: { position: [-1.6, 2.2, 0.9], target: [-0.8, 1.4, 0.2] },
    seat: { position: [1.6, 2.4, -0.7], target: [0.4, 1.5, -0.1] },
    chain: { position: [-1.4, 0.9, -1.1], target: [-0.4, 0.6, -0.2] },
    suspension: { position: [1.2, 1.5, -1.1], target: [0.2, 1.1, -0.1] },
  },
  guitar: {
    body: { position: [0.2, 1.8, -2.8], target: [0, 0.6, 0] },
    pickguard: { position: [0.5, 1.5, -2.0], target: [0.1, 0.7, 0] },
    neck: { position: [-0.8, 2.4, -2.0], target: [-0.2, 1.4, 0] },
    fretboard: { position: [-0.5, 2.0, -1.8], target: [-0.1, 1.2, 0] },
    pickups: { position: [-0.3, 1.4, -1.8], target: [-0.1, 0.8, 0] },
    hardware: { position: [0.6, 1.3, -1.6], target: [0.2, 0.6, 0] },
    knobs: { position: [0.8, 1.2, -1.5], target: [0.3, 0.5, 0] },
  },
};

// helper to retrieve camera focus target for active model and tab
export function getFocusTarget(
  model: ConfiguratorModel,
  tab: string,
): FocusCameraTarget | null {
  const modelTargets = MODEL_FOCUS_TARGETS[model];
  if (!modelTargets) return null;
  return modelTargets[tab] || null;
}

