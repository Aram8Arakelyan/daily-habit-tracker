"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getLastNDays, toDateKey, getDayLabel } from "@/lib/dates";
import { Habit, CompletionMap } from "@/lib/types";

interface WeeklyChartProps {
  habits: Habit[];
  completions: CompletionMap;
}

export default function WeeklyChart({ habits, completions }: WeeklyChartProps) {
  const days = getLastNDays(7);

  const data = days.map((date) => {
    const key = toDateKey(date);
    const completed = habits.filter((h) =>
      (completions[h.id] || []).includes(key)
    ).length;
    return {
      day: getDayLabel(date),
      completed,
      total: habits.length,
    };
  });

  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="day" tick={{ fill: "#a1a1aa", fontSize: 12 }} />
          <YAxis
            allowDecimals={false}
            tick={{ fill: "#a1a1aa", fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#27272a",
              border: "1px solid #3f3f46",
              borderRadius: "8px",
              color: "#e4e4e7",
            }}
          />
          <Bar dataKey="completed" fill="#6366f1" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
