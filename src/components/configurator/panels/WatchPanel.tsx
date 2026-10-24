import { Activity, CircleDot, Layers, Palette, Watch } from "lucide-react";
import { HexColorPicker } from "react-colorful";
import {
  useConfiguratorStore,
  WatchMaterialCategory,
  DEFAULT_WATCH_MATERIALS,
} from "@/stores/useConfiguratorStore";

type WatchPanelProps = {
  activeTab: string;
};

// configuration tabs for watch customization
export const watchTabs = [
  { id: "case", label: "Case", icon: Palette },
  { id: "band", label: "Band", icon: Layers },
  { id: "crown", label: "Crown", icon: CircleDot },
  { id: "face", label: "Display", icon: Watch },
  { id: "back", label: "Back", icon: Activity },
];

const categoryInfo: Record<string, { title: string; description: string }> = {
  case: {
    title: "Case & Finish",
    description: "Customize the watch chassis, bezel, and connector materials.",
  },
  band: {
    title: "Band & Stitching",
    description: "Select strap materials, contrast stitching, and buckle finishes.",
  },
  crown: {
    title: "Crown & Buttons",
    description: "Personalize the digital crown, accent ring, and side buttons.",
  },
  face: {
    title: "Display & Face",
    description: "Choose watch face styles, dial color themes, and glass tones.",
  },
  back: {
    title: "Back Plate & Sensor",
    description: "Customize the ceramic backplate and optical biometric sensor array.",
  },
};

// watch configuration panel with five categories
export default function WatchPanel({ activeTab }: WatchPanelProps) {
  const { watchMaterials, setWatchMaterialProperty } = useConfiguratorStore();

  const validCategory: WatchMaterialCategory =
    activeTab in DEFAULT_WATCH_MATERIALS
      ? (activeTab as WatchMaterialCategory)
      : "case";

  // extract current material properties
  const currentMaterial =
    watchMaterials[validCategory] || DEFAULT_WATCH_MATERIALS[validCategory];

  const currentCategory = categoryInfo[activeTab] || {
    title: `${activeTab} Configuration`,
    description: `Customize the watch ${activeTab} components.`,
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex flex-col gap-6">
        <div>
          <h2 className="text-lg font-medium text-gray-900 dark:text-white capitalize">
            {currentCategory.title}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {currentCategory.description}
          </p>
        </div>

        {/* base color picker section */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Base Color
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              {currentMaterial.color.toUpperCase()}
            </span>
          </div>

          <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 [&_.react-colorful]:!w-full [&_.react-colorful]:!h-36">
            <HexColorPicker
              color={currentMaterial.color}
              onChange={(hex) =>
                setWatchMaterialProperty(validCategory, "color", hex)
              }
            />
          </div>
        </div>

        {/* surface roughness slider control */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Roughness
            </span>
            <span className="text-xs font-mono text-gray-600 dark:text-gray-400">
              {Math.round(currentMaterial.roughness * 100)}%
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={currentMaterial.roughness}
            onChange={(e) =>
              setWatchMaterialProperty(
                validCategory,
                "roughness",
                parseFloat(e.target.value)
              )
            }
            className="w-full h-1.5 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-gray-900 dark:accent-white"
          />
          <div className="flex justify-between text-[10px] text-gray-400">
            <span>Glossy</span>
            <span>Matte</span>
          </div>
        </div>

        {/* physical metalness slider control */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Metalness
            </span>
            <span className="text-xs font-mono text-gray-600 dark:text-gray-400">
              {Math.round(currentMaterial.metalness * 100)}%
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={currentMaterial.metalness}
            onChange={(e) =>
              setWatchMaterialProperty(
                validCategory,
                "metalness",
                parseFloat(e.target.value)
              )
            }
            className="w-full h-1.5 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-gray-900 dark:accent-white"
          />
          <div className="flex justify-between text-[10px] text-gray-400">
            <span>Dielectric</span>
            <span>Metallic</span>
          </div>
        </div>
      </div>
    </div>
  );
}
