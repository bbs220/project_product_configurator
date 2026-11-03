"use client";

import { useRef, useEffect } from "react";
import { PerspectiveCamera, OrbitControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  useConfiguratorStore,
  MODEL_CAMERA_TARGETS,
  MODEL_EXPLODED_CAMERA_POSITIONS,
  MODEL_EXPLODED_CAMERA_TARGETS,
  type ConfiguratorModel,
} from "@/stores/useConfiguratorStore";
import {
  MODEL_FOCUS_TARGETS,
  getFocusTarget,
} from "@/constants/modelFocusPositions";
import { useTweakpane } from "@/hooks/useTweakpane";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

// maximum pan distance offsets allowed from model center
const PAN_LIMITS = {
  x: 2.0,
  y: 1.2,
  z: 1.5,
};

// generate initial tweakpane configuration from model focus targets
function createFocusTweakpaneConfig(): Record<string, unknown> {
  const config: Record<string, unknown> = {};

  (Object.keys(MODEL_FOCUS_TARGETS) as ConfiguratorModel[]).forEach((model) => {
    const parts = MODEL_FOCUS_TARGETS[model];
    Object.keys(parts).forEach((part) => {
      const target = parts[part];
      config[`${model}_${part}_pos`] = {
        value: {
          x: target.position[0],
          y: target.position[1],
          z: target.position[2],
        },
        folder: `${model}/${part}`,
        label: "cam pos",
        step: 0.05,
      };
      config[`${model}_${part}_target`] = {
        value: {
          x: target.target[0],
          y: target.target[1],
          z: target.target[2],
        },
        folder: `${model}/${part}`,
        label: "look target",
        step: 0.05,
      };
    });
  });

  return config;
}

// stable initial focus configuration for tweakpane bindings
const initialFocusConfig = createFocusTweakpaneConfig();

export default function CameraRig() {
  const {
    cameraPosition,
    cameraTarget,
    cameraFov,
    cameraMinDistance,
    cameraMaxDistance,
    isExploded,
    activeModel,
    activeTab,
    focus,
  } = useConfiguratorStore();
  const controlsRef = useRef<OrbitControlsImpl>(null);

  const targetPos = useRef(new THREE.Vector3(...cameraPosition));
  const targetLook = useRef(new THREE.Vector3(...cameraTarget));
  const isLerping = useRef(false);

  // register tweakpane controls for all model focus targets
  const focusParams = useTweakpane(
    { title: "🎯 Part Focus", expanded: true },
    initialFocusConfig,
  );

  // synchronize tweakpane adjustments with model focus targets
  useEffect(() => {
    (Object.keys(MODEL_FOCUS_TARGETS) as ConfiguratorModel[]).forEach(
      (model) => {
        const parts = MODEL_FOCUS_TARGETS[model];
        Object.keys(parts).forEach((part) => {
          const posVal = focusParams[`${model}_${part}_pos`] as
            | { x: number; y: number; z: number }
            | undefined;
          const targetVal = focusParams[`${model}_${part}_target`] as
            | { x: number; y: number; z: number }
            | undefined;

          if (posVal) {
            parts[part].position = [posVal.x, posVal.y, posVal.z];
          }
          if (targetVal) {
            parts[part].target = [targetVal.x, targetVal.y, targetVal.z];
          }

          // apply active focus coordinates immediately
          if (focus && model === activeModel && part === activeTab) {
            if (posVal) {
              targetPos.current.set(posVal.x, posVal.y, posVal.z);
            }
            if (targetVal) {
              targetLook.current.set(targetVal.x, targetVal.y, targetVal.z);
            }
            isLerping.current = true;
          }
        });
      },
    );
  }, [focusParams, focus, activeModel, activeTab]);

  useEffect(() => {
    // Determine the desired camera state based on activeModel and isExploded
    if (isExploded) {
      targetPos.current.set(...MODEL_EXPLODED_CAMERA_POSITIONS[activeModel]);
      targetLook.current.set(...MODEL_EXPLODED_CAMERA_TARGETS[activeModel]);
    } else if (focus) {
      const focusTarget = getFocusTarget(activeModel, activeTab);
      if (focusTarget) {
        targetPos.current.set(...focusTarget.position);
        targetLook.current.set(...focusTarget.target);
      } else {
        targetPos.current.set(...cameraPosition);
        targetLook.current.set(...cameraTarget);
      }
    } else {
      if (["watch", "guitar", "keyboard", "mtBike"].includes(activeModel)) {
        targetPos.current.set(...cameraPosition);
        targetLook.current.set(...cameraTarget);
      }
    }
    isLerping.current = true;
  }, [
    isExploded,
    activeModel,
    focus,
    activeTab,
    cameraPosition,
    cameraTarget,
  ]);

  useFrame((state, delta) => {
    if (!controlsRef.current) return;

    if (!focus && !isExploded) {
      // clamp pan target and position within bounding box
      const center = isExploded
        ? MODEL_EXPLODED_CAMERA_TARGETS[activeModel]
        : MODEL_CAMERA_TARGETS[activeModel];

      const currentX = controlsRef.current.target.x;
      const currentY = controlsRef.current.target.y;
      const currentZ = controlsRef.current.target.z;

      const clampedX = THREE.MathUtils.clamp(
        currentX,
        center[0] - PAN_LIMITS.x,
        center[0] + PAN_LIMITS.x,
      );
      const clampedY = THREE.MathUtils.clamp(
        currentY,
        center[1] - PAN_LIMITS.y,
        center[1] + PAN_LIMITS.y,
      );
      const clampedZ = THREE.MathUtils.clamp(
        currentZ,
        center[2] - PAN_LIMITS.z,
        center[2] + PAN_LIMITS.z,
      );

      const diffX = clampedX - currentX;
      const diffY = clampedY - currentY;
      const diffZ = clampedZ - currentZ;

      if (diffX !== 0 || diffY !== 0 || diffZ !== 0) {
        controlsRef.current.target.set(clampedX, clampedY, clampedZ);
        state.camera.position.x += diffX;
        state.camera.position.y += diffY;
        state.camera.position.z += diffZ;
      }
    }

    if (isLerping.current) {
      const speed = 4 * delta;
      state.camera.position.lerp(targetPos.current, speed);
      controlsRef.current.target.lerp(targetLook.current, speed);
      controlsRef.current.update();

      if (
        state.camera.position.distanceTo(targetPos.current) < 0.05 &&
        controlsRef.current.target.distanceTo(targetLook.current) < 0.05
      ) {
        isLerping.current = false;
      }
    }
  });

  return (
    <>
      <PerspectiveCamera
        makeDefault
        position={cameraPosition}
        fov={cameraFov}
      />
      <OrbitControls
        ref={controlsRef}
        makeDefault
        maxPolarAngle={1.5}
        maxDistance={cameraMaxDistance}
        minDistance={cameraMinDistance}
        target={cameraTarget}
        onStart={() => {
          isLerping.current = false;
        }}
        enablePan={!focus}
        screenSpacePanning={true}
      />
    </>
  );
}
