import { Activity, CircleDot, Layers, Palette, Watch } from "lucide-react";

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

        <div className="p-4 border border-dashed border-gray-300 dark:border-gray-800 rounded-xl flex items-center justify-center text-gray-400 text-sm">
          Controls coming soon...
        </div>
      </div>
    </div>
  );
}
