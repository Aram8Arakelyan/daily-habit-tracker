"use client";

import { useState } from "react";
import { getUSDAApiKey, setUSDAApiKey } from "@/lib/usda-api";

export default function USDAApiKeySetup() {
  const [apiKey, setApiKeyState] = useState(getUSDAApiKey() || "");
  const [showSetup, setShowSetup] = useState(!getUSDAApiKey());

  const handleSave = () => {
    if (apiKey.trim()) {
      setUSDAApiKey(apiKey.trim());
      setShowSetup(false);
    }
  };

  if (!showSetup) {
    return (
      <button
        onClick={() => setShowSetup(true)}
        className="text-xs text-zinc-500 hover:text-zinc-300"
      >
        Update API Key
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-700 bg-zinc-800/80 p-4 space-y-3">
      <div>
        <h4 className="text-sm font-medium text-zinc-200">
          USDA FoodData Central API Key
        </h4>
        <p className="mt-1 text-xs text-zinc-500">
          Get a free API key at{" "}
          <a
            href="https://fdc.nal.usda.gov/api-key-signup.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-400 hover:underline"
          >
            fdc.nal.usda.gov
          </a>
        </p>
      </div>
      <input
        type="text"
        value={apiKey}
        onChange={(e) => setApiKeyState(e.target.value)}
        placeholder="Enter your API key..."
        className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-indigo-500"
      />
      <div className="flex justify-end gap-2">
        {getUSDAApiKey() && (
          <button
            onClick={() => setShowSetup(false)}
            className="rounded-lg border border-zinc-600 px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-700"
          >
            Cancel
          </button>
        )}
        <button
          onClick={handleSave}
          disabled={!apiKey.trim()}
          className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-500 disabled:opacity-40"
        >
          Save
        </button>
      </div>
    </div>
  );
}
