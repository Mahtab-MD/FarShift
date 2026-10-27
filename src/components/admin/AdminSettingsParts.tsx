import React from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { SectorSettings } from '../../types/index.ts';

interface GeofenceSettingsCardProps {
  form: SectorSettings;
  isLocating: boolean;
  onUseCurrentLocation: () => void;
  onChangeForm: (next: SectorSettings) => void;
}

/**
 * Renders the site coordinates and geofence radius configuration card for AdminSettings.
 *
 * @param {GeofenceSettingsCardProps} props - Geofence card props
 * @returns {React.ReactElement} Rendered geofence settings card
 */
export function GeofenceSettingsCard({
  form,
  isLocating,
  onUseCurrentLocation,
  onChangeForm,
}: GeofenceSettingsCardProps): React.ReactElement {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-teal-700" aria-hidden="true" />
          1. Site Location & Geofence Boundary (Sample Coordinates)
        </h3>
        <button
          type="button"
          onClick={onUseCurrentLocation}
          disabled={isLocating}
          className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Navigation className="w-3.5 h-3.5" aria-hidden="true" />
          {isLocating ? 'Locating...' : 'Use my current location'}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label htmlFor="site-lat" className="block text-xs font-bold text-slate-700 mb-1">Site Latitude (Sample)</label>
          <input
            id="site-lat"
            type="number"
            step="0.000001"
            value={form.siteLat}
            onChange={(e) => onChangeForm({ ...form, siteLat: Number(e.target.value) })}
            className="w-full min-h-[42px] px-3 py-2 text-sm font-mono rounded-xl border border-slate-300 bg-slate-50 text-slate-900"
          />
        </div>
        <div>
          <label htmlFor="site-lng" className="block text-xs font-bold text-slate-700 mb-1">Site Longitude (Sample)</label>
          <input
            id="site-lng"
            type="number"
            step="0.000001"
            value={form.siteLng}
            onChange={(e) => onChangeForm({ ...form, siteLng: Number(e.target.value) })}
            className="w-full min-h-[42px] px-3 py-2 text-sm font-mono rounded-xl border border-slate-300 bg-slate-50 text-slate-900"
          />
        </div>
        <div>
          <label htmlFor="geofence-radius" className="block text-xs font-bold text-slate-700 mb-1">Geofence Radius (Meters)</label>
          <input
            id="geofence-radius"
            type="number"
            min="20"
            max="10000"
            value={form.geofenceRadiusMeters}
            onChange={(e) => onChangeForm({ ...form, geofenceRadiusMeters: Number(e.target.value) })}
            className="w-full min-h-[42px] px-3 py-2 text-sm font-mono rounded-xl border border-slate-300 bg-slate-50 text-slate-900"
          />
        </div>
      </div>
    </div>
  );
}

interface WageAndFatigueSettingsCardsProps {
  form: SectorSettings;
  onChangeForm: (next: SectorSettings) => void;
}

/**
 * Renders the standard shift hours, wage rates, and fatigue threshold configuration cards.
 *
 * @param {WageAndFatigueSettingsCardsProps} props - Wage and fatigue card props
 * @returns {React.ReactElement} Rendered wage and fatigue cards
 */
export function WageAndFatigueSettingsCards({
  form,
  onChangeForm,
}: WageAndFatigueSettingsCardsProps): React.ReactElement {
  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900">
          2. Standard Shift Hours & Transparent Wage Rates (Labeled Sample Values)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label htmlFor="std-hours" className="block text-xs font-bold text-slate-700 mb-1">Standard Shift Hours</label>
            <input
              id="std-hours"
              type="number"
              step="0.5"
              min="1"
              max="16"
              value={form.standardShiftHours}
              onChange={(e) => onChangeForm({ ...form, standardShiftHours: Number(e.target.value) })}
              className="w-full min-h-[42px] px-3 py-2 text-sm font-mono rounded-xl border border-slate-300 bg-slate-50 text-slate-900"
            />
          </div>
          <div>
            <label htmlFor="base-rate" className="block text-xs font-bold text-slate-700 mb-1">Sample Base Rate ($/hr)</label>
            <input
              id="base-rate"
              type="number"
              step="0.5"
              min="1"
              max="250"
              value={form.baseHourlyRate}
              onChange={(e) => onChangeForm({ ...form, baseHourlyRate: Number(e.target.value) })}
              className="w-full min-h-[42px] px-3 py-2 text-sm font-mono rounded-xl border border-slate-300 bg-slate-50 text-slate-900"
            />
          </div>
          <div>
            <label htmlFor="ot-mult" className="block text-xs font-bold text-slate-700 mb-1">Overtime Multiplier (x)</label>
            <input
              id="ot-mult"
              type="number"
              step="0.1"
              min="1"
              max="4"
              value={form.overtimeMultiplier}
              onChange={(e) => onChangeForm({ ...form, overtimeMultiplier: Number(e.target.value) })}
              className="w-full min-h-[42px] px-3 py-2 text-sm font-mono rounded-xl border border-slate-300 bg-slate-50 text-slate-900"
            />
          </div>
          <div>
            <label htmlFor="deduction-pct" className="block text-xs font-bold text-slate-700 mb-1">Statutory Deduction (%)</label>
            <input
              id="deduction-pct"
              type="number"
              step="0.5"
              min="0"
              max="50"
              value={form.deductionPercentage}
              onChange={(e) => onChangeForm({ ...form, deductionPercentage: Number(e.target.value) })}
              className="w-full min-h-[42px] px-3 py-2 text-sm font-mono rounded-xl border border-slate-300 bg-slate-50 text-slate-900"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900">
          3. Worker Fatigue Protection Thresholds (Sample Safety Limits)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="cfg-fatigue-daily" className="block text-xs font-bold text-slate-700 mb-1">
              Max Daily Hours Before Fatigue Alert (h)
            </label>
            <input
              id="cfg-fatigue-daily"
              type="number"
              step="0.5"
              min="4"
              max="20"
              value={form.fatigueDailyHoursThreshold}
              onChange={(e) => onChangeForm({ ...form, fatigueDailyHoursThreshold: Number(e.target.value) })}
              className="w-full min-h-[42px] px-3 py-2 text-sm font-mono rounded-xl border border-slate-300 bg-slate-50 text-slate-900"
            />
          </div>
          <div>
            <label htmlFor="cfg-fatigue-rest" className="block text-xs font-bold text-slate-700 mb-1">
              Minimum Rest Gap Between Shifts (h)
            </label>
            <input
              id="cfg-fatigue-rest"
              type="number"
              step="0.5"
              min="4"
              max="24"
              value={form.fatigueMinRestHoursThreshold}
              onChange={(e) => onChangeForm({ ...form, fatigueMinRestHoursThreshold: Number(e.target.value) })}
              className="w-full min-h-[42px] px-3 py-2 text-sm font-mono rounded-xl border border-slate-300 bg-slate-50 text-slate-900"
            />
          </div>
        </div>
      </div>
    </>
  );
}
