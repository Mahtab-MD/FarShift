import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateShiftOvertime, formatShiftDuration } from '../lib/overtime.ts';

test('overtime calculation: below threshold (normal 6-hour shift)', () => {
  const checkIn = '2026-10-26T08:00:00Z';
  const checkOut = '2026-10-26T14:00:00Z';
  const result = calculateShiftOvertime(checkIn, checkOut, 8.0);

  assert.equal(result.isValid, true);
  assert.equal(result.totalHours, 6.0);
  assert.equal(result.regularHours, 6.0);
  assert.equal(result.overtimeHours, 0.0);
});

test('overtime calculation: exactly at threshold (8.0 hours)', () => {
  const checkIn = '2026-10-26T08:00:00Z';
  const checkOut = '2026-10-26T16:00:00Z';
  const result = calculateShiftOvertime(checkIn, checkOut, 8.0);

  assert.equal(result.isValid, true);
  assert.equal(result.totalHours, 8.0);
  assert.equal(result.regularHours, 8.0);
  assert.equal(result.overtimeHours, 0.0);
});

test('overtime calculation: above threshold (10.5 hours)', () => {
  const checkIn = '2026-10-26T07:00:00Z';
  const checkOut = '2026-10-26T17:30:00Z';
  const result = calculateShiftOvertime(checkIn, checkOut, 8.0);

  assert.equal(result.isValid, true);
  assert.equal(result.totalHours, 10.5);
  assert.equal(result.regularHours, 8.0);
  assert.equal(result.overtimeHours, 2.5);
});

test('overtime calculation: midnight crossing (22:00 to 07:00 next morning = 9h)', () => {
  const checkIn = '2026-10-26T22:00:00Z';
  const checkOut = '2026-10-27T07:00:00Z';
  const result = calculateShiftOvertime(checkIn, checkOut, 8.0);

  assert.equal(result.isValid, true);
  assert.equal(result.totalHours, 9.0);
  assert.equal(result.regularHours, 8.0);
  assert.equal(result.overtimeHours, 1.0);
});

test('overtime calculation: zero hours and inverted times', () => {
  const time = '2026-10-26T08:00:00Z';
  const zeroResult = calculateShiftOvertime(time, time, 8.0);
  assert.equal(zeroResult.totalHours, 0);
  assert.equal(zeroResult.overtimeHours, 0);

  const inverted = calculateShiftOvertime('2026-10-26T10:00:00Z', '2026-10-26T08:00:00Z', 8.0);
  assert.equal(inverted.isValid, false);
});

test('formatShiftDuration formats elapsed time accurately', () => {
  const start = '2026-10-26T08:00:00Z';
  const end = '2026-10-26T11:45:00Z';
  const formatted = formatShiftDuration(start, end);
  assert.equal(formatted.hours, 3);
  assert.equal(formatted.minutes, 45);
  assert.equal(formatted.formatted, '3h 45m');
});
