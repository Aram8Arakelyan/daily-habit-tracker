"use client";

import { createContext, useContext, ReactNode } from "react";
import { useHabits } from "@/hooks/useHabits";

type HabitContextType = ReturnType<typeof useHabits>;

const HabitContext = createContext<HabitContextType | null>(null);

export function HabitProvider({ children }: { children: ReactNode }) {
  const habits = useHabits();
  return (
    <HabitContext.Provider value={habits}>{children}</HabitContext.Provider>
  );
}

export function useHabitContext(): HabitContextType {
  const ctx = useContext(HabitContext);
  if (!ctx) {
    throw new Error("useHabitContext must be used within HabitProvider");
  }
  return ctx;
}
