import {
  Activity,
  CircleDot,
  Layers,
  Palette,
  RotateCcw,
  Watch,
} from "lucide-react";
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

  // reset category material properties to defaults
  const handleResetCategory = () => {
    const defaults = DEFAULT_WATCH_MATERIALS[validCategory];
    setWatchMaterialProperty(validCategory, "color", defaults.color);
    setWatchMaterialProperty(validCategory, "roughness", defaults.roughness);
    setWatchMaterialProperty(validCategory, "metalness", defaults.metalness);
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* category header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white capitalize">
            {currentCategory.title}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {currentCategory.description}
          </p>
        </div>
        <button
          type="button"
          onClick={handleResetCategory}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-gray-800 rounded-lg transition-colors shrink-0"
          title="Reset part to default"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* base color picker section */}
      <div className="flex flex-col gap-3 p-5 rounded-2xl bg-white dark:bg-zinc-900/60 border border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">
            Base Color
          </span>
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full border border-black/10 dark:border-white/10"
              style={{ backgroundColor: currentMaterial.color }}
            />
            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-gray-200">
              {currentMaterial.color.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 [&_.react-colorful]:!w-full [&_.react-colorful]:!h-48">
          <HexColorPicker
            color={currentMaterial.color}
            onChange={(hex) =>
              setWatchMaterialProperty(validCategory, "color", hex)
            }
          />
        </div>
      </div>

      {/* surface finish sliders card */}
      <div className="flex flex-col gap-6 p-5 rounded-2xl bg-white dark:bg-zinc-900/60 border border-gray-200 dark:border-gray-800 shadow-sm">
        <span className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">
          Surface Properties
        </span>

        {/* surface roughness slider control */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Roughness
            </span>
            <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
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
            className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-gray-900 dark:accent-white"
          />
          <div className="flex justify-between text-[11px] text-gray-400 font-medium">
            <span>High Gloss (0%)</span>
            <span>Matte Finish (100%)</span>
          </div>
        </div>

        {/* physical metalness slider control */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Metalness
            </span>
            <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
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
            className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-gray-900 dark:accent-white"
          />
          <div className="flex justify-between text-[11px] text-gray-400 font-medium">
            <span>Dielectric (0%)</span>
            <span>Metallic (100%)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
