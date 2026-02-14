"use client";

import { useState } from "react";
import { searchFoods, parseFoodItem } from "@/lib/usda-api";
import { FoodItem } from "@/lib/types";

interface FoodSearchProps {
  onSelect: (food: FoodItem) => void;
}

export default function FoodSearch({ onSelect }: FoodSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await searchFoods(query, 10);
      if (response && response.foods && response.foods.length > 0) {
        const foods = response.foods.map(parseFoodItem);
        setResults(foods);
      } else if (response && response.foods && response.foods.length === 0) {
        setError("No foods found. Try a different search term.");
      } else {
        setError("Search failed. Check your API key and try again.");
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Search failed";
      setError(`Error: ${errorMsg}. Make sure your API key is valid.`);
      console.error("Food search error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Search input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Search for food..."
          className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        />
        <button
          onClick={handleSearch}
          disabled={loading || !query.trim()}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="rounded-lg bg-red-900/20 border border-red-700 px-3 py-2 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Results list */}
      {results.length > 0 && (
        <div className="max-h-80 space-y-1 overflow-y-auto rounded-lg border border-zinc-700 bg-zinc-900/50 p-2">
          {results.map((food) => (
            <button
              key={food.fdcId}
              onClick={() => onSelect(food)}
              className="w-full rounded-lg bg-zinc-800/50 px-3 py-2 text-left hover:bg-zinc-700/50"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-zinc-200">{food.description}</p>
                  {food.brandOwner && (
                    <p className="mt-0.5 text-xs text-zinc-500">
                      {food.brandOwner}
                    </p>
                  )}
                </div>
                <div className="ml-3 text-right">
                  <p className="text-sm font-medium text-indigo-400">
                    {Math.round(food.calories)} cal
                  </p>
                  <p className="text-xs text-zinc-500">per 100g</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
