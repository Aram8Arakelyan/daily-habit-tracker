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
import { getLastNDays, toDateKey, getDateLabel } from "@/lib/dates";
import { Habit, CompletionMap } from "@/lib/types";

interface MonthlyChartProps {
  habits: Habit[];
  completions: CompletionMap;
}

export default function MonthlyChart({
  habits,
  completions,
}: MonthlyChartProps) {
  const days = getLastNDays(30);

  const data = days.map((date) => {
    const key = toDateKey(date);
    const completed = habits.filter((h) =>
      (completions[h.id] || []).includes(key)
    ).length;
    return {
      date: getDateLabel(date),
      completed,
    };
  });

  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis
            dataKey="date"
            tick={{ fill: "#a1a1aa", fontSize: 10 }}
            interval={4}
          />
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
          <Bar dataKey="completed" fill="#10b981" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
