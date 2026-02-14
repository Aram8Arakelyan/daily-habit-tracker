"use client";

interface ProgressRingProps {
  completed: number;
  total: number;
}

export default function ProgressRing({ completed, total }: ProgressRingProps) {
  const size = 80;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = total > 0 ? completed / total : 0;
  const offset = circumference - pct * circumference;
  const allDone = total > 0 && completed >= total;

  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-zinc-800 dark:text-zinc-800"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={
              allDone
                ? "text-emerald-400 transition-all duration-700"
                : "text-indigo-500 transition-all duration-500"
            }
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-zinc-200">
            {completed}/{total}
          </span>
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-zinc-300">Today&apos;s Progress</p>
        <p className="text-xs text-zinc-500">
          {allDone
            ? "All done! Great work!"
            : total - completed === 1
              ? "1 habit remaining"
              : `${total - completed} habits remaining`}
        </p>
      </div>
    </div>
  );
}
