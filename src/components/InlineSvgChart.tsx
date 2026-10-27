import { AttendanceTrendPoint } from '../types/index.ts';

interface InlineSvgChartProps {
  data: AttendanceTrendPoint[];
  title?: string;
}

export function InlineSvgChart({ data, title = 'Last 7 Days Attendance & Overtime Trend' }: InlineSvgChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="p-6 text-center text-sm text-slate-500 bg-slate-50 rounded-xl border border-slate-200">
        No shift history available for chart.
      </div>
    );
  }

  const maxHours = Math.max(...data.map((d) => d.totalHours), 12);
  const svgWidth = 560;
  const svgHeight = 200;
  const paddingLeft = 38;
  const paddingRight = 16;
  const paddingTop = 20;
  const paddingBottom = 34;

  const plotWidth = svgWidth - paddingLeft - paddingRight;
  const plotHeight = svgHeight - paddingTop - paddingBottom;
  const barSlotWidth = plotWidth / data.length;
  const barWidth = Math.min(34, barSlotWidth * 0.58);

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <h3 className="text-sm font-bold text-slate-800">{title}</h3>
        <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-teal-600 inline-block" aria-hidden="true" />
            Regular Hours
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-amber-500 inline-block" aria-hidden="true" />
            Overtime Hours
          </span>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          role="img"
          aria-label={title}
          className="w-full h-auto min-w-[320px] select-none"
        >
          <title>{title}</title>
          <desc>
            Bar chart comparing daily regular hours and overtime hours across the last 7 days.
          </desc>

          {/* Horizontal Grid Lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = paddingTop + plotHeight * (1 - ratio);
            const val = Math.round(maxHours * ratio);
            return (
              <g key={ratio}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={svgWidth - paddingRight}
                  y2={y}
                  stroke="#e2e8f0"
                  strokeDasharray={ratio === 0 ? undefined : '3 3'}
                  strokeWidth="1"
                />
                <text
                  x={paddingLeft - 6}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-slate-400 text-[10px] font-mono"
                >
                  {val}h
                </text>
              </g>
            );
          })}

          {/* Bars per Day */}
          {data.map((point, idx) => {
            const regularHours = Math.max(0, point.totalHours - point.overtimeHours);
            const regHeight = (regularHours / maxHours) * plotHeight;
            const otHeight = (point.overtimeHours / maxHours) * plotHeight;

            const x = paddingLeft + idx * barSlotWidth + (barSlotWidth - barWidth) / 2;
            const yReg = paddingTop + plotHeight - regHeight;
            const yOt = yReg - otHeight;

            return (
              <g key={point.date}>
                {/* Regular Hours Bar */}
                {regHeight > 0 && (
                  <rect
                    x={x}
                    y={yReg}
                    width={barWidth}
                    height={Math.max(2, regHeight)}
                    rx={otHeight > 0 ? 0 : 4}
                    className="fill-teal-600 transition-opacity hover:opacity-90"
                  />
                )}

                {/* Overtime Hours Stacked Top Bar */}
                {otHeight > 0 && (
                  <rect
                    x={x}
                    y={yOt}
                    width={barWidth}
                    height={Math.max(2, otHeight)}
                    rx={4}
                    className="fill-amber-500 transition-opacity hover:opacity-90"
                  />
                )}

                {/* Value Label Above Bar */}
                {point.totalHours > 0 && (
                  <text
                    x={x + barWidth / 2}
                    y={Math.max(12, yOt - 5)}
                    textAnchor="middle"
                    className="fill-slate-700 text-[10px] font-bold font-mono"
                  >
                    {point.totalHours.toFixed(1)}h
                  </text>
                )}

                {/* Day Label */}
                <text
                  x={x + barWidth / 2}
                  y={svgHeight - 12}
                  textAnchor="middle"
                  className="fill-slate-600 text-[11px] font-semibold"
                >
                  {point.dayLabel}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
