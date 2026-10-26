import { Disc, Keyboard, Layers, RotateCcw, Settings2 } from "lucide-react";
import { HexColorPicker } from "react-colorful";
import {
  DEFAULT_KEYBOARD_MATERIALS,
  KeyboardMaterialCategory,
  useConfiguratorStore,
} from "@/stores/useConfiguratorStore";

type KeyboardPanelProps = {
  activeTab: string;
};

// configuration tabs for keyboard customization
export const keyboardTabs = [
  { id: "base", label: "Base", icon: Layers },
  { id: "keycaps", label: "Keycaps", icon: Keyboard },
  { id: "switches", label: "Switches", icon: Settings2 },
  { id: "knobs", label: "Knobs", icon: Disc },
];

const categoryInfo: Record<string, { title: string; description: string }> = {
  base: {
    title: "Chassis & Frame",
    description: "Customize the keyboard aluminum chassis and bottom weight plate finish.",
  },
  keycaps: {
    title: "Keycaps & Legends",
    description: "Personalize the primary keycap colorway and surface texture.",
  },
  switches: {
    title: "Switches & Switch Plate",
    description: "Configure the switch plate material and mechanical switch accents.",
  },
  knobs: {
    title: "Rotary Control Knobs",
    description: "Choose colors and metallic finish for the dual encoder knobs.",
  },
};

// keyboard configuration panel with four component categories
export default function KeyboardPanel({ activeTab }: KeyboardPanelProps) {
  const { keyboardMaterials, setKeyboardMaterialProperty } =
    useConfiguratorStore();

  const validCategory: KeyboardMaterialCategory =
    activeTab in DEFAULT_KEYBOARD_MATERIALS
      ? (activeTab as KeyboardMaterialCategory)
      : "base";

  // extract current material properties
  const currentMaterial =
    keyboardMaterials[validCategory] || DEFAULT_KEYBOARD_MATERIALS[validCategory];

  const currentCategory = categoryInfo[activeTab] || {
    title: `${activeTab} Configuration`,
    description: `Customize the keyboard ${activeTab} components.`,
  };

  // reset category material properties to defaults
  const handleResetCategory = () => {
    const defaults = DEFAULT_KEYBOARD_MATERIALS[validCategory];
    setKeyboardMaterialProperty(validCategory, "color", defaults.color);
    setKeyboardMaterialProperty(validCategory, "roughness", defaults.roughness);
    setKeyboardMaterialProperty(validCategory, "metalness", defaults.metalness);
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

      {/* controls layout container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* base color picker section */}
        <div className="flex flex-col gap-2.5 p-4 rounded-xl bg-white dark:bg-zinc-900/60 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">
              Color
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
                setKeyboardMaterialProperty(validCategory, "color", hex)
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
                setKeyboardMaterialProperty(
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
                setKeyboardMaterialProperty(
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
    </div>
  );
}
