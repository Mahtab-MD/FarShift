import { useState, useEffect, useMemo } from 'react';
import { FileText, Printer, Sliders, CheckCircle2, RotateCcw } from 'lucide-react';
import { Sector, SectorSettings, Shift, Worker } from '../../types/index.ts';
import { calculatePayslip, formatCurrency } from '../../lib/payslip.ts';
import { CURRENCY_SYMBOL } from '../../config/constants.ts';
import { dataSource } from '../../data/index.ts';
import { useI18n } from '../../i18n/I18nContext.tsx';
import { AudioReadoutButton } from '../../components/AudioReadoutButton.tsx';

interface PayslipViewProps {
  worker: Worker;
  sector: Sector;
  settings: SectorSettings;
}

export function PayslipView({ worker, sector, settings }: PayslipViewProps) {
  const { t } = useI18n();
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);

  // Editable sample rates (defaulting to configured settings / worker rate)
  const [customBaseRate, setCustomBaseRate] = useState<number>(settings.baseHourlyRate);
  const [customMultiplier, setCustomMultiplier] = useState<number>(settings.overtimeMultiplier);
  const [customDeductionPct, setCustomDeductionPct] = useState<number>(
    settings.deductionPercentage
  );
  const [showRateEditor, setShowRateEditor] = useState(false);

  useEffect(() => {
    setCustomBaseRate(settings.baseHourlyRate);
    setCustomMultiplier(settings.overtimeMultiplier);
    setCustomDeductionPct(settings.deductionPercentage);
  }, [settings]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    dataSource
      .getShifts(sector)
      .then((all) => {
        if (!mounted) return;
        const workerCompleted = all.filter(
          (s) => s.workerId === worker.id && s.status === 'completed'
        );
        setShifts(workerCompleted);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [worker.id, sector]);

  const hoursSummary = useMemo(() => {
    let regular = 0;
    let overtime = 0;
    for (const s of shifts) {
      regular += s.regularHours;
      overtime += s.overtimeHours;
    }
    return {
      regularHours: Math.round(regular * 100) / 100,
      overtimeHours: Math.round(overtime * 100) / 100,
    };
  }, [shifts]);

  const payslip = useMemo(
    () =>
      calculatePayslip({
        regularHours: hoursSummary.regularHours,
        overtimeHours: hoursSummary.overtimeHours,
        baseHourlyRate: customBaseRate,
        overtimeMultiplier: customMultiplier,
        deductionPercentage: customDeductionPct,
      }),
    [hoursSummary, customBaseRate, customMultiplier, customDeductionPct]
  );

  const audioSummary = `${t.payslipTitle} for ${worker.name}. ${t.standardHours}: ${payslip.regularHours}. ${t.overtimeHours}: ${payslip.overtimeHours}. ${t.grossPay}: ${formatCurrency(payslip.grossTotalPay)}. ${t.deductions}: ${formatCurrency(payslip.deductionAmount)}. ${t.netPay}: ${formatCurrency(payslip.netPay)}.`;

  const resetSampleRates = () => {
    setCustomBaseRate(settings.baseHourlyRate);
    setCustomMultiplier(settings.overtimeMultiplier);
    setCustomDeductionPct(settings.deductionPercentage);
  };

  return (
    <div className="space-y-5">
      {/* Top Payslip Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 block">
              UN SDG 8 Wage Transparency
            </span>
            <h1 className="text-xl font-bold text-slate-900">{t.payslipTitle}</h1>
          </div>
          <AudioReadoutButton textToRead={audioSummary} />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
          <span>
            Worker: <strong>{worker.name}</strong> ({worker.roleTitle})
          </span>
          <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
            Sample Rates (Editable)
          </span>
        </div>
      </div>

      {/* Main Net Pay Card */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
            {t.netPay}
          </span>
          <span className="text-xs text-slate-400 font-mono">
            {shifts.length} Completed Shifts
          </span>
        </div>
        <div className="text-4xl font-extrabold font-mono tracking-tight text-white mb-4">
          {formatCurrency(payslip.netPay, CURRENCY_SYMBOL)}
        </div>

        <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 block">{t.standardHours}</span>
            <span className="font-bold font-mono text-sm text-white">
              {payslip.regularHours}h
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">{t.overtimeHours}</span>
            <span className="font-bold font-mono text-sm text-amber-400">
              +{payslip.overtimeHours}h
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">{t.grossPay}</span>
            <span className="font-bold font-mono text-sm text-teal-300">
              {formatCurrency(payslip.grossTotalPay, CURRENCY_SYMBOL)}
            </span>
          </div>
        </div>
      </div>

      {/* Itemized Breakdown Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-teal-700" aria-hidden="true" />
            {t.itemizedSummary}
          </h2>
          <button
            type="button"
            onClick={() => setShowRateEditor(!showRateEditor)}
            className="min-h-[36px] px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5 text-teal-700" aria-hidden="true" />
            {showRateEditor ? 'Hide Rate Editor' : 'Edit Sample Rates'}
          </button>
        </div>

        {/* Editable Sample Rate Controls */}
        {showRateEditor && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">
                Editable Sample Pay Configuration
              </span>
              <button
                type="button"
                onClick={resetSampleRates}
                className="inline-flex items-center gap-1 text-xs text-teal-700 font-semibold hover:underline"
              >
                <RotateCcw className="w-3 h-3" aria-hidden="true" />
                Reset to Site Default
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label
                  htmlFor="sample-base-rate"
                  className="block text-[11px] font-semibold text-slate-600 mb-1"
                >
                  {t.hourlyRate} ($/hr)
                </label>
                <input
                  id="sample-base-rate"
                  type="number"
                  step="0.5"
                  min="1"
                  max="200"
                  value={customBaseRate}
                  onChange={(e) => setCustomBaseRate(Math.max(0, Number(e.target.value)))}
                  className="w-full min-h-[40px] px-3 py-1.5 text-sm font-mono rounded-lg border border-slate-300 bg-white text-slate-900"
                />
              </div>
              <div>
                <label
                  htmlFor="sample-ot-multiplier"
                  className="block text-[11px] font-semibold text-slate-600 mb-1"
                >
                  Overtime Multiplier (x)
                </label>
                <input
                  id="sample-ot-multiplier"
                  type="number"
                  step="0.1"
                  min="1"
                  max="5"
                  value={customMultiplier}
                  onChange={(e) => setCustomMultiplier(Math.max(1, Number(e.target.value)))}
                  className="w-full min-h-[40px] px-3 py-1.5 text-sm font-mono rounded-lg border border-slate-300 bg-white text-slate-900"
                />
              </div>
              <div>
                <label
                  htmlFor="sample-deduction-pct"
                  className="block text-[11px] font-semibold text-slate-600 mb-1"
                >
                  Deductions (%)
                </label>
                <input
                  id="sample-deduction-pct"
                  type="number"
                  step="0.5"
                  min="0"
                  max="50"
                  value={customDeductionPct}
                  onChange={(e) =>
                    setCustomDeductionPct(Math.min(100, Math.max(0, Number(e.target.value))))
                  }
                  className="w-full min-h-[40px] px-3 py-1.5 text-sm font-mono rounded-lg border border-slate-300 bg-white text-slate-900"
                />
              </div>
            </div>
          </div>
        )}

        {/* Line Items Table */}
        {loading ? (
          <p className="text-xs text-slate-500 py-4 text-center">Calculating payslip...</p>
        ) : (
          <div className="divide-y divide-slate-200 text-sm">
            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-800">{t.regularPay}</p>
                <p className="text-xs text-slate-500 font-mono">
                  {payslip.regularHours}h × {formatCurrency(payslip.baseHourlyRate)}/hr
                </p>
              </div>
              <span className="font-bold font-mono text-slate-900">
                {formatCurrency(payslip.grossRegularPay)}
              </span>
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-800">{t.overtimePay}</p>
                <p className="text-xs text-slate-500 font-mono">
                  {payslip.overtimeHours}h × {formatCurrency(payslip.overtimeHourlyRate)}/hr (
                  {customMultiplier}x rate)
                </p>
              </div>
              <span className="font-bold font-mono text-amber-700">
                +{formatCurrency(payslip.grossOvertimePay)}
              </span>
            </div>

            <div className="py-3 flex items-center justify-between bg-slate-50/70 px-2 rounded-lg">
              <span className="font-bold text-slate-800">{t.grossPay}</span>
              <span className="font-bold font-mono text-slate-900">
                {formatCurrency(payslip.grossTotalPay)}
              </span>
            </div>

            <div className="py-3 flex items-center justify-between text-rose-700">
              <div>
                <p className="font-semibold">{t.deductions}</p>
                <p className="text-xs text-rose-600/80 font-mono">
                  Tax & Social Security ({payslip.deductionPercentage}%)
                </p>
              </div>
              <span className="font-bold font-mono">
                -{formatCurrency(payslip.deductionAmount)}
              </span>
            </div>

            <div className="pt-4 pb-1 flex items-center justify-between text-base">
              <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-5 h-5 text-teal-600" aria-hidden="true" />
                {t.netPay}
              </span>
              <span className="font-extrabold font-mono text-xl text-teal-700">
                {formatCurrency(payslip.netPay)}
              </span>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => window.print()}
          className="w-full min-h-[48px] inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm rounded-xl px-4 py-2.5 transition-colors cursor-pointer"
        >
          <Printer className="w-4 h-4" aria-hidden="true" />
          <span>{t.printPayslip}</span>
        </button>
      </div>
    </div>
  );
}
