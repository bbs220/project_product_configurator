"use client";

import { useState } from "react";
import {
  PanelLeftClose,
  PanelLeftOpen,
  Palette,
  Disc,
  Layers,
  Settings2,
} from "lucide-react";
import { useSidebarStore } from "@/stores/useSidebarStore";

// sidebar tab definitions
const tabs = [
  { id: "paint", label: "Paint", icon: Palette },
  { id: "wheels", label: "Wheels", icon: Disc },
  { id: "interior", label: "Interior", icon: Layers },
  { id: "options", label: "Options", icon: Settings2 },
] as const;

type TabId = (typeof tabs)[number]["id"];

const ConfiguratorSidebar = () => {
  const { isSidebarOpen, toggleSidebar } = useSidebarStore();
  const [activeTab, setActiveTab] = useState<TabId>("paint");

  return (
    <aside
      className={`flex flex-col h-full bg-white/90 dark:bg-black/90 backdrop-blur-md border-r border-gray-200 dark:border-gray-800 transition-all duration-300 shrink-0 ${
        isSidebarOpen ? "w-72" : "w-14"
      }`}
    >
      {/* header row with collapse toggle */}
      <div className="flex items-center justify-between px-2 py-3 border-b border-gray-200 dark:border-gray-800">
        {isSidebarOpen && (
          <span className="pl-2 text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
            Configure
          </span>
        )}
        <button
          onClick={toggleSidebar}
          className="ml-auto w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
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
          <button
            key={id}
            onClick={() => {
              setActiveTab(id);
              if (!isSidebarOpen) toggleSidebar();
            }}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              activeTab === id && isSidebarOpen
                ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900"
            }`}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {isSidebarOpen && <span>{label}</span>}
          </button>
        ))}
      </nav>

      {/* panel content */}
      {isSidebarOpen && (
        <div className="flex-1 overflow-y-auto p-4">
          <p className="text-xs text-gray-400 uppercase tracking-widest font-medium">
            {activeTab}
          </p>
          <p className="mt-6 text-sm text-gray-500 dark:text-gray-500">
            coming soon
          </p>
        </div>
      )}
    </aside>
  );
};

export default ConfiguratorSidebar;
