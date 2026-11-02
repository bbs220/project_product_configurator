"use client";

import { useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import {
  Box,
  Copy,
  Globe,
  Lock,
  MoreVertical,
  Trash2,
  Unlock,
  Check,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import { deleteConfig, forkConfig, updateConfig } from "@/actions/garage";
import type { SavedConfig } from "@/db/schema";

// garage card properties definition
export type GarageCardProps = {
  config: SavedConfig;
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

// format date deterministically to prevent server client locale mismatch
function formatConfigDate(dateInput: Date | string): string {
  const d = new Date(dateInput);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// human readable model display titles
const modelNames: Record<string, string> = {
  watch: "Apple Watch Ultra",
  keyboard: "Mechanical Keyboard",
  mtBike: "Santa Cruz V10",
  guitar: "Fender Stratocaster",
};

// interactive individual saved configuration card component
export default function GarageCard({ config }: GarageCardProps) {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isDuplicating, setIsDuplicating] = useState<boolean>(false);
  const [isLocking, setIsLocking] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const mounted = useClientMount();

  // copy direct studio configuration link to clipboard
  const handleCopyLink = async () => {
    try {
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const shareUrl = `${origin}/configurator?model=${config.modelType}&id=${config.id}`;
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Share link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
      setMenuOpen(false);
    } catch (err) {
      console.error("Clipboard copy failed:", err);
      toast.error("Failed to copy link to clipboard");
    }
  };

  // clone existing configuration into user garage
  const handleDuplicate = async () => {
    try {
      setIsDuplicating(true);
      const res = await forkConfig(config.id, `${config.name} (Copy)`);

      if (!res.success) {
        toast.error(res.error || "Failed to duplicate configuration");
        return;
      }

      toast.success(`Duplicated "${config.name}"`);
      setMenuOpen(false);
    } catch (err) {
      console.error("Duplication failed:", err);
      toast.error("Failed to duplicate configuration");
    } finally {
      setIsDuplicating(false);
    }
  };

  // toggle edit protection lock state
  const handleToggleLock = async () => {
    try {
      setIsLocking(true);
      const nextLockedState = !config.isLocked;
      const res = await updateConfig({
        id: config.id,
        isLocked: nextLockedState,
      });

      if (!res.success) {
        toast.error(res.error || "Failed to update lock state");
        return;
      }

      toast.success(
        nextLockedState
          ? `Locked "${config.name}" from edits`
          : `Unlocked "${config.name}" for edits`
      );
      setMenuOpen(false);
    } catch (err) {
      console.error("Lock toggle failed:", err);
      toast.error("Failed to update lock state");
    } finally {
      setIsLocking(false);
    }
  };

  // delete configuration record
  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      const res = await deleteConfig(config.id);

      if (!res.success) {
        toast.error(res.error || "Failed to delete configuration");
        return;
      }

      toast.success(`Deleted "${config.name}"`);
      setShowDeleteConfirm(false);
    } catch (err) {
      console.error("Deletion failed:", err);
      toast.error("Failed to delete configuration");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="group relative rounded-2xl bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-gray-800 transition-all duration-300 hover:ring-2 hover:ring-gray-900 dark:hover:ring-white hover:-translate-y-1 flex flex-col">
        {/* card image preview container */}
        <div className="relative w-full aspect-square rounded-t-2xl bg-gray-100 dark:bg-zinc-800/60 flex items-center justify-center overflow-hidden">
          {config.thumbnailUrl ? (
            <Image
              src={config.thumbnailUrl}
              alt={config.name}
              fill
              className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <Box className="w-16 h-16 text-gray-400 dark:text-zinc-600" />
          )}
        </div>

        {/* card content and metadata */}
        <div className="p-4 flex flex-col justify-between rounded-b-2xl bg-white/40 dark:bg-zinc-900/40 border-t border-gray-200/60 dark:border-gray-800/60">
          <div>
            {/* product category and status row */}
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 truncate">
                  {modelNames[config.modelType] || config.modelType}
                </span>
                {config.isLocked && (
                  <span
                    title="Build is locked from edits"
                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shrink-0"
                  >
                    <Lock className="w-2.5 h-2.5" />
                    <span>Locked</span>
                  </span>
                )}
              </div>

              {/* options dropdown trigger button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setMenuOpen(!menuOpen)}
                  aria-label="Configuration options"
                  className="p-1 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors shrink-0"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>

                {/* options menu dropdown */}
                {menuOpen && (
                  <>
                    {/* modal backdrop dismiss surface */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setMenuOpen(false)}
                    />

                    <div className="absolute right-0 bottom-full mb-1 sm:bottom-auto sm:top-full sm:mt-1 w-44 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-800 p-1.5 shadow-xl z-50 text-xs font-medium space-y-0.5 animate-in fade-in zoom-in-95 duration-100">
                      <button
                        type="button"
                        onClick={handleCopyLink}
                        className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors text-left"
                      >
                        {copied ? (
                          <Check className="w-3.5 h-3.5 text-green-500 shrink-0" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        )}
                        <span>{copied ? "Copied" : "Copy Link"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleDuplicate}
                        disabled={isDuplicating}
                        className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors text-left disabled:opacity-50"
                      >
                        {isDuplicating ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0 text-blue-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        )}
                        <span>Duplicate</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleToggleLock}
                        disabled={isLocking}
                        className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors text-left disabled:opacity-50"
                      >
                        {isLocking ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0 text-amber-500" />
                        ) : config.isLocked ? (
                          <Unlock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        ) : (
                          <Lock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        )}
                        <span>{config.isLocked ? "Unlock" : "Lock"}</span>
                      </button>

                      <div className="my-1 border-t border-gray-100 dark:border-gray-800" />

                      <button
                        type="button"
                        onClick={() => {
                          setMenuOpen(false);
                          setShowDeleteConfirm(true);
                        }}
                        className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors text-left"
                      >
                        <Trash2 className="w-3.5 h-3.5 shrink-0" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* variation title and update timestamp */}
            <h2
              className="text-sm font-bold text-gray-900 dark:text-white truncate"
              title={config.name}
            >
              {config.name}
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
              <p
                suppressHydrationWarning
                className="text-[11px] text-gray-500 dark:text-gray-400"
              >
                Updated {formatConfigDate(config.updatedAt)}
              </p>
              {config.isPublic ? (
                <span className="inline-flex items-center gap-1 text-[10px] text-blue-600 dark:text-blue-400">
                  <Globe className="w-2.5 h-2.5" />
                  <span>Public</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] text-gray-400 dark:text-gray-500">
                  <Lock className="w-2.5 h-2.5" />
                  <span>Private</span>
                </span>
              )}
            </div>
          </div>

          {/* primary load configuration action button */}
          <Link
            href={`/configurator?model=${config.modelType}&id=${config.id}`}
            className="w-full mt-3 block text-center bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:opacity-90 py-2 rounded-xl text-xs font-semibold transition-opacity shadow-sm"
          >
            Load in Studio
          </Link>
        </div>
      </div>

      {/* in-app delete confirmation modal */}
      {showDeleteConfirm && mounted && createPortal(
        <div
          style={{ zIndex: 9999 }}
          className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
        >
          {/* modal backdrop dismiss surface */}
          <div
            className="fixed inset-0"
            onClick={() => !isDeleting && setShowDeleteConfirm(false)}
          />

          {/* delete confirmation dialog card */}
          <div className="relative w-full max-w-sm rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-800 p-6 shadow-2xl z-10 space-y-4 my-auto">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  Delete Configuration?
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  This action cannot be undone
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              Are you sure you want to permanently delete <span className="font-semibold text-gray-900 dark:text-white">&ldquo;{config.name}&rdquo;</span> from your garage?
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-gray-100 dark:border-gray-800">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-red-600 hover:bg-red-500 text-white shadow-sm transition-colors disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Delete Build</span>
                )}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
