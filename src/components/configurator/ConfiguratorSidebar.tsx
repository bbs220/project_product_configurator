"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Globe, Lock, PanelRightClose, Settings2, type LucideIcon } from "lucide-react";

import WatchPanel, { watchTabs } from "./panels/WatchPanel";
import KeyboardPanel, { keyboardTabs } from "./panels/KeyboardPanel";
import BikePanel, { bikeTabs } from "./panels/BikePanel";
import GuitarPanel, { guitarTabs } from "./panels/GuitarPanel";
import CanvasControls from "./CanvasControls";
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
  const { focus } = useConfiguratorStore();
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
      <div className="flex flex-col gap-3 px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-black/60 backdrop-blur-md">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
                Design Studio
              </span>
              {activeConfigName && (
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border ${
                    !isConfigOwner
                      ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
                      : isConfigLocked
                      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                      : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
                  }`}
                >
                  {!isConfigOwner ? (
                    <Globe className="w-2.5 h-2.5" />
                  ) : isConfigLocked ? (
                    <Lock className="w-2.5 h-2.5" />
                  ) : null}
                  <span className="truncate max-w-35">{activeConfigName}</span>
                  {!isConfigOwner && (
                    <span className="font-normal opacity-75">(view only)</span>
                  )}
                  {isConfigOwner && isConfigLocked && (
                    <span className="font-normal opacity-75">(locked)</span>
                  )}
                </span>
              )}
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {modelLabels[modelKey] || modelKey}
            </h1>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <SaveConfigButton modelKey={modelKey} />
            <ExportPdfButton modelKey={modelKey} />
            <ExportGlbButton modelKey={modelKey} />
            {/* toggle sidebar visibility button */}
            <button
              type="button"
              onClick={toggleSidebar}
              title="Collapse studio sidebar"
              aria-label="Collapse studio sidebar"
              className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
            >
              <PanelRightClose className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="w-full">
          <CanvasControls />
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
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-2xl mx-auto w-full flex flex-col gap-4">
          {/* inspection mode alert banner */}
          {isReadOnly && (
            <div
              className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                !isConfigOwner
                  ? "bg-purple-500/10 border-purple-500/20 text-purple-900 dark:text-purple-200"
                  : "bg-amber-500/10 border-amber-500/20 text-amber-900 dark:text-amber-200"
              }`}
            >
              <div
                className={`p-1.5 rounded-lg shrink-0 ${
                  !isConfigOwner
                    ? "bg-purple-500/20 text-purple-600 dark:text-purple-400"
                    : "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                }`}
              >
                {!isConfigOwner ? (
                  <Globe className="w-4 h-4" />
                ) : (
                  <Lock className="w-4 h-4" />
                )}
              </div>
              <div className="flex-1 text-xs">
                <p className="font-semibold mb-0.5">
                  {!isConfigOwner
                    ? "Shared Build • Inspection Mode"
                    : "Locked Build • Read Only"}
                </p>
                <p className="opacity-80 leading-relaxed">
                  {!isConfigOwner
                    ? "Viewing shared configuration. You can inspect all materials and colors below, or click Fork to My Garage to make your own edits."
                    : "This build is locked from direct edits to protect the original design. Inspect specifications below, or click Save Copy to make changes."}
                </p>
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

      {/* navigation controls hints footer */}
      <div className="px-6 py-2.5 border-t border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-black/50 backdrop-blur-sm flex items-center justify-around gap-2 text-[11px] text-gray-500 dark:text-gray-400 select-none shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-gray-700 text-[10px] font-mono font-medium text-gray-700 dark:text-gray-300">
            L-Click
          </span>
          <span>Rotate</span>
        </div>
        <span className="text-gray-300 dark:text-gray-700">•</span>
        <div
          className="relative flex items-center gap-1.5"
          title={focus ? "Panning is disabled when focus is on" : undefined}
        >
          <span
            className={`px-1.5 py-0.5 rounded border text-[10px] font-mono font-medium transition-colors ${
              focus
                ? "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400 line-through"
                : "bg-gray-100 dark:bg-zinc-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            R-Click
          </span>
          <span
            className={`transition-colors ${
              focus
                ? "line-through text-red-600 dark:text-red-400 font-medium"
                : ""
            }`}
          >
            Pan
          </span>
          <Lock
            className={`w-3 h-3 text-red-600 dark:text-red-400 absolute -right-4 top-1/2 -translate-y-1/2 transition-opacity duration-150 ${
              focus ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          />
        </div>
        <span className="text-gray-300 dark:text-gray-700">•</span>
        <div className="flex items-center gap-1.5">
          <span className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-gray-700 text-[10px] font-mono font-medium text-gray-700 dark:text-gray-300">
            Scroll
          </span>
          <span>Zoom</span>
        </div>
      </div>
    </aside>
  );
};

export default ConfiguratorSidebar;
