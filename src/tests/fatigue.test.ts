import test from 'node:test';
import assert from 'node:assert/strict';
import {
  checkDailyHoursFatigue,
  checkRestGap,
  evaluateWorkerFatigue,
} from '../lib/fatigue.ts';
import { Shift } from '../types/index.ts';

test('fatigue rules: normal day under daily threshold', () => {
  const check = checkDailyHoursFatigue(8.0, 10.0);
  assert.equal(check.isExcessive, false);
  assert.equal(check.excessHours, 0);
});

test('fatigue rules: long day exceeding threshold', () => {
  const check = checkDailyHoursFatigue(11.5, 10.0);
  assert.equal(check.isExcessive, true);
  assert.equal(check.excessHours, 1.5);
});

test('fatigue rules: back-to-back shifts with short rest gap (< 11h)', () => {
  const priorEnd = '2026-10-26T22:00:00Z'; // 10 PM
  const nextStart = '2026-10-27T06:00:00Z'; // 6 AM -> 8 hours rest
  const minRest = 11.0;

  const result = checkRestGap(priorEnd, nextStart, minRest);
  assert.equal(result.isInsufficient, true);
  assert.equal(result.restHours, 8.0);
  assert.equal(result.deficitHours, 3.0);
});

test('fatigue rules: back-to-back shifts with adequate rest gap (>= 11h)', () => {
  const priorEnd = '2026-10-26T17:00:00Z'; // 5 PM
  const nextStart = '2026-10-27T07:00:00Z'; // 7 AM -> 14 hours rest
  const minRest = 11.0;

  const result = checkRestGap(priorEnd, nextStart, minRest);
  assert.equal(result.isInsufficient, false);
  assert.equal(result.restHours, 14.0);
  assert.equal(result.deficitHours, 0);
});

test('evaluateWorkerFatigue identifies both excessive hours and rest gap violations in shift history', () => {
  const shifts: Shift[] = [
    {
      id: 's-1',
      workerId: 'w-1',
      workerName: 'Carlos M.',
      sector: 'construction',
      checkInTime: '2026-10-25T07:00:00Z',
      checkOutTime: '2026-10-25T19:30:00Z', // 12.5h shift (> 10h threshold)
      hoursWorked: 12.5,
      regularHours: 8.0,
      overtimeHours: 4.5,
      isManual: false,
      status: 'completed',
      createdAt: '2026-10-25T07:00:00Z',
    },
    {
      id: 's-2',
      workerId: 'w-1',
      workerName: 'Carlos M.',
      sector: 'construction',
      checkInTime: '2026-10-26T03:30:00Z', // only 8 hours after 19:30
      checkOutTime: '2026-10-26T11:30:00Z',
      hoursWorked: 8.0,
      regularHours: 8.0,
      overtimeHours: 0,
      isManual: false,
      status: 'completed',
      createdAt: '2026-10-26T03:30:00Z',
    },
  ];

  const alerts = evaluateWorkerFatigue(shifts, 10.0, 11.0);
  assert.equal(alerts.length, 2);

  const hoursAlert = alerts.find((a) => a.type === 'excessive_hours');
  assert.ok(hoursAlert);
  assert.equal(hoursAlert?.severity, 'critical');

  const restAlert = alerts.find((a) => a.type === 'insufficient_rest');
  assert.ok(restAlert);
  assert.equal(restAlert?.severity, 'critical');
});
