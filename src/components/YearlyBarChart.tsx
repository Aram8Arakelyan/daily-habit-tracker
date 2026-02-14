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
import { toDateKey, getMonthLabel } from "@/lib/dates";
import { Habit, CompletionMap } from "@/lib/types";

interface YearlyBarChartProps {
  habits: Habit[];
  completions: CompletionMap;
}

export default function YearlyBarChart({
  habits,
  completions,
}: YearlyBarChartProps) {
  // Generate the last 12 months
  const today = new Date();
  const months: { year: number; month: number; label: string }[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    months.push({
      year: d.getFullYear(),
      month: d.getMonth(),
      label: getMonthLabel(d),
    });
  }

  // Precompute a set of completed dates per habit for fast lookup
  const completionSets: Record<string, Set<string>> = {};
  for (const h of habits) {
    completionSets[h.id] = new Set(completions[h.id] || []);
  }

  const data = months.map(({ year, month, label }) => {
    // Count days in this month (up to today if it's the current month)
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const isCurrentMonth =
      year === today.getFullYear() && month === today.getMonth();
    const maxDay = isCurrentMonth ? today.getDate() : daysInMonth;

    let totalCompleted = 0;
    for (let day = 1; day <= maxDay; day++) {
      const dateKey = toDateKey(new Date(year, month, day));
      for (const h of habits) {
        if (completionSets[h.id].has(dateKey)) {
          totalCompleted++;
        }
      }
    }

    const avg = maxDay > 0 ? Math.round((totalCompleted / maxDay) * 10) / 10 : 0;
    return { month: label, avg };
  });

  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="month" tick={{ fill: "#a1a1aa", fontSize: 12 }} />
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
            formatter={(value) => [value, "Avg/day"]}
          />
          <Bar dataKey="avg" fill="#10b981" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
