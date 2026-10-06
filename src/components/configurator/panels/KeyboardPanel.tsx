import { Layers, Keyboard, Settings2, Disc } from "lucide-react";

export const keyboardTabs = [
  { id: "base", label: "Base", icon: Layers },
  { id: "keycaps", label: "Keycaps", icon: Keyboard },
  { id: "switches", label: "Switches", icon: Settings2 },
  { id: "knobs", label: "Knobs", icon: Disc },
];

export default function KeyboardPanel({ activeTab }: { activeTab: string }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white capitalize">
          {activeTab} Configuration
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Customize the keyboard {activeTab} options.
        </p>
      </div>
      
      <div className="p-4 border border-dashed border-gray-300 dark:border-gray-800 rounded-xl flex items-center justify-center text-gray-400 text-sm">
        Controls coming soon...
      </div>
    </div>
  );
}

