"use client";

import { useState } from "react";
import { useHabitContext } from "@/context/HabitContext";
import { getLastNDays, toDateKey } from "@/lib/dates";

export default function WeeklyReview() {
  const [open, setOpen] = useState(false);
  const { habits, completions } = useHabitContext();

  if (habits.length === 0) return null;

  const thisWeek = getLastNDays(7).map(toDateKey);
  const lastWeek = getLastNDays(14).slice(0, 7).map(toDateKey);

  const countCompletions = (days: string[]) => {
    let count = 0;
    for (const day of days) {
      for (const h of habits) {
        if ((completions[h.id] || []).includes(day)) count++;
      }
    }
    return count;
  };

  const thisWeekCount = countCompletions(thisWeek);
  const lastWeekCount = countCompletions(lastWeek);
  const maxPossible = habits.length * 7;
  const thisWeekPct = maxPossible > 0 ? Math.round((thisWeekCount / maxPossible) * 100) : 0;
  const lastWeekPct = maxPossible > 0 ? Math.round((lastWeekCount / maxPossible) * 100) : 0;
  const diff = thisWeekPct - lastWeekPct;

  const getMessage = () => {
    if (thisWeekPct >= 90) return "Outstanding week! You're crushing it!";
    if (thisWeekPct >= 70) return "Great progress! Keep the momentum going.";
    if (thisWeekPct >= 50) return "Solid effort. Every day counts!";
    if (diff > 0) return "You're improving! Keep pushing forward.";
    return "Every step matters. Tomorrow is a fresh start.";
  };

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-zinc-300 hover:text-zinc-100"
      >
        <span>Weekly Review</span>
        <svg
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="space-y-4 border-t border-zinc-800 px-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-zinc-800/50 p-3 text-center">
              <p className="text-2xl font-bold text-zinc-100">{thisWeekPct}%</p>
              <p className="text-xs text-zinc-500">This Week</p>
            </div>
            <div className="rounded-lg bg-zinc-800/50 p-3 text-center">
              <p className="text-2xl font-bold text-zinc-100">{lastWeekPct}%</p>
              <p className="text-xs text-zinc-500">Last Week</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                diff > 0
                  ? "bg-emerald-500/15 text-emerald-400"
                  : diff < 0
                    ? "bg-red-500/15 text-red-400"
                    : "bg-zinc-700 text-zinc-400"
              }`}
            >
              {diff > 0 ? "+" : ""}
              {diff}%
            </span>
            <span className="text-xs text-zinc-500">vs last week</span>
          </div>

          <div className="rounded-lg bg-zinc-800/30 px-3 py-2">
            <p className="text-sm text-zinc-300">{getMessage()}</p>
          </div>

          <div className="space-y-1">
            {habits.map((h) => {
              const done = thisWeek.filter((d) =>
                (completions[h.id] || []).includes(d)
              ).length;
              return (
                <div
                  key={h.id}
                  className="flex items-center justify-between text-xs"
                >
                  <span className="text-zinc-400">
                    {h.emoji} {h.name}
                  </span>
                  <span className="text-zinc-500">{done}/7 days</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
