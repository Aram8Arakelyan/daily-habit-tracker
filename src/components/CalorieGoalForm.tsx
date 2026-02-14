"use client";

import { useState, useEffect } from "react";
import { useCalorieContext } from "@/context/CalorieContext";

export default function CalorieGoalForm() {
  const { activeGoal, setCalorieGoal } = useCalorieContext();
  const [dailyCalories, setDailyCalories] = useState(2000);
  const [protein, setProtein] = useState<number | "">(150);
  const [carbs, setCarbs] = useState<number | "">(200);
  const [fat, setFat] = useState<number | "">(65);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (activeGoal) {
      setDailyCalories(activeGoal.dailyCalories);
      setProtein(activeGoal.protein || "");
      setCarbs(activeGoal.carbs || "");
      setFat(activeGoal.fat || "");
    }
  }, [activeGoal]);

  const handleSave = () => {
    setCalorieGoal({
      dailyCalories,
      protein: protein || undefined,
      carbs: carbs || undefined,
      fat: fat || undefined,
      startDate: new Date().toISOString(),
      active: true,
    });
    setShowForm(false);
  };

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50">
      <button
        onClick={() => setShowForm(!showForm)}
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-zinc-300 hover:text-zinc-100"
      >
        <span>
          {activeGoal ? "Calorie Goal" : "Set Calorie Goal"}
          {activeGoal && (
            <span className="ml-2 text-zinc-500">
              ({activeGoal.dailyCalories} cal/day)
            </span>
          )}
        </span>
        <svg
          className={`h-4 w-4 transition-transform ${showForm ? "rotate-180" : ""}`}
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

      {showForm && (
        <div className="space-y-4 border-t border-zinc-800 px-4 py-4">
          {/* Daily calories */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-500">
              Daily Calorie Target
            </label>
            <input
              type="number"
              value={dailyCalories}
              onChange={(e) => setDailyCalories(Number(e.target.value))}
              min="0"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-indigo-500"
            />
          </div>

          {/* Macros (optional) */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-500">
              Macro Targets (optional)
            </label>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <input
                  type="number"
                  value={protein}
                  onChange={(e) =>
                    setProtein(e.target.value ? Number(e.target.value) : "")
                  }
                  placeholder="Protein (g)"
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <input
                  type="number"
                  value={carbs}
                  onChange={(e) =>
                    setCarbs(e.target.value ? Number(e.target.value) : "")
                  }
                  placeholder="Carbs (g)"
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <input
                  type="number"
                  value={fat}
                  onChange={(e) =>
                    setFat(e.target.value ? Number(e.target.value) : "")
                  }
                  placeholder="Fat (g)"
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleSave}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
          >
            Save Goal
          </button>
        </div>
      )}
    </div>
  );
}
