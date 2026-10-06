"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { WatchModel } from "../gltfjsx/WatchModel";
import { KeyboardModel } from "../gltfjsx/KeyboardModel";
import { MTBikeModel } from "../gltfjsx/MTBikeModel";
import { GuitarModel } from "../gltfjsx/GuitarModel";
import { useConfiguratorStore, ConfiguratorModel } from "@/stores/useConfiguratorStore";

const ProductModelLoader = () => {
  const searchParams = useSearchParams();
  const modelName = (searchParams.get("model") as ConfiguratorModel) || "watch";
  
  const setActiveModel = useConfiguratorStore((state) => state.setActiveModel);

  useEffect(() => {
    if (["watch", "keyboard", "mtBike", "guitar"].includes(modelName)) {
      setActiveModel(modelName);
    }
  }, [modelName, setActiveModel]);

  return (
    <group position={[0, 0, 0]} scale={[1, 1, 1]}>
      {modelName === "watch" && <WatchModel />}
      {modelName === "keyboard" && <KeyboardModel />}
      {modelName === "mtBike" && <MTBikeModel />}
      {modelName === "guitar" && <GuitarModel />}
    </group>
  );
};

export default ProductModelLoader;
