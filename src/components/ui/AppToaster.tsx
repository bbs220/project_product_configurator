"use client";

import { Toaster } from "react-hot-toast";

// global colored toast notifications component
export default function AppToaster() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 3500,
        // base toast appearance
        style: {
          background: "#18181b",
          color: "#f4f4f5",
          border: "1px solid #27272a",
          fontSize: "13px",
          fontWeight: "500",
          borderRadius: "12px",
          padding: "10px 16px",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.3)",
        },
        // green styling for successful operations
        success: {
          duration: 3000,
          style: {
            border: "1px solid rgba(34, 197, 94, 0.4)",
            background: "#0c1f15",
            color: "#4ade80",
          },
          iconTheme: {
            primary: "#22c55e",
            secondary: "#ffffff",
          },
        },
        // red styling for error notifications
        error: {
          duration: 4000,
          style: {
            border: "1px solid rgba(239, 68, 68, 0.4)",
            background: "#221113",
            color: "#f87171",
          },
          iconTheme: {
            primary: "#ef4444",
            secondary: "#ffffff",
          },
        },
        // blue styling for ongoing background operations
        loading: {
          style: {
            border: "1px solid rgba(59, 130, 246, 0.4)",
            background: "#0f172a",
            color: "#60a5fa",
          },
          iconTheme: {
            primary: "#3b82f6",
            secondary: "#ffffff",
          },
        },
        // yellow warning styling for prompts and notices
        blank: {
          style: {
            border: "1px solid rgba(245, 158, 11, 0.4)",
            background: "#1f180d",
            color: "#fbbf24",
          },
        },
      }}
    />
  );
}

