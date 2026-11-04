import { ConfiguratorModel } from "@/stores/useConfiguratorStore";

// focus target definition for model component framing
export type FocusCameraTarget = {
  position: [number, number, number];
  target: [number, number, number];
  distance?: number;
};

// default part focus camera coordinates for all product models
export const MODEL_FOCUS_TARGETS: Record<
  ConfiguratorModel,
  Record<string, FocusCameraTarget>
> = {
  watch: {
    case: {
      position: [2.45, 1.7, -1.65],
      target: [-0.2, 0.9, -0.1],
      distance: 2.05,
    },
    band: { position: [-1.15, 1.15, 2.2], target: [0, 1.0, 0], distance: 1.88 },
    crown: {
      position: [-3.75, 1.15, -0.75],
      target: [-0.15, 1.35, -0.5],
      distance: 1.5,
    },
    face: {
      position: [0, 1.1, -0.46],
      target: [-0.01, 0.85, -0.1],
      distance: 1.95,
    },
    back: {
      position: [2.5, 1.2, 3.45],
      target: [-0.05, 1.15, -0.6],
      distance: 1.5,
    },
  },
  keyboard: {
    base: {
      position: [2.1, 0.7, -1.55],
      target: [0.1, -0.25, 0.3],
      distance: 1.66,
    },
    keycaps: {
      position: [0, 2.4, -1.21],
      target: [-0.05, -0.4, 0.25],
      distance: 1.26,
    },
    switches: {
      position: [0, 2.4, -1.21],
      target: [-0.05, -0.4, 0.25],
      distance: 1.26,
    },
    knobs: {
      position: [-1.3, 0.45, -0.8],
      target: [-0.55, -0.25, 1.2],
      distance: 1.55,
    },
    display: {
      position: [-0.9, 1.7, -0.6],
      target: [-0.85, -1.05, 0.3],
      distance: 1.75,
    },
  },
  mtBike: {
    frame: { position: [3.2, 1.8, -0.45], target: [0, 1.0, 0], distance: 1.85 },
    wheels: {
      position: [5.9, 0.9, -0.3],
      target: [0.9, 0.6, -0.8],
      distance: 1.5,
    },
    suspension: {
      position: [3.2, 1.8, -0.75],
      target: [-0.8, 0.55, 0.5],
      distance: 1.6,
    },
    drivetrain: {
      position: [2.25, 0.9, -1.1],
      target: [-0.8, 0.45, 0.8],
      distance: 1.38,
    },
  },
  guitar: {
    body: {
      position: [0.25, 0.55, -4.6],
      target: [0.05, 0.35, 1.4],
      distance: 2.9,
    },
    neck: {
      position: [0, 0.1, -0.2],
      target: [0.05, 1.25, 1.25],
      distance: 4.72,
    },
    hardware: {
      position: [0.25, 0.1, -2.05],
      target: [-0.15, 0.3, 1.05],
      distance: 1.8,
    },
    pickguard: {
      position: [-0.15, 0.55, -4.6],
      target: [0.05, 0.4, 1.4],
      distance: 2.45,
    },
  },
};

// compute effective camera position accounting for optional zoom distance
export function getEffectiveCameraPosition(
  target: FocusCameraTarget,
): [number, number, number] {
  if (typeof target.distance !== "number" || target.distance <= 0) {
    return target.position;
  }
  const dx = target.position[0] - target.target[0];
  const dy = target.position[1] - target.target[1];
  const dz = target.position[2] - target.target[2];
  const currentDist = Math.hypot(dx, dy, dz);
  if (currentDist < 0.0001) {
    return target.position;
  }
  const scale = target.distance / currentDist;
  return [
    target.target[0] + dx * scale,
    target.target[1] + dy * scale,
    target.target[2] + dz * scale,
  ];
}

// helper to retrieve camera focus target for active model and tab
export function getFocusTarget(
  model: ConfiguratorModel,
  tab: string,
): FocusCameraTarget | null {
  const modelTargets = MODEL_FOCUS_TARGETS[model];
  if (!modelTargets) return null;
  return modelTargets[tab] || null;
}
