"use client";

import { useCallback, useState, useMemo } from "react";
import {
  CalorieLogEntry,
  CalorieGoal,
  CalorieLogMap,
  CalorieGoalMap,
  CalorieUndoAction,
  DailyCalorieStats,
} from "@/lib/types";
import { STORAGE_KEYS } from "@/lib/storage";
import { toDateKey, getLastNDays } from "@/lib/dates";
import { useLocalStorage } from "./useLocalStorage";

export function useCalories() {
  // Storage layers
  const [logs, setLogs, logsHydrated] = useLocalStorage<CalorieLogMap>(
    STORAGE_KEYS.CALORIE_LOGS,
    {}
  );
  const [goals, setGoals, goalsHydrated] = useLocalStorage<CalorieGoalMap>(
    STORAGE_KEYS.CALORIE_GOALS,
    {}
  );

  const [undoAction, setUndoAction] = useState<CalorieUndoAction | null>(null);

  const isHydrated = logsHydrated && goalsHydrated;

  // Get active goal
  const activeGoal = useMemo(() => {
    const today = new Date().toISOString();
    return Object.values(goals).find(
      (g) =>
        g.active &&
        g.startDate <= today &&
        (!g.endDate || g.endDate >= today)
    );
  }, [goals]);

  // Add calorie log entry
  const addLogEntry = useCallback(
    (entry: Omit<CalorieLogEntry, "id" | "timestamp" | "dateKey">) => {
      const now = new Date();
      const newEntry: CalorieLogEntry = {
        ...entry,
        id: crypto.randomUUID(),
        timestamp: now.toISOString(),
        dateKey: toDateKey(now),
      };

      setLogs((prev) => {
        const dateEntries = prev[newEntry.dateKey] || [];
        return {
          ...prev,
          [newEntry.dateKey]: [...dateEntries, newEntry],
        };
      });

      return newEntry;
    },
    [setLogs]
  );

  // Delete log entry
  const deleteLogEntry = useCallback(
    (entryId: string, dateKey: string) => {
      const entry = logs[dateKey]?.find((e) => e.id === entryId);

      setLogs((prev) => {
        const dateEntries = prev[dateKey] || [];
        const filtered = dateEntries.filter((e) => e.id !== entryId);
        return {
          ...prev,
          [dateKey]: filtered,
        };
      });

      if (entry) {
        setUndoAction({
          type: "deleteEntry",
          description: `Deleted ${entry.foodName}`,
          undo: () => {
            setLogs((prev) => {
              const dateEntries = prev[dateKey] || [];
              return {
                ...prev,
                [dateKey]: [...dateEntries, entry],
              };
            });
          },
        });
      }
    },
    [logs, setLogs]
  );

  // Update log entry
  const updateLogEntry = useCallback(
    (
      entryId: string,
      dateKey: string,
      updates: Partial<CalorieLogEntry>
    ) => {
      setLogs((prev) => {
        const dateEntries = prev[dateKey] || [];
        const updated = dateEntries.map((e) =>
          e.id === entryId ? { ...e, ...updates } : e
        );
        return {
          ...prev,
          [dateKey]: updated,
        };
      });
    },
    [setLogs]
  );

  // Get entries for a specific date
  const getEntriesForDate = useCallback(
    (date: Date): CalorieLogEntry[] => {
      const key = toDateKey(date);
      return logs[key] || [];
    },
    [logs]
  );

  // Create or update goal
  const setCalorieGoal = useCallback(
    (goal: Omit<CalorieGoal, "id">) => {
      // Deactivate all existing goals
      setGoals((prev) => {
        const deactivated = Object.fromEntries(
          Object.entries(prev).map(([id, g]) => [id, { ...g, active: false }])
        );

        const newGoal: CalorieGoal = {
          ...goal,
          id: crypto.randomUUID(),
        };

        return {
          ...deactivated,
          [newGoal.id]: newGoal,
        };
      });
    },
    [setGoals]
  );

  // Delete goal
  const deleteGoal = useCallback(
    (goalId: string) => {
      const goal = goals[goalId];

      setGoals((prev) => {
        const next = { ...prev };
        delete next[goalId];
        return next;
      });

      if (goal) {
        setUndoAction({
          type: "deleteGoal",
          description: "Deleted calorie goal",
          undo: () => {
            setGoals((prev) => ({ ...prev, [goalId]: goal }));
          },
        });
      }
    },
    [goals, setGoals]
  );

  // Get daily stats
  const getDailyStats = useCallback(
    (date: Date): DailyCalorieStats => {
      const key = toDateKey(date);
      const entries = logs[key] || [];

      const totalCalories = entries.reduce((sum, e) => sum + e.calories, 0);
      const totalProtein = entries.reduce(
        (sum, e) => sum + (e.protein || 0),
        0
      );
      const totalCarbs = entries.reduce((sum, e) => sum + (e.carbs || 0), 0);
      const totalFat = entries.reduce((sum, e) => sum + (e.fat || 0), 0);

      const goal = activeGoal?.dailyCalories || 2000;
      const percentOfGoal = goal > 0 ? (totalCalories / goal) * 100 : 0;

      return {
        date: key,
        totalCalories: Math.round(totalCalories),
        totalProtein: Math.round(totalProtein * 10) / 10,
        totalCarbs: Math.round(totalCarbs * 10) / 10,
        totalFat: Math.round(totalFat * 10) / 10,
        entryCount: entries.length,
        goal,
        percentOfGoal: Math.round(percentOfGoal),
      };
    },
    [logs, activeGoal]
  );

  // Get weekly average
  const getWeeklyAverage = useCallback((): number => {
    const days = getLastNDays(7);
    const totals = days.map((d) => getDailyStats(d).totalCalories);
    const sum = totals.reduce((a, b) => a + b, 0);
    return Math.round(sum / days.length);
  }, [getDailyStats]);

  // Undo functionality
  const clearUndo = useCallback(() => {
    setUndoAction(null);
  }, []);

  const performUndo = useCallback(() => {
    if (undoAction) {
      undoAction.undo();
      setUndoAction(null);
    }
  }, [undoAction]);

  // Export/import data
  const exportData = useCallback(() => {
    const data = { logs, goals };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `calorie-tracker-${toDateKey(new Date())}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [logs, goals]);

  const importData = useCallback(
    (json: string) => {
      try {
        const data = JSON.parse(json);
        if (data.logs) setLogs(data.logs);
        if (data.goals) setGoals(data.goals);
        return true;
      } catch {
        return false;
      }
    },
    [setLogs, setGoals]
  );

  return {
    logs,
    goals,
    activeGoal,
    isHydrated,
    undoAction,
    addLogEntry,
    deleteLogEntry,
    updateLogEntry,
    getEntriesForDate,
    setCalorieGoal,
    deleteGoal,
    getDailyStats,
    getWeeklyAverage,
    clearUndo,
    performUndo,
    exportData,
    importData,
  };
}
