"use client";

import { useState } from "react";
import { useCalorieContext } from "@/context/CalorieContext";
import CalorieChart from "./CalorieChart";

export default function CalorieStats() {
  const [open, setOpen] = useState(false);
  const { getWeeklyAverage, activeGoal } = useCalorieContext();

  const weeklyAvg = getWeeklyAverage();

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-zinc-300 hover:text-zinc-100"
      >
        <span>Calorie Stats</span>
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
          {/* Weekly average */}
          <div>
            <h3 className="mb-3 text-sm font-medium text-zinc-400">
              Weekly Average
            </h3>
            <div className="rounded-lg bg-zinc-800/50 px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Avg. Daily</span>
                <span className="text-lg font-medium text-zinc-100">
                  {weeklyAvg} cal
                </span>
              </div>
              {activeGoal && (
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="text-zinc-500">vs. Goal</span>
                  <span
                    className={
                      weeklyAvg > activeGoal.dailyCalories
                        ? "text-red-400"
                        : "text-emerald-400"
                    }
                  >
                    {weeklyAvg > activeGoal.dailyCalories ? "+" : ""}
                    {weeklyAvg - activeGoal.dailyCalories} cal
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Weekly chart */}
          <div>
            <h3 className="mb-3 text-sm font-medium text-zinc-400">
              7-Day Trend
            </h3>
            <CalorieChart days={7} />
          </div>

          {/* Monthly chart */}
          <div>
            <h3 className="mb-3 text-sm font-medium text-zinc-400">
              30-Day Trend
            </h3>
            <CalorieChart days={30} />
          </div>
        </div>
      )}
    </div>
  );
}
