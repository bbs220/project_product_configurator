import { Guitar, Layers, Settings2, Palette } from "lucide-react";

export const guitarTabs = [
  { id: "body", label: "Body", icon: Guitar },
  { id: "neck", label: "Neck", icon: Layers },
  { id: "hardware", label: "Hardware", icon: Settings2 },
  { id: "pickguard", label: "Pickguard", icon: Palette },
];

export default function GuitarPanel({ activeTab }: { activeTab: string }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white capitalize">
          {activeTab} Configuration
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Customize the guitar {activeTab} options.
        </p>
      </div>
      
      <div className="p-4 border border-dashed border-gray-300 dark:border-gray-800 rounded-xl flex items-center justify-center text-gray-400 text-sm">
        Controls coming soon...
      </div>
    </div>
  );
}

