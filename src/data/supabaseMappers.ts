/**
 * Pure row-mapping helpers converting Supabase snake_case records into FairShift domain models.
 */

import {
  AnonymousFeedback,
  HazardReport,
  HazardSeverity,
  HazardStatus,
  Sector,
  SectorSettings,
  Shift,
  ShiftStatus,
  Worker,
} from '../types/index.ts';

/**
 * Maps a database worker row to a domain Worker object.
 *
 * @param {Record<string, unknown>} row - Raw database row
 * @returns {Worker} Mapped Worker entity
 */
export function mapWorkerRow(row: Record<string, unknown>): Worker {
  return {
    id: String(row.id),
    name: String(row.name),
    sector: row.sector as Sector,
    roleTitle: String(row.role_title),
    hourlyRate: Number(row.hourly_rate),
  };
}

/**
 * Maps a database shift row to a domain Shift object.
 *
 * @param {Record<string, unknown>} row - Raw database row
 * @returns {Shift} Mapped Shift entity
 */
export function mapShiftRow(row: Record<string, unknown>): Shift {
  return {
    id: String(row.id),
    workerId: String(row.worker_id),
    workerName: String(row.worker_name),
    sector: row.sector as Sector,
    checkInTime: String(row.check_in_time),
    checkOutTime: row.check_out_time ? String(row.check_out_time) : undefined,
    checkInLat: row.check_in_lat ? Number(row.check_in_lat) : undefined,
    checkInLng: row.check_in_lng ? Number(row.check_in_lng) : undefined,
    checkInAccuracy: row.check_in_accuracy ? Number(row.check_in_accuracy) : undefined,
    checkOutLat: row.check_out_lat ? Number(row.check_out_lat) : undefined,
    checkOutLng: row.check_out_lng ? Number(row.check_out_lng) : undefined,
    isManual: Boolean(row.is_manual),
    manualReason: row.manual_reason ? String(row.manual_reason) : undefined,
    hoursWorked: Number(row.hours_worked || 0),
    regularHours: Number(row.regular_hours || 0),
    overtimeHours: Number(row.overtime_hours || 0),
    status: row.status as ShiftStatus,
    createdAt: String(row.created_at),
  };
}

/**
 * Maps a database hazard_reports row to a domain HazardReport object.
 *
 * @param {Record<string, unknown>} row - Raw database row
 * @returns {HazardReport} Mapped HazardReport entity
 */
export function mapHazardRow(row: Record<string, unknown>): HazardReport {
  return {
    id: String(row.id),
    sector: row.sector as Sector,
    category: String(row.category),
    severity: row.severity as HazardSeverity,
    description: String(row.description),
    voiceTranscribed: Boolean(row.voice_transcribed),
    status: row.status as HazardStatus,
    resolutionNotes: row.resolution_notes ? String(row.resolution_notes) : undefined,
    reportedByName: String(row.reported_by_name || 'Worker'),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

/**
 * Maps a database feedback row to an AnonymousFeedback object.
 *
 * @param {Record<string, unknown>} row - Raw database row
 * @returns {AnonymousFeedback} Mapped AnonymousFeedback entity
 */
export function mapFeedbackRow(row: Record<string, unknown>): AnonymousFeedback {
  return {
    id: String(row.id),
    sector: row.sector as Sector,
    managerRating: Number(row.manager_rating),
    conditionsRating: Number(row.conditions_rating),
    comment: String(row.comment || ''),
    createdAt: String(row.created_at),
  };
}

/**
 * Maps a database settings row to a SectorSettings object.
 *
 * @param {Record<string, unknown>} row - Raw database row
 * @returns {SectorSettings} Mapped SectorSettings entity
 */
export function mapSettingsRow(row: Record<string, unknown>): SectorSettings {
  return {
    sector: row.sector as Sector,
    siteName: String(row.site_name),
    siteLat: Number(row.site_lat),
    siteLng: Number(row.site_lng),
    geofenceRadiusMeters: Number(row.geofence_radius_meters),
    standardShiftHours: Number(row.standard_shift_hours),
    baseHourlyRate: Number(row.base_hourly_rate),
    overtimeMultiplier: Number(row.overtime_multiplier),
    deductionPercentage: Number(row.deduction_percentage),
    fatigueDailyHoursThreshold: Number(row.fatigue_daily_hours_threshold),
    fatigueMinRestHoursThreshold: Number(row.fatigue_min_rest_hours_threshold),
    updatedAt: String(row.updated_at),
  };
}
