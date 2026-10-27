/**
 * Domain types for FairShift - UN SDG 8 Decent Work Platform
 */

export type Sector = 'construction' | 'college';
export type UserRole = 'worker' | 'admin';
export type Language = 'en' | 'es' | 'hi';

export type ShiftStatus = 'active' | 'completed';
export type HazardSeverity = 'low' | 'medium' | 'high' | 'critical';
export type HazardStatus = 'reported' | 'in_review' | 'resolved';

export interface Coordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface Worker {
  id: string;
  name: string;
  sector: Sector;
  roleTitle: string;
  hourlyRate: number;
  avatarUrl?: string;
}

export interface Shift {
  id: string;
  workerId: string;
  workerName: string;
  sector: Sector;
  checkInTime: string; // ISO 8601
  checkOutTime?: string; // ISO 8601
  checkInLat?: number;
  checkInLng?: number;
  checkInAccuracy?: number;
  checkOutLat?: number;
  checkOutLng?: number;
  isManual: boolean;
  manualReason?: string;
  hoursWorked: number;
  regularHours: number;
  overtimeHours: number;
  status: ShiftStatus;
  createdAt: string;
}

export interface HazardReport {
  id: string;
  sector: Sector;
  category: string;
  severity: HazardSeverity;
  description: string;
  voiceTranscribed: boolean;
  status: HazardStatus;
  resolutionNotes?: string;
  reportedByName: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Anonymous feedback: Strictly NO workerId or personal identifier.
 */
export interface AnonymousFeedback {
  id: string;
  sector: Sector;
  managerRating: number; // 1-5
  conditionsRating: number; // 1-5
  comment: string;
  createdAt: string;
}

export interface SectorSettings {
  sector: Sector;
  siteName: string;
  siteLat: number;
  siteLng: number;
  geofenceRadiusMeters: number;
  standardShiftHours: number;
  baseHourlyRate: number;
  overtimeMultiplier: number;
  deductionPercentage: number;
  fatigueDailyHoursThreshold: number;
  fatigueMinRestHoursThreshold: number;
  updatedAt: string;
}

export interface PayslipItem {
  id: string;
  periodStart: string;
  periodEnd: string;
  regularHours: number;
  overtimeHours: number;
  totalHours: number;
  baseRate: number;
  overtimeRate: number;
  grossRegularPay: number;
  grossOvertimePay: number;
  grossTotalPay: number;
  deductions: number;
  netPay: number;
  currency: string;
}

export interface FatigueAlert {
  id: string;
  workerId: string;
  workerName: string;
  sector: Sector;
  type: 'excessive_hours' | 'insufficient_rest';
  severity: 'warning' | 'critical';
  details: string;
  metricValue: number;
  thresholdValue: number;
  timestamp: string;
}

export interface AttendanceTrendPoint {
  date: string;
  dayLabel: string;
  totalHours: number;
  overtimeHours: number;
  activeWorkers: number;
}
