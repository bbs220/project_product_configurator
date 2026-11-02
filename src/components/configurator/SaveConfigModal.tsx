"use client";

import { useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { Loader2, Lock, Globe, Bookmark, X } from "lucide-react";
import toast from "react-hot-toast";
import { saveNewConfig, updateConfig, forkConfig } from "@/actions/garage";
import { captureStudioThumbnail } from "@/lib/thumbnailCapture";
import { useConfiguratorStore, type ConfiguratorModel } from "@/stores/useConfiguratorStore";

// modal operation mode definition
export type SaveModalMode = "new" | "update" | "fork" | "duplicate";

// modal component properties definition
export type SaveConfigModalProps = {
  isOpen: boolean;
  mode: SaveModalMode;
  modelKey: ConfiguratorModel;
  configId?: number | null;
  initialName?: string;
  initialIsPublic?: boolean;
  initialIsLocked?: boolean;
  onClose: () => void;
  onSuccess: (id: number, name: string) => void;
};

// empty subscribe callback for client hydration sync
const emptySubscribe = () => () => {};

// track client mount state for safe portal mounting
function useClientMount(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

// save and update configuration dialog modal
export default function SaveConfigModal({
  isOpen,
  mode,
  modelKey,
  configId,
  initialName = "",
  initialIsPublic = true,
  initialIsLocked = false,
  onClose,
  onSuccess,
}: SaveConfigModalProps) {
  const [name, setName] = useState<string>(initialName);
  const [isPublic, setIsPublic] = useState<boolean>(initialIsPublic);
  const [isLocked, setIsLocked] = useState<boolean>(initialIsLocked);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const mounted = useClientMount();

  const getConfigSnapshot = useConfiguratorStore((s) => s.getConfigSnapshot);

  if (!isOpen || !mounted) return null;

  // determine modal display title
  const modalTitle =
    mode === "update"
      ? "Update Saved Variation"
      : mode === "fork"
      ? "Fork to My Garage"
      : mode === "duplicate"
      ? "Save As New Copy"
      : "Save to My Garage";

  // handle form submission to backend actions
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const trimmedName = name.trim();
    if (!trimmedName) {
      toast.error("Please enter a variation name");
      return;
    }

    try {
      setIsSubmitting(true);
      const thumbnail = captureStudioThumbnail();
      const snapshot = getConfigSnapshot(modelKey);

      if (mode === "update" && configId) {
        // update existing configuration record
        const res = await updateConfig({
          id: configId,
          name: trimmedName,
          configData: snapshot,
          thumbnailUrl: thumbnail,
          isPublic,
          isLocked,
        });

        if (!res.success) {
          toast.error(res.error || "Failed to update configuration");
          return;
        }

        toast.success(`Updated "${trimmedName}" in garage`);
        onSuccess(configId, trimmedName);
      } else if (mode === "fork" && configId) {
        // fork external configuration to user garage
        const res = await forkConfig(configId, trimmedName);

        if (!res.success || !res.data) {
          toast.error(res.error || "Failed to fork configuration");
          return;
        }

        toast.success(`Forked "${trimmedName}" to your garage`);
        onSuccess(res.data.id, trimmedName);
      } else {
        // create new configuration record
        const res = await saveNewConfig({
          name: trimmedName,
          modelType: modelKey,
          configData: snapshot,
          thumbnailUrl: thumbnail,
          isPublic,
          isLocked,
        });

        if (!res.success || !res.data) {
          toast.error(res.error || "Failed to save configuration");
          return;
        }

        toast.success(`Saved "${trimmedName}" to garage`);
        onSuccess(res.data.id, trimmedName);
      }

      onClose();
    } catch (err) {
      console.error("Save configuration failed:", err);
      toast.error("An error occurred while saving");
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div
      style={{ zIndex: 9999 }}
      className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-800 p-6 shadow-2xl my-auto">
        {/* modal close button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* modal header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center justify-center shrink-0">
            <Bookmark className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              {modalTitle}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Persist your customized materials and style presets
            </p>
          </div>
        </div>

        {/* save configuration form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
              Variation Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alpine Stealth Matte"
              maxLength={60}
              required
              disabled={isSubmitting}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* privacy visibility setting */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-zinc-800/60 border border-gray-200 dark:border-gray-700/60">
            <div className="flex items-center gap-2.5">
              <Globe className="w-4 h-4 text-gray-500 dark:text-gray-400 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                  Public Link Sharing
                </p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                  Allow anyone with the link to view this 3D design
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              disabled={isSubmitting}
              className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
            />
          </div>

          {/* lock protection setting */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-zinc-800/60 border border-gray-200 dark:border-gray-700/60">
            <div className="flex items-center gap-2.5">
              <Lock className="w-4 h-4 text-gray-500 dark:text-gray-400 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                  Lock Configuration
                </p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                  Prevent accidental edits or overwrites
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={isLocked}
              onChange={(e) => setIsLocked(e.target.checked)}
              disabled={isSubmitting}
              className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
            />
          </div>

          {/* form action buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-200 dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Confirm & Save</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
