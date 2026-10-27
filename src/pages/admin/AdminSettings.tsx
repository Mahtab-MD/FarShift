import React, { useState, useEffect } from 'react';
import { Settings, MapPin, Save, RotateCcw, CheckCircle2, Navigation } from 'lucide-react';
import { SectorSettings } from '../../types/index.ts';
import { DEFAULT_SETTINGS } from '../../config/constants.ts';
import { validateCoordinates } from '../../lib/validators.ts';

interface AdminSettingsProps {
  settings: SectorSettings;
  onSaveSettings: (next: SectorSettings) => Promise<void>;
}

export default function AdminSettings({ settings, onSaveSettings }: AdminSettingsProps) {
  const [form, setForm] = useState<SectorSettings>(settings);
  const [locating, setLocating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  const handleUseCurrentLocation = () => {
    setMessage(null);
    if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
      setMessage({
        type: 'error',
        text: 'Geolocation API not available in this browser.',
      });
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((prev) => ({
          ...prev,
          siteLat: Math.round(pos.coords.latitude * 1000000) / 1000000,
          siteLng: Math.round(pos.coords.longitude * 1000000) / 1000000,
        }));
        setLocating(false);
        setMessage({
          type: 'success',
          text: 'Site coordinates updated from your current GPS location. Click Save Settings to apply.',
        });
      },
      () => {
        setLocating(false);
        setMessage({
          type: 'error',
          text: 'Could not read current location (permission denied or timed out). You can enter coordinates manually.',
        });
      },
      { enableHighAccuracy: true, timeout: 7000 }
    );
  };

  const handleResetDefaults = async () => {
    const def = DEFAULT_SETTINGS[settings.sector];
    setForm(def);
    await onSaveSettings(def);
    setMessage({
      type: 'success',
      text: 'Reset to labeled sample default values.',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const coordCheck = validateCoordinates(form.siteLat, form.siteLng);
    if (!coordCheck.isValid) {
      setMessage({ type: 'error', text: coordCheck.error || 'Invalid coordinates' });
      return;
    }

    if (form.geofenceRadiusMeters < 20 || form.geofenceRadiusMeters > 10000) {
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
          onClick={handleResetDefaults}
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

      {/* 1. Geofence & Site Location */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-teal-700" aria-hidden="true" />
            1. Site Location & Geofence Boundary (Sample Coordinates)
          </h3>

          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={locating}
            className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Navigation className="w-3.5 h-3.5" aria-hidden="true" />
            {locating ? 'Locating...' : 'Use my current location'}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="site-lat" className="block text-xs font-bold text-slate-700 mb-1">
              Site Latitude (Sample)
            </label>
            <input
              id="site-lat"
              type="number"
              step="0.000001"
              value={form.siteLat}
              onChange={(e) => setForm({ ...form, siteLat: Number(e.target.value) })}
              className="w-full min-h-[42px] px-3 py-2 text-sm font-mono rounded-xl border border-slate-300 bg-slate-50 text-slate-900"
            />
          </div>

          <div>
            <label htmlFor="site-lng" className="block text-xs font-bold text-slate-700 mb-1">
              Site Longitude (Sample)
            </label>
            <input
              id="site-lng"
              type="number"
              step="0.000001"
              value={form.siteLng}
              onChange={(e) => setForm({ ...form, siteLng: Number(e.target.value) })}
              className="w-full min-h-[42px] px-3 py-2 text-sm font-mono rounded-xl border border-slate-300 bg-slate-50 text-slate-900"
            />
          </div>

          <div>
            <label
              htmlFor="geofence-radius"
              className="block text-xs font-bold text-slate-700 mb-1"
            >
              Geofence Radius (Meters)
            </label>
            <input
              id="geofence-radius"
              type="number"
              min="20"
              max="10000"
              value={form.geofenceRadiusMeters}
              onChange={(e) =>
                setForm({ ...form, geofenceRadiusMeters: Number(e.target.value) })
              }
              className="w-full min-h-[42px] px-3 py-2 text-sm font-mono rounded-xl border border-slate-300 bg-slate-50 text-slate-900"
            />
          </div>
        </div>
      </div>

      {/* 2. Shift & Wage Rates */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900">
          2. Standard Shift Hours & Transparent Wage Rates (Labeled Sample Values)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label htmlFor="std-hours" className="block text-xs font-bold text-slate-700 mb-1">
              Standard Shift Hours
            </label>
            <input
              id="std-hours"
              type="number"
              step="0.5"
              min="1"
              max="16"
              value={form.standardShiftHours}
              onChange={(e) =>
                setForm({ ...form, standardShiftHours: Number(e.target.value) })
              }
              className="w-full min-h-[42px] px-3 py-2 text-sm font-mono rounded-xl border border-slate-300 bg-slate-50 text-slate-900"
            />
          </div>

          <div>
            <label htmlFor="base-rate" className="block text-xs font-bold text-slate-700 mb-1">
              Sample Base Rate ($/hr)
            </label>
            <input
              id="base-rate"
              type="number"
              step="0.5"
              min="1"
              max="250"
              value={form.baseHourlyRate}
              onChange={(e) => setForm({ ...form, baseHourlyRate: Number(e.target.value) })}
              className="w-full min-h-[42px] px-3 py-2 text-sm font-mono rounded-xl border border-slate-300 bg-slate-50 text-slate-900"
            />
          </div>

          <div>
            <label htmlFor="ot-mult" className="block text-xs font-bold text-slate-700 mb-1">
              Overtime Multiplier (x)
            </label>
            <input
              id="ot-mult"
              type="number"
              step="0.1"
              min="1"
              max="4"
              value={form.overtimeMultiplier}
              onChange={(e) =>
                setForm({ ...form, overtimeMultiplier: Number(e.target.value) })
              }
              className="w-full min-h-[42px] px-3 py-2 text-sm font-mono rounded-xl border border-slate-300 bg-slate-50 text-slate-900"
            />
          </div>

          <div>
            <label htmlFor="deduction-pct" className="block text-xs font-bold text-slate-700 mb-1">
              Statutory Deduction (%)
            </label>
            <input
              id="deduction-pct"
              type="number"
              step="0.5"
              min="0"
              max="50"
              value={form.deductionPercentage}
              onChange={(e) =>
                setForm({ ...form, deductionPercentage: Number(e.target.value) })
              }
              className="w-full min-h-[42px] px-3 py-2 text-sm font-mono rounded-xl border border-slate-300 bg-slate-50 text-slate-900"
            />
          </div>
        </div>
      </div>

      {/* 3. Fatigue Thresholds */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900">
          3. Worker Fatigue Protection Thresholds (Sample Safety Limits)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="cfg-fatigue-daily"
              className="block text-xs font-bold text-slate-700 mb-1"
            >
              Max Daily Hours Before Fatigue Alert (h)
            </label>
            <input
              id="cfg-fatigue-daily"
              type="number"
              step="0.5"
              min="4"
              max="20"
              value={form.fatigueDailyHoursThreshold}
              onChange={(e) =>
                setForm({ ...form, fatigueDailyHoursThreshold: Number(e.target.value) })
              }
              className="w-full min-h-[42px] px-3 py-2 text-sm font-mono rounded-xl border border-slate-300 bg-slate-50 text-slate-900"
            />
          </div>

          <div>
            <label
              htmlFor="cfg-fatigue-rest"
              className="block text-xs font-bold text-slate-700 mb-1"
            >
              Minimum Rest Gap Between Shifts (h)
            </label>
            <input
              id="cfg-fatigue-rest"
              type="number"
              step="0.5"
              min="4"
              max="24"
              value={form.fatigueMinRestHoursThreshold}
              onChange={(e) =>
                setForm({ ...form, fatigueMinRestHoursThreshold: Number(e.target.value) })
              }
              className="w-full min-h-[42px] px-3 py-2 text-sm font-mono rounded-xl border border-slate-300 bg-slate-50 text-slate-900"
            />
          </div>
        </div>
      </div>

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
