"use client";

import { useState } from "react";
import { FileDown, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { generateProductPdf } from "@/lib/pdfExport";

// export pdf button properties definition
type ExportPdfButtonProps = {
  modelKey: string;
  className?: string;
};

// global export pdf action button component
export default function ExportPdfButton({
  modelKey,
  className = "",
}: ExportPdfButtonProps) {
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [progressText, setProgressText] = useState<string>("");

  // handle pdf generation and progress tracking
  const handleExport = async () => {
    if (isExporting) return;

    try {
      setIsExporting(true);
      setProgressText("Starting export...");
      toast.loading("Starting export...", { id: "pdf-export-toast" });

      await generateProductPdf({
        modelKey,
        onProgress: (msg) => {
          setProgressText(msg);
          toast.loading(msg, { id: "pdf-export-toast" });
        },
      });

      // notify user of successful generation
      toast.success("Specification PDF downloaded successfully", {
        id: "pdf-export-toast",
      });
    } catch {
      // notify user of export failure
      toast.error("Failed to generate PDF. Please try again.", {
        id: "pdf-export-toast",
      });
    } finally {
      setIsExporting(false);
      setProgressText("");
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleExport}
        disabled={isExporting}
        title={isExporting ? progressText : "Download Specification PDF"}
        className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border shrink-0 ${
          isExporting
            ? "bg-blue-600/10 border-blue-500/30 text-blue-600 dark:text-blue-400 cursor-wait"
            : "bg-blue-600 hover:bg-blue-700 active:scale-95 text-white border-transparent shadow-sm"
        } ${className}`}
      >
        {isExporting ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
        ) : (
          <FileDown className="w-3.5 h-3.5 shrink-0" />
        )}
        <span>{isExporting ? "Exporting..." : "Export PDF"}</span>
      </button>
    </>
  );
}
