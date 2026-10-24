"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Settings2, type LucideIcon } from "lucide-react";

import WatchPanel, { watchTabs } from "./panels/WatchPanel";
import KeyboardPanel, { keyboardTabs } from "./panels/KeyboardPanel";
import BikePanel, { bikeTabs } from "./panels/BikePanel";
import GuitarPanel, { guitarTabs } from "./panels/GuitarPanel";

type TabDef = {
  id: string;
  label: string;
  icon: LucideIcon;
};

// Define specific configuration tabs mapping for each 3D model
const modelTabsConfig: Record<string, TabDef[]> = {
  watch: watchTabs,
  keyboard: keyboardTabs,
  mtBike: bikeTabs,
  guitar: guitarTabs,
};

const fallbackTabs: TabDef[] = [
  { id: "general", label: "General", icon: Settings2 },
];

const ConfiguratorSidebar = () => {
  const searchParams = useSearchParams();
  const modelKey = searchParams.get("model") || "watch";
  const tabs = modelTabsConfig[modelKey] || fallbackTabs;

  const [activeTab, setActiveTab] = useState<string>(tabs[0]?.id || "general");
  const [prevModelKey, setPrevModelKey] = useState<string>(modelKey);

  // Reset active tab during render when model changes (avoids useEffect cascading renders)
  if (modelKey !== prevModelKey) {
    setPrevModelKey(modelKey);
    setActiveTab(tabs[0]?.id || "general");
  }

  // Determine which panel to render
  const renderPanel = () => {
    switch (modelKey) {
      case "watch":
        return <WatchPanel activeTab={activeTab} />;
      case "keyboard":
        return <KeyboardPanel activeTab={activeTab} />;
      case "mtBike":
        return <BikePanel activeTab={activeTab} />;
      case "guitar":
        return <GuitarPanel activeTab={activeTab} />;
      default:
        return <div className="p-4 text-gray-500">Select a valid model.</div>;
    }
  };

  const modelLabels: Record<string, string> = {
    watch: "Apple Watch Ultra 2",
    mtBike: "Santa Cruz V10",
    guitar: "Fender Stratocaster 1954",
    keyboard: "Mechanical Keyboard",
  };

  return (
    <aside className="flex flex-col h-full w-full overflow-hidden">
      {/* studio header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-black/60 backdrop-blur-md">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
            Design Studio
          </span>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            {modelLabels[modelKey] || modelKey}
          </h1>
        </div>
      </div>

      {/* horizontal category tabs navigation */}
      <nav className="flex items-center gap-2 px-6 py-3 border-b border-gray-200 dark:border-gray-800 bg-white/40 dark:bg-black/40 backdrop-blur-sm overflow-x-auto">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === id
                ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-sm"
                : "bg-gray-200/60 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 hover:bg-gray-300/60 dark:hover:bg-gray-700/60"
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      {/* studio panel body */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="max-w-xl mx-auto w-full">
          {renderPanel()}
        </div>
      </div>
    </aside>
  );
};

export default ConfiguratorSidebar;
