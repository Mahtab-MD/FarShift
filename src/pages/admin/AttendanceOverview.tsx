import React, { useState, useMemo } from 'react';
import { Users, Clock, AlertTriangle, Search, CheckCircle2 } from 'lucide-react';
import { AttendanceTrendPoint, Shift } from '../../types/index.ts';
import { TIME_CONSTANTS } from '../../config/constants.ts';
import { InlineSvgChart } from '../../components/InlineSvgChart.tsx';

interface AttendanceOverviewProps {
  shifts: Shift[];
}

/**
 * Computes 7-day attendance and overtime trend points from shift history.
 *
 * @param {Shift[]} shifts - Recorded shifts
 * @returns {AttendanceTrendPoint[]} 7-day trend series
 */
function buildSevenDayTrend(shifts: Shift[]): AttendanceTrendPoint[] {
  const days: AttendanceTrendPoint[] = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getTime() - i * TIME_CONSTANTS.MS_PER_DAY);
    const dateStr = d.toISOString().split('T')[0];
    const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });
    const matching = shifts.filter((s) => s.checkInTime.startsWith(dateStr));
    let totalHours = 0;
    let overtimeHours = 0;
    const workerSet = new Set<string>();
    for (const s of matching) {
      totalHours += s.hoursWorked;
      overtimeHours += s.overtimeHours;
      workerSet.add(s.workerId);
    }
    days.push({
      date: dateStr,
      dayLabel: i === 0 ? 'Today' : dayLabel,
      totalHours: Math.round(totalHours * 10) / 10,
      overtimeHours: Math.round(overtimeHours * 10) / 10,
      activeWorkers: workerSet.size,
    });
  }
  return days;
}

/**
 * Employer attendance overview with KPI summary cards, 7-day inline SVG chart, and filterable shift log.
 *
 * @param {AttendanceOverviewProps} props - Component props
 * @returns {React.ReactElement} Rendered AttendanceOverview component
 */
export default function AttendanceOverview({ shifts }: AttendanceOverviewProps): React.ReactElement {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'overtime' | 'manual'>('all');

  const trendData = useMemo(() => buildSevenDayTrend(shifts), [shifts]);

  const filteredShifts = useMemo(
    () =>
      shifts.filter((s) => {
        if (!s.workerName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        if (filterMode === 'overtime') return s.overtimeHours > 0;
        if (filterMode === 'manual') return s.isManual;
        return true;
      }),
    [shifts, searchQuery, filterMode]
  );

  const summaryStats = useMemo(() => {
    let totalHours = 0;
    let totalOvertime = 0;
    let manualCount = 0;
    let activeCount = 0;
    for (const s of shifts) {
      totalHours += s.hoursWorked;
      totalOvertime += s.overtimeHours;
      if (s.isManual) manualCount++;
      if (s.status === 'active') activeCount++;
    }
    return {
      totalHours: Math.round(totalHours * 10) / 10,
      totalOvertime: Math.round(totalOvertime * 10) / 10,
      manualCount,
      activeCount,
    };
  }, [shifts]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
            <span>Total Shifts Logged</span>
            <Users className="w-4 h-4 text-teal-600" aria-hidden="true" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">{shifts.length}</div>
          <p className="text-[11px] text-teal-700 font-medium mt-1">{summaryStats.activeCount} currently active on site</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
            <span>7-Day Total Hours</span>
            <Clock className="w-4 h-4 text-teal-600" aria-hidden="true" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">{summaryStats.totalHours}h</div>
          <p className="text-[11px] text-slate-500 mt-1">Verified attendance hours</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
            <span>Total Overtime (1.5x)</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" aria-hidden="true" />
          </div>
          <div className="text-2xl font-extrabold text-amber-600 font-mono">+{summaryStats.totalOvertime}h</div>
          <p className="text-[11px] text-slate-500 mt-1">Counted automatically for pay</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
            <span>Manual Check-Ins</span>
            <CheckCircle2 className="w-4 h-4 text-slate-600" aria-hidden="true" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">{summaryStats.manualCount}</div>
          <p className="text-[11px] text-slate-500 mt-1">Flagged for supervisor audit</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <InlineSvgChart data={trendData} title="Attendance & Overtime Hours Trend (Today + Last 7 Days)" />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-slate-900">Shift Attendance Log</h3>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <label htmlFor="shift-worker-search" className="sr-only">Search worker name</label>
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
              <input
                id="shift-worker-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search worker..."
                className="pl-9 pr-3 py-1.5 min-h-[38px] text-xs rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>
            <div className="inline-flex rounded-lg bg-slate-100 p-0.5 border border-slate-200">
              {(['all', 'overtime', 'manual'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setFilterMode(mode)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold capitalize min-h-[32px] transition-colors cursor-pointer ${
                    filterMode === mode ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider">
                <th className="py-2.5 px-3 font-semibold">Worker</th>
                <th className="py-2.5 px-3 font-semibold">Date & Check-In</th>
                <th className="py-2.5 px-3 font-semibold">Verification</th>
                <th className="py-2.5 px-3 font-semibold">Regular</th>
                <th className="py-2.5 px-3 font-semibold">Overtime</th>
                <th className="py-2.5 px-3 font-semibold text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredShifts.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50">
                  <td className="py-3 px-3 font-bold text-slate-900">{s.workerName}</td>
                  <td className="py-3 px-3 text-slate-600 font-mono">
                    {new Date(s.checkInTime).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-3 px-3">
                    {s.isManual ? (
                      <span title={s.manualReason} className="inline-flex items-center px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold text-[11px]">Manual Flag</span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-teal-100 text-teal-900 font-bold text-[11px]">GPS Verified</span>
                    )}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-700">{s.regularHours}h</td>
                  <td className="py-3 px-3 font-mono font-bold text-amber-700">{s.overtimeHours > 0 ? `+${s.overtimeHours}h` : '0h'}</td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-900 text-right">
                    {s.status === 'active' ? <span className="text-teal-700">Active Shift</span> : `${s.hoursWorked}h`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
