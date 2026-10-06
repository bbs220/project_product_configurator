import { Layers, Palette, Watch } from "lucide-react";

export const watchTabs = [
  { id: "band", label: "Band", icon: Layers },
  { id: "case", label: "Case", icon: Palette },
  { id: "face", label: "Face", icon: Watch },
];

export default function WatchPanel({ activeTab }: { activeTab: string }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white capitalize">
          {activeTab} Configuration
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Customize the watch {activeTab} materials and colors.
        </p>
      </div>
      
      <div className="p-4 border border-dashed border-gray-300 dark:border-gray-800 rounded-xl flex items-center justify-center text-gray-400 text-sm">
        Controls coming soon...
      </div>
    </div>
  );
}

