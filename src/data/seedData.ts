/**
 * Initial sample seed data for shifts, hazard reports, and anonymous feedback.
 * Used when running in offline/localStorage sample mode.
 */

import { DEFAULT_SETTINGS, SAMPLE_WORKERS, STORAGE_KEYS, TIME_CONSTANTS } from '../config/constants.ts';
import { AnonymousFeedback, HazardReport, Shift } from '../types/index.ts';

/**
 * Generates realistic initial shift records for both Construction and College sectors.
 *
 * @returns {Shift[]} Seeded shift history
 */
export function buildInitialShifts(): Shift[] {
  const now = Date.now();
  const h = TIME_CONSTANTS.MS_PER_HOUR;
  const d = TIME_CONSTANTS.MS_PER_DAY;
  return [
    {
      id: 'shift-seed-1',
      workerId: 'w-con-1',
      workerName: 'Mateo Rivera',
      sector: 'construction',
      checkInTime: new Date(now - 2 * d - 11 * h).toISOString(),
      checkOutTime: new Date(now - 2 * d - 0.5 * h).toISOString(),
      checkInLat: 28.61395,
      checkInLng: 77.20905,
      checkInAccuracy: 14,
      isManual: false,
      hoursWorked: 10.5,
      regularHours: 8,
      overtimeHours: 2.5,
      status: 'completed',
      createdAt: new Date(now - 2 * d).toISOString(),
    },
    {
      id: 'shift-seed-2',
      workerId: 'w-con-1',
      workerName: 'Mateo Rivera',
      sector: 'construction',
      checkInTime: new Date(now - 1 * d - 16 * h).toISOString(),
      checkOutTime: new Date(now - 1 * d - 6.5 * h).toISOString(),
      checkInLat: 28.61392,
      checkInLng: 77.20901,
      checkInAccuracy: 18,
      isManual: false,
      hoursWorked: 9.5,
      regularHours: 8,
      overtimeHours: 1.5,
      status: 'completed',
      createdAt: new Date(now - 1 * d).toISOString(),
    },
    {
      id: 'shift-seed-3',
      workerId: 'w-con-2',
      workerName: 'Ramesh Kumar',
      sector: 'construction',
      checkInTime: new Date(now - 3 * d - 9 * h).toISOString(),
      checkOutTime: new Date(now - 3 * d - 1 * h).toISOString(),
      checkInLat: 28.614,
      checkInLng: 77.2091,
      checkInAccuracy: 22,
      isManual: false,
      hoursWorked: 8,
      regularHours: 8,
      overtimeHours: 0,
      status: 'completed',
      createdAt: new Date(now - 3 * d).toISOString(),
    },
    {
      id: 'shift-seed-4',
      workerId: 'w-con-3',
      workerName: 'Elena Rostova',
      sector: 'construction',
      checkInTime: new Date(now - 4 * d - 10 * h).toISOString(),
      checkOutTime: new Date(now - 4 * d - 1 * h).toISOString(),
      isManual: true,
      manualReason: 'Basement sub-level 2 signal blocked by concrete',
      hoursWorked: 9,
      regularHours: 8,
      overtimeHours: 1,
      status: 'completed',
      createdAt: new Date(now - 4 * d).toISOString(),
    },
    {
      id: 'shift-seed-5',
      workerId: 'w-col-1',
      workerName: 'Dr. Priya Nair',
      sector: 'college',
      checkInTime: new Date(now - 2 * d - 10 * h).toISOString(),
      checkOutTime: new Date(now - 2 * d - 1 * h).toISOString(),
      checkInLat: 28.54505,
      checkInLng: 77.19265,
      checkInAccuracy: 12,
      isManual: false,
      hoursWorked: 9,
      regularHours: 7.5,
      overtimeHours: 1.5,
      status: 'completed',
      createdAt: new Date(now - 2 * d).toISOString(),
    },
    {
      id: 'shift-seed-6',
      workerId: 'w-col-2',
      workerName: 'Carlos Mendez',
      sector: 'college',
      checkInTime: new Date(now - 1 * d - 11.5 * h).toISOString(),
      checkOutTime: new Date(now - 1 * d - 0.5 * h).toISOString(),
      checkInLat: 28.5451,
      checkInLng: 77.1927,
      checkInAccuracy: 19,
      isManual: false,
      hoursWorked: 11,
      regularHours: 7.5,
      overtimeHours: 3.5,
      status: 'completed',
      createdAt: new Date(now - 1 * d).toISOString(),
    },
  ];
}

