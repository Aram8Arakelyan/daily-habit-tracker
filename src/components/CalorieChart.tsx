"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { getLastNDays, getDateLabel } from "@/lib/dates";
import { useCalorieContext } from "@/context/CalorieContext";

interface CalorieChartProps {
  days?: number;
}

export default function CalorieChart({ days = 7 }: CalorieChartProps) {
  const { getDailyStats } = useCalorieContext();
  const dates = getLastNDays(days);

  const data = dates.map((date) => {
    const stats = getDailyStats(date);
    return {
      date: getDateLabel(date),
      calories: stats.totalCalories,
      goal: stats.goal,
    };
  });

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="calorieGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="date" tick={{ fill: "#a1a1aa", fontSize: 12 }} />
          <YAxis tick={{ fill: "#a1a1aa", fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#27272a",
              border: "1px solid #3f3f46",
              borderRadius: "8px",
              color: "#e4e4e7",
            }}
          />
          <ReferenceLine
            y={data[0]?.goal || 2000}
            stroke="#10b981"
            strokeDasharray="5 5"
            label={{ value: "Goal", fill: "#10b981", fontSize: 12 }}
          />
          <Area
            type="monotone"
            dataKey="calories"
            stroke="#6366f1"
            strokeWidth={2}
            fill="url(#calorieGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
