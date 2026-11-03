"use client";

import {
  useRef,
  useState,
  useEffect,
  useSyncExternalStore,
  type PointerEvent,
} from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, FileDown, Loader2, RotateCcw, X } from "lucide-react";

// signature modal component properties definition
type SignatureModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (signature: {
    signerName: string;
    signerEmail: string;
    signatureDataUrl?: string;
  }) => void;
  userName: string;
  userEmail: string;
  isExporting: boolean;
};

// empty subscribe callback for client hydration sync
const emptySubscribe = () => () => {};

// track client mount state for safe portal mounting
// set mounted flag after initial client render
function useClientMount(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

// interactive signature dialog for authorized specification sign off
export default function SignatureModal({
  isOpen,
  onClose,
  onConfirm,
  userName,
  userEmail,
  isExporting,
}: SignatureModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [hasDrawn, setHasDrawn] = useState<boolean>(false);
  const mounted = useClientMount();

  // initialize drawing canvas background
  useEffect(() => {
    if (!isOpen || !mounted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  }, [isOpen, mounted]);

  if (!isOpen || !mounted) return null;

  // begin tracking pointer path
  const handlePointerDown = (e: PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#18181b";
    setIsDrawing(true);
    setHasDrawn(true);
  };

  // continue drawing smooth pointer stroke
  const handlePointerMove = (e: PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  // conclude active drawing stroke
  const handlePointerUp = () => {
    setIsDrawing(false);
  };

  // clear canvas surface to allow redrawing
  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  // handle sign off confirmation and trigger export
  const handleSubmit = () => {
    const canvas = canvasRef.current;
    const signatureDataUrl =
      hasDrawn && canvas ? canvas.toDataURL("image/png") : undefined;

    onConfirm({
      signerName: userName || "Authorized Designer",
      signerEmail: userEmail || "",
      signatureDataUrl,
    });
  };

  return createPortal(
    <div
      style={{ zIndex: 60 }}
      className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-md p-6 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl flex flex-col gap-5 my-auto">
        {/* dialog header bar */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
              Authorization & Sign-Off
            </span>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Sign Specification Sheet
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isExporting}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* authenticated user badge */}
        <div className="p-3 bg-gray-50 dark:bg-zinc-800/60 rounded-xl border border-gray-200 dark:border-gray-700/60 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm shrink-0">
            {userName ? userName.charAt(0).toUpperCase() : "U"}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-900 dark:text-white">
              <span className="truncate">
                {userName || "Authenticated User"}
              </span>
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
              {userEmail || "Signed in with Clerk"}
            </p>
          </div>
        </div>

        {/* interactive signature drawing pad */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs font-medium text-gray-700 dark:text-gray-300">
            <span>Draw Signature (Touch / Stylus / Mouse)</span>
            {hasDrawn && (
              <button
                type="button"
                onClick={handleClear}
                className="flex items-center gap-1 text-[11px] text-gray-500 hover:text-red-500 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Clear</span>
              </button>
            )}
          </div>
          <div className="relative w-full h-32 bg-white rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 overflow-hidden shadow-inner flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width={380}
              height={128}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              className="touch-none w-full h-full cursor-crosshair"
            />
            {!hasDrawn && (
              <span className="absolute pointer-events-none text-xs text-gray-400 select-none">
                Sign inside this box
              </span>
            )}
          </div>
          <p className="text-[10px] text-gray-400">
            Optional: If left blank, your verified account credentials will be
            stamped.
          </p>
        </div>

        {/* action button controls */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-gray-200 dark:border-gray-800">
          <button
            type="button"
            onClick={onClose}
            disabled={isExporting}
            className="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isExporting}
            className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 disabled:opacity-50 rounded-xl shadow-sm transition-all"
          >
            {isExporting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <FileDown className="w-3.5 h-3.5" />
            )}
            <span>{isExporting ? "Generating..." : "Authorize & Export"}</span>
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
