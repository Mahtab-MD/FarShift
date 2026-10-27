import React from 'react';
import { CheckCircle2, RotateCcw } from 'lucide-react';
import { PayslipBreakdown, formatCurrency } from '../../lib/payslip.ts';
import { Translations } from '../../i18n/translations.ts';

interface SampleRateEditorProps {
  customBaseRate: number;
  customMultiplier: number;
  customDeductionPct: number;
  onChangeBaseRate: (val: number) => void;
  onChangeMultiplier: (val: number) => void;
  onChangeDeductionPct: (val: number) => void;
  onReset: () => void;
  t: Translations;
}

/**
 * Renders the editable sample rate controls for the worker payslip preview.
 *
 * @param {SampleRateEditorProps} props - Rate editor props
 * @returns {React.ReactElement} Rate editor form section
 */
export function SampleRateEditor({
  customBaseRate,
  customMultiplier,
  customDeductionPct,
  onChangeBaseRate,
  onChangeMultiplier,
  onChangeDeductionPct,
  onReset,
  t,
}: SampleRateEditorProps): React.ReactElement {
  return (
    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-700">Editable Sample Pay Configuration</span>
        <button
          type="button"
          onClick={onReset}
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
            onChange={(e) => onChangeBaseRate(Math.max(0, Number(e.target.value)))}
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
            onChange={(e) => onChangeMultiplier(Math.max(1, Number(e.target.value)))}
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
              onChangeDeductionPct(Math.min(100, Math.max(0, Number(e.target.value))))
            }
            className="w-full min-h-[40px] px-3 py-1.5 text-sm font-mono rounded-lg border border-slate-300 bg-white text-slate-900"
          />
        </div>
      </div>
    </div>
  );
}

interface PayslipLineItemsProps {
  payslip: PayslipBreakdown;
  customMultiplier: number;
  t: Translations;
}

/**
 * Renders the itemized breakdown rows of a worker payslip.
 *
 * @param {PayslipLineItemsProps} props - Line items props
 * @returns {React.ReactElement} Itemized breakdown list
 */
export function PayslipLineItems({
  payslip,
  customMultiplier,
  t,
}: PayslipLineItemsProps): React.ReactElement {
  return (
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
        <span className="font-bold font-mono">-{formatCurrency(payslip.deductionAmount)}</span>
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
  );
}
