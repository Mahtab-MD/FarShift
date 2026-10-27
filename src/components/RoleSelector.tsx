import {
  HardHat,
  ShieldCheck,
  Building2,
  GraduationCap,
  MapPin,
  FileSpreadsheet,
  Mic,
  MessageSquareLock,
  Activity,
  ArrowRight,
  Info,
} from 'lucide-react';
import { Sector, UserRole } from '../types/index.ts';
import { useI18n } from '../i18n/I18nContext.tsx';
import { AudioReadoutButton } from './AudioReadoutButton.tsx';

interface RoleSelectorProps {
  sector: Sector;
  onChangeSector: (sector: Sector) => void;
  onSelectRole: (role: UserRole) => void;
  onOpenAbout: () => void;
}

export function RoleSelector({
  sector,
  onChangeSector,
  onSelectRole,
  onOpenAbout,
}: RoleSelectorProps) {
  const { t } = useI18n();

  const summarySpeech = `${t.appName}: ${t.tagline}. Select ${t.roleWorker} to check in with GPS, view your payslip, report safety hazards by voice, or send anonymous feedback. Select ${t.roleAdmin} to monitor site attendance, fatigue alerts, and safety resolution.`;

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Hero Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 mb-8 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" aria-hidden="true" />
            {t.sdgGoal}
          </span>
          <AudioReadoutButton textToRead={summarySpeech} />
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
          {t.appName}: Decent Work Platform
        </h1>
        <p className="text-slate-300 text-base sm:text-lg max-w-2xl mb-6 leading-relaxed">
          Make work fairer, safer, and more transparent for employee-intensive organisations.
          Empowering workers with clarity and voice while giving employers actionable insights into
          workforce health.
        </p>

        {/* Active Sector Switcher Card */}
        <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-1">
                Active Industry Sector (Live Switchable)
              </span>
              <p className="text-sm text-slate-300">
                Switch between industries to adapt worker roles, geofence sites, pay rates, and
                safety hazard categories:
              </p>
            </div>
            <div
              role="group"
              aria-label="Choose Industry Sector"
              className="grid grid-cols-2 gap-2 sm:flex shrink-0"
            >
              <button
                type="button"
                onClick={() => onChangeSector('construction')}
                aria-pressed={sector === 'construction'}
                className={`inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all min-h-[48px] ${
                  sector === 'construction'
                    ? 'bg-amber-500 text-slate-950 shadow-md ring-2 ring-amber-300'
                    : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                }`}
              >
                <Building2 className="w-4 h-4" aria-hidden="true" />
                Construction Site
              </button>
              <button
                type="button"
                onClick={() => onChangeSector('college')}
                aria-pressed={sector === 'college'}
                className={`inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all min-h-[48px] ${
                  sector === 'college'
                    ? 'bg-teal-400 text-slate-950 shadow-md ring-2 ring-teal-200'
                    : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                }`}
              >
                <GraduationCap className="w-4 h-4" aria-hidden="true" />
                College Campus
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Role Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* 1. Worker Interface Card */}
        <div className="bg-white rounded-3xl border-2 border-teal-600/80 shadow-md hover:shadow-xl transition-shadow p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center">
                <HardHat className="w-6 h-6" aria-hidden="true" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-teal-50 text-teal-800 border border-teal-200">
                Mobile-First Interface
              </span>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-2">{t.roleWorker}</h2>
            <p className="text-sm text-slate-600 mb-6">
              Designed for basic smartphones, regional languages, and high outdoor contrast. No
              complex login required in demo mode.
            </p>

            <ul className="space-y-3 mb-8 text-sm text-slate-700">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  <strong>GPS Shift Check-In/Out:</strong> Haversine geofence check + one-tap manual
                  fallback & automatic overtime calculation.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <FileSpreadsheet className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  <strong>Transparent Payslip:</strong> Live itemized base pay, 1.5x overtime, and
                  deduction breakdown in your language.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Mic className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  <strong>Voice & Text Safety Reporting:</strong> Web Speech API voice input with
                  real-time resolution status tracking.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <MessageSquareLock className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  <strong>100% Anonymous Feedback:</strong> Rate supervision and conditions with
                  zero worker ID recorded.
                </span>
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={() => onSelectRole('worker')}
            className="w-full min-h-[54px] inline-flex items-center justify-center gap-2 bg-teal-700 hover:bg-teal-800 text-white font-bold text-base rounded-2xl px-6 py-3.5 shadow-sm transition-colors cursor-pointer"
          >
            <span>Enter {t.roleWorker}</span>
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* 2. Employer / Admin Interface Card */}
        <div className="bg-white rounded-3xl border-2 border-slate-300 shadow-md hover:shadow-xl transition-shadow p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 text-amber-400 flex items-center justify-center">
                <Activity className="w-6 h-6" aria-hidden="true" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 border border-slate-300">
                Responsive Operations View
              </span>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-2">{t.roleAdmin}</h2>
            <p className="text-sm text-slate-600 mb-6">
              Real-time workforce visibility, proactive fatigue prevention, and rapid safety
              escalation for supervisors and HR teams.
            </p>

            <ul className="space-y-3 mb-8 text-sm text-slate-700">
              <li className="flex items-start gap-2.5">
                <Activity className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  <strong>Attendance & 7-Day Trend:</strong> Lightweight inline-SVG chart tracking
                  regular vs. overtime hours across shifts.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  <strong>Proactive Fatigue Alerts:</strong> Automatically flags workers exceeding
                  daily hour limits or insufficient rest gaps.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <HardHat className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  <strong>Live Hazard Resolution:</strong> Triage worker safety reports (Reported →
                  In Review → Resolved) with instant sync.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <MessageSquareLock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  <strong>Anonymous Sentiment & Site Settings:</strong> Review unredacted anonymous
                  ratings and configure geofence/pay rates.
                </span>
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={() => onSelectRole('admin')}
            className="w-full min-h-[54px] inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-base rounded-2xl px-6 py-3.5 shadow-sm transition-colors cursor-pointer"
          >
            <span>Enter {t.roleAdmin}</span>
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Cross-sector use cases quick link bar */}
      <div className="bg-teal-900/5 border border-teal-800/15 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Info className="w-5 h-5 text-teal-700 shrink-0" aria-hidden="true" />
          <p className="text-sm text-slate-700 font-medium">
            Want to see how FairShift addresses <strong>UN SDG 8</strong> across{' '}
            <strong>Construction Sites</strong> and <strong>Colleges</strong>?
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenAbout}
          className="shrink-0 min-h-[44px] px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-teal-800 font-bold text-xs border border-teal-300 shadow-xs transition-colors"
        >
          Read Cross-Sector Use Cases & Architecture
        </button>
      </div>
    </main>
  );
}
