"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { FileDown, Loader2, Lock } from "lucide-react";
import toast from "react-hot-toast";
import { generateProductPdf } from "@/lib/pdfExport";
import SignatureModal from "./SignatureModal";

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
  const router = useRouter();
  const { isSignedIn, user, isLoaded } = useUser();
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [progressText, setProgressText] = useState<string>("");

  // retrieve authenticated user display credentials
  const userName =
    user?.fullName ||
    user?.firstName ||
    (user?.username ? `@${user.username}` : "Authorized Designer");
  const userEmail = user?.primaryEmailAddress?.emailAddress || "";

  // initiate authorization check or signature dialog
  const handleButtonClick = () => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      toast("Please sign in to export specification sheets", {
        icon: "🔒",
        id: "auth-required-toast",
      });
      router.push("/sign-in");
      return;
    }

    setIsModalOpen(true);
  };

  // handle authorized pdf generation and progress tracking
  const handleConfirmSignature = async ({
    signerName,
    signerEmail,
    signatureDataUrl,
  }: {
    signerName: string;
    signerEmail: string;
    signatureDataUrl?: string;
  }) => {
    if (isExporting) return;

    try {
      setIsExporting(true);
      setProgressText("Starting export...");
      toast.loading("Starting export...", { id: "pdf-export-toast" });

      await generateProductPdf({
        modelKey,
        signerName,
        signerEmail,
        signatureDataUrl,
        onProgress: (msg) => {
          setProgressText(msg);
          toast.loading(msg, { id: "pdf-export-toast" });
        },
      });

      // notify user of successful generation
      toast.success("Specification PDF downloaded successfully", {
        id: "pdf-export-toast",
      });
      setIsModalOpen(false);
    } catch (err) {
      console.error("PDF export failed:", err);
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
        onClick={handleButtonClick}
        disabled={isExporting || !isLoaded}
        title={
          !isSignedIn
            ? "Sign in to export specification sheet"
            : isExporting
              ? progressText
              : "Authorize & Download Specification PDF"
        }
        className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border shrink-0 ${
          !isSignedIn
            ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700 shadow-sm"
            : isExporting
              ? "bg-blue-600/10 border-blue-500/30 text-blue-600 dark:text-blue-400 cursor-wait"
              : "bg-blue-600 hover:bg-blue-700 active:scale-95 text-white border-transparent shadow-sm"
        } ${className}`}
      >
        {!isSignedIn ? (
          <Lock className="w-3.5 h-3.5 shrink-0 text-zinc-400" />
        ) : isExporting ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
        ) : (
          <FileDown className="w-3.5 h-3.5 shrink-0" />
        )}
        <span>
          {!isSignedIn
            ? "Sign in to Export"
            : isExporting
              ? "Exporting..."
              : "Export PDF"}
        </span>
      </button>

      <SignatureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmSignature}
        userName={userName}
        userEmail={userEmail}
        isExporting={isExporting}
      />
    </>
  );
}
