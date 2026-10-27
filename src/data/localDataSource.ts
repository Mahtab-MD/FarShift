import { DEFAULT_SETTINGS, SAMPLE_WORKERS } from '../config/constants.ts';
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

const STORAGE_KEYS = {
  WORKERS: 'fairshift_workers_v1',
  SHIFTS: 'fairshift_shifts_v1',
  HAZARDS: 'fairshift_hazards_v1',
  FEEDBACK: 'fairshift_feedback_v1',
  SETTINGS: 'fairshift_settings_v1',
};

function dispatchDataEvent(type: string) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('fairshift-data-updated', { detail: { type } }));
  }
}

export class LocalDataSource implements IDataSource {
  readonly isSampleMode = true;

  constructor() {
    this.initSeedData();
  }

  private initSeedData() {
    if (typeof window === 'undefined') return;

    // 1. Settings
    const existingSettingsRaw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!existingSettingsRaw) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    } else {
      try {
        const parsed = JSON.parse(existingSettingsRaw);
        if (parsed?.college?.siteName === 'Oakridge Community College Campus') {
          parsed.college.siteName = DEFAULT_SETTINGS.college.siteName;
          localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(parsed));
        }
      } catch {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
      }
    }

    // 2. Workers
    if (!localStorage.getItem(STORAGE_KEYS.WORKERS)) {
      localStorage.setItem(STORAGE_KEYS.WORKERS, JSON.stringify(SAMPLE_WORKERS));
    }

    // 3. Shifts (past 7 days + active shift)
    if (!localStorage.getItem(STORAGE_KEYS.SHIFTS)) {
      const now = new Date();
      const shifts: Shift[] = [];

      // Generate realistic history for past 7 days
      for (let dayOffset = 6; dayOffset >= 1; dayOffset--) {
        const shiftDate = new Date(now.getTime() - dayOffset * 24 * 60 * 60 * 1000);
        const dateStr = shiftDate.toISOString().split('T')[0];

        // Construction shifts
        shifts.push({
          id: `seed-c-${dayOffset}-1`,
          workerId: 'w-c1',
          workerName: 'Carlos Mendoza',
          sector: 'construction',
          checkInTime: `${dateStr}T07:00:00Z`,
          checkOutTime: `${dateStr}T17:30:00Z`, // 10.5h
          isManual: dayOffset === 2,
          manualReason: dayOffset === 2 ? 'GPS signal obstructed in basement pit' : undefined,
          hoursWorked: 10.5,
          regularHours: 8.0,
          overtimeHours: 2.5,
          status: 'completed',
          createdAt: `${dateStr}T07:00:00Z`,
        });

        shifts.push({
          id: `seed-c-${dayOffset}-2`,
          workerId: 'w-c2',
          workerName: 'Devon Vance',
          sector: 'construction',
          checkInTime: `${dateStr}T07:30:00Z`,
          checkOutTime: `${dateStr}T15:30:00Z`, // 8.0h
          isManual: false,
          hoursWorked: 8.0,
          regularHours: 8.0,
          overtimeHours: 0,
          status: 'completed',
          createdAt: `${dateStr}T07:30:00Z`,
        });

        // College shifts
        shifts.push({
          id: `seed-k-${dayOffset}-1`,
          workerId: 'w-k1',
          workerName: 'Elena Rostova',
          sector: 'college',
          checkInTime: `${dateStr}T08:30:00Z`,
          checkOutTime: `${dateStr}T17:00:00Z`, // 8.5h
          isManual: false,
          hoursWorked: 8.5,
          regularHours: 7.5,
          overtimeHours: 1.0,
          status: 'completed',
          createdAt: `${dateStr}T08:30:00Z`,
        });
      }

      // Back-to-back shift for fatigue alert demonstration (w-c1 on day 1)
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      shifts.push({
        id: 'seed-fatigue-back2back',
        workerId: 'w-c1',
        workerName: 'Carlos Mendoza',
        sector: 'construction',
        checkInTime: `${yesterday}T21:30:00Z`,
        checkOutTime: `${now.toISOString().split('T')[0]}T05:30:00Z`, // only 4h rest before prior shift ended
        isManual: false,
        hoursWorked: 8.0,
        regularHours: 8.0,
        overtimeHours: 0,
        status: 'completed',
        createdAt: `${yesterday}T21:30:00Z`,
      });

      localStorage.setItem(STORAGE_KEYS.SHIFTS, JSON.stringify(shifts));
    }

    // 4. Hazard reports
    if (!localStorage.getItem(STORAGE_KEYS.HAZARDS)) {
      const hazards: HazardReport[] = [
        {
          id: 'h-1',
          sector: 'construction',
          category: 'Scaffolding & Working at Heights',
          severity: 'high',
          description: 'South elevation scaffolding 4th floor has loose toe-boards and unlatched guardrail.',
          voiceTranscribed: true,
          status: 'in_review',
          resolutionNotes: 'Site safety lead dispatched with harness kit.',
          reportedByName: 'Worker (Voice Report)',
          createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'h-2',
          sector: 'construction',
          category: 'Heavy Machinery & Cranes',
          severity: 'critical',
          description: 'Tower crane counterweight radius is not barricaded during concrete bucket transit.',
          voiceTranscribed: false,
          status: 'reported',
          reportedByName: 'Worker (Self)',
          createdAt: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'h-3',
          sector: 'construction',
          category: 'Heat Stress & Dehydration',
          severity: 'medium',
          description: 'Zone C water refill station empty since 11 AM.',
          voiceTranscribed: false,
          status: 'resolved',
          resolutionNotes: 'Fresh 5-gallon coolers refilled and ice added.',
          reportedByName: 'Worker (Self)',
          createdAt: new Date(Date.now() - 26 * 3600 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
        },
        {
          id: 'h-4',
          sector: 'college',
          category: 'Laboratory Chemical / Biological Spill',
          severity: 'high',
          description: 'Fume hood #3 in Organic Chem Lab 204 low airflow warning light blinking.',
          voiceTranscribed: true,
          status: 'in_review',
          resolutionNotes: 'HVAC maintenance ticket #8843 filed.',
          reportedByName: 'Staff (Voice Report)',
          createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'h-5',
          sector: 'college',
          category: 'Broken Stairwell & Handrails',
          severity: 'medium',
          description: 'Humanities Hall east stairwell tread rubber loose, trip risk for evening students.',
          voiceTranscribed: false,
          status: 'resolved',
          resolutionNotes: 'Non-slip adhesive strip replaced by facilities team.',
          reportedByName: 'Staff (Self)',
          createdAt: new Date(Date.now() - 30 * 3600 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 28 * 3600 * 1000).toISOString(),
        },
      ];
      localStorage.setItem(STORAGE_KEYS.HAZARDS, JSON.stringify(hazards));
    }

    // 5. Anonymous Feedback (CRITICAL: zero worker identity!)
    if (!localStorage.getItem(STORAGE_KEYS.FEEDBACK)) {
      const feedback: AnonymousFeedback[] = [
        {
          id: 'fb-1',
          sector: 'construction',
          managerRating: 4,
          conditionsRating: 4,
          comment: 'Good attention to safety briefings this week. Please keep earplug dispensers full.',
          createdAt: new Date(Date.now() - 2 * 86400 * 1000).toISOString(),
        },
        {
          id: 'fb-2',
          sector: 'construction',
          managerRating: 2,
          conditionsRating: 3,
          comment: 'Overtime hours were not communicated until 10 minutes before shift end. Need more notice.',
          createdAt: new Date(Date.now() - 4 * 86400 * 1000).toISOString(),
        },
        {
          id: 'fb-3',
          sector: 'college',
          managerRating: 5,
          conditionsRating: 4,
          comment: 'Department chair is very supportive with flexible lab prep hours.',
          createdAt: new Date(Date.now() - 1 * 86400 * 1000).toISOString(),
        },
      ];
      localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify(feedback));
    }
  }

  async getWorkers(sector: Sector): Promise<Worker[]> {
    const raw = localStorage.getItem(STORAGE_KEYS.WORKERS);
    const workers: Worker[] = raw ? JSON.parse(raw) : SAMPLE_WORKERS;
    return workers.filter((w) => w.sector === sector);
  }

  async getWorkerById(id: string): Promise<Worker | null> {
    const raw = localStorage.getItem(STORAGE_KEYS.WORKERS);
    const workers: Worker[] = raw ? JSON.parse(raw) : SAMPLE_WORKERS;
    return workers.find((w) => w.id === id) || null;
  }

  async getShifts(sector: Sector): Promise<Shift[]> {
    const raw = localStorage.getItem(STORAGE_KEYS.SHIFTS);
    const shifts: Shift[] = raw ? JSON.parse(raw) : [];
    return shifts.filter((s) => s.sector === sector);
  }

  async getActiveShift(workerId: string): Promise<Shift | null> {
    const raw = localStorage.getItem(STORAGE_KEYS.SHIFTS);
    const shifts: Shift[] = raw ? JSON.parse(raw) : [];
    return shifts.find((s) => s.workerId === workerId && s.status === 'active') || null;
  }

  async checkInShift(
    data: Omit<Shift, 'id' | 'createdAt' | 'status' | 'hoursWorked' | 'regularHours' | 'overtimeHours'>
  ): Promise<Shift> {
    const raw = localStorage.getItem(STORAGE_KEYS.SHIFTS);
    const shifts: Shift[] = raw ? JSON.parse(raw) : [];

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
    const raw = localStorage.getItem(STORAGE_KEYS.SHIFTS);
    const shifts: Shift[] = raw ? JSON.parse(raw) : [];
    const index = shifts.findIndex((s) => s.id === shiftId);

    if (index === -1) {
      throw new Error('Shift record not found');
    }

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
    const raw = localStorage.getItem(STORAGE_KEYS.HAZARDS);
    const list: HazardReport[] = raw ? JSON.parse(raw) : [];
    return list
      .filter((h) => h.sector === sector)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createHazardReport(
    report: Omit<HazardReport, 'id' | 'createdAt' | 'updatedAt' | 'status'>
  ): Promise<HazardReport> {
    const raw = localStorage.getItem(STORAGE_KEYS.HAZARDS);
    const list: HazardReport[] = raw ? JSON.parse(raw) : [];

    const created: HazardReport = {
      ...report,
      id: `hazard-${Date.now()}`,
      status: 'reported',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
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
    const raw = localStorage.getItem(STORAGE_KEYS.HAZARDS);
    const list: HazardReport[] = raw ? JSON.parse(raw) : [];
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
    const raw = localStorage.getItem(STORAGE_KEYS.FEEDBACK);
    const list: AnonymousFeedback[] = raw ? JSON.parse(raw) : [];
    return list
      .filter((f) => f.sector === sector)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async submitFeedback(
    feedback: Omit<AnonymousFeedback, 'id' | 'createdAt'>
  ): Promise<AnonymousFeedback> {
    const raw = localStorage.getItem(STORAGE_KEYS.FEEDBACK);
    const list: AnonymousFeedback[] = raw ? JSON.parse(raw) : [];

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
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    const map = raw ? JSON.parse(raw) : DEFAULT_SETTINGS;
    return map[sector] || DEFAULT_SETTINGS[sector];
  }

  async updateSettings(settings: SectorSettings): Promise<SectorSettings> {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    const map = raw ? JSON.parse(raw) : DEFAULT_SETTINGS;
    map[settings.sector] = {
      ...settings,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(map));
    dispatchDataEvent('settings');
    return map[settings.sector];
  }
}
