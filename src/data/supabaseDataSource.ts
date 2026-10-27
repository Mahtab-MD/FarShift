import { supabase } from './supabaseClient.ts';
import { IDataSource } from './database.interface.ts';
import {
  AnonymousFeedback,
  HazardReport,
  HazardStatus,
  Sector,
  SectorSettings,
  Shift,
  Worker,
} from '../types/index.ts';
import { calculateShiftOvertime } from '../lib/overtime.ts';
import { LocalDataSource } from './localDataSource.ts';

export class SupabaseDataSource implements IDataSource {
  readonly isSampleMode = false;
  private fallback: LocalDataSource;

  constructor() {
    this.fallback = new LocalDataSource();
  }

  async getWorkers(sector: Sector): Promise<Worker[]> {
    if (!supabase) return this.fallback.getWorkers(sector);
    const { data, error } = await supabase
      .from('workers')
      .select('*')
      .eq('sector', sector);
    if (error || !data) return this.fallback.getWorkers(sector);
    return data.map((d) => ({
      id: d.id,
      name: d.name,
      sector: d.sector as Sector,
      roleTitle: d.role_title,
      hourlyRate: Number(d.hourly_rate),
    }));
  }

  async getWorkerById(id: string): Promise<Worker | null> {
    if (!supabase) return this.fallback.getWorkerById(id);
    const { data, error } = await supabase
      .from('workers')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error || !data) return this.fallback.getWorkerById(id);
    return {
      id: data.id,
      name: data.name,
      sector: data.sector as Sector,
      roleTitle: data.role_title,
      hourlyRate: Number(data.hourly_rate),
    };
  }

  async getShifts(sector: Sector): Promise<Shift[]> {
    if (!supabase) return this.fallback.getShifts(sector);
    const { data, error } = await supabase
      .from('shifts')
      .select('*')
      .eq('sector', sector)
      .order('check_in_time', { ascending: false });
    if (error || !data) return this.fallback.getShifts(sector);
    return data.map((d) => ({
      id: d.id,
      workerId: d.worker_id,
      workerName: d.worker_name,
      sector: d.sector as Sector,
      checkInTime: d.check_in_time,
      checkOutTime: d.check_out_time,
      checkInLat: d.check_in_lat ? Number(d.check_in_lat) : undefined,
      checkInLng: d.check_in_lng ? Number(d.check_in_lng) : undefined,
      checkInAccuracy: d.check_in_accuracy ? Number(d.check_in_accuracy) : undefined,
      checkOutLat: d.check_out_lat ? Number(d.check_out_lat) : undefined,
      checkOutLng: d.check_out_lng ? Number(d.check_out_lng) : undefined,
      isManual: Boolean(d.is_manual),
      manualReason: d.manual_reason,
      hoursWorked: Number(d.hours_worked || 0),
      regularHours: Number(d.regular_hours || 0),
      overtimeHours: Number(d.overtime_hours || 0),
      status: d.status,
      createdAt: d.created_at,
    }));
  }

  async getActiveShift(workerId: string): Promise<Shift | null> {
    if (!supabase) return this.fallback.getActiveShift(workerId);
    const { data, error } = await supabase
      .from('shifts')
      .select('*')
      .eq('worker_id', workerId)
      .eq('status', 'active')
      .maybeSingle();
    if (error || !data) return this.fallback.getActiveShift(workerId);
    return {
      id: data.id,
      workerId: data.worker_id,
      workerName: data.worker_name,
      sector: data.sector as Sector,
      checkInTime: data.check_in_time,
      checkOutTime: data.check_out_time,
      checkInLat: data.check_in_lat ? Number(data.check_in_lat) : undefined,
      checkInLng: data.check_in_lng ? Number(data.check_in_lng) : undefined,
      checkInAccuracy: data.check_in_accuracy ? Number(data.check_in_accuracy) : undefined,
      isManual: Boolean(data.is_manual),
      manualReason: data.manual_reason,
      hoursWorked: Number(data.hours_worked || 0),
      regularHours: Number(data.regular_hours || 0),
      overtimeHours: Number(data.overtime_hours || 0),
      status: data.status,
      createdAt: data.created_at,
    };
  }

  async checkInShift(
    data: Omit<Shift, 'id' | 'createdAt' | 'status' | 'hoursWorked' | 'regularHours' | 'overtimeHours'>
  ): Promise<Shift> {
    if (!supabase) return this.fallback.checkInShift(data);
    const id = `shift-${Date.now()}`;
    const { error } = await supabase.from('shifts').insert({
      id,
      worker_id: data.workerId,
      worker_name: data.workerName,
      sector: data.sector,
      check_in_time: data.checkInTime,
      check_in_lat: data.checkInLat,
      check_in_lng: data.checkInLng,
      check_in_accuracy: data.checkInAccuracy,
      is_manual: data.isManual,
      manual_reason: data.manualReason,
      hours_worked: 0,
      regular_hours: 0,
      overtime_hours: 0,
      status: 'active',
    });
    if (error) return this.fallback.checkInShift(data);
    return {
      ...data,
      id,
      status: 'active',
      hoursWorked: 0,
      regularHours: 0,
      overtimeHours: 0,
      createdAt: new Date().toISOString(),
    };
  }

  async checkOutShift(
    shiftId: string,
    checkOutTime: string,
    checkOutLat?: number,
    checkOutLng?: number,
    standardHours: number = 8.0
  ): Promise<Shift> {
    if (!supabase) {
      return this.fallback.checkOutShift(shiftId, checkOutTime, checkOutLat, checkOutLng, standardHours);
    }
    const { data: shift, error: fetchErr } = await supabase
      .from('shifts')
      .select('*')
      .eq('id', shiftId)
      .single();

    if (fetchErr || !shift) {
      return this.fallback.checkOutShift(shiftId, checkOutTime, checkOutLat, checkOutLng, standardHours);
    }

    const calc = calculateShiftOvertime(shift.check_in_time, checkOutTime, standardHours);

    const { error: updateErr } = await supabase
      .from('shifts')
      .update({
        check_out_time: checkOutTime,
        check_out_lat: checkOutLat,
        check_out_lng: checkOutLng,
        hours_worked: calc.totalHours,
        regular_hours: calc.regularHours,
        overtime_hours: calc.overtimeHours,
        status: 'completed',
      })
      .eq('id', shiftId);

    if (updateErr) {
      return this.fallback.checkOutShift(shiftId, checkOutTime, checkOutLat, checkOutLng, standardHours);
    }

    return {
      id: shift.id,
      workerId: shift.worker_id,
      workerName: shift.worker_name,
      sector: shift.sector as Sector,
      checkInTime: shift.check_in_time,
      checkOutTime,
      checkOutLat,
      checkOutLng,
      isManual: Boolean(shift.is_manual),
      manualReason: shift.manual_reason,
      hoursWorked: calc.totalHours,
      regularHours: calc.regularHours,
      overtimeHours: calc.overtimeHours,
      status: 'completed',
      createdAt: shift.created_at,
    };
  }

  async getHazardReports(sector: Sector): Promise<HazardReport[]> {
    if (!supabase) return this.fallback.getHazardReports(sector);
    const { data, error } = await supabase
      .from('hazard_reports')
      .select('*')
      .eq('sector', sector)
      .order('created_at', { ascending: false });
    if (error || !data) return this.fallback.getHazardReports(sector);
    return data.map((d) => ({
      id: d.id,
      sector: d.sector as Sector,
      category: d.category,
      severity: d.severity,
      description: d.description,
      voiceTranscribed: Boolean(d.voice_transcribed),
      status: d.status,
      resolutionNotes: d.resolution_notes,
      reportedByName: d.reported_by_name || 'Worker',
      createdAt: d.created_at,
      updatedAt: d.updated_at,
    }));
  }

  async createHazardReport(
    report: Omit<HazardReport, 'id' | 'createdAt' | 'updatedAt' | 'status'>
  ): Promise<HazardReport> {
    if (!supabase) return this.fallback.createHazardReport(report);
    const id = `hazard-${Date.now()}`;
    const { error } = await supabase.from('hazard_reports').insert({
      id,
      sector: report.sector,
      category: report.category,
      severity: report.severity,
      description: report.description,
      voice_transcribed: report.voiceTranscribed,
      status: 'reported',
      reported_by_name: report.reportedByName,
    });
    if (error) return this.fallback.createHazardReport(report);
    return {
      ...report,
      id,
      status: 'reported',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  async updateHazardReportStatus(
    reportId: string,
    status: HazardStatus,
    resolutionNotes?: string
  ): Promise<HazardReport> {
    if (!supabase) return this.fallback.updateHazardReportStatus(reportId, status, resolutionNotes);
    const { error } = await supabase
      .from('hazard_reports')
      .update({
        status,
        resolution_notes: resolutionNotes,
        updated_at: new Date().toISOString(),
      })
      .eq('id', reportId);
    if (error) return this.fallback.updateHazardReportStatus(reportId, status, resolutionNotes);
    return (await this.getHazardReports('construction')).find((h) => h.id === reportId) ||
      this.fallback.updateHazardReportStatus(reportId, status, resolutionNotes);
  }

  async getFeedback(sector: Sector): Promise<AnonymousFeedback[]> {
    if (!supabase) return this.fallback.getFeedback(sector);
    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .eq('sector', sector)
      .order('created_at', { ascending: false });
    if (error || !data) return this.fallback.getFeedback(sector);
    return data.map((d) => ({
      id: d.id,
      sector: d.sector as Sector,
      managerRating: Number(d.manager_rating),
      conditionsRating: Number(d.conditions_rating),
      comment: d.comment || '',
      createdAt: d.created_at,
    }));
  }

  async submitFeedback(
    feedback: Omit<AnonymousFeedback, 'id' | 'createdAt'>
  ): Promise<AnonymousFeedback> {
    if (!supabase) return this.fallback.submitFeedback(feedback);
    const id = `fb-${Date.now()}`;
    const { error } = await supabase.from('feedback').insert({
      id,
      sector: feedback.sector,
      manager_rating: feedback.managerRating,
      conditions_rating: feedback.conditionsRating,
      comment: feedback.comment,
    });
    if (error) return this.fallback.submitFeedback(feedback);
    return {
      ...feedback,
      id,
      createdAt: new Date().toISOString(),
    };
  }

  async getSettings(sector: Sector): Promise<SectorSettings> {
    if (!supabase) return this.fallback.getSettings(sector);
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('sector', sector)
      .maybeSingle();
    if (error || !data) return this.fallback.getSettings(sector);
    return {
      sector: data.sector as Sector,
      siteName: data.site_name,
      siteLat: Number(data.site_lat),
      siteLng: Number(data.site_lng),
      geofenceRadiusMeters: Number(data.geofence_radius_meters),
      standardShiftHours: Number(data.standard_shift_hours),
      baseHourlyRate: Number(data.base_hourly_rate),
      overtimeMultiplier: Number(data.overtime_multiplier),
      deductionPercentage: Number(data.deduction_percentage),
      fatigueDailyHoursThreshold: Number(data.fatigue_daily_hours_threshold),
      fatigueMinRestHoursThreshold: Number(data.fatigue_min_rest_hours_threshold),
      updatedAt: data.updated_at,
    };
  }

  async updateSettings(settings: SectorSettings): Promise<SectorSettings> {
    if (!supabase) return this.fallback.updateSettings(settings);
    const { error } = await supabase.from('settings').upsert({
      sector: settings.sector,
      site_name: settings.siteName,
      site_lat: settings.siteLat,
      site_lng: settings.siteLng,
      geofence_radius_meters: settings.geofenceRadiusMeters,
      standard_shift_hours: settings.standardShiftHours,
      base_hourly_rate: settings.baseHourlyRate,
      overtime_multiplier: settings.overtimeMultiplier,
      deduction_percentage: settings.deductionPercentage,
      fatigue_daily_hours_threshold: settings.fatigueDailyHoursThreshold,
      fatigue_min_rest_hours_threshold: settings.fatigueMinRestHoursThreshold,
      updated_at: new Date().toISOString(),
    });
    if (error) return this.fallback.updateSettings(settings);
    return settings;
  }
}
