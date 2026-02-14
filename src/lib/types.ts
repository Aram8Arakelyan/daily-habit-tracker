export type FrequencyType = "daily" | "weekdays" | "custom";

export interface Habit {
  id: string;
  name: string;
  emoji: string;
  createdAt: string;
  color: string;
  frequency: FrequencyType;
  customDays?: number[]; // 0=Sun..6=Sat, used when frequency === "custom"
  order: number;
  archived: boolean;
}

export type CompletionMap = Record<string, string[]>; // habitId -> dateString[]

export type NotesMap = Record<string, Record<string, string>>; // habitId -> { dateKey -> note }

export interface HabitStats {
  currentStreak: number;
  bestStreak: number;
  completionRateWeek: number;
  completionRateMonth: number;
  totalCompletions: number;
}

export interface UndoAction {
  type: "toggle" | "delete" | "archive";
  description: string;
  undo: () => void;
}

// USDA FoodData Central API Response Types
export interface USDAFoodSearchResult {
  fdcId: number;
  description: string;
  brandOwner?: string;
  dataType: string;
  foodNutrients: {
    nutrientId: number;
    nutrientName: string;
    nutrientNumber: string;
    unitName: string;
    value: number;
  }[];
}

export interface USDASearchResponse {
  foods: USDAFoodSearchResult[];
  totalHits: number;
  currentPage: number;
  totalPages: number;
}

// Core Calorie Tracking Types
export interface FoodItem {
  fdcId: number;
  description: string;
  calories: number; // per 100g
  protein?: number;
  carbs?: number;
  fat?: number;
  servingSize?: string;
  brandOwner?: string;
}

export interface CalorieLogEntry {
  id: string;
  fdcId: number;
  foodName: string;
  calories: number; // calculated based on portion
  servingSize: number; // in grams
  servingSizeUnit: "g" | "oz" | "serving";
  protein?: number;
  carbs?: number;
  fat?: number;
  timestamp: string; // ISO string
  dateKey: string; // YYYY-MM-DD
  meal?: "breakfast" | "lunch" | "dinner" | "snack";
  notes?: string;
}

export interface CalorieGoal {
  id: string;
  dailyCalories: number;
  protein?: number; // grams
  carbs?: number; // grams
  fat?: number; // grams
  startDate: string; // ISO string
  endDate?: string; // ISO string - optional for ongoing goals
  active: boolean;
}

// Maps for efficient lookups
export type CalorieLogMap = Record<string, CalorieLogEntry[]>; // dateKey -> entries[]
export type CalorieGoalMap = Record<string, CalorieGoal>; // goalId -> goal

// Daily summary statistics
export interface DailyCalorieStats {
  date: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  entryCount: number;
  goal?: number;
  percentOfGoal: number;
}

// Calorie-specific undo action
export interface CalorieUndoAction {
  type: "deleteEntry" | "deleteGoal";
  description: string;
  undo: () => void;
}
