"use client";

interface StreakBadgeProps {
  streak: number;
}

export default function StreakBadge({ streak }: StreakBadgeProps) {
  if (streak === 0) return null;

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/15 px-2 py-0.5 text-xs font-medium text-orange-400">
      <span>🔥</span>
      <span>{streak}</span>
    </span>
  );
}
