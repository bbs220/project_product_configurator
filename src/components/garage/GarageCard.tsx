"use client";

import { useState } from "react";
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
    } catch (err) {
      console.error("Deletion failed:", err);
      toast.error("Failed to delete configuration");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="group relative rounded-2xl bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-gray-300 dark:hover:border-zinc-700 flex flex-col">
      {/* card image preview container */}
      <div className="w-full aspect-video bg-gray-200 dark:bg-zinc-800 relative flex items-center justify-center overflow-hidden">
        {config.thumbnailUrl ? (
          <Image
            src={config.thumbnailUrl}
            alt={config.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <Box className="w-16 h-16 text-gray-400 dark:text-zinc-600" />
        )}

        {/* top badges overlay */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-black/60 backdrop-blur-md text-white border border-white/10 uppercase tracking-wider">
            {modelNames[config.modelType] || config.modelType}
          </span>
          <div className="flex items-center gap-1.5">
            {config.isLocked && (
              <span
                title="Build is locked from edits"
                className="p-1 rounded-md bg-amber-500/80 text-white backdrop-blur-md shadow-sm"
              >
                <Lock className="w-3.5 h-3.5" />
              </span>
            )}
            {config.isPublic ? (
              <span
                title="Public share link active"
                className="p-1 rounded-md bg-black/60 text-white backdrop-blur-md border border-white/10 shadow-sm"
              >
                <Globe className="w-3.5 h-3.5" />
              </span>
            ) : (
              <span
                title="Private build"
                className="p-1 rounded-md bg-black/60 text-gray-400 backdrop-blur-md border border-white/10 shadow-sm"
              >
                <Lock className="w-3.5 h-3.5" />
              </span>
            )}
          </div>
        </div>
      </div>

      {/* card content and metadata */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2 relative">
            <div className="pr-2">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1">
                {config.name}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Updated {new Date(config.updatedAt).toLocaleDateString()}
              </p>
            </div>

            {/* options dropdown trigger button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Configuration options"
                className="p-1.5 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {/* options menu dropdown */}
              {menuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-1 w-44 rounded-xl bg-white dark:bg-zinc-800 border border-gray-200 dark:border-gray-700 shadow-xl py-1.5 z-50 text-xs font-medium">
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="w-full flex items-center gap-2 px-3.5 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors text-left"
                    >
                      {copied ? (
                        <Check className="w-3.5 h-3.5 text-green-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-gray-400" />
                      )}
                      <span>Copy Share Link</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleDuplicate}
                      disabled={isDuplicating}
                      className="w-full flex items-center gap-2 px-3.5 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors text-left disabled:opacity-50"
                    >
                      {isDuplicating ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-gray-400" />
                      )}
                      <span>Duplicate Build</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleToggleLock}
                      disabled={isLocking}
                      className="w-full flex items-center gap-2 px-3.5 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors text-left disabled:opacity-50"
                    >
                      {config.isLocked ? (
                        <>
                          <Unlock className="w-3.5 h-3.5 text-amber-500" />
                          <span>Unlock Build</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5 text-gray-400" />
                          <span>Lock Build</span>
                        </>
                      )}
                    </button>

                    <div className="my-1 border-t border-gray-100 dark:border-gray-700" />

                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="w-full flex items-center gap-2 px-3.5 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors text-left disabled:opacity-50"
                    >
                      {isDeleting ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                      <span>Delete</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* primary load configuration action button */}
        <Link
          href={`/configurator?model=${config.modelType}&id=${config.id}`}
          className="w-full mt-4 block text-center bg-gray-200 dark:bg-zinc-800 hover:bg-gray-300 dark:hover:bg-zinc-700 text-gray-900 dark:text-white py-2.5 rounded-xl text-xs font-semibold transition-colors"
        >
          Load in Studio
        </Link>
      </div>
    </div>
  );
}

