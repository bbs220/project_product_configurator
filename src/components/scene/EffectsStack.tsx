"use client";

import { useTweakpane } from "@/hooks/useTweakpane";
import { EffectComposer, SMAA } from "@react-three/postprocessing";

const EffectsStack = () => {
  const { enableSMAA } = useTweakpane(
    { title: "✨ Post Processing", expanded: false },
    {
      enableSMAA: { value: true, label: "smaa" },
    },
  );

  return (
    <EffectComposer enableNormalPass={false} renderPriority={2}>
      {enableSMAA && <SMAA />}
    </EffectComposer>
  );
};

export default EffectsStack;
