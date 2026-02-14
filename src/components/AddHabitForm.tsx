"use client";

import { useState, FormEvent } from "react";
import { useHabitContext } from "@/context/HabitContext";
import { FrequencyType } from "@/lib/types";

const EMOJI_OPTIONS = [
  "📝", "💪", "📚", "🧘", "🏃", "💧", "🎯", "✍️",
  "🎨", "🎵", "🧹", "💤", "🥗", "🧠", "❤️", "🌱",
];

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function AddHabitForm() {
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("📝");
  const [showOptions, setShowOptions] = useState(false);
  const [frequency, setFrequency] = useState<FrequencyType>("daily");
  const [customDays, setCustomDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const { addHabit } = useHabitContext();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addHabit(name, emoji, frequency, customDays);
    setName("");
    setEmoji("📝");
    setFrequency("daily");
    setCustomDays([1, 2, 3, 4, 5]);
    setShowOptions(false);
  };

  const toggleDay = (day: number) => {
    setCustomDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  return (
    <div className="space-y-2">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <button
          type="button"
          onClick={() => setShowOptions(!showOptions)}
          className="flex items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800 px-3 text-lg hover:border-zinc-500"
          title="Customize habit"
        >
          {emoji}
        </button>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New habit..."
          className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        />
        <button
          type="submit"
          disabled={!name.trim()}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Add
        </button>
      </form>

      {showOptions && (
        <div className="rounded-xl border border-zinc-700 bg-zinc-800/80 p-3 space-y-3">
          {/* Emoji picker */}
          <div>
            <p className="mb-1.5 text-xs font-medium text-zinc-500">Icon</p>
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
          <div>
            <p className="mb-1.5 text-xs font-medium text-zinc-500">Frequency</p>
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
            <div className="flex gap-1">
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
        </div>
      )}
    </div>
  );
}
