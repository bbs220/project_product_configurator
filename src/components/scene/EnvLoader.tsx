import { Environment } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";
import { HDRLoader } from "three/examples/jsm/loaders/HDRLoader.js";
import { useTweakpane } from "../../hooks/useTweakpane";
import { hdrSet } from "@/lib/utils";

// pre extract global keys and urls to prevent react from recreating them every frame
const envKeys = Object.keys(hdrSet);
const envUrls = Object.values(hdrSet);

// auto generate the tweakpane dropdown options directly from the asset bank
const envOptions = envKeys.reduce(
  (acc, key) => {
    acc[key] = key;
    return acc;
  },
  {} as Record<string, string>,
);

const BackgroundLight = () => {
  // auto load and cache all hdris simultaneously using the updated loader
  const envTextures = useLoader(HDRLoader, envUrls);

  // strictly apply equirectangular mapping to all loaded textures
  useMemo(() => {
    envTextures.forEach((tex) => {
      tex.mapping = THREE.EquirectangularReflectionMapping;
    });
  }, [envTextures]);

  // configure debug tools with dynamic dropdown options
  const { activeEnvironment, showBg, bgBlur } = useTweakpane(
    { title: "☀️ Scene" },
    {
      activeEnvironment: {
        value: "studioWhiteTint",
        label: "environment",
        options: envOptions,
        folder: "Environment",
      },
      showBg: { value: false, label: "show bg", folder: "Environment" },
      bgBlur: {
        value: 0.1,
        min: 0.01,
        max: 1,
        label: "bg blur",
        folder: "Environment",
      },
    },
  );

  // find the index of the currently selected environment to apply the correct texture
  const activeIndex = envKeys.indexOf(activeEnvironment as unknown as string);
  const activeSkyMap = envTextures[activeIndex];

  return (
    <Environment
      map={activeSkyMap}
      background={showBg}
      backgroundBlurriness={bgBlur}
    />
  );
};

export default BackgroundLight;
