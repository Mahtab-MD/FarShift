/**
 * LocalStorage-backed implementation of IDataSource for offline and sample mode operation.
 */

import {
  DATA_UPDATED_EVENT,
  DEFAULT_SETTINGS,
  SAMPLE_WORKERS,
  STORAGE_KEYS,
} from '../config/constants.ts';
import { calculateShiftOvertime } from '../lib/overtime.ts';
import {
  AnonymousFeedback,
  HazardReport,
  HazardStatus,
  Sector,
  SectorSettings,
  Shift,
  Worker,
} from '../types/index.ts';
import { IDataSource } from './database.interface.ts';
import { initializeBrowserSeedData } from './seedData.ts';

/**
 * Dispatches a window custom event when local data mutates so subscribed components refresh.
 */
function dispatchDataEvent(type: string): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(DATA_UPDATED_EVENT, { detail: { type } }));
  }
}

/**
 * Reads and parses a JSON array or object from localStorage with fallback.
 */
function readStorageJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export class LocalDataSource implements IDataSource {
  readonly isSampleMode = true;

  constructor() {
    initializeBrowserSeedData();
  }

  async getWorkers(sector: Sector): Promise<Worker[]> {
    return readStorageJson<Worker[]>(STORAGE_KEYS.WORKERS, SAMPLE_WORKERS).filter((w) => w.sector === sector);
  }

  async getWorkerById(id: string): Promise<Worker | null> {
    return readStorageJson<Worker[]>(STORAGE_KEYS.WORKERS, SAMPLE_WORKERS).find((w) => w.id === id) || null;
  }

  async getShifts(sector: Sector): Promise<Shift[]> {
    return readStorageJson<Shift[]>(STORAGE_KEYS.SHIFTS, []).filter((s) => s.sector === sector);
  }

  async getActiveShift(workerId: string): Promise<Shift | null> {
    return readStorageJson<Shift[]>(STORAGE_KEYS.SHIFTS, []).find((s) => s.workerId === workerId && s.status === 'active') || null;
  }

  async checkInShift(
    data: Omit<Shift, 'id' | 'createdAt' | 'status' | 'hoursWorked' | 'regularHours' | 'overtimeHours'>
  ): Promise<Shift> {
    const shifts = readStorageJson<Shift[]>(STORAGE_KEYS.SHIFTS, []);
    const newShift: Shift = {
      ...data,
      id: `shift-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      status: 'active',
      hoursWorked: 0,
      regularHours: 0,
      overtimeHours: 0,
      createdAt: new Date().toISOString(),
    };
    shifts.unshift(newShift);
    localStorage.setItem(STORAGE_KEYS.SHIFTS, JSON.stringify(shifts));
    dispatchDataEvent('shifts');
    return newShift;
  }

  async checkOutShift(
    shiftId: string,
    checkOutTime: string,
    checkOutLat?: number,
    checkOutLng?: number,
    standardHours: number = 8.0
  ): Promise<Shift> {
    const shifts = readStorageJson<Shift[]>(STORAGE_KEYS.SHIFTS, []);
    const index = shifts.findIndex((s) => s.id === shiftId);
    if (index === -1) throw new Error('Shift record not found');

    const shift = shifts[index];
    const calc = calculateShiftOvertime(shift.checkInTime, checkOutTime, standardHours);
    const updated: Shift = {
      ...shift,
      checkOutTime,
      checkOutLat,
      checkOutLng,
      hoursWorked: calc.totalHours,
      regularHours: calc.regularHours,
      overtimeHours: calc.overtimeHours,
      status: 'completed',
    };
    shifts[index] = updated;
    localStorage.setItem(STORAGE_KEYS.SHIFTS, JSON.stringify(shifts));
    dispatchDataEvent('shifts');
    return updated;
  }

  async getHazardReports(sector: Sector): Promise<HazardReport[]> {
    return readStorageJson<HazardReport[]>(STORAGE_KEYS.HAZARDS, [])
      .filter((h) => h.sector === sector)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createHazardReport(
    report: Omit<HazardReport, 'id' | 'createdAt' | 'updatedAt' | 'status'>
  ): Promise<HazardReport> {
    const list = readStorageJson<HazardReport[]>(STORAGE_KEYS.HAZARDS, []);
    const nowIso = new Date().toISOString();
    const created: HazardReport = {
      ...report,
      id: `hazard-${Date.now()}`,
      status: 'reported',
      createdAt: nowIso,
      updatedAt: nowIso,
    };
    list.unshift(created);
    localStorage.setItem(STORAGE_KEYS.HAZARDS, JSON.stringify(list));
    dispatchDataEvent('hazards');
    return created;
  }

  async updateHazardReportStatus(
    reportId: string,
    status: HazardStatus,
    resolutionNotes?: string
  ): Promise<HazardReport> {
    const list = readStorageJson<HazardReport[]>(STORAGE_KEYS.HAZARDS, []);
    const idx = list.findIndex((h) => h.id === reportId);
    if (idx === -1) throw new Error('Hazard report not found');

    const updated: HazardReport = {
      ...list[idx],
      status,
      resolutionNotes: resolutionNotes || list[idx].resolutionNotes,
      updatedAt: new Date().toISOString(),
    };
    list[idx] = updated;
    localStorage.setItem(STORAGE_KEYS.HAZARDS, JSON.stringify(list));
    dispatchDataEvent('hazards');
    return updated;
  }

  async getFeedback(sector: Sector): Promise<AnonymousFeedback[]> {
    return readStorageJson<AnonymousFeedback[]>(STORAGE_KEYS.FEEDBACK, [])
      .filter((f) => f.sector === sector)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async submitFeedback(
    feedback: Omit<AnonymousFeedback, 'id' | 'createdAt'>
  ): Promise<AnonymousFeedback> {
    const list = readStorageJson<AnonymousFeedback[]>(STORAGE_KEYS.FEEDBACK, []);
    const item: AnonymousFeedback = {
      ...feedback,
      id: `fb-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    list.unshift(item);
    localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify(list));
    dispatchDataEvent('feedback');
    return item;
  }

  async getSettings(sector: Sector): Promise<SectorSettings> {
    const map = readStorageJson<Record<Sector, SectorSettings>>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    return map[sector] || DEFAULT_SETTINGS[sector];
  }

  async updateSettings(settings: SectorSettings): Promise<SectorSettings> {
    const map = readStorageJson<Record<Sector, SectorSettings>>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    map[settings.sector] = { ...settings, updatedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(map));
    dispatchDataEvent('settings');
    return map[settings.sector];
  }
}
