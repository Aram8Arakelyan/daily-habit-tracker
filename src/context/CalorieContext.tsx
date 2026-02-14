"use client";

import { createContext, useContext, ReactNode } from "react";
import { useCalories } from "@/hooks/useCalories";

type CalorieContextType = ReturnType<typeof useCalories>;

const CalorieContext = createContext<CalorieContextType | null>(null);

export function CalorieProvider({ children }: { children: ReactNode }) {
  const calories = useCalories();
  return (
    <CalorieContext.Provider value={calories}>
      {children}
    </CalorieContext.Provider>
  );
}

export function useCalorieContext(): CalorieContextType {
  const ctx = useContext(CalorieContext);
  if (!ctx) {
    throw new Error("useCalorieContext must be used within CalorieProvider");
  }
  return ctx;
}
