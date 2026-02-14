"use client";

import { useState, useEffect } from "react";
import { FoodItem } from "@/lib/types";
import {
  calculatePortionCalories,
  calculatePortionMacros,
} from "@/lib/usda-api";
import FoodSearch from "./FoodSearch";
import { useCalorieContext } from "@/context/CalorieContext";

interface AddCalorieEntryProps {
  open: boolean;
  onClose: () => void;
}

export default function AddCalorieEntry({
  open,
  onClose,
}: AddCalorieEntryProps) {
  const { addLogEntry } = useCalorieContext();
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [servingSize, setServingSize] = useState<number>(100);
  const [servingUnit, setServingUnit] = useState<"g" | "oz" | "serving">("g");
  const [meal, setMeal] = useState<
    "breakfast" | "lunch" | "dinner" | "snack"
  >("breakfast");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!open) {
      // Reset form when closed
      setSelectedFood(null);
      setServingSize(100);
      setServingUnit("g");
      setMeal("breakfast");
      setNotes("");
    }
  }, [open]);

  if (!open) return null;

  const handleSave = () => {
    if (!selectedFood) return;

    const calories = calculatePortionCalories(
      selectedFood.calories,
      servingSize,
      servingUnit
    );
    const protein = calculatePortionMacros(
      selectedFood.protein,
      servingSize,
      servingUnit
    );
    const carbs = calculatePortionMacros(
      selectedFood.carbs,
      servingSize,
      servingUnit
    );
    const fat = calculatePortionMacros(
      selectedFood.fat,
      servingSize,
      servingUnit
    );

    addLogEntry({
      fdcId: selectedFood.fdcId,
      foodName: selectedFood.description,
      calories,
      servingSize,
      servingSizeUnit: servingUnit,
      protein,
      carbs,
      fat,
      meal,
      notes: notes || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-xl border border-zinc-700 bg-zinc-800 p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold text-zinc-100">Log Food</h3>

        {!selectedFood ? (
          <div className="mt-4">
            <FoodSearch onSelect={setSelectedFood} />
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {/* Selected food */}
            <div className="rounded-lg bg-zinc-900/50 p-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-zinc-200">
                    {selectedFood.description}
                  </p>
                  {selectedFood.brandOwner && (
                    <p className="text-xs text-zinc-500">
                      {selectedFood.brandOwner}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setSelectedFood(null)}
                  className="text-xs text-zinc-500 hover:text-zinc-300"
                >
                  Change
                </button>
              </div>
            </div>

            {/* Serving size */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-500">
                Serving Size
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={servingSize}
                  onChange={(e) => setServingSize(Number(e.target.value))}
                  min="1"
                  className="flex-1 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-indigo-500"
                />
                <select
                  value={servingUnit}
                  onChange={(e) =>
                    setServingUnit(e.target.value as "g" | "oz" | "serving")
                  }
                  className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-indigo-500"
                >
                  <option value="g">grams</option>
                  <option value="oz">oz</option>
                  <option value="serving">serving</option>
                </select>
              </div>
            </div>

            {/* Meal type */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-500">
                Meal
              </label>
              <div className="flex gap-2">
                {(["breakfast", "lunch", "dinner", "snack"] as const).map(
                  (m) => (
                    <button
                      key={m}
                      onClick={() => setMeal(m)}
                      className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium capitalize ${
                        meal === m
                          ? "bg-indigo-600 text-white"
                          : "bg-zinc-700 text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      {m}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-500">
                Notes (optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g., homemade, restaurant..."
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-indigo-500"
              />
            </div>

            {/* Calculated nutrition */}
            <div className="rounded-lg bg-indigo-900/20 border border-indigo-700/50 p-3">
              <p className="text-xs font-medium text-indigo-400 mb-2">
                Nutrition Summary
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-zinc-500">Calories:</span>
                  <span className="ml-2 font-medium text-zinc-200">
                    {calculatePortionCalories(
                      selectedFood.calories,
                      servingSize,
                      servingUnit
                    )}
                  </span>
                </div>
                {selectedFood.protein !== undefined && (
                  <div>
                    <span className="text-zinc-500">Protein:</span>
                    <span className="ml-2 font-medium text-zinc-200">
                      {calculatePortionMacros(
                        selectedFood.protein,
                        servingSize,
                        servingUnit
                      )}
                      g
                    </span>
                  </div>
                )}
                {selectedFood.carbs !== undefined && (
                  <div>
                    <span className="text-zinc-500">Carbs:</span>
                    <span className="ml-2 font-medium text-zinc-200">
                      {calculatePortionMacros(
                        selectedFood.carbs,
                        servingSize,
                        servingUnit
                      )}
                      g
                    </span>
                  </div>
                )}
                {selectedFood.fat !== undefined && (
                  <div>
                    <span className="text-zinc-500">Fat:</span>
                    <span className="ml-2 font-medium text-zinc-200">
                      {calculatePortionMacros(
                        selectedFood.fat,
                        servingSize,
                        servingUnit
                      )}
                      g
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-zinc-600 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700"
          >
            Cancel
          </button>
          {selectedFood && (
            <button
              onClick={handleSave}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
            >
              Add Food
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
