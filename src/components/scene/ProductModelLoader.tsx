"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useGLTF, useAnimations } from "@react-three/drei";
import { assetPaths } from "@/lib/utils";

import { useSearchParams } from "next/navigation";

const ProductModelLoader = () => {
  const searchParams = useSearchParams();
  const modelName = searchParams.get("model") || "laFerrari";

  // ensure we don't load an invalid model if the url param is messed with
  const modelPath =
    modelName in assetPaths
      ? assetPaths[modelName as keyof typeof assetPaths]
      : assetPaths.laFerrari;

  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(modelPath);
  const { actions, names } = useAnimations(animations, group);

  // play all animations on load
  useEffect(() => {
    names.forEach((name) => {
      actions[name]?.reset().play();
    });
  }, [actions, names]);

  return (
    <group ref={group} position={[0, 0, 0]} scale={[1, 1, 1]} castShadow>
      <primitive object={scene} />
    </group>
  );
};

export default ProductModelLoader;
