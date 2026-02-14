"use client";

import { useState, useEffect } from "react";
import { Habit, FrequencyType } from "@/lib/types";

const EMOJI_OPTIONS = [
  "📝", "💪", "📚", "🧘", "🏃", "💧", "🎯", "✍️",
  "🎨", "🎵", "🧹", "💤", "🥗", "🧠", "❤️", "🌱",
];

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface EditHabitModalProps {
  open: boolean;
  habit: Habit;
  onSave: (updates: Partial<Pick<Habit, "name" | "emoji" | "frequency" | "customDays">>) => void;
  onClose: () => void;
}

export default function EditHabitModal({
  open,
  habit,
  onSave,
  onClose,
}: EditHabitModalProps) {
  const [name, setName] = useState(habit.name);
  const [emoji, setEmoji] = useState(habit.emoji);
  const [frequency, setFrequency] = useState<FrequencyType>(habit.frequency);
  const [customDays, setCustomDays] = useState<number[]>(habit.customDays || [1, 2, 3, 4, 5]);

  useEffect(() => {
    if (open) {
      setName(habit.name);
      setEmoji(habit.emoji);
      setFrequency(habit.frequency);
      setCustomDays(habit.customDays || [1, 2, 3, 4, 5]);
    }
  }, [open, habit]);

  if (!open) return null;

  const toggleDay = (day: number) => {
    setCustomDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      emoji,
      frequency,
      customDays: frequency === "custom" ? customDays : undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-sm rounded-xl border border-zinc-700 bg-zinc-800 p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-zinc-100">Edit Habit</h3>

        {/* Name */}
        <div className="mt-4">
          <label className="mb-1.5 block text-xs font-medium text-zinc-500">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-indigo-500"
            autoFocus
          />
        </div>

        {/* Emoji picker */}
        <div className="mt-4">
          <label className="mb-1.5 block text-xs font-medium text-zinc-500">
            Icon
          </label>
          <div className="flex flex-wrap gap-1">
            {EMOJI_OPTIONS.map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => setEmoji(e)}
                className={`rounded-md p-1.5 text-base hover:bg-zinc-700 ${
                  emoji === e
                    ? "bg-indigo-600/30 ring-1 ring-indigo-500"
                    : ""
                }`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        {/* Frequency picker */}
        <div className="mt-4">
          <label className="mb-1.5 block text-xs font-medium text-zinc-500">
            Frequency
          </label>
          <div className="flex gap-2">
            {(["daily", "weekdays", "custom"] as FrequencyType[]).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFrequency(f)}
                className={`rounded-lg px-3 py-1 text-xs font-medium capitalize ${
                  frequency === f
                    ? "bg-indigo-600 text-white"
                    : "bg-zinc-700 text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Custom days */}
        {frequency === "custom" && (
          <div className="mt-3 flex gap-1">
            {DAY_NAMES.map((dayName, i) => (
              <button
                key={dayName}
                type="button"
                onClick={() => toggleDay(i)}
                className={`rounded-md px-2 py-1 text-xs font-medium ${
                  customDays.includes(i)
                    ? "bg-indigo-600 text-white"
                    : "bg-zinc-700 text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {dayName}
              </button>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-zinc-600 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
