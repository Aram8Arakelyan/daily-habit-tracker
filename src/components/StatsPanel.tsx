"use client";

import { useState } from "react";
import { useHabitContext } from "@/context/HabitContext";
import YearlyHeatmap from "./YearlyHeatmap";
import YearlyBarChart from "./YearlyBarChart";
import WeeklyChart from "./WeeklyChart";
import MonthlyChart from "./MonthlyChart";

export default function StatsPanel() {
  const [open, setOpen] = useState(false);
  const { habits, completions, getStats } = useHabitContext();

  if (habits.length === 0) return null;

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-zinc-300 hover:text-zinc-100"
      >
        <span>Stats &amp; Charts</span>
        <svg
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <div className="space-y-6 border-t border-zinc-800 px-4 py-4">
          <div>
            <h3 className="mb-3 text-sm font-medium text-zinc-400">
              Yearly Activity
            </h3>
            <YearlyHeatmap habits={habits} completions={completions} />
          </div>

          <div>
            <h3 className="mb-3 text-sm font-medium text-zinc-400">
              Monthly Overview
            </h3>
            <YearlyBarChart habits={habits} completions={completions} />
          </div>

          <div>
            <h3 className="mb-3 text-sm font-medium text-zinc-400">
              Weekly Completions
            </h3>
            <WeeklyChart habits={habits} completions={completions} />
          </div>

          <div>
            <h3 className="mb-3 text-sm font-medium text-zinc-400">
              Monthly Completions
            </h3>
            <MonthlyChart habits={habits} completions={completions} />
          </div>

          <div>
            <h3 className="mb-3 text-sm font-medium text-zinc-400">
              Per-Habit Stats
            </h3>
            <div className="space-y-3">
              {habits.map((habit) => {
                const stats = getStats(habit.id);
                return (
                  <div
                    key={habit.id}
                    className="flex items-start justify-between rounded-lg bg-zinc-800/50 px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{habit.emoji}</span>
                      <span className="text-sm text-zinc-200">
                        {habit.name}
                      </span>
                    </div>
                    <div className="flex gap-4 text-xs text-zinc-400">
                      <span title="Current streak">
                        🔥 {stats.currentStreak}
                      </span>
                      <span title="Best streak">
                        Best: {stats.bestStreak}
                      </span>
                      <span title="Week completion rate">
                        Week: {stats.completionRateWeek}%
                      </span>
                      <span title="Month completion rate">
                        Month: {stats.completionRateMonth}%
                      </span>
                      <span title="Total completions">
                        Total: {stats.totalCompletions}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
