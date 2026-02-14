"use client";

import { getDayLabel, getDateLabel, toDateKey } from "@/lib/dates";

interface CalendarGridProps {
  dates: Date[];
}

export default function CalendarGrid({ dates }: CalendarGridProps) {
  const todayKey = toDateKey(new Date());

  return (
    <>
      <div /> {/* spacer for habit name column */}
      {dates.map((date) => {
        const key = toDateKey(date);
        const isToday = key === todayKey;
        return (
          <div
            key={key}
            className={`flex flex-col items-center text-[10px] leading-tight ${
              isToday
                ? "rounded-md bg-indigo-500/15 px-1 py-0.5 font-semibold text-indigo-400"
                : "text-zinc-500"
            }`}
          >
            <span>{getDayLabel(date)}</span>
            <span>{getDateLabel(date)}</span>
            {isToday && (
              <span className="mt-0.5 text-[8px] uppercase tracking-wide text-indigo-400">
                Today
              </span>
            )}
          </div>
        );
      })}
      <div /> {/* spacer for actions column */}
    </>
  );
}
