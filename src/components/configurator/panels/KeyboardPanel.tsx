import {
  Activity,
  Clock,
  Disc,
  Gamepad2,
  Keyboard,
  Layers,
  RotateCcw,
  Settings2,
  SunMedium,
  Terminal,
  Tv,
} from "lucide-react";
import { HexColorPicker } from "react-colorful";
import {
  DEFAULT_KEYBOARD_MATERIALS,
  KeyboardDisplayStyle,
  KeyboardDisplayTheme,
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
  { id: "switches", label: "Switch Plate", icon: Settings2 },
  { id: "knobs", label: "Knobs", icon: Disc },
  { id: "display", label: "Display", icon: Tv },
];

const categoryInfo: Record<string, { title: string; description: string }> = {
  base: {
    title: "Chassis & Frame",
    description:
      "Customize the keyboard aluminum chassis and bottom weight plate finish.",
  },
  keycaps: {
    title: "Keycaps & Legends",
    description: "Personalize the primary keycap colorway and surface texture.",
  },
  switches: {
    title: "Switch Plate",
    description: "Configure the switch plate material and finish.",
  },
  knobs: {
    title: "Rotary Control Knobs",
    description: "Choose colors and metallic finish for the dual encoder knobs.",
  },
  display: {
    title: "OLED Info Display",
    description:
      "Configure real-time screen modes, color themes, and brightness.",
  },
};

// available display mode definitions
const DISPLAY_MODES: Array<{
  id: KeyboardDisplayStyle;
  title: string;
  desc: string;
  icon: typeof Clock;
}> = [
  {
    id: "status",
    title: "Status & Clock",
    desc: "Digital clock, battery level, layer indicator & telemetry",
    icon: Clock,
  },
  {
    id: "matrix",
    title: "Matrix Stream",
    desc: "Falling digital code rain & live performance telemetry",
    icon: Terminal,
  },
  {
    id: "audio",
    title: "Audio Spectrum",
    desc: "Dynamic equalizer frequency bars & stereo vu meters",
    icon: Activity,
  },
  {
    id: "retro",
    title: "Retro Arcade",
    desc: "Animated pixel companion mascot & wpm typing gauge",
    icon: Gamepad2,
  },
];

// available display color themes
const DISPLAY_THEMES: Array<{
  id: KeyboardDisplayTheme;
  label: string;
  color: string;
}> = [
  { id: "amber", label: "Amber", color: "#f59e0b" },
  { id: "cyber", label: "Cyber", color: "#06b6d4" },
  { id: "matrix", label: "Matrix", color: "#10b981" },
  { id: "neon", label: "Neon", color: "#c084fc" },
  { id: "white", label: "White", color: "#f4f4f5" },
];

// keyboard configuration panel with four component categories
export default function KeyboardPanel({ activeTab }: KeyboardPanelProps) {
  const {
    keyboardMaterials,
    setKeyboardMaterialProperty,
    keyboardDisplayStyle,
    setKeyboardDisplayStyle,
    keyboardDisplayTheme,
    setKeyboardDisplayTheme,
    keyboardDisplayBrightness,
    setKeyboardDisplayBrightness,
  } = useConfiguratorStore();

  const validCategory: KeyboardMaterialCategory =
    activeTab in DEFAULT_KEYBOARD_MATERIALS
      ? (activeTab as KeyboardMaterialCategory)
      : "base";

  // extract current material properties
  const currentMaterial =
    keyboardMaterials[validCategory] ||
    DEFAULT_KEYBOARD_MATERIALS[validCategory];

  const currentCategory = categoryInfo[activeTab] || {
    title: `${activeTab} Configuration`,
    description: `Customize the keyboard ${activeTab} components.`,
  };

  // reset category material properties to defaults
  const handleResetCategory = () => {
    if (activeTab === "display") {
      setKeyboardDisplayStyle("status");
      setKeyboardDisplayTheme("amber");
      setKeyboardDisplayBrightness(1.0);
      return;
    }

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

      {activeTab === "display" ? (
        <div className="flex flex-col gap-4">
          {/* screen style selector section */}
          <div className="flex flex-col gap-2.5 p-4 rounded-xl bg-white dark:bg-zinc-900/60 border border-gray-200 dark:border-gray-800 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">
              Display Mode
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {DISPLAY_MODES.map(({ id, title, desc, icon: ModeIcon }) => {
                const isActive = keyboardDisplayStyle === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setKeyboardDisplayStyle(id)}
                    className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                      isActive
                        ? "bg-blue-50/70 dark:bg-blue-950/40 border-blue-500 shadow-sm"
                        : "bg-gray-50/50 dark:bg-zinc-800/40 border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg shrink-0 ${
                        isActive
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200/80 dark:bg-zinc-700 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      <ModeIcon className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-bold text-gray-900 dark:text-white">
                        {title}
                      </span>
                      <span className="text-[11px] text-gray-500 dark:text-gray-400 leading-tight">
                        {desc}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {/* color theme selector */}
            <div className="flex flex-col justify-between p-4 rounded-xl bg-white dark:bg-zinc-900/60 border border-gray-200 dark:border-gray-800 shadow-sm gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                OLED Color Theme
              </span>
              <div className="grid grid-cols-5 gap-2">
                {DISPLAY_THEMES.map(({ id, label, color }) => {
                  const isActive = keyboardDisplayTheme === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setKeyboardDisplayTheme(id)}
                      className={`flex flex-col items-center gap-1.5 p-2 rounded-lg border transition-all ${
                        isActive
                          ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 ring-2 ring-blue-500/20"
                          : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
                      }`}
                      title={label}
                    >
                      <div
                        className="w-5 h-5 rounded-full border border-black/10 dark:border-white/10 shadow-sm"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-[10px] font-medium text-gray-600 dark:text-gray-400">
                        {label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* display brightness slider */}
            <div className="flex flex-col justify-between p-4 rounded-xl bg-white dark:bg-zinc-900/60 border border-gray-200 dark:border-gray-800 shadow-sm gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  Screen Glow
                </span>
                <span className="text-xs font-mono font-medium px-1.5 py-0.5 rounded bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-gray-200">
                  {Math.round(keyboardDisplayBrightness * 100)}%
                </span>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <SunMedium className="w-4 h-4 text-gray-400 shrink-0" />
                  <input
                    type="range"
                    min={0.1}
                    max={2.0}
                    step={0.05}
                    value={keyboardDisplayBrightness}
                    onChange={(e) =>
                      setKeyboardDisplayBrightness(parseFloat(e.target.value))
                    }
                    className="w-full h-1.5 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-gray-900 dark:accent-white"
                  />
                </div>
                <div className="flex justify-between text-[10px] text-gray-400">
                  <span>Dim</span>
                  <span>Vibrant Glow</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* controls layout container */
        <div className="flex flex-col gap-4">
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

            <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 [&_.react-colorful]:w-full! [&_.react-colorful]:h-40!">
              <HexColorPicker
                color={currentMaterial.color}
                onChange={(hex) =>
                  setKeyboardMaterialProperty(validCategory, "color", hex)
                }
              />
            </div>
          </div>

          {/* surface finish properties section */}
          <div className="flex flex-col justify-between p-4 rounded-xl bg-white dark:bg-zinc-900/60 border border-gray-200 dark:border-gray-800 shadow-sm gap-4">
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
      )}
    </div>
  );
}
