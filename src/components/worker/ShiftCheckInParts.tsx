import React, { useState } from 'react';
import { Clock, LogOut } from 'lucide-react';
import { Coordinates, SectorSettings, Shift } from '../../types/index.ts';
import { GEO_BOUNDS, TIME_CONSTANTS } from '../../config/constants.ts';
import { Translations } from '../../i18n/translations.ts';

export interface ShiftGeolocationState {
  coords: Coordinates | null;
  isLocating: boolean;
  geoError: string | null;
  setGeoError: (err: string | null) => void;
  requestBrowserGeolocation: () => void;
  simulateSiteGps: () => void;
}

/**
 * Custom hook managing browser Geolocation API requests and simulated site coordinates.
 *
 * @param {SectorSettings} settings - Current sector geofence settings
 * @returns {ShiftGeolocationState} Geolocation state and trigger handlers
 */
export function useShiftGeolocation(settings: SectorSettings): ShiftGeolocationState {
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  const requestBrowserGeolocation = (): void => {
    setIsLocating(true);
    setGeoError(null);
    if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
      setIsLocating(false);
      setGeoError('Geolocation is not supported by this browser. Use one-tap manual check-in below.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });
        setIsLocating(false);
      },
      (err) => {
        setIsLocating(false);
        let msg = 'Location permission denied or timed out. You can use the manual check-in fallback below.';
        if (err.code === 1) msg = 'GPS permission denied. One-tap manual check-in enabled below.';
        if (err.code === 3) msg = 'GPS signal timed out. One-tap manual check-in enabled below.';
        setGeoError(msg);
      },
      {
        enableHighAccuracy: true,
        timeout: TIME_CONSTANTS.GEOLOCATION_TIMEOUT_MS,
        maximumAge: TIME_CONSTANTS.GEOLOCATION_MAX_AGE_MS,
      }
    );
  };

  const simulateSiteGps = (): void => {
    setGeoError(null);
    setCoords({
      latitude: settings.siteLat + GEO_BOUNDS.SIMULATED_LAT_OFFSET,
      longitude: settings.siteLng + GEO_BOUNDS.SIMULATED_LNG_OFFSET,
      accuracy: GEO_BOUNDS.SIMULATED_ACCURACY_METERS,
    });
  };

  return { coords, isLocating, geoError, setGeoError, requestBrowserGeolocation, simulateSiteGps };
}

interface ActiveShiftCardProps {
  activeShift: Shift;
  elapsedText: string;
  onCheckOut: () => void;
  t: Translations;
}

/**
 * Displays the active shift status timer and check-out button.
 *
 * @param {ActiveShiftCardProps} props - Active shift props
 * @returns {React.ReactElement} Active shift card element
 */
export function ActiveShiftCard({
  activeShift,
  elapsedText,
  onCheckOut,
  t,
}: ActiveShiftCardProps): React.ReactElement {
  return (
    <div className="bg-teal-900 text-white rounded-2xl p-6 shadow-md space-y-5">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-teal-800 text-teal-200 text-xs font-bold">
          <Clock className="w-4 h-4 animate-spin" aria-hidden="true" />
          {t.shiftInProgress}
        </span>
        {activeShift.isManual && (
          <span className="px-2.5 py-1 rounded-md bg-amber-500 text-slate-950 text-xs font-bold">
            Flagged: Manual
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 bg-teal-950/60 rounded-xl p-4 border border-teal-800">
        <div>
          <span className="text-xs text-teal-300 block">{t.elapsedTime}</span>
          <span className="text-2xl font-extrabold font-mono">{elapsedText}</span>
        </div>
        <div>
          <span className="text-xs text-teal-300 block">Started At</span>
          <span className="text-base font-bold font-mono">
            {new Date(activeShift.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={onCheckOut}
        className="w-full min-h-[54px] inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-base rounded-xl px-5 py-3.5 shadow-sm transition-colors cursor-pointer"
      >
        <LogOut className="w-5 h-5" aria-hidden="true" />
        <span>{t.checkOutButton}</span>
      </button>
    </div>
  );
}

interface RecentShiftsListProps {
  workerName: string;
  recentShifts: Shift[];
  t: Translations;
}

/**
 * Displays the list of recent shifts recorded for the current worker.
 *
 * @param {RecentShiftsListProps} props - Recent shifts props
 * @returns {React.ReactElement} Recent shifts card element
 */
export function RecentShiftsList({
  workerName,
  recentShifts,
  t,
}: RecentShiftsListProps): React.ReactElement {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
      <h2 className="text-sm font-bold text-slate-900 mb-3">Recent Recorded Shifts ({workerName})</h2>
      {recentShifts.length === 0 ? (
        <p className="text-xs text-slate-500 py-4 text-center">No shifts recorded yet for this worker.</p>
      ) : (
        <div className="space-y-2.5">
          {recentShifts.map((s) => (
            <div
              key={s.id}
              className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-2 text-xs"
            >
              <div>
                <div className="font-bold text-slate-800 flex items-center gap-2">
                  <span>{new Date(s.checkInTime).toLocaleDateString()}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      s.isManual ? 'bg-amber-100 text-amber-900' : 'bg-teal-100 text-teal-900'
                    }`}
                  >
                    {s.isManual ? 'Manual' : 'GPS Verified'}
                  </span>
                </div>
                <p className="text-slate-500 mt-0.5">
                  {s.status === 'active'
                    ? 'Currently Active'
                    : `${t.standardHours}: ${s.regularHours}h · ${t.overtimeHours}: ${s.overtimeHours}h`}
                </p>
              </div>
              <div className="text-right font-mono font-bold text-slate-900 text-sm">
                {s.status === 'active' ? 'In Progress' : `${s.hoursWorked}h`}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
