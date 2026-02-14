"use client";

import { USDASearchResponse, USDAFoodSearchResult, FoodItem } from "./types";

const USDA_BASE_URL = "https://api.nal.usda.gov/fdc/v1";

// Helper to get API key from localStorage or environment
export function getUSDAApiKey(): string | null {
  if (typeof window === "undefined") return null;

  // Try localStorage first (user-provided key)
  const stored = localStorage.getItem("daily-habit-tracker:usda-api-key");
  if (stored) return stored;

  // Fallback to environment variable (if set)
  return process.env.NEXT_PUBLIC_USDA_API_KEY || null;
}

export function setUSDAApiKey(key: string): void {
  localStorage.setItem("daily-habit-tracker:usda-api-key", key);
}

// Search for foods by query
export async function searchFoods(
  query: string,
  pageSize: number = 25,
  pageNumber: number = 1
): Promise<USDASearchResponse | null> {
  const apiKey = getUSDAApiKey();
  if (!apiKey) {
    throw new Error("USDA API key not configured");
  }

  try {
    const params = new URLSearchParams({
      query,
      pageSize: pageSize.toString(),
      pageNumber: pageNumber.toString(),
      dataType: "Survey (FNDDS),Foundation,Branded", // Include multiple data types
      api_key: apiKey,
    });

    const url = `${USDA_BASE_URL}/foods/search?${params}`;
    console.log("Fetching from USDA API:", url.replace(apiKey, "***"));

    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API error response:", errorText);
      if (response.status === 403) {
        throw new Error(`Invalid API key. Please check your key and try again.`);
      }
      throw new Error(`API error (${response.status}): ${errorText || response.statusText}`);
    }

    const data = await response.json();
    console.log("API response:", data);
    return data;
  } catch (error) {
    console.error("Error searching foods:", error);
    throw error; // Re-throw so FoodSearch can display it
  }
}

// Get detailed food information
export async function getFoodDetails(fdcId: number): Promise<FoodItem | null> {
  const apiKey = getUSDAApiKey();
  if (!apiKey) {
    throw new Error("USDA API key not configured");
  }

  try {
    const response = await fetch(
      `${USDA_BASE_URL}/food/${fdcId}?api_key=${apiKey}`
    );
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data: USDAFoodSearchResult = await response.json();
    return parseFoodItem(data);
  } catch (error) {
    console.error("Error fetching food details:", error);
    return null;
  }
}

// Parse USDA response into our FoodItem format
export function parseFoodItem(usdaFood: USDAFoodSearchResult): FoodItem {
  const nutrients = usdaFood.foodNutrients;

  // Find energy (calories)
  const energyNutrient = nutrients.find(
    (n) =>
      n.nutrientName.toLowerCase().includes("energy") ||
      n.nutrientNumber === "208"
  );
  const calories = energyNutrient?.value || 0;

  // Find protein
  const proteinNutrient = nutrients.find(
    (n) =>
      n.nutrientName.toLowerCase().includes("protein") ||
      n.nutrientNumber === "203"
  );
  const protein = proteinNutrient?.value;

  // Find carbs
  const carbsNutrient = nutrients.find(
    (n) =>
      n.nutrientName.toLowerCase().includes("carbohydrate") ||
      n.nutrientNumber === "205"
  );
  const carbs = carbsNutrient?.value;

  // Find fat
  const fatNutrient = nutrients.find(
    (n) =>
      n.nutrientName.toLowerCase().includes("total lipid") ||
      n.nutrientNumber === "204"
  );
  const fat = fatNutrient?.value;

  return {
    fdcId: usdaFood.fdcId,
    description: usdaFood.description,
    calories,
    protein,
    carbs,
    fat,
    brandOwner: usdaFood.brandOwner,
  };
}

// Calculate calories for a specific portion
export function calculatePortionCalories(
  baseCalories: number,
  servingSize: number,
  unit: "g" | "oz" | "serving"
): number {
  // Base calories are per 100g
  let grams = servingSize;

  if (unit === "oz") {
    grams = servingSize * 28.35; // Convert oz to grams
  } else if (unit === "serving") {
    grams = servingSize * 100; // Assume 1 serving = 100g
  }

  return Math.round((baseCalories / 100) * grams);
}

// Calculate macros for a specific portion
export function calculatePortionMacros(
  baseMacro: number | undefined,
  servingSize: number,
  unit: "g" | "oz" | "serving"
): number | undefined {
  if (baseMacro === undefined) return undefined;

  let grams = servingSize;
  if (unit === "oz") {
    grams = servingSize * 28.35;
  } else if (unit === "serving") {
    grams = servingSize * 100;
  }

  return Math.round((baseMacro / 100) * grams * 10) / 10; // Round to 1 decimal
}
