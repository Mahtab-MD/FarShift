/**
 * Pure business logic for shift duration and overtime calculation.
 */

export interface OvertimeResult {
  totalHours: number;
  regularHours: number;
  overtimeHours: number;
  isValid: boolean;
  error?: string;
}

/**
 * Calculates shift duration, normal hours, and overtime hours based on start and end timestamps.
 * Handles standard daytime shifts, overnight shifts (crossing midnight), zero-hour shifts,
 * and exact threshold boundaries.
 *
 * @param {string | Date} checkIn - Start timestamp
 * @param {string | Date} checkOut - End timestamp
 * @param {number} standardShiftHours - Standard daily shift threshold (e.g. 8.0)
 * @returns {OvertimeResult} Calculated hours split into total, regular, and overtime
 */
export function calculateShiftOvertime(
  checkIn: string | Date,
  checkOut: string | Date,
  standardShiftHours: number = 8.0
): OvertimeResult {
  const startDate = new Date(checkIn);
  const endDate = new Date(checkOut);

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return {
      totalHours: 0,
      regularHours: 0,
      overtimeHours: 0,
      isValid: false,
      error: 'Invalid timestamp format',
    };
  }

  const durationMs = endDate.getTime() - startDate.getTime();

  if (durationMs < 0) {
    return {
      totalHours: 0,
      regularHours: 0,
      overtimeHours: 0,
      isValid: false,
      error: 'Check-out time cannot be before check-in time',
    };
  }

  // Convert milliseconds to hours rounded to 2 decimal places
  const totalHours = Math.round((durationMs / (1000 * 60 * 60)) * 100) / 100;
  const threshold = Math.max(0, standardShiftHours);

  if (totalHours <= threshold) {
    return {
      totalHours,
      regularHours: totalHours,
      overtimeHours: 0,
      isValid: true,
    };
  }

  const regularHours = threshold;
  const overtimeHours = Math.round((totalHours - threshold) * 100) / 100;

  return {
    totalHours,
    regularHours,
    overtimeHours,
    isValid: true,
  };
}

/**
 * Computes the total elapsed duration in hours and minutes between two dates or from start to now.
 *
 * @param {string | Date} startTime - Shift start time
 * @param {string | Date} [endTime] - Optional shift end time (defaults to now)
 * @returns {{ hours: number; minutes: number; formatted: string }} Formatted duration string
 */
export function formatShiftDuration(
  startTime: string | Date,
  endTime?: string | Date
): { hours: number; minutes: number; formatted: string } {
  const start = new Date(startTime).getTime();
  const end = endTime ? new Date(endTime).getTime() : Date.now();

  if (Number.isNaN(start) || Number.isNaN(end) || end < start) {
    return { hours: 0, minutes: 0, formatted: '0h 00m' };
  }

  const diffMinutes = Math.floor((end - start) / (1000 * 60));
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;

  return {
    hours,
    minutes,
    formatted: `${hours}h ${formattedMinutes}m`,
  };
}
