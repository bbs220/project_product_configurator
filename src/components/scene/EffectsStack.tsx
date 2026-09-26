"use client";

import { useTweakpane } from "@/src/hooks/useTweakpane";
import { EffectComposer, SMAA, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

const EffectsStack = () => {
  const { enableVig } = useTweakpane(
    { title: "✨ Post Processing", expanded: true },
    {
      enableVig: { value: true, label: "vignette" },
    },
  );

  return (
    <EffectComposer enableNormalPass={false} renderPriority={2}>
      {enableVig && (
        <Vignette
          offset={0.5}
          darkness={0.5}
          eskil={false}
          blendFunction={BlendFunction.NORMAL}
        />
      )}
    </EffectComposer>
  );
};

export default EffectsStack;
