import test from 'node:test';
import assert from 'node:assert/strict';
import { calculatePayslip, formatCurrency } from '../lib/payslip.ts';

test('payslip calculation: no overtime, standard deductions', () => {
  // 40 regular hours at $25.00/hr, 0 overtime, 10% deductions
  const result = calculatePayslip({
    regularHours: 40,
    overtimeHours: 0,
    baseHourlyRate: 25.0,
    overtimeMultiplier: 1.5,
    deductionPercentage: 10.0,
  });

  assert.equal(result.isValid, true);
  assert.equal(result.grossRegularPay, 1000.0);
  assert.equal(result.grossOvertimePay, 0.0);
  assert.equal(result.grossTotalPay, 1000.0);
  assert.equal(result.deductionAmount, 100.0);
  assert.equal(result.netPay, 900.0);
});

test('payslip calculation: with overtime and 1.5x premium', () => {
  // 35 regular hours, 5 overtime hours at $20.00/hr base rate, 12% deduction
  // Overtime rate: $20 * 1.5 = $30/hr
  // Gross regular: 35 * 20 = $700
  // Gross overtime: 5 * 30 = $150
  // Gross total: $850
  // Deduction: 12% of 850 = $102
  // Net pay: 850 - 102 = $748
  const result = calculatePayslip({
    regularHours: 35,
    overtimeHours: 5,
    baseHourlyRate: 20.0,
    overtimeMultiplier: 1.5,
    deductionPercentage: 12.0,
  });

  assert.equal(result.isValid, true);
  assert.equal(result.overtimeHourlyRate, 30.0);
  assert.equal(result.grossRegularPay, 700.0);
  assert.equal(result.grossOvertimePay, 150.0);
  assert.equal(result.grossTotalPay, 850.0);
  assert.equal(result.deductionAmount, 102.0);
  assert.equal(result.netPay, 748.0);
});

test('payslip calculation: precision rounding on fractional hours and odd rates', () => {
  const result = calculatePayslip({
    regularHours: 7.75,
    overtimeHours: 2.25,
    baseHourlyRate: 23.33,
    overtimeMultiplier: 1.5,
    deductionPercentage: 11.5,
  });

  assert.equal(result.isValid, true);
  // Base rate 23.33 -> overtime rate 35.00
  assert.equal(result.totalHours, 10.0);
  assert.ok(Number.isFinite(result.netPay));
  assert.equal(result.netPay, Math.round((result.grossTotalPay - result.deductionAmount) * 100) / 100);
});

test('payslip calculation: invalid negative input rejection', () => {
  const result = calculatePayslip({
    regularHours: -5,
    overtimeHours: 0,
    baseHourlyRate: 20,
  });
  assert.equal(result.isValid, false);
});

test('formatCurrency formats accurately', () => {
  assert.equal(formatCurrency(1250.5), '$1250.50');
  assert.equal(formatCurrency(0), '$0.00');
});
