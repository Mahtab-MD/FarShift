import { useMemo } from 'react';
import { Activity, AlertTriangle, Clock, ShieldCheck, Sliders } from 'lucide-react';
import { SectorSettings, Shift } from '../../types/index.ts';
import { evaluateWorkerFatigue } from '../../lib/fatigue.ts';

interface FatigueAlertsProps {
  shifts: Shift[];
  settings: SectorSettings;
  onUpdateSettings: (next: SectorSettings) => Promise<void>;
}

export default function FatigueAlerts({
  shifts,
  settings,
  onUpdateSettings,
}: FatigueAlertsProps) {
  const alerts = useMemo(
    () =>
      evaluateWorkerFatigue(
        shifts,
        settings.fatigueDailyHoursThreshold,
        settings.fatigueMinRestHoursThreshold
      ),
    [shifts, settings.fatigueDailyHoursThreshold, settings.fatigueMinRestHoursThreshold]
  );

  const handleDailyThresholdChange = (val: number) => {
    if (val >= 4 && val <= 20) {
      onUpdateSettings({
        ...settings,
        fatigueDailyHoursThreshold: val,
      });
    }
  };

  const handleRestThresholdChange = (val: number) => {
    if (val >= 4 && val <= 24) {
      onUpdateSettings({
        ...settings,
        fatigueMinRestHoursThreshold: val,
      });
    }
  };

  return (
    <div className="space-y-5">
      {/* Configurable Fatigue Rules Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-amber-600" aria-hidden="true" />
              Workforce Fatigue & Overwork Prevention Engine
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Automatically flags workers exceeding daily hour caps or returning for back-to-back
              shifts with insufficient rest.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-md bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold">
            {alerts.length} Active Fatigue Flags
          </span>
        </div>

        {/* Live Threshold Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <label
              htmlFor="fatigue-daily-limit"
              className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1.5"
            >
              <span className="inline-flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-teal-700" aria-hidden="true" />
                Max Daily Shift Hours Threshold
              </span>
              <span className="font-mono text-teal-700">
                {settings.fatigueDailyHoursThreshold}h
              </span>
            </label>
            <input
              id="fatigue-daily-limit"
              type="number"
              step="0.5"
              min="4"
              max="20"
              value={settings.fatigueDailyHoursThreshold}
              onChange={(e) => handleDailyThresholdChange(Number(e.target.value))}
              className="w-full min-h-[40px] px-3 py-1.5 text-sm font-mono rounded-lg border border-slate-300 bg-white text-slate-900"
            />
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <label
              htmlFor="fatigue-rest-gap"
              className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1.5"
            >
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-teal-700" aria-hidden="true" />
                Min Rest Gap Between Shifts
              </span>
              <span className="font-mono text-teal-700">
                {settings.fatigueMinRestHoursThreshold}h
              </span>
            </label>
            <input
              id="fatigue-rest-gap"
              type="number"
              step="0.5"
              min="4"
              max="24"
              value={settings.fatigueMinRestHoursThreshold}
              onChange={(e) => handleRestThresholdChange(Number(e.target.value))}
              className="w-full min-h-[40px] px-3 py-1.5 text-sm font-mono rounded-lg border border-slate-300 bg-white text-slate-900"
            />
          </div>
        </div>
      </div>

      {/* Alert List */}
      {alerts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-2">
          <ShieldCheck className="w-8 h-8 text-emerald-600 mx-auto" aria-hidden="true" />
          <p className="text-sm font-bold text-slate-800">
            Zero Fatigue Violations Detected
          </p>
          <p className="text-xs text-slate-500">
            All workers are within the {settings.fatigueDailyHoursThreshold}h daily limit and{' '}
            {settings.fatigueMinRestHoursThreshold}h rest turnaround requirement.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`rounded-2xl border p-5 shadow-xs space-y-2.5 ${
                alert.severity === 'critical'
                  ? 'bg-rose-50/70 border-rose-300'
                  : 'bg-amber-50/70 border-amber-300'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <AlertTriangle
                    className={`w-4 h-4 ${
                      alert.severity === 'critical' ? 'text-rose-600' : 'text-amber-600'
                    }`}
                    aria-hidden="true"
                  />
                  {alert.workerName}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    alert.type === 'excessive_hours'
                      ? 'bg-amber-200 text-amber-950'
                      : 'bg-rose-200 text-rose-950'
                  }`}
                >
                  {alert.type === 'excessive_hours' ? 'Long Day Exceeded' : 'Back-to-Back Shift'}
                </span>
              </div>

              <p className="text-xs text-slate-800 leading-relaxed font-medium">
                {alert.details}
              </p>

              <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1 border-t border-slate-200/70 font-mono">
                <span>
                  Recorded: {alert.metricValue}h vs Threshold: {alert.thresholdValue}h
                </span>
                <span>{new Date(alert.timestamp).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
