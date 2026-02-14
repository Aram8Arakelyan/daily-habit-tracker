"use client";

import { useEffect } from "react";
import { UndoAction } from "@/lib/types";

interface UndoToastProps {
  action: UndoAction | null;
  onUndo: () => void;
  onDismiss: () => void;
}

export default function UndoToast({ action, onUndo, onDismiss }: UndoToastProps) {
  useEffect(() => {
    if (!action) return;
    const timer = setTimeout(onDismiss, 5000);
    return () => clearTimeout(timer);
  }, [action, onDismiss]);

  if (!action) return null;

  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 animate-slide-up">
      <div className="flex items-center gap-3 rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 shadow-2xl">
        <span className="text-sm text-zinc-300">{action.description}</span>
        <button
          onClick={onUndo}
          className="rounded-lg bg-indigo-600 px-3 py-1 text-xs font-medium text-white hover:bg-indigo-500"
        >
          Undo
        </button>
        <button
          onClick={onDismiss}
          className="text-zinc-500 hover:text-zinc-300"
          aria-label="Dismiss"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
