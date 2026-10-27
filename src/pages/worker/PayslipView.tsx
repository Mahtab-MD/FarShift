import React, { useState, useEffect, useMemo } from 'react';
import { FileText, Printer, Sliders } from 'lucide-react';
import { Sector, SectorSettings, Shift, Worker } from '../../types/index.ts';
import { calculatePayslip, formatCurrency } from '../../lib/payslip.ts';
import { CURRENCY_SYMBOL } from '../../config/constants.ts';
import { dataSource } from '../../data/index.ts';
import { useI18n } from '../../i18n/I18nContext.tsx';
import { AudioReadoutButton } from '../../components/AudioReadoutButton.tsx';
import { SampleRateEditor, PayslipLineItems } from '../../components/worker/PayslipParts.tsx';

interface PayslipViewProps {
  worker: Worker;
  sector: Sector;
  settings: SectorSettings;
}

/**
 * Displays the itemized worker payslip with editable sample rates and audio readout.
 *
 * @param {PayslipViewProps} props - Component props
 * @returns {React.ReactElement} Rendered PayslipView component
 */
export function PayslipView({ worker, sector, settings }: PayslipViewProps): React.ReactElement {
  const { t } = useI18n();
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [customBaseRate, setCustomBaseRate] = useState<number>(settings.baseHourlyRate);
  const [customMultiplier, setCustomMultiplier] = useState<number>(settings.overtimeMultiplier);
  const [customDeductionPct, setCustomDeductionPct] = useState<number>(
    settings.deductionPercentage
  );
  const [isShowingRateEditor, setIsShowingRateEditor] = useState(false);

  useEffect(() => {
    setCustomBaseRate(settings.baseHourlyRate);
    setCustomMultiplier(settings.overtimeMultiplier);
    setCustomDeductionPct(settings.deductionPercentage);
  }, [settings]);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    dataSource
      .getShifts(sector)
      .then((all) => {
        if (!isMounted) return;
        const workerCompleted = all.filter(
          (s) => s.workerId === worker.id && s.status === 'completed'
        );
        setShifts(workerCompleted);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => {
      isMounted = false;
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

  const resetSampleRates = (): void => {
    setCustomBaseRate(settings.baseHourlyRate);
    setCustomMultiplier(settings.overtimeMultiplier);
    setCustomDeductionPct(settings.deductionPercentage);
  };

  return (
    <div className="space-y-5">
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

      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-teal-700" aria-hidden="true" />
            {t.itemizedSummary}
          </h2>
          <button
            type="button"
            onClick={() => setIsShowingRateEditor(!isShowingRateEditor)}
            className="min-h-[36px] px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5 text-teal-700" aria-hidden="true" />
            {isShowingRateEditor ? 'Hide Rate Editor' : 'Edit Sample Rates'}
          </button>
        </div>

        {isShowingRateEditor && (
          <SampleRateEditor
            customBaseRate={customBaseRate}
            customMultiplier={customMultiplier}
            customDeductionPct={customDeductionPct}
            onChangeBaseRate={setCustomBaseRate}
            onChangeMultiplier={setCustomMultiplier}
            onChangeDeductionPct={setCustomDeductionPct}
            onReset={resetSampleRates}
            t={t}
          />
        )}

        {isLoading ? (
          <p className="text-xs text-slate-500 py-4 text-center">Calculating payslip...</p>
        ) : (
          <PayslipLineItems payslip={payslip} customMultiplier={customMultiplier} t={t} />
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
