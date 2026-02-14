"use client";

import { useState, useMemo } from "react";
import { useCalorieContext } from "@/context/CalorieContext";
import AddCalorieEntry from "./AddCalorieEntry";
import ProgressRing from "./ProgressRing";

export default function DailyCalorieView() {
  const {
    getEntriesForDate,
    getDailyStats,
    deleteLogEntry,
    isHydrated,
  } = useCalorieContext();
  const [showAddModal, setShowAddModal] = useState(false);

  const today = useMemo(() => new Date(), []);
  const entries = useMemo(
    () => getEntriesForDate(today),
    [getEntriesForDate, today]
  );
  const stats = useMemo(() => getDailyStats(today), [getDailyStats, today]);

  if (!isHydrated) {
    return (
      <div className="py-12 text-center text-sm text-zinc-600">
        Loading...
      </div>
    );
  }

  // Group entries by meal
  const mealGroups = {
    breakfast: entries.filter((e) => e.meal === "breakfast"),
    lunch: entries.filter((e) => e.meal === "lunch"),
    dinner: entries.filter((e) => e.meal === "dinner"),
    snack: entries.filter((e) => e.meal === "snack"),
  };

  return (
    <div className="space-y-6">
      {/* Header with progress */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-zinc-100">
            Today&apos;s Calories
          </h2>
          <p className="text-sm text-zinc-500">
            {stats.totalCalories} / {stats.goal} cal
          </p>
        </div>
        <ProgressRing
          completed={stats.totalCalories}
          total={stats.goal}
          label="cal"
        />
      </div>

      {/* Add button */}
      <button
        onClick={() => setShowAddModal(true)}
        className="w-full rounded-lg border border-dashed border-zinc-700 bg-zinc-900/50 px-4 py-3 text-sm font-medium text-zinc-400 hover:border-indigo-500 hover:text-indigo-400"
      >
        + Log Food
      </button>

      {/* Meal sections */}
      {(["breakfast", "lunch", "dinner", "snack"] as const).map((meal) => {
        const mealEntries = mealGroups[meal];
        if (mealEntries.length === 0) return null;

        return (
          <div
            key={meal}
            className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4"
          >
            <h3 className="mb-3 text-sm font-medium capitalize text-zinc-400">
              {meal}
            </h3>
            <div className="space-y-2">
              {mealEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-start justify-between rounded-lg bg-zinc-800/50 px-3 py-2"
                >
                  <div className="flex-1">
                    <p className="text-sm text-zinc-200">{entry.foodName}</p>
                    <p className="text-xs text-zinc-500">
                      {entry.servingSize}
                      {entry.servingSizeUnit}
                      {entry.notes && ` • ${entry.notes}`}
                    </p>
                  </div>
                  <div className="ml-3 flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-medium text-indigo-400">
                        {entry.calories} cal
                      </p>
                      {entry.protein !== undefined && (
                        <p className="text-xs text-zinc-500">
                          P: {entry.protein}g C: {entry.carbs}g F: {entry.fat}g
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => deleteLogEntry(entry.id, entry.dateKey)}
                      className="text-zinc-500 hover:text-red-400"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Daily summary */}
      {entries.length > 0 && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <h3 className="mb-3 text-sm font-medium text-zinc-400">
            Daily Summary
          </h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg bg-zinc-800/50 px-3 py-2">
              <p className="text-xs text-zinc-500">Total Calories</p>
              <p className="text-lg font-medium text-zinc-100">
                {stats.totalCalories}
              </p>
            </div>
            <div className="rounded-lg bg-zinc-800/50 px-3 py-2">
              <p className="text-xs text-zinc-500">Remaining</p>
              <p className="text-lg font-medium text-zinc-100">
                {Math.max(0, stats.goal - stats.totalCalories)}
              </p>
            </div>
            <div className="rounded-lg bg-zinc-800/50 px-3 py-2">
              <p className="text-xs text-zinc-500">Protein</p>
              <p className="text-lg font-medium text-zinc-100">
                {stats.totalProtein}g
              </p>
            </div>
            <div className="rounded-lg bg-zinc-800/50 px-3 py-2">
              <p className="text-xs text-zinc-500">Carbs / Fat</p>
              <p className="text-lg font-medium text-zinc-100">
                {stats.totalCarbs}g / {stats.totalFat}g
              </p>
            </div>
          </div>
        </div>
      )}

      <AddCalorieEntry
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </div>
  );
}
