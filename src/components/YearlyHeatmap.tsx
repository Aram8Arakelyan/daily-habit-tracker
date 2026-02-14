"use client";

import { getLastNDays, toDateKey, getMonthLabel } from "@/lib/dates";
import { Habit, CompletionMap } from "@/lib/types";

interface YearlyHeatmapProps {
  habits: Habit[];
  completions: CompletionMap;
}

const COLORS = [
  "#27272a", // 0%   — zinc-800
  "#064e3b", // 1-25%  — emerald-900
  "#065f46", // 26-50% — emerald-800
  "#047857", // 51-75% — emerald-700
  "#10b981", // 76-100% — emerald-500
];

function getColor(completed: number, total: number): string {
  if (total === 0 || completed === 0) return COLORS[0];
  const pct = completed / total;
  if (pct <= 0.25) return COLORS[1];
  if (pct <= 0.5) return COLORS[2];
  if (pct <= 0.75) return COLORS[3];
  return COLORS[4];
}

const DAY_LABELS = ["Mon", "", "Wed", "", "Fri", "", ""];

export default function YearlyHeatmap({
  habits,
  completions,
}: YearlyHeatmapProps) {
  const days = getLastNDays(365);
  const total = habits.length;
  const todayKey = toDateKey(new Date());

  // Build grid data: each day has a row index (0=Mon..6=Sun) and column index (week)
  type CellData = {
    date: Date;
    dateKey: string;
    completed: number;
    row: number;
    col: number;
  };

  const cells: CellData[] = [];
  // We need to figure out the column for each day.
  // The first day's weekday determines how many empty slots are at the start.
  const firstDay = days[0];
  // JS getDay(): 0=Sun,1=Mon..6=Sat → convert to Mon-based: Mon=0..Sun=6
  const toMonBased = (d: Date) => (d.getDay() + 6) % 7;

  let col = 0;
  let prevRow = toMonBased(firstDay);

  days.forEach((date, i) => {
    const row = toMonBased(date);
    // If we wrap from a later row to an earlier/equal row, we start a new column
    if (i > 0 && row <= prevRow) {
      col++;
    }
    const key = toDateKey(date);
    const completed = habits.filter((h) =>
      (completions[h.id] || []).includes(key)
    ).length;
    cells.push({ date, dateKey: key, completed, row, col });
    prevRow = row;
  });

  const totalCols = col + 1;

  // Month labels: find the first day of each month and its column
  const monthLabels: { label: string; col: number }[] = [];
  let lastMonth = -1;
  for (const cell of cells) {
    const m = cell.date.getMonth();
    if (m !== lastMonth) {
      monthLabels.push({ label: getMonthLabel(cell.date), col: cell.col });
      lastMonth = m;
    }
  }

  const cellSize = 12;
  const gap = 2;
  const leftPad = 28;
  const topPad = 18;
  const svgWidth = leftPad + totalCols * (cellSize + gap);
  const svgHeight = topPad + 7 * (cellSize + gap);

  return (
    <div className="overflow-x-auto">
      <svg width={svgWidth} height={svgHeight} className="block">
        {/* Month labels */}
        {monthLabels.map((m, i) => (
          <text
            key={i}
            x={leftPad + m.col * (cellSize + gap)}
            y={12}
            fill="#a1a1aa"
            fontSize={10}
          >
            {m.label}
          </text>
        ))}

        {/* Day-of-week labels */}
        {DAY_LABELS.map((label, i) =>
          label ? (
            <text
              key={i}
              x={0}
              y={topPad + i * (cellSize + gap) + cellSize - 2}
              fill="#a1a1aa"
              fontSize={10}
            >
              {label}
            </text>
          ) : null
        )}

        {/* Cells */}
        {cells.map((cell, i) => {
          const x = leftPad + cell.col * (cellSize + gap);
          const y = topPad + cell.row * (cellSize + gap);
          const dateStr = cell.date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });
          const isToday = cell.dateKey === todayKey;
          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={cellSize}
                height={cellSize}
                rx={2}
                fill={getColor(cell.completed, total)}
              >
                <title>{`${dateStr} — ${cell.completed}/${total} completed`}</title>
              </rect>
              {isToday && (
                <rect
                  x={x - 1}
                  y={y - 1}
                  width={cellSize + 2}
                  height={cellSize + 2}
                  rx={3}
                  fill="none"
                  stroke="#818cf8"
                  strokeWidth={2}
                />
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
