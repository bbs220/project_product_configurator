"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, startTransition, useRef } from "react";
import type { Group } from "three";
import { registerProductGroup } from "@/lib/glbExport";
import { WatchModel } from "../gltfjsx/WatchModel";
import { KeyboardModel } from "../gltfjsx/KeyboardModel";
import { MTBikeModel } from "../gltfjsx/MTBikeModel";
import { GuitarModel } from "../gltfjsx/GuitarModel";
import { useConfiguratorStore, ConfiguratorModel } from "@/stores/useConfiguratorStore";

const ProductModelLoader = () => {
  const searchParams = useSearchParams();
  const modelName = (searchParams.get("model") as ConfiguratorModel) || "watch";
  
  const activeModel = useConfiguratorStore((state) => state.activeModel);
  const setActiveModel = useConfiguratorStore((state) => state.setActiveModel);
  const groupRef = useRef<Group>(null);

  // synchronize active model ref with glb exporter module
  useEffect(() => {
    if (groupRef.current) {
      registerProductGroup(groupRef.current);
    }
    return () => {
      registerProductGroup(null);
    };
  }, [activeModel]);

  useEffect(() => {
    if (["watch", "keyboard", "mtBike", "guitar"].includes(modelName) && modelName !== activeModel) {
      startTransition(() => {
        setActiveModel(modelName);
      });
    }
  }, [modelName, activeModel, setActiveModel]);

  return (
    <group ref={groupRef} position={[0, 0, 0]} scale={[1, 1, 1]}>
      {activeModel === "watch" && <WatchModel />}
      {activeModel === "keyboard" && <KeyboardModel />}
      {activeModel === "mtBike" && <MTBikeModel />}
      {activeModel === "guitar" && <GuitarModel />}
    </group>
  );
};

export default ProductModelLoader;
