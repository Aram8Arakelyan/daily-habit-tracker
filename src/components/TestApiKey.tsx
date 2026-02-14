"use client";

import { useState } from "react";
import { getUSDAApiKey } from "@/lib/usda-api";

export default function TestApiKey() {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<string>("");

  const testKey = async () => {
    setTesting(true);
    setResult("");

    const apiKey = getUSDAApiKey();
    if (!apiKey) {
      setResult("❌ No API key found. Please save your API key first.");
      setTesting(false);
      return;
    }

    try {
      const url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=apple&pageSize=1&api_key=${apiKey}`;
      const response = await fetch(url);

      if (!response.ok) {
        const errorText = await response.text();
        setResult(`❌ API Error (${response.status}): ${errorText}`);
      } else {
        const data = await response.json();
        if (data.foods && data.foods.length > 0) {
          setResult(`✅ API key works! Found: ${data.foods[0].description}`);
        } else {
          setResult("⚠️ API key works but no results found.");
        }
      }
    } catch (error) {
      setResult(`❌ Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="rounded-lg border border-zinc-700 bg-zinc-800/50 p-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1">
          <p className="text-xs font-medium text-zinc-400">Test API Connection</p>
          {result && (
            <p className="mt-1 text-xs text-zinc-300">{result}</p>
          )}
        </div>
        <button
          onClick={testKey}
          disabled={testing}
          className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-500 disabled:opacity-40"
        >
          {testing ? "Testing..." : "Test Key"}
        </button>
      </div>
    </div>
  );
}
