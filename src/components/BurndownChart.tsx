'use client';

import { Sprint } from '@/types';
import dayjs from 'dayjs';

interface BurndownChartProps {
  sprint: Sprint;
}

export default function BurndownChart({ sprint }: BurndownChartProps) {
  if (!sprint.metrics || !sprint.metrics.totalPontos) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Adicione cards com story points ao sprint para visualizar o burndown chart</p>
      </div>
    );
  }

  const startDate = dayjs(sprint.dataInicio.toDate());
  const endDate = dayjs(sprint.dataFim.toDate());
  const today = dayjs();
  const totalDays = endDate.diff(startDate, 'day') + 1;
  const daysElapsed = today.diff(startDate, 'day') + 1;

  // Calculate ideal burndown line
  const idealBurndown: { day: number; points: number }[] = [];
  for (let i = 0; i <= totalDays; i++) {
    const remainingPoints = sprint.metrics.totalPontos * (1 - i / totalDays);
    idealBurndown.push({ day: i, points: Math.max(0, remainingPoints) });
  }

  // Calculate actual burndown (simplified - using current progress)
  const currentRemaining = sprint.metrics.totalPontos - sprint.metrics.pontosCompletados;
  const actualBurndown: { day: number; points: number }[] = [
    { day: 0, points: sprint.metrics.totalPontos },
  ];

  if (daysElapsed > 0 && daysElapsed <= totalDays) {
    actualBurndown.push({ day: Math.min(daysElapsed, totalDays), points: currentRemaining });
  }

  // Chart dimensions
  const chartWidth = 600;
  const chartHeight = 300;
  const padding = 40;
  const graphWidth = chartWidth - padding * 2;
  const graphHeight = chartHeight - padding * 2;

  const maxPoints = sprint.metrics.totalPontos;
  const scaleX = graphWidth / totalDays;
  const scaleY = graphHeight / maxPoints;

  // Generate SVG path for ideal line
  const idealPath = idealBurndown
    .map(
      (point, i) =>
        `${i === 0 ? 'M' : 'L'} ${padding + point.day * scaleX} ${
          padding + (maxPoints - point.points) * scaleY
        }`
    )
    .join(' ');

  // Generate SVG path for actual line
  const actualPath = actualBurndown
    .map(
      (point, i) =>
        `${i === 0 ? 'M' : 'L'} ${padding + point.day * scaleX} ${
          padding + (maxPoints - point.points) * scaleY
        }`
    )
    .join(' ');

  return (
    <div className="relative">
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        className="overflow-visible"
      >
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((fraction) => {
          const y = padding + graphHeight * fraction;
          const points = maxPoints * (1 - fraction);
          return (
            <g key={fraction}>
              <line
                x1={padding}
                y1={y}
                x2={chartWidth - padding}
                y2={y}
                stroke="#e5e7eb"
                strokeWidth="1"
              />
              <text x={padding - 10} y={y + 5} textAnchor="end" fontSize="12" fill="#6b7280">
                {Math.round(points)}
              </text>
            </g>
          );
        })}

        {/* X-axis labels */}
        {[0, Math.floor(totalDays / 2), totalDays].map((day) => {
          const x = padding + day * scaleX;
          const date = startDate.add(day, 'day');
          return (
            <g key={day}>
              <line x1={x} y1={padding} x2={x} y2={chartHeight - padding} stroke="#e5e7eb" />
              <text
                x={x}
                y={chartHeight - padding + 20}
                textAnchor="middle"
                fontSize="12"
                fill="#6b7280"
              >
                {date.format('DD/MM')}
              </text>
            </g>
          );
        })}

        {/* Ideal burndown line */}
        <path d={idealPath} stroke="#9ca3af" strokeWidth="2" fill="none" strokeDasharray="5,5" />

        {/* Actual burndown line */}
        <path d={actualPath} stroke="#2563eb" strokeWidth="3" fill="none" />

        {/* Current day marker */}
        {daysElapsed > 0 && daysElapsed <= totalDays && (
          <line
            x1={padding + daysElapsed * scaleX}
            y1={padding}
            x2={padding + daysElapsed * scaleX}
            y2={chartHeight - padding}
            stroke="#ef4444"
            strokeWidth="2"
            strokeDasharray="3,3"
          />
        )}

        {/* Axes */}
        <line
          x1={padding}
          y1={padding}
          x2={padding}
          y2={chartHeight - padding}
          stroke="#374151"
          strokeWidth="2"
        />
        <line
          x1={padding}
          y1={chartHeight - padding}
          x2={chartWidth - padding}
          y2={chartHeight - padding}
          stroke="#374151"
          strokeWidth="2"
        />

        {/* Axis labels */}
        <text
          x={chartWidth / 2}
          y={chartHeight - 5}
          textAnchor="middle"
          fontSize="14"
          fill="#374151"
          fontWeight="500"
        >
          Dias do Sprint
        </text>
        <text
          x={15}
          y={chartHeight / 2}
          textAnchor="middle"
          fontSize="14"
          fill="#374151"
          fontWeight="500"
          transform={`rotate(-90 15 ${chartHeight / 2})`}
        >
          Story Points
        </text>
      </svg>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-0.5 bg-gray-400 border-dashed border-t-2" />
          <span className="text-sm text-gray-600">Ideal</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-0.5 bg-blue-600" />
          <span className="text-sm text-gray-600">Real</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-0.5 bg-red-500 border-dashed border-t-2" />
          <span className="text-sm text-gray-600">Hoje</span>
        </div>
      </div>
    </div>
  );
}
