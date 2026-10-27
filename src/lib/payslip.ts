/**
 * Pure business logic for payslip calculations, tax/statutory deductions, and net wage breakdowns.
 */

export interface PayslipCalculationParams {
  regularHours: number;
  overtimeHours: number;
  baseHourlyRate: number;
  overtimeMultiplier?: number; // defaults to 1.5
  deductionPercentage?: number; // defaults to 12.0
}

export interface PayslipBreakdown {
  regularHours: number;
  overtimeHours: number;
  totalHours: number;
  baseHourlyRate: number;
  overtimeHourlyRate: number;
  grossRegularPay: number;
  grossOvertimePay: number;
  grossTotalPay: number;
  deductionPercentage: number;
  deductionAmount: number;
  netPay: number;
  isValid: boolean;
  error?: string;
}

/**
 * Calculates itemized gross pay, overtime premium, statutory deductions, and net wage.
 * Ensures strict currency-grade 2-decimal rounding.
 *
 * @param {PayslipCalculationParams} params - Calculation input parameters
 * @returns {PayslipBreakdown} Breakdown of payslip figures
 */
export function calculatePayslip(params: PayslipCalculationParams): PayslipBreakdown {
  const {
    regularHours,
    overtimeHours,
    baseHourlyRate,
    overtimeMultiplier = 1.5,
    deductionPercentage = 12.0,
  } = params;

  if (
    regularHours < 0 ||
    overtimeHours < 0 ||
    baseHourlyRate < 0 ||
    overtimeMultiplier < 1 ||
    deductionPercentage < 0 ||
    deductionPercentage > 100 ||
    !Number.isFinite(regularHours) ||
    !Number.isFinite(overtimeHours) ||
    !Number.isFinite(baseHourlyRate)
  ) {
    return {
      regularHours: 0,
      overtimeHours: 0,
      totalHours: 0,
      baseHourlyRate: 0,
      overtimeHourlyRate: 0,
      grossRegularPay: 0,
      grossOvertimePay: 0,
      grossTotalPay: 0,
      deductionPercentage: 0,
      deductionAmount: 0,
      netPay: 0,
      isValid: false,
      error: 'Invalid input parameters for payslip calculation',
    };
  }

  const totalHours = Math.round((regularHours + overtimeHours) * 100) / 100;
  const overtimeHourlyRate = Math.round(baseHourlyRate * overtimeMultiplier * 100) / 100;

  const grossRegularPay = Math.round(regularHours * baseHourlyRate * 100) / 100;
  const grossOvertimePay = Math.round(overtimeHours * overtimeHourlyRate * 100) / 100;
  const grossTotalPay = Math.round((grossRegularPay + grossOvertimePay) * 100) / 100;

  const deductionAmount = Math.round(((grossTotalPay * deductionPercentage) / 100) * 100) / 100;
  const netPay = Math.round((grossTotalPay - deductionAmount) * 100) / 100;

  return {
    regularHours,
    overtimeHours,
    totalHours,
    baseHourlyRate,
    overtimeHourlyRate,
    grossRegularPay,
    grossOvertimePay,
    grossTotalPay,
    deductionPercentage,
    deductionAmount,
    netPay,
    isValid: true,
  };
}

/**
 * Formats a numeric currency value into standardized two-decimal notation.
 *
 * @param {number} amount - Amount in currency
 * @param {string} currency - Currency symbol (e.g. '$')
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount: number, currency: string = '$'): string {
  if (!Number.isFinite(amount)) return `${currency}0.00`;
  return `${currency}${amount.toFixed(2)}`;
}
