import type { Group } from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import { useConfiguratorStore } from "@/stores/useConfiguratorStore";

// global reference to active product model group
let registeredProductGroup: Group | null = null;

// register active product model group for export
export function registerProductGroup(group: Group | null): void {
  registeredProductGroup = group;
}

// retrieve registered active product model group
export function getRegisteredProductGroup(): Group | null {
  return registeredProductGroup;
}

// options definition for product glb model export
export type GlbExportOptions = {
  modelKey: string;
  onProgress?: (message: string) => void;
};

// delay utility to wait for lerp animations
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// export customized three dimensional model as binary gltf
export async function exportProductGlb({
  modelKey,
  onProgress,
}: GlbExportOptions): Promise<void> {
  // check if registered product group is available
  const productGroup = getRegisteredProductGroup();
  if (!productGroup) {
    throw new Error("Active 3D product model not found");
  }

  const store = useConfiguratorStore.getState();
  const originalExploded = store.isExploded;
  const originalLabels = store.showLabels;

  try {
    // temporarily assemble model if currently in exploded view
    if (originalExploded || originalLabels) {
      onProgress?.("Aligning model components...");
      store.setExploded(false);
      store.setLabels(false);
      // allow animation lerp to settle into assembled position
      await wait(450);
    }

    onProgress?.("Packaging 3D materials & meshes...");

    // parse three dimensional scene into binary gltf buffer
    const exporter = new GLTFExporter();
    const gltfOutput = await exporter.parseAsync(productGroup, {
      binary: true,
      onlyVisible: true,
      embedImages: true,
    });

    if (!(gltfOutput instanceof ArrayBuffer)) {
      throw new Error("Expected binary GLB output from exporter");
    }

    onProgress?.("Downloading customized GLB file...");

    // trigger browser binary file download
    const blob = new Blob([gltfOutput], { type: "model/gltf-binary" });
    const url = URL.createObjectURL(blob);
    const sanitizedModel = modelKey.toLowerCase().replace(/[^a-z0-9]/g, "-");
    const filename = `forma-${sanitizedModel}-custom.glb`;

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } finally {
    // restore original exploded and label visibility states
    if (originalExploded) {
      store.setExploded(true);
    }
    if (originalLabels) {
      store.setLabels(true);
    }
  }
}

