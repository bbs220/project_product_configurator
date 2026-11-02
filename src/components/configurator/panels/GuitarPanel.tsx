import {
  Activity,
  CircleDot,
  Layers,
  Music,
  Palette,
  RotateCcw,
  Sliders,
  Sparkles,
} from "lucide-react";
import { HexColorPicker } from "react-colorful";
import {
  useConfiguratorStore,
  GuitarMaterialCategory,
  DEFAULT_GUITAR_MATERIALS,
} from "@/stores/useConfiguratorStore";

type GuitarPanelProps = {
  activeTab: string;
};

// configuration tabs for stratocaster guitar customization
export const guitarTabs = [
  { id: "body", label: "Body", icon: Palette },
  { id: "pickguard", label: "Pickguard", icon: Layers },
  { id: "neck", label: "Neck & Head", icon: Music },
  { id: "fretboard", label: "Fretboard", icon: Activity },
  { id: "pickups", label: "Pickups", icon: Sliders },
  { id: "hardware", label: "Bridge Hardware", icon: Sparkles },
  { id: "knobs", label: "Volume Knobs", icon: CircleDot },
];

const categoryInfo: Record<string, { title: string; description: string }> = {
  body: {
    title: "Solid Alder Wood Body",
    description: "Contoured alder body finished in nitrocellulose lacquer.",
  },
  pickguard: {
    title: "Layered Scratchplate",
    description: "Classic three-ply beveled vintage celluloid pickguard.",
  },
  neck: {
    title: "Maple Neck & Headstock",
    description: "One-piece modern oval 'C'-shaped rock maple guitar neck.",
  },
  fretboard: {
    title: "Fretboard Wood",
    description: "Select 9.5-inch radius slab rosewood or slab maple fingerboard.",
  },
  pickups: {
    title: "Single-Coil Pickup Covers",
    description: "Vintage-wound staggered Alnico V magnetic pickup bobbins.",
  },
  hardware: {
    title: "Synchronized Tremolo Bridge",
    description: "Vintage synchronized tremolo with bent steel saddles.",
  },
  knobs: {
    title: "Skirted Control Knobs",
    description: "Embossed master volume and dual tone control potentiometers.",
  },
};

// guitar configuration panel with seven categories
export default function GuitarPanel({ activeTab }: GuitarPanelProps) {
  const { guitarMaterials, setGuitarMaterialProperty } = useConfiguratorStore();

  const validCategory: GuitarMaterialCategory =
    activeTab in DEFAULT_GUITAR_MATERIALS
      ? (activeTab as GuitarMaterialCategory)
      : "body";

  // extract current material properties
  const currentMaterial =
    guitarMaterials[validCategory] || DEFAULT_GUITAR_MATERIALS[validCategory];

  const currentCategory = categoryInfo[activeTab] || {
    title: `${activeTab} Configuration`,
    description: `Customize the guitar ${activeTab} components.`,
  };

  // reset category material properties to defaults
  const handleResetCategory = () => {
    const defaults = DEFAULT_GUITAR_MATERIALS[validCategory];
    setGuitarMaterialProperty(validCategory, "color", defaults.color);
    setGuitarMaterialProperty(validCategory, "roughness", defaults.roughness);
    setGuitarMaterialProperty(validCategory, "metalness", defaults.metalness);
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
      <div className="flex flex-col gap-4">
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

          <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 [&_.react-colorful]:w-full! [&_.react-colorful]:h-40!">
            <HexColorPicker
              color={currentMaterial.color}
              onChange={(hex) =>
                setGuitarMaterialProperty(validCategory, "color", hex)
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
                setGuitarMaterialProperty(
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
                setGuitarMaterialProperty(
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
