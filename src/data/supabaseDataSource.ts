/**
 * Supabase-backed implementation of IDataSource with automatic LocalDataSource fallback.
 */

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
import { LocalDataSource } from './localDataSource.ts';
import { supabase } from './supabaseClient.ts';
import {
  mapFeedbackRow,
  mapHazardRow,
  mapSettingsRow,
  mapShiftRow,
  mapWorkerRow,
} from './supabaseMappers.ts';

export class SupabaseDataSource implements IDataSource {
  readonly isSampleMode = false;
  private readonly fallback = new LocalDataSource();

  async getWorkers(sector: Sector): Promise<Worker[]> {
    if (!supabase) return this.fallback.getWorkers(sector);
    const { data, error } = await supabase.from('workers').select('*').eq('sector', sector);
    if (error || !data) return this.fallback.getWorkers(sector);
    return data.map((row) => mapWorkerRow(row as Record<string, unknown>));
  }

  async getWorkerById(id: string): Promise<Worker | null> {
    if (!supabase) return this.fallback.getWorkerById(id);
    const { data, error } = await supabase.from('workers').select('*').eq('id', id).maybeSingle();
    if (error || !data) return this.fallback.getWorkerById(id);
    return mapWorkerRow(data as Record<string, unknown>);
  }

  async getShifts(sector: Sector): Promise<Shift[]> {
    if (!supabase) return this.fallback.getShifts(sector);
    const { data, error } = await supabase.from('shifts').select('*').eq('sector', sector).order('check_in_time', { ascending: false });
    if (error || !data) return this.fallback.getShifts(sector);
    return data.map((row) => mapShiftRow(row as Record<string, unknown>));
  }

  async getActiveShift(workerId: string): Promise<Shift | null> {
    if (!supabase) return this.fallback.getActiveShift(workerId);
    const { data, error } = await supabase.from('shifts').select('*').eq('worker_id', workerId).eq('status', 'active').maybeSingle();
    if (error || !data) return this.fallback.getActiveShift(workerId);
    return mapShiftRow(data as Record<string, unknown>);
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
    return { ...data, id, status: 'active', hoursWorked: 0, regularHours: 0, overtimeHours: 0, createdAt: new Date().toISOString() };
  }

  async checkOutShift(
    shiftId: string,
    checkOutTime: string,
    checkOutLat?: number,
    checkOutLng?: number,
    standardHours: number = 8.0
  ): Promise<Shift> {
    if (!supabase) return this.fallback.checkOutShift(shiftId, checkOutTime, checkOutLat, checkOutLng, standardHours);
    const { data: shift, error: fetchErr } = await supabase.from('shifts').select('*').eq('id', shiftId).single();
    if (fetchErr || !shift) return this.fallback.checkOutShift(shiftId, checkOutTime, checkOutLat, checkOutLng, standardHours);

    const calc = calculateShiftOvertime(String(shift.check_in_time), checkOutTime, standardHours);
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
    if (updateErr) return this.fallback.checkOutShift(shiftId, checkOutTime, checkOutLat, checkOutLng, standardHours);
    return {
      ...mapShiftRow(shift as Record<string, unknown>),
      checkOutTime,
      checkOutLat,
      checkOutLng,
      hoursWorked: calc.totalHours,
      regularHours: calc.regularHours,
      overtimeHours: calc.overtimeHours,
      status: 'completed',
    };
  }

  async getHazardReports(sector: Sector): Promise<HazardReport[]> {
    if (!supabase) return this.fallback.getHazardReports(sector);
    const { data, error } = await supabase.from('hazard_reports').select('*').eq('sector', sector).order('created_at', { ascending: false });
    if (error || !data) return this.fallback.getHazardReports(sector);
    return data.map((row) => mapHazardRow(row as Record<string, unknown>));
  }

  async createHazardReport(report: Omit<HazardReport, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<HazardReport> {
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
    const nowIso = new Date().toISOString();
    return { ...report, id, status: 'reported', createdAt: nowIso, updatedAt: nowIso };
  }

  async updateHazardReportStatus(reportId: string, status: HazardStatus, resolutionNotes?: string): Promise<HazardReport> {
    if (!supabase) return this.fallback.updateHazardReportStatus(reportId, status, resolutionNotes);
    const { error } = await supabase.from('hazard_reports').update({ status, resolution_notes: resolutionNotes, updated_at: new Date().toISOString() }).eq('id', reportId);
    if (error) return this.fallback.updateHazardReportStatus(reportId, status, resolutionNotes);
    return (await this.getHazardReports('construction')).find((h) => h.id === reportId) || this.fallback.updateHazardReportStatus(reportId, status, resolutionNotes);
  }

  async getFeedback(sector: Sector): Promise<AnonymousFeedback[]> {
    if (!supabase) return this.fallback.getFeedback(sector);
    const { data, error } = await supabase.from('feedback').select('*').eq('sector', sector).order('created_at', { ascending: false });
    if (error || !data) return this.fallback.getFeedback(sector);
    return data.map((row) => mapFeedbackRow(row as Record<string, unknown>));
  }

  async submitFeedback(feedback: Omit<AnonymousFeedback, 'id' | 'createdAt'>): Promise<AnonymousFeedback> {
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
    return { ...feedback, id, createdAt: new Date().toISOString() };
  }

  async getSettings(sector: Sector): Promise<SectorSettings> {
    if (!supabase) return this.fallback.getSettings(sector);
    const { data, error } = await supabase.from('settings').select('*').eq('sector', sector).maybeSingle();
    if (error || !data) return this.fallback.getSettings(sector);
    return mapSettingsRow(data as Record<string, unknown>);
  }

  async updateSettings(s: SectorSettings): Promise<SectorSettings> {
    if (!supabase) return this.fallback.updateSettings(s);
    const { error } = await supabase.from('settings').upsert({
      sector: s.sector,
      site_name: s.siteName,
      site_lat: s.siteLat,
      site_lng: s.siteLng,
      geofence_radius_meters: s.geofenceRadiusMeters,
      standard_shift_hours: s.standardShiftHours,
      base_hourly_rate: s.baseHourlyRate,
      overtime_multiplier: s.overtimeMultiplier,
      deduction_percentage: s.deductionPercentage,
      fatigue_daily_hours_threshold: s.fatigueDailyHoursThreshold,
      fatigue_min_rest_hours_threshold: s.fatigueMinRestHoursThreshold,
      updated_at: new Date().toISOString(),
    });
    return error ? this.fallback.updateSettings(s) : s;
  }
}
