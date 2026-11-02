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
  X,
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

  // delete configuration with confirmation
  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${config.name}"? This action cannot be undone.`
    );
    if (!confirmed) return;

    try {
      setIsDeleting(true);
      const res = await deleteConfig(config.id);

      if (!res.success) {
        toast.error(res.error || "Failed to delete configuration");
        return;
      }

      toast.success(`Deleted "${config.name}"`);
      setMenuOpen(false);
    } catch (err) {
      console.error("Deletion failed:", err);
      toast.error("Failed to delete configuration");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="group relative rounded-2xl bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-gray-800 overflow-hidden transition-all duration-300 hover:ring-2 hover:ring-gray-900 dark:hover:ring-white hover:-translate-y-1 flex flex-col aspect-[9/14]">
        {/* card image preview container */}
        <div className="relative w-full flex-1 bg-gray-100 dark:bg-zinc-800/60 flex items-center justify-center overflow-hidden">
          {config.thumbnailUrl ? (
            <Image
              src={config.thumbnailUrl}
              alt={config.name}
              fill
              className="object-contain p-3 group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <Box className="w-14 h-14 text-gray-400 dark:text-zinc-600" />
          )}

          {/* top badges overlay */}
          <div className="absolute top-3 left-3 pointer-events-none">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-black/70 backdrop-blur-md text-white border border-white/10 uppercase tracking-wider">
              {modelNames[config.modelType] || config.modelType}
            </span>
          </div>

          {config.isLocked && (
            <div className="absolute top-3 right-3 pointer-events-none">
              <span className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium bg-amber-500/90 text-white backdrop-blur-md shadow-sm">
                <Lock className="w-3 h-3" />
                <span>Locked</span>
              </span>
            </div>
          )}
        </div>

        {/* card content and metadata */}
        <div className="p-4 flex flex-col justify-between shrink-0 bg-white/40 dark:bg-zinc-900/40 border-t border-gray-200/60 dark:border-gray-800/60">
          <div>
            <div className="flex justify-between items-start gap-2 mb-1.5">
              <div className="min-w-0 flex-1">
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

              {/* options dropdown trigger button */}
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label="Configuration options"
                className="p-1 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors shrink-0"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
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

      {/* options menu dropdown */}
      {/* options management modal portaled outside the card */}
      {menuOpen && mounted && createPortal(
        <div
          style={{ zIndex: 9999 }}
          className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
        >
          {/* modal backdrop dismiss surface */}
          <div
            className="fixed inset-0"
            onClick={() => setMenuOpen(false)}
          />

          {/* modal container content */}
          <div className="relative w-full max-w-sm rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-800 p-5 shadow-2xl z-10 space-y-4 my-auto">
            {/* modal header */}
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
              <div className="min-w-0 pr-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
                  Build Options
                </span>
                <h3 className="text-base font-bold text-gray-900 dark:text-white truncate">
                  {config.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* action options list */}
            <div className="space-y-1.5">
              <button
                type="button"
                onClick={handleCopyLink}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors text-left"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-500 shrink-0" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-400 shrink-0" />
                )}
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Copy Share Link</p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">Direct link to inspect this variation in studio</p>
                </div>
              </button>

              <button
                type="button"
                onClick={handleDuplicate}
                disabled={isDuplicating}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors text-left disabled:opacity-50"
              >
                {isDuplicating ? (
                  <Loader2 className="w-4 h-4 animate-spin shrink-0 text-blue-500" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-400 shrink-0" />
                )}
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Duplicate Build</p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">Create an independent copy in your garage</p>
                </div>
              </button>

              <button
                type="button"
                onClick={handleToggleLock}
                disabled={isLocking}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors text-left disabled:opacity-50"
              >
                {isLocking ? (
                  <Loader2 className="w-4 h-4 animate-spin shrink-0 text-amber-500" />
                ) : config.isLocked ? (
                  <Unlock className="w-4 h-4 text-amber-500 shrink-0" />
                ) : (
                  <Lock className="w-4 h-4 text-gray-400 shrink-0" />
                )}
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {config.isLocked ? "Unlock Configuration" : "Lock Configuration"}
                  </p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    {config.isLocked
                      ? "Allow future modifications in studio"
                      : "Prevent accidental edits or overwrites"}
                  </p>
                </div>
              </button>

              <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors text-left disabled:opacity-50"
                >
                  {isDeleting ? (
                    <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                  ) : (
                    <Trash2 className="w-4 h-4 shrink-0" />
                  )}
                  <div>
                    <p className="font-semibold text-red-600">Delete Configuration</p>
                    <p className="text-[11px] text-red-500/80">Permanently remove this build from garage</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
