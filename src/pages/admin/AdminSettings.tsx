import React, { useState, useEffect } from 'react';
import { Settings, Save, RotateCcw, CheckCircle2 } from 'lucide-react';
import { SectorSettings } from '../../types/index.ts';
import { DEFAULT_SETTINGS, GEO_BOUNDS, TIME_CONSTANTS } from '../../config/constants.ts';
import { validateCoordinates } from '../../lib/validators.ts';
import {
  GeofenceSettingsCard,
  WageAndFatigueSettingsCards,
} from '../../components/admin/AdminSettingsParts.tsx';

interface AdminSettingsProps {
  settings: SectorSettings;
  onSaveSettings: (next: SectorSettings) => Promise<void>;
}

/**
 * Employer configuration form for site geofence coordinates, wage rates, and fatigue rules.
 *
 * @param {AdminSettingsProps} props - Component props
 * @returns {React.ReactElement} Rendered AdminSettings form
 */
export default function AdminSettings({
  settings,
  onSaveSettings,
}: AdminSettingsProps): React.ReactElement {
  const [form, setForm] = useState<SectorSettings>(settings);
  const [isLocating, setIsLocating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  const handleUseCurrentLocation = (): void => {
    setMessage(null);
    if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
      setMessage({ type: 'error', text: 'Geolocation API not available in this browser.' });
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((prev) => ({
          ...prev,
          siteLat: Math.round(pos.coords.latitude * 1000000) / 1000000,
          siteLng: Math.round(pos.coords.longitude * 1000000) / 1000000,
        }));
        setIsLocating(false);
        setMessage({
          type: 'success',
          text: 'Site coordinates updated from your current GPS location. Click Save Settings to apply.',
        });
      },
      () => {
        setIsLocating(false);
        setMessage({
          type: 'error',
          text: 'Could not read current location (permission denied or timed out). You can enter coordinates manually.',
        });
      },
      { enableHighAccuracy: true, timeout: TIME_CONSTANTS.GEOLOCATION_TIMEOUT_MS }
    );
  };

  const handleResetDefaults = async (): Promise<void> => {
    const def = DEFAULT_SETTINGS[settings.sector];
    setForm(def);
    await onSaveSettings(def);
    setMessage({ type: 'success', text: 'Reset to labeled sample default values.' });
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setMessage(null);

    const coordCheck = validateCoordinates(form.siteLat, form.siteLng);
    if (!coordCheck.isValid) {
      setMessage({ type: 'error', text: coordCheck.error || 'Invalid coordinates' });
      return;
    }

    if (
      form.geofenceRadiusMeters < GEO_BOUNDS.MIN_RADIUS_METERS ||
      form.geofenceRadiusMeters > GEO_BOUNDS.MAX_RADIUS_METERS
    ) {
      setMessage({ type: 'error', text: 'Geofence radius must be between 20m and 10,000m' });
      return;
    }

    await onSaveSettings(form);
    setMessage({
      type: 'success',
      text: 'Sector settings saved! Worker GPS check-in, payslip rates, and fatigue rules updated.',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-teal-700" aria-hidden="true" />
            <h2 className="text-base font-bold text-slate-900">
              Sector Configuration & Sample Rate Defaults
            </h2>
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            All defaults below are clearly labeled sample values for{' '}
            <strong>{form.siteName}</strong> and can be customized live.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void handleResetDefaults()}
          className="min-h-[40px] px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          Reset Sample Defaults
        </button>
      </div>

      {message && (
        <div
          role="status"
          className={`p-4 rounded-xl border text-sm font-medium flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-rose-50 border-rose-300 text-rose-900'
          }`}
        >
          <CheckCircle2 className="w-5 h-5 shrink-0" aria-hidden="true" />
          <span>{message.text}</span>
        </div>
      )}

      <GeofenceSettingsCard
        form={form}
        isLocating={isLocating}
        onUseCurrentLocation={handleUseCurrentLocation}
        onChangeForm={setForm}
      />

      <WageAndFatigueSettingsCards form={form} onChangeForm={setForm} />

      <button
        type="submit"
        className="w-full sm:w-auto min-h-[50px] inline-flex items-center justify-center gap-2 bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm rounded-xl px-8 py-3 shadow-sm transition-colors cursor-pointer"
      >
        <Save className="w-4 h-4" aria-hidden="true" />
        <span>Save Sector Settings</span>
      </button>
    </form>
  );
}
