"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Bookmark, GitFork, Lock, Plus } from "lucide-react";
import toast from "react-hot-toast";
import SaveConfigModal, { type SaveModalMode } from "./SaveConfigModal";
import { useConfiguratorStore, type ConfiguratorModel } from "@/stores/useConfiguratorStore";

// save button component properties definition
export type SaveConfigButtonProps = {
  modelKey: string;
};

// interactive save and fork action button for configurator header
export default function SaveConfigButton({ modelKey }: SaveConfigButtonProps) {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();

  const activeConfigId = useConfiguratorStore((s) => s.activeConfigId);
  const activeConfigName = useConfiguratorStore((s) => s.activeConfigName);
  const isConfigOwner = useConfiguratorStore((s) => s.isConfigOwner);
  const isConfigLocked = useConfiguratorStore((s) => s.isConfigLocked);
  const setActiveConfig = useConfiguratorStore((s) => s.setActiveConfig);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<SaveModalMode>("new");

  // handle initial button click and authentication check
  const handleButtonClick = (mode: SaveModalMode) => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      toast("Please sign in to save custom variations to your garage", {
        icon: "🔒",
        id: "auth-save-toast",
      });
      router.push("/sign-in");
      return;
    }

    setModalMode(mode);
    setIsModalOpen(true);
  };

  // handle successful save or fork operation
  const handleSaveSuccess = (id: number, name: string) => {
    setActiveConfig({
      id,
      name,
      isOwner: true,
      isLocked: false,
    });

    // synchronize browser address bar with configuration identifier query parameter
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("id", String(id));
      window.history.pushState(null, "", url.toString());
    }
  };

  return (
    <>
      {/* authenticated user is viewing someone else's shared build */}
      {activeConfigId !== null && !isConfigOwner ? (
        <button
          type="button"
          onClick={() => handleButtonClick("fork")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:bg-purple-500/20 text-xs font-semibold transition-all shadow-sm"
        >
          <GitFork className="w-3.5 h-3.5" />
          <span>Fork Build</span>
        </button>
      ) : activeConfigId !== null && isConfigLocked ? (
        /* owner is viewing a locked build */
        <button
          type="button"
          onClick={() => handleButtonClick("duplicate")}
          title="Build is locked from direct edits click to save a copy"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 text-xs font-semibold transition-all shadow-sm"
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Save Copy</span>
        </button>
      ) : activeConfigId !== null && isConfigOwner ? (
        /* owner is viewing an active editable build */
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => handleButtonClick("update")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 text-xs font-semibold transition-all shadow-sm"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Update</span>
          </button>
          <button
            type="button"
            onClick={() => handleButtonClick("duplicate")}
            title="Save as a new variation copy"
            className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        /* new unsaved custom build */
        <button
          type="button"
          onClick={() => handleButtonClick("new")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-zinc-700 text-xs font-semibold transition-all shadow-sm"
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>Save</span>
        </button>
      )}

      {/* configuration save modal */}
      <SaveConfigModal
        isOpen={isModalOpen}
        mode={modalMode}
        modelKey={modelKey as ConfiguratorModel}
        configId={activeConfigId}
        initialName={activeConfigName || ""}
        initialIsLocked={isConfigLocked}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSaveSuccess}
      />
    </>
  );
}

