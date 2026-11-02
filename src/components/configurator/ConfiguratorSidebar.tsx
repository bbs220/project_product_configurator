"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Globe, Lock, PanelRightClose, Settings2, type LucideIcon } from "lucide-react";

import WatchPanel, { watchTabs } from "./panels/WatchPanel";
import KeyboardPanel, { keyboardTabs } from "./panels/KeyboardPanel";
import BikePanel, { bikeTabs } from "./panels/BikePanel";
import GuitarPanel, { guitarTabs } from "./panels/GuitarPanel";
import ExportPdfButton from "./ExportPdfButton";
import ExportGlbButton from "./ExportGlbButton";
import SaveConfigButton from "./SaveConfigButton";
import ConfigDataLoader from "./ConfigDataLoader";
import { useConfiguratorStore } from "@/stores/useConfiguratorStore";
import { useSidebarStore } from "@/stores/useSidebarStore";

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
  const activeConfigId = useConfiguratorStore((s) => s.activeConfigId);
  const activeConfigName = useConfiguratorStore((s) => s.activeConfigName);
  const isConfigLocked = useConfiguratorStore((s) => s.isConfigLocked);
  const isConfigOwner = useConfiguratorStore((s) => s.isConfigOwner);
  const toggleSidebar = useSidebarStore((s) => s.toggleSidebar);
  const searchParams = useSearchParams();
  const modelKey = searchParams.get("model") || "watch";
  const tabs = modelTabsConfig[modelKey] || fallbackTabs;

  const [activeTab, setActiveTab] = useState<string>(tabs[0]?.id || "general");
  const [prevModelKey, setPrevModelKey] = useState<string>(modelKey);

  const isReadOnly = Boolean(
    activeConfigId !== null && (!isConfigOwner || isConfigLocked),
  );

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
    watch: "Apple Watch Ultra 2 (2023)",
    keyboard: "Knob1 Mechanical Keyboard (2024)",
    mtBike: "Santa Cruz V10 (2023)",
    guitar: "Fender Stratocaster (1954)",
  };

  return (
    <aside className="flex flex-col h-full w-full overflow-hidden">
      <ConfigDataLoader />

      {/* studio header */}
      <div className="flex flex-col gap-3 px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-black/70 backdrop-blur-md shrink-0">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[11px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 shrink-0">
              Design Studio
            </span>
            {activeConfigName && (
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border truncate ${
                  !isConfigOwner
                    ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
                    : isConfigLocked
                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                    : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
                }`}
              >
                {!isConfigOwner ? (
                  <Globe className="w-2.5 h-2.5 shrink-0" />
                ) : isConfigLocked ? (
                  <Lock className="w-2.5 h-2.5 shrink-0" />
                ) : null}
                <span className="truncate max-w-[120px]">{activeConfigName}</span>
                {!isConfigOwner && (
                  <span className="font-normal opacity-75 shrink-0">(view only)</span>
                )}
                {isConfigOwner && isConfigLocked && (
                  <span className="font-normal opacity-75 shrink-0">(locked)</span>
                )}
              </span>
            )}
          </div>
          {/* toggle sidebar visibility button */}
          <button
            type="button"
            onClick={toggleSidebar}
            title="Collapse studio sidebar"
            aria-label="Collapse studio sidebar"
            className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors shrink-0"
          >
            <PanelRightClose className="w-4 h-4" />
          </button>
        </div>

        <h1 className="text-lg font-bold text-gray-900 dark:text-white truncate">
          {modelLabels[modelKey] || modelKey}
        </h1>

        <div className="flex items-center gap-2 pt-0.5">
          <div className="flex-1 min-w-0">
            <SaveConfigButton modelKey={modelKey} />
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <ExportPdfButton modelKey={modelKey} />
            <ExportGlbButton modelKey={modelKey} />
          </div>
        </div>
      </div>

      {/* horizontal category tabs navigation */}
      <nav className="flex items-center gap-2 px-6 py-3 border-b border-gray-200 dark:border-gray-800 bg-white/40 dark:bg-black/40 backdrop-blur-sm overflow-x-auto shrink-0 scrollbar-none">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
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
      <div className="flex-1 overflow-y-auto p-5 sm:p-6">
        <div className="max-w-xl mx-auto w-full flex flex-col gap-4">
          {/* inspection mode alert banner */}
          {isReadOnly && (
            <div
              className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                !isConfigOwner
                  ? "bg-purple-500/10 border-purple-500/20 text-purple-900 dark:text-purple-200"
                  : "bg-amber-500/10 border-amber-500/20 text-amber-900 dark:text-amber-200"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`p-1.5 rounded-lg shrink-0 ${
                    !isConfigOwner
                      ? "bg-purple-500/20 text-purple-600 dark:text-purple-400"
                      : "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                  }`}
                >
                  {!isConfigOwner ? (
                    <Globe className="w-3.5 h-3.5" />
                  ) : (
                    <Lock className="w-3.5 h-3.5" />
                  )}
                </div>
                <div className="text-xs min-w-0">
                  <p className="font-semibold truncate">
                    {!isConfigOwner
                      ? "Shared Build • Inspection Mode"
                      : "Locked Build • Read Only"}
                  </p>
                  <p className="text-[11px] opacity-75 truncate">
                    {!isConfigOwner
                      ? "Controls are read only until forked"
                      : "Direct changes locked to protect design"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* panel options with read only guard */}
          <div
            className={
              isReadOnly
                ? "pointer-events-none select-none opacity-80 cursor-not-allowed"
                : ""
            }
          >
            {renderPanel()}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default ConfiguratorSidebar;
