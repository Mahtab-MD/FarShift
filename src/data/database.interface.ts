import {
  AnonymousFeedback,
  HazardReport,
  HazardStatus,
  Sector,
  SectorSettings,
  Shift,
  Worker,
} from '../types/index.ts';

/**
 * Pluggable data source interface allowing transparent swapping
 * between real Supabase persistence and offline local storage sample mode.
 */
export interface IDataSource {
  readonly isSampleMode: boolean;

  getWorkers(sector: Sector): Promise<Worker[]>;
  getWorkerById(id: string): Promise<Worker | null>;

  getShifts(sector: Sector): Promise<Shift[]>;
  getActiveShift(workerId: string): Promise<Shift | null>;
  checkInShift(
    data: Omit<Shift, 'id' | 'createdAt' | 'status' | 'hoursWorked' | 'regularHours' | 'overtimeHours'>
  ): Promise<Shift>;
  checkOutShift(
    shiftId: string,
    checkOutTime: string,
    checkOutLat?: number,
    checkOutLng?: number,
    standardHours?: number
  ): Promise<Shift>;

  getHazardReports(sector: Sector): Promise<HazardReport[]>;
  createHazardReport(
    report: Omit<HazardReport, 'id' | 'createdAt' | 'updatedAt' | 'status'>
  ): Promise<HazardReport>;
  updateHazardReportStatus(
    reportId: string,
    status: HazardStatus,
    resolutionNotes?: string
  ): Promise<HazardReport>;

  getFeedback(sector: Sector): Promise<AnonymousFeedback[]>;
  submitFeedback(
    feedback: Omit<AnonymousFeedback, 'id' | 'createdAt'>
  ): Promise<AnonymousFeedback>;

  getSettings(sector: Sector): Promise<SectorSettings>;
  updateSettings(settings: SectorSettings): Promise<SectorSettings>;
}
