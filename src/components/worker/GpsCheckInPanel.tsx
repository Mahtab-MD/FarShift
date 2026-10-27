import React from 'react';
import { MapPin, AlertTriangle, Navigation, Hand, ShieldAlert } from 'lucide-react';
import { Coordinates, SectorSettings } from '../../types/index.ts';
import { formatDistance } from '../../lib/haversine.ts';
import { Translations } from '../../i18n/translations.ts';

interface GpsCheckInPanelProps {
  settings: SectorSettings;
  coords: Coordinates | null;
  geofenceStatus: { isInside: boolean; distanceMeters: number; isValid: boolean } | null;
  isLowAccuracy: boolean;
  isLocating: boolean;
  geoError: string | null;
  manualReason: string;
  onChangeManualReason: (val: string) => void;
  onDetectGps: () => void;
  onSimulateGps: () => void;
  onGpsCheckIn: () => void;
  onManualCheckIn: () => void;
  t: Translations;
}

/**
 * Renders the GPS coordinate verification and manual fallback controls for worker shift check-in.
 *
 * @param {GpsCheckInPanelProps} props - Check-in panel props
 * @returns {React.ReactElement} Rendered check-in panel
 */
export function GpsCheckInPanel({
  settings,
  coords,
  geofenceStatus,
  isLowAccuracy,
  isLocating,
  geoError,
  manualReason,
  onChangeManualReason,
  onDetectGps,
  onSimulateGps,
  onGpsCheckIn,
  onManualCheckIn,
  t,
}: GpsCheckInPanelProps): React.ReactElement {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-5">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-teal-600" aria-hidden="true" />
            Step 1: Verify Site Location (Haversine Geofence)
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onDetectGps}
              disabled={isLocating}
              className="min-h-[40px] px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5 text-teal-700" aria-hidden="true" />
              {isLocating ? 'Locating...' : 'Detect My GPS'}
            </button>
            <button
              type="button"
              onClick={onSimulateGps}
              className="min-h-[40px] px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold transition-colors cursor-pointer"
            >
              Simulate On-Site GPS
            </button>
          </div>
        </div>

        {coords && geofenceStatus && (
          <div
            className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
              geofenceStatus.isInside
                ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                : 'bg-amber-50 border-amber-300 text-amber-950'
            }`}
          >
            <div className="flex items-center justify-between font-bold text-sm">
              <span>{geofenceStatus.isInside ? t.withinSite : t.outsideSite}</span>
              <span className="font-mono">
                {formatDistance(geofenceStatus.distanceMeters)} / {settings.geofenceRadiusMeters}m
              </span>
            </div>
            <p className="text-slate-600 font-mono text-[11px]">
              Worker GPS: {coords.latitude.toFixed(5)}, {coords.longitude.toFixed(5)} (Accuracy: ±
              {Math.round(coords.accuracy || 15)}m)
            </p>
            {isLowAccuracy && (
              <p className="text-amber-800 font-semibold flex items-center gap-1 pt-1">
                <AlertTriangle className="w-4 h-4 shrink-0" aria-hidden="true" />
                {t.lowAccuracyWarning}
              </p>
            )}
          </div>
        )}

        {geoError && (
          <div
            role="alert"
            className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 text-xs flex items-start gap-2"
          >
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="font-bold">{t.gpsError}</p>
              <p className="mt-0.5">{geoError}</p>
            </div>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={onGpsCheckIn}
        className="w-full min-h-[54px] inline-flex items-center justify-center gap-2 bg-teal-700 hover:bg-teal-800 text-white font-bold text-base rounded-xl px-5 py-3.5 shadow-sm transition-colors cursor-pointer"
      >
        <MapPin className="w-5 h-5" aria-hidden="true" />
        <span>{t.checkInButton}</span>
      </button>

      <div className="pt-4 border-t border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700">
            No GPS Signal or Denied? One-Tap Manual Check-In
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
            Flagged "manual"
          </span>
        </div>
        <div>
          <label htmlFor="manual-reason-input" className="sr-only">
            Manual Check-in Note
          </label>
          <input
            id="manual-reason-input"
            type="text"
            value={manualReason}
            onChange={(e) => onChangeManualReason(e.target.value)}
            placeholder="Reason for manual check-in"
            className="w-full min-h-[42px] px-3 py-2 text-xs rounded-lg border border-slate-300 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
        </div>
        <button
          type="button"
          onClick={onManualCheckIn}
          className="w-full min-h-[48px] inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-sm rounded-xl px-4 py-2.5 transition-colors cursor-pointer"
        >
          <Hand className="w-4 h-4 text-amber-400" aria-hidden="true" />
          <span>{t.manualCheckInFallback}</span>
        </button>
      </div>
    </div>
  );
}
