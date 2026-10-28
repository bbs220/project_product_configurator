import {
  Activity,
  CircleDot,
  Clock,
  Compass,
  Layers,
  Moon,
  Palette,
  RotateCcw,
  Sun,
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
  { id: "face", label: "Face", icon: Clock },
  { id: "back", label: "Back", icon: Activity },
];

const categoryInfo: Record<string, { title: string; description: string }> = {
  case: {
    title: "Case & Finish",
    description: "Customize the watch chassis, bezel, and connector materials.",
  },
  band: {
    title: "Band & Stitching",
    description:
      "Select strap materials, contrast stitching, and buckle finishes.",
  },
  crown: {
    title: "Crown & Buttons",
    description:
      "Personalize the digital crown, accent ring, and side buttons.",
  },
  face: {
    title: "Display & Face",
    description:
      "Choose watch face styles, complications, and ultra night mode.",
  },
  back: {
    title: "Back Plate & Sensor",
    description:
      "Customize the ceramic backplate and optical biometric sensor array.",
  },
};

// watch configuration panel with five categories
export default function WatchPanel({ activeTab }: WatchPanelProps) {
  const {
    watchMaterials,
    setWatchMaterialProperty,
    watchFaceStyle,
    setWatchFaceStyle,
    watchNightMode,
    toggleWatchNightMode,
  } = useConfiguratorStore();

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
    if (activeTab === "face") {
      setWatchFaceStyle("wayfinder");
      if (watchNightMode) {
        toggleWatchNightMode();
      }
      return;
    }
    const defaults = DEFAULT_WATCH_MATERIALS[validCategory];
    setWatchMaterialProperty(validCategory, "color", defaults.color);
    setWatchMaterialProperty(validCategory, "roughness", defaults.roughness);
    setWatchMaterialProperty(validCategory, "metalness", defaults.metalness);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* category header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-gray-900 dark:text-white capitalize">
            {currentCategory.title}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {currentCategory.description}
          </p>
        </div>
        <button
          type="button"
          onClick={handleResetCategory}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-gray-800 rounded-lg transition-colors shrink-0"
          title="Reset part to default"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {activeTab === "face" && (
        <div className="flex flex-col gap-3">
          {/* watch face style selector and night mode controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* modular ultra option card */}
            <button
              type="button"
              onClick={() => setWatchFaceStyle("modular")}
              className={`flex flex-col items-start gap-1.5 p-3.5 rounded-xl border text-left transition-all ${
                watchFaceStyle === "modular"
                  ? "bg-blue-50/70 dark:bg-blue-950/40 border-blue-500 shadow-sm"
                  : "bg-white dark:bg-zinc-900/60 border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-500" />
                <span className="text-xs font-bold text-gray-900 dark:text-white">
                  Modular Ultra
                </span>
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300">
                  Digital
                </span>
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
                Official digital face with live time, complications, fitness metrics, and activity rings.
              </p>
            </button>

            {/* wayfinder option card */}
            <button
              type="button"
              onClick={() => setWatchFaceStyle("wayfinder")}
              className={`flex flex-col items-start gap-1.5 p-3.5 rounded-xl border text-left transition-all ${
                watchFaceStyle === "wayfinder"
                  ? "bg-blue-50/70 dark:bg-blue-950/40 border-blue-500 shadow-sm"
                  : "bg-white dark:bg-zinc-900/60 border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-bold text-gray-900 dark:text-white">
                  Wayfinder
                </span>
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                  Analog
                </span>
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
                Precision analog dial with compass coordinates, hour numerals, and sweeping second hand.
              </p>
            </button>
          </div>

          {/* night mode toggle banner */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-white dark:bg-zinc-900/60 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                  watchNightMode
                    ? "bg-red-500/20 text-red-500"
                    : "bg-gray-100 dark:bg-zinc-800 text-gray-500"
                }`}
              >
                {watchNightMode ? (
                  <Moon className="w-4 h-4" />
                ) : (
                  <Sun className="w-4 h-4" />
                )}
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-900 dark:text-white">
                  Ultra Night Mode
                </h3>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                  Monochromatic red OLED night vision display
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={toggleWatchNightMode}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                watchNightMode ? "bg-red-600" : "bg-gray-300 dark:bg-zinc-700"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  watchNightMode ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      )}

      {/* controls layout container */}
      {activeTab !== "face" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* base color picker section */}
          <div className="flex flex-col gap-2.5 p-4 rounded-xl bg-white dark:bg-zinc-900/60 border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                Base Color
              </span>
            <div className="flex items-center gap-1.5">
              <div
                className="w-3.5 h-3.5 rounded-full border border-black/10 dark:border-white/10 shrink-0"
                style={{ backgroundColor: currentMaterial.color }}
              />
              <span className="text-xs font-mono font-medium px-1.5 py-0.5 rounded bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-gray-200">
                {currentMaterial.color.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 [&_.react-colorful]:w-full! [&_.react-colorful]:h-36!">
            <HexColorPicker
              color={currentMaterial.color}
              onChange={(hex) =>
                setWatchMaterialProperty(validCategory, "color", hex)
              }
            />
          </div>
        </div>

        {/* surface finish properties section */}
        <div className="flex flex-col justify-between p-4 rounded-xl bg-white dark:bg-zinc-900/60 border border-gray-200 dark:border-gray-800 shadow-sm gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">
            Surface Properties
          </span>

          {/* surface roughness slider control */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
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
                  parseFloat(e.target.value),
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
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
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
                  parseFloat(e.target.value),
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
      )}
    </div>
  );
}
