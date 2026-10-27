import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Sector, SectorSettings, Shift, Worker } from '../../types/index.ts';
import { checkGeofence, formatDistance } from '../../lib/haversine.ts';
import { formatShiftDuration } from '../../lib/overtime.ts';
import { LOW_ACCURACY_THRESHOLD_METERS, TIME_CONSTANTS } from '../../config/constants.ts';
import { dataSource } from '../../data/index.ts';
import { useI18n } from '../../i18n/I18nContext.tsx';
import { AudioReadoutButton } from '../../components/AudioReadoutButton.tsx';
import {
  ActiveShiftCard,
  RecentShiftsList,
  useShiftGeolocation,
} from '../../components/worker/ShiftCheckInParts.tsx';
import { GpsCheckInPanel } from '../../components/worker/GpsCheckInPanel.tsx';

interface ShiftCheckInProps {
  worker: Worker;
  sector: Sector;
  settings: SectorSettings;
  onShiftUpdated: () => void;
}

/**
 * Worker GPS Shift Check-in/Check-out view with Haversine geofence verification and manual fallback.
 *
 * @param {ShiftCheckInProps} props - Component props
 * @returns {React.ReactElement} Rendered ShiftCheckIn component
 */
export function ShiftCheckIn({
  worker,
  sector,
  settings,
  onShiftUpdated,
}: ShiftCheckInProps): React.ReactElement {
  const { t } = useI18n();
  const [activeShift, setActiveShift] = useState<Shift | null>(null);
  const [recentShifts, setRecentShifts] = useState<Shift[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<{
    type: 'success' | 'warning' | 'error';
    text: string;
  } | null>(null);
  const [manualReason, setManualReason] = useState('GPS unavailable / signal obstructed');
  const [elapsedText, setElapsedText] = useState('0h 00m');

  const { coords, isLocating, geoError, setGeoError, requestBrowserGeolocation, simulateSiteGps } =
    useShiftGeolocation(settings);

  const loadShiftData = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      const [active, allShifts] = await Promise.all([
        dataSource.getActiveShift(worker.id),
        dataSource.getShifts(sector),
      ]);
      setActiveShift(active);
      setRecentShifts(allShifts.filter((s) => s.workerId === worker.id).slice(0, 5));
    } catch {
      setActionMessage({ type: 'error', text: 'Failed to load shift status.' });
    } finally {
      setIsLoading(false);
    }
  }, [worker.id, sector]);

  useEffect(() => void loadShiftData(), [loadShiftData]);

  useEffect(() => {
    if (!activeShift) return;
    const updateTimer = (): void => setElapsedText(formatShiftDuration(activeShift.checkInTime).formatted);
    updateTimer();
    const interval = setInterval(updateTimer, TIME_CONSTANTS.TIMER_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [activeShift]);

  const geofenceStatus = coords
    ? checkGeofence(
        { latitude: coords.latitude, longitude: coords.longitude },
        { latitude: settings.siteLat, longitude: settings.siteLng },
        settings.geofenceRadiusMeters
      )
    : null;

  const isLowAccuracy = coords?.accuracy !== undefined && coords.accuracy > LOW_ACCURACY_THRESHOLD_METERS;

  const recordCheckIn = async (isManual: boolean, msgType: 'success' | 'warning', msgText: string): Promise<void> => {
    try {
      const created = await dataSource.checkInShift({
        workerId: worker.id,
        workerName: worker.name,
        sector,
        checkInTime: new Date().toISOString(),
        checkInLat: coords?.latitude,
        checkInLng: coords?.longitude,
        checkInAccuracy: coords?.accuracy,
        isManual,
        manualReason: isManual ? manualReason.trim() || 'Manual check-in fallback' : undefined,
      });
      setActiveShift(created);
      setActionMessage({ type: msgType, text: msgText });
      onShiftUpdated();
      await loadShiftData();
    } catch {
      setActionMessage({ type: 'error', text: isManual ? 'Manual check-in failed.' : 'Could not complete check-in.' });
    }
  };

  const handleGpsCheckIn = async (): Promise<void> => {
    if (!coords || !geofenceStatus) {
      setGeoError('Please acquire GPS coordinates first or use Manual Check-In.');
      return;
    }
    if (!geofenceStatus.isInside) {
      setActionMessage({
        type: 'warning',
        text: `You are ${formatDistance(geofenceStatus.distanceMeters)} from ${settings.siteName} (limit: ${settings.geofenceRadiusMeters}m). Use Manual Check-In if working at an annex.`,
      });
      return;
    }
    await recordCheckIn(false, 'success', `GPS Check-In verified (${formatDistance(geofenceStatus.distanceMeters)} from site center).`);
  };

  const handleManualCheckIn = async (): Promise<void> => {
    await recordCheckIn(true, 'warning', 'Checked in via Manual Fallback (flagged "manual" for supervisor review).');
  };

  const handleCheckOut = async (): Promise<void> => {
    if (!activeShift) return;
    try {
      const checkInMs = new Date(activeShift.checkInTime).getTime();
      const effectiveIso =
        Date.now() - checkInMs < TIME_CONSTANTS.DEMO_SHORT_SHIFT_THRESHOLD_MS
          ? new Date(checkInMs + TIME_CONSTANTS.DEMO_FALLBACK_SHIFT_HOURS * TIME_CONSTANTS.MS_PER_HOUR).toISOString()
          : new Date().toISOString();
      const completed = await dataSource.checkOutShift(
        activeShift.id,
        effectiveIso,
        coords?.latitude,
        coords?.longitude,
        settings.standardShiftHours
      );
      setActiveShift(null);
      setActionMessage({
        type: 'success',
        text: `Shift completed! Total: ${completed.hoursWorked}h (Regular: ${completed.regularHours}h, Overtime: ${completed.overtimeHours}h).`,
      });
      onShiftUpdated();
      await loadShiftData();
    } catch {
      setActionMessage({ type: 'error', text: 'Check-out failed.' });
    }
  };

  const audioGuide = activeShift
    ? `${t.shiftInProgress}. ${t.elapsedTime}: ${elapsedText}. Tap ${t.checkOutButton} when your shift ends.`
    : `${t.checkInTitle} at ${settings.siteName}. Standard shift is ${settings.standardShiftHours} hours. Tap ${t.checkInButton} or use ${t.manualCheckInFallback}.`;

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 block">{settings.siteName}</span>
            <h1 className="text-xl font-bold text-slate-900">{activeShift ? t.checkOutTitle : t.checkInTitle}</h1>
          </div>
          <AudioReadoutButton textToRead={audioGuide} />
        </div>
        <p className="text-xs text-slate-600">
          Worker: <strong>{worker.name}</strong> ({worker.roleTitle}) · Geofence Radius: <strong>{settings.geofenceRadiusMeters}m</strong> · Standard Shift: <strong>{settings.standardShiftHours}h</strong>
        </p>
      </div>

      {actionMessage && (
        <div
          role="status"
          className={`p-4 rounded-xl border text-sm font-medium flex items-start gap-2.5 ${
            actionMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : actionMessage.type === 'warning'
              ? 'bg-amber-50 border-amber-300 text-amber-900'
              : 'bg-rose-50 border-rose-300 text-rose-900'
          }`}
        >
          <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
          <span>{actionMessage.text}</span>
        </div>
      )}

      {isLoading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-sm text-slate-500">Loading shift state...</div>
      ) : activeShift ? (
        <ActiveShiftCard activeShift={activeShift} elapsedText={elapsedText} onCheckOut={handleCheckOut} t={t} />
      ) : (
        <GpsCheckInPanel
          settings={settings}
          coords={coords}
          geofenceStatus={geofenceStatus}
          isLowAccuracy={isLowAccuracy}
          isLocating={isLocating}
          geoError={geoError}
          manualReason={manualReason}
          onChangeManualReason={setManualReason}
          onDetectGps={requestBrowserGeolocation}
          onSimulateGps={simulateSiteGps}
          onGpsCheckIn={handleGpsCheckIn}
          onManualCheckIn={handleManualCheckIn}
          t={t}
        />
      )}

      <RecentShiftsList workerName={worker.name} recentShifts={recentShifts} t={t} />
    </div>
  );
}