/** Generates initial hazard report records for both sectors. */
export function buildInitialHazards(): HazardReport[] {
  const now = Date.now();
  const h = TIME_CONSTANTS.MS_PER_HOUR;
  return [
    {
      id: 'haz-seed-1',
      sector: 'construction',
      category: 'Scaffolding & Fall Risk',
      severity: 'critical',
      description: 'Loose guardrail on East Wing 4th-floor external scaffolding near hoist.',
      voiceTranscribed: true,
      status: 'in_review',
      resolutionNotes: 'Safety officer dispatched; area cordoned off pending bolt torque check.',
      reportedByName: 'Mateo Rivera',
      createdAt: new Date(now - 18 * h).toISOString(),
      updatedAt: new Date(now - 6 * h).toISOString(),
    },
    {
      id: 'haz-seed-2',
      sector: 'construction',
      category: 'Heat Stress / Hydration',
      severity: 'high',
      description: 'Water station at Zone C ran dry during peak afternoon pour.',
      voiceTranscribed: false,
      status: 'resolved',
      resolutionNotes: 'Refilled two 200L insulated tanks and added shade canopy.',
      reportedByName: 'Ramesh Kumar',
      createdAt: new Date(now - 42 * h).toISOString(),
      updatedAt: new Date(now - 28 * h).toISOString(),
    },
    {
      id: 'haz-seed-3',
      sector: 'college',
      category: 'Laboratory Chemical / Fume Hood',
      severity: 'high',
      description: 'Fume hood #3 airflow alarm intermittently beeping in Chemistry Annex B.',
      voiceTranscribed: true,
      status: 'reported',
      reportedByName: 'Dr. Priya Nair',
      createdAt: new Date(now - 8 * h).toISOString(),
      updatedAt: new Date(now - 8 * h).toISOString(),
    },
  ];
}

/** Generates initial anonymous feedback records with zero worker identifiers. */
export function buildInitialFeedback(): AnonymousFeedback[] {
  const now = Date.now();
  const h = TIME_CONSTANTS.MS_PER_HOUR;
  return [
    {
      id: 'fb-seed-1',
      sector: 'construction',
      managerRating: 4,
      conditionsRating: 3,
      comment: 'New transparent overtime payslip helps a lot. Need more shaded rest benches near rebar yard.',
      createdAt: new Date(now - 30 * h).toISOString(),
    },
    {
      id: 'fb-seed-2',
      sector: 'college',
      managerRating: 5,
      conditionsRating: 4,
      comment: 'Glad evening lab prep overtime is now automatically counted on the shift timer.',
      createdAt: new Date(now - 20 * h).toISOString(),
    },
  ];
}

/** Initializes browser localStorage with default seed data if keys are not yet populated. */
export function initializeBrowserSeedData(): void {
  if (typeof window === 'undefined') return;
  const pairs: Array<[string, unknown]> = [
    [STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS],
    [STORAGE_KEYS.WORKERS, SAMPLE_WORKERS],
    [STORAGE_KEYS.SHIFTS, buildInitialShifts()],
    [STORAGE_KEYS.HAZARDS, buildInitialHazards()],
    [STORAGE_KEYS.FEEDBACK, buildInitialFeedback()],
  ];
  for (const [k, v] of pairs) if (!localStorage.getItem(k)) localStorage.setItem(k, JSON.stringify(v));
}
