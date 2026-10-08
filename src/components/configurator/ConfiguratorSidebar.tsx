"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  PanelLeftClose,
  PanelLeftOpen,
  Settings2,
  type LucideIcon,
} from "lucide-react";
import { useSidebarStore } from "@/stores/useSidebarStore";

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

  const { isSidebarOpen, toggleSidebar } = useSidebarStore();
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

  return (
    <aside
      className={`absolute top-0 left-0 bottom-0 z-10 flex flex-col h-full bg-white/90 dark:bg-black/90 backdrop-blur-md border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ${
        isSidebarOpen ? "w-72" : "w-14"
      }`}
    >
      {/* header row with collapse toggle */}
      <div className="flex items-center px-2 py-3 border-b border-gray-200 dark:border-gray-800">
        <div
          className={`overflow-hidden transition-all duration-300 flex items-center ${
            isSidebarOpen ? "w-32 opacity-100" : "w-0 opacity-0"
          }`}
        >
          <span className="pl-2 text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 whitespace-nowrap">
            Inspector
          </span>
        </div>
        <button
          onClick={toggleSidebar}
          className="ml-auto shrink-0 w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
        >
          {isSidebarOpen ? (
            <PanelLeftClose className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          ) : (
            <PanelLeftOpen className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          )}
        </button>
      </div>

      {/* tab strip */}
      <nav className="flex flex-col gap-1 p-2 border-b border-gray-200 dark:border-gray-800">
        {tabs.map(({ id, label, icon: Icon }) => (
          <div key={id} className="relative group">
            <button
              onClick={() => {
                setActiveTab(id);
                if (!isSidebarOpen) toggleSidebar();
              }}
              className={`w-full flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                activeTab === id && isSidebarOpen
                  ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <div
                className={`overflow-hidden transition-all duration-300 text-left flex items-center ${
                  isSidebarOpen ? "w-40 opacity-100 ml-3" : "w-0 opacity-0 ml-0"
                }`}
              >
                <span className="whitespace-nowrap">{label}</span>
              </div>
            </button>

            {/* discord-style tooltip — only visible when sidebar is collapsed */}
            {!isSidebarOpen && (
              <div className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-150 ease-out">
                {/* arrow */}
                <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-0 h-0 border-y-4 border-y-transparent border-r-4 border-r-gray-900 dark:border-r-white" />
                <div className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-semibold px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-lg">
                  {label}
                </div>
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* panel content */}
      <div
        className={`flex-1 overflow-hidden transition-opacity duration-300 ${
          isSidebarOpen
            ? "opacity-100 delay-100"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="w-71.75 p-4 h-full overflow-y-auto">
          {renderPanel()}
        </div>
      </div>
    </aside>
  );
};

export default ConfiguratorSidebar;
