import { Sector, SectorSettings, Worker } from '../types/index.ts';

/**
 * Standard editable sample settings for sectors
 */
export const DEFAULT_SETTINGS: Record<Sector, SectorSettings> = {
  construction: {
    sector: 'construction',
    siteName: 'Metro Tower Construction Site B-4',
    siteLat: 37.774929,
    siteLng: -122.419416,
    geofenceRadiusMeters: 200,
    standardShiftHours: 8.0,
    baseHourlyRate: 24.5,
    overtimeMultiplier: 1.5,
    deductionPercentage: 12.0,
    fatigueDailyHoursThreshold: 10.0,
    fatigueMinRestHoursThreshold: 11.0,
    updatedAt: new Date().toISOString(),
  },
  college: {
    sector: 'college',
    siteName: 'S.R.M Institue Of Science and Technology KTR',
    siteLat: 37.783333,
    siteLng: -122.416667,
    geofenceRadiusMeters: 300,
    standardShiftHours: 7.5,
    baseHourlyRate: 21.0,
    overtimeMultiplier: 1.5,
    deductionPercentage: 10.0,
    fatigueDailyHoursThreshold: 9.5,
    fatigueMinRestHoursThreshold: 12.0,
    updatedAt: new Date().toISOString(),
  },
};

/**
 * Hazard categories per sector
 */
export const SECTOR_HAZARD_CATEGORIES: Record<Sector, string[]> = {
  construction: [
    'Scaffolding & Working at Heights',
    'Heavy Machinery & Cranes',
    'Electrical & Exposed Cables',
    'Falling Objects / PPE Missing',
    'Dust, Fumes & Poor Ventilation',
    'Heat Stress & Dehydration',
    'Structural Instability',
    'Other Safety Concern',
  ],
  college: [
    'Laboratory Chemical / Biological Spill',
    'Broken Stairwell & Handrails',
    'Faulty Electrical & Lighting Outage',
    'Slip, Trip & Wet Floor Hazard',
    'Crowd Control & Blocked Fire Exit',
    'HVAC & Air Quality Issue',
    'Equipment Malfunction in Workshop',
    'Other Campus Hazard',
  ],
};

/**
 * Seeded sample workers per sector
 */
export const SAMPLE_WORKERS: Worker[] = [
  {
    id: 'w-c1',
    name: 'Carlos Mendoza',
    sector: 'construction',
    roleTitle: 'Ironworker Specialist',
    hourlyRate: 26.0,
  },
  {
    id: 'w-c2',
    name: 'Devon Vance',
    sector: 'construction',
    roleTitle: 'Scaffolding Lead',
    hourlyRate: 24.5,
  },
  {
    id: 'w-c3',
    name: 'Priya Sharma',
    sector: 'construction',
    roleTitle: 'Site Safety Tech',
    hourlyRate: 25.0,
  },
  {
    id: 'w-k1',
    name: 'Elena Rostova',
    sector: 'college',
    roleTitle: 'Adjunct Lecturer / Lab Tech',
    hourlyRate: 22.0,
  },
  {
    id: 'w-k2',
    name: 'Marcus Chen',
    sector: 'college',
    roleTitle: 'Facilities Maintenance Lead',
    hourlyRate: 21.5,
  },
  {
    id: 'w-k3',
    name: 'Aisha Al-Mansoor',
    sector: 'college',
    roleTitle: 'Campus Safety Assistant',
    hourlyRate: 19.5,
  },
];

export const CURRENCY_SYMBOL = '$';
export const LOW_ACCURACY_THRESHOLD_METERS = 100;
export const MAX_REASONABLE_HOURS = 24;
