"use client";

import { useState, useEffect } from "react";

interface NoteModalProps {
  open: boolean;
  habitName: string;
  dateLabel: string;
  initialNote: string;
  onSave: (note: string) => void;
  onClose: () => void;
}

export default function NoteModal({
  open,
  habitName,
  dateLabel,
  initialNote,
  onSave,
  onClose,
}: NoteModalProps) {
  const [note, setNote] = useState(initialNote);

  useEffect(() => {
    setNote(initialNote);
  }, [initialNote, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-sm rounded-xl border border-zinc-700 bg-zinc-800 p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-zinc-100">Add Note</h3>
        <p className="mt-1 text-xs text-zinc-500">
          {habitName} &middot; {dateLabel}
        </p>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="e.g. Ran 5k, read 30 pages..."
          rows={3}
          className="mt-3 w-full rounded-lg border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 outline-none focus:border-indigo-500"
          autoFocus
        />
        <div className="mt-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-zinc-600 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave(note);
              onClose();
            }}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
