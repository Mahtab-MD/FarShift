import { FatigueAlert, Shift } from '../types/index.ts';

/**
 * Pure business logic for worker fatigue detection, rest gap validation, and ILO/OSHA health compliance.
 */

/**
 * Checks if a single shift or day's accumulated hours exceeds the daily safety threshold.
 *
 * @param {number} hoursWorked - Total hours worked in the shift/day
 * @param {number} dailyThreshold - Maximum allowable daily hours before fatigue flag (e.g. 10.0)
 * @returns {{ isExcessive: boolean; excessHours: number }} Fatigue evaluation result
 */
export function checkDailyHoursFatigue(
  hoursWorked: number,
  dailyThreshold: number
): { isExcessive: boolean; excessHours: number } {
  if (hoursWorked <= 0 || dailyThreshold <= 0 || !Number.isFinite(hoursWorked)) {
    return { isExcessive: false, excessHours: 0 };
  }

  const excessHours = Math.round((hoursWorked - dailyThreshold) * 100) / 100;
  return {
    isExcessive: excessHours > 0,
    excessHours: Math.max(0, excessHours),
  };
}

/**
 * Computes the rest gap between the end of one shift and the start of the next shift.
 * Flags back-to-back shifts where rest falls below the minimum recuperation threshold.
 *
 * @param {string | Date} previousShiftEnd - End timestamp of prior shift
 * @param {string | Date} nextShiftStart - Start timestamp of subsequent shift
 * @param {number} minRestHours - Minimum required rest interval in hours (e.g. 11.0)
 * @returns {{ isInsufficient: boolean; restHours: number; deficitHours: number }} Rest gap evaluation
 */
export function checkRestGap(
  previousShiftEnd: string | Date,
  nextShiftStart: string | Date,
  minRestHours: number
): { isInsufficient: boolean; restHours: number; deficitHours: number } {
  const prevEnd = new Date(previousShiftEnd).getTime();
  const nextStart = new Date(nextShiftStart).getTime();

  if (Number.isNaN(prevEnd) || Number.isNaN(nextStart) || nextStart < prevEnd) {
    return { isInsufficient: false, restHours: 0, deficitHours: 0 };
  }

  const diffMs = nextStart - prevEnd;
  const restHours = Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100;

  if (restHours < minRestHours) {
    const deficitHours = Math.round((minRestHours - restHours) * 100) / 100;
    return {
      isInsufficient: true,
      restHours,
      deficitHours,
    };
  }

  return {
    isInsufficient: false,
    restHours,
    deficitHours: 0,
  };
}

/**
 * Analyzes a collection of shifts for a worker or entire organisation to identify fatigue violations.
 *
 * @param {Shift[]} shifts - List of shift records
 * @param {number} dailyHoursThreshold - Configurable daily hours threshold (e.g. 10.0)
 * @param {number} minRestHoursThreshold - Configurable minimum rest interval between shifts (e.g. 11.0)
 * @returns {FatigueAlert[]} List of generated fatigue alerts
 */
export function evaluateWorkerFatigue(
  shifts: Shift[],
  dailyHoursThreshold: number = 10.0,
  minRestHoursThreshold: number = 11.0
): FatigueAlert[] {
  const alerts: FatigueAlert[] = [];

  // Group shifts by worker
  const shiftsByWorker = new Map<string, Shift[]>();
  for (const shift of shifts) {
    const existing = shiftsByWorker.get(shift.workerId) || [];
    existing.push(shift);
    shiftsByWorker.set(shift.workerId, existing);
  }

  for (const [workerId, workerShifts] of shiftsByWorker.entries()) {
    // Sort chronologically by check-in time
    const sortedShifts = [...workerShifts].sort(
      (a, b) => new Date(a.checkInTime).getTime() - new Date(b.checkInTime).getTime()
    );

    for (let i = 0; i < sortedShifts.length; i++) {
      const shift = sortedShifts[i];

      // 1. Check excessive daily shift hours
      const dailyCheck = checkDailyHoursFatigue(shift.hoursWorked, dailyHoursThreshold);
      if (dailyCheck.isExcessive) {
        alerts.push({
          id: `fatigue-hours-${shift.id}`,
          workerId,
          workerName: shift.workerName,
          sector: shift.sector,
          type: 'excessive_hours',
          severity: dailyCheck.excessHours >= 2 ? 'critical' : 'warning',
          details: `Worked ${shift.hoursWorked}h exceeding ${dailyHoursThreshold}h safety limit by +${dailyCheck.excessHours}h`,
          metricValue: shift.hoursWorked,
          thresholdValue: dailyHoursThreshold,
          timestamp: shift.checkOutTime || shift.checkInTime,
        });
      }

      // 2. Check back-to-back shifts rest gap
      if (i > 0) {
        const prevShift = sortedShifts[i - 1];
        if (prevShift.checkOutTime) {
          const restCheck = checkRestGap(
            prevShift.checkOutTime,
            shift.checkInTime,
            minRestHoursThreshold
          );

          if (restCheck.isInsufficient) {
            alerts.push({
              id: `fatigue-rest-${shift.id}`,
              workerId,
              workerName: shift.workerName,
              sector: shift.sector,
              type: 'insufficient_rest',
              severity: restCheck.deficitHours >= 3 ? 'critical' : 'warning',
              details: `Rest interval of only ${restCheck.restHours}h between shifts (minimum required: ${minRestHoursThreshold}h, deficit: ${restCheck.deficitHours}h)`,
              metricValue: restCheck.restHours,
              thresholdValue: minRestHoursThreshold,
              timestamp: shift.checkInTime,
            });
          }
        }
      }
    }
  }

  return alerts;
}
