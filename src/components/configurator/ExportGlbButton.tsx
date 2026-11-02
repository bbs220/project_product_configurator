"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Box, Loader2, Lock } from "lucide-react";
import toast from "react-hot-toast";
import { exportProductGlb } from "@/lib/glbExport";

// export glb button properties definition
type ExportGlbButtonProps = {
  modelKey: string;
  className?: string;
};

// global export glb model action button component
export default function ExportGlbButton({
  modelKey,
  className = "",
}: ExportGlbButtonProps) {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // handle authorization check and binary glb generation
  const handleExport = async () => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      toast("Please sign in to export customized 3D models", {
        icon: "🔒",
        id: "auth-glb-toast",
      });
      router.push("/sign-in");
      return;
    }

    if (isExporting) return;

    try {
      setIsExporting(true);
      toast.loading("Preparing 3D model export...", { id: "glb-export-toast" });

      await exportProductGlb({
        modelKey,
        onProgress: (msg) => {
          toast.loading(msg, { id: "glb-export-toast" });
        },
      });

      // notify user of successful file generation
      toast.success("Custom 3D model (.glb) downloaded successfully", {
        id: "glb-export-toast",
      });
    } catch (err) {
      console.error("GLB export failed:", err);
      // notify user of generation failure
      toast.error("Failed to export 3D model. Please try again.", {
        id: "glb-export-toast",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={isExporting || !isLoaded}
      title={
        !isSignedIn
          ? "Sign in to export customized 3D GLB model"
          : isExporting
            ? "Exporting 3D Model..."
            : "Download Customized 3D GLB Model"
      }
      className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border shrink-0 ${
        !isSignedIn
          ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700 shadow-sm"
          : isExporting
            ? "bg-emerald-600/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 cursor-wait"
            : "bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white border-transparent shadow-sm"
      } ${className}`}
    >
      {!isSignedIn ? (
        <Lock className="w-3.5 h-3.5 shrink-0 text-zinc-400" />
      ) : isExporting ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
      ) : (
        <Box className="w-3.5 h-3.5 shrink-0" />
      )}
      <span>
        {!isSignedIn
          ? "Sign in for GLB"
          : isExporting
            ? "Exporting..."
            : "Export GLB"}
      </span>
    </button>
  );
}

