import {
  Building2,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  Globe,
  Lock,
  Cpu,
} from 'lucide-react';
import { Sector, UserRole } from '../types/index.ts';
import { AudioReadoutButton } from '../components/AudioReadoutButton.tsx';

interface AboutPageProps {
  onBack: () => void;
  onSelectSectorAndRole: (sector: Sector, role: UserRole) => void;
}

export function AboutPage({ onBack, onSelectSectorAndRole }: AboutPageProps) {
  const audioOverview =
    'About FairShift: Built for UN Sustainable Development Goal 8, Decent Work and Economic Growth. FairShift works across Construction Sites and Colleges, empowering workers with transparent GPS overtime tracking, localized payslips, voice hazard reporting, and 100% anonymous feedback.';

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 min-h-[42px] px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs border border-slate-300 shadow-xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Back to Application</span>
        </button>
        <AudioReadoutButton textToRead={audioOverview} />
      </div>

      {/* UN SDG 8 Mission Card */}
      <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg border border-slate-800 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" aria-hidden="true" />
          UN SDG 8: Decent Work & Economic Growth
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          How FairShift Works Across Sectors
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
          FairShift makes work fairer, safer, and more transparent for employee-intensive
          organisations. It eliminates opaque pay and uncounted overtime, removes the fear of
          retaliation through cryptographically/structurally anonymous feedback, and bridges
          language and literacy barriers on basic smartphones.
        </p>
      </section>

      {/* Cross-Sector Use Cases Grid */}
      <section aria-labelledby="cross-sector-heading" className="space-y-4">
        <h2 id="cross-sector-heading" className="text-xl font-extrabold text-slate-900">
          How FairShift Works in These Sectors
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sector 1: Construction Site */}
          <div className="bg-white rounded-3xl border-2 border-amber-500/70 p-6 shadow-sm flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Building2 className="w-6 h-6" aria-hidden="true" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-amber-50 text-amber-900 border border-amber-200">
                  Sector 1: Heavy Industry
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900">
                1. Construction Site (Metro Tower Site B-4)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Construction crews face high physical risk, subcontracted wage disputes, and
                frequent unrecorded overtime. Many workers speak regional languages (Spanish,
                Hindi) and work in noisy or basement zones where GPS can fluctuate.
              </p>

              <ul className="space-y-2.5 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>
                    <strong>GPS + Manual Basement Fallback:</strong> Ironworkers and scaffolders
                    check in within the 200m site radius—or use the one-tap manual fallback when in
                    sub-grade pits, automatically calculating 1.5x overtime above 8 hours.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>
                    <strong>Voice Hazard Escalation:</strong> Workers wearing gloves can use voice
                    dictation to report loose scaffolding toe-boards or crane blindspots in seconds.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>
                    <strong>Fatigue Protection:</strong> Site superintendents receive automatic
                    alerts when crew members exceed 10 hours/day or have less than 11 hours rest
                    between shifts.
                  </span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onSelectSectorAndRole('construction', 'worker')}
                className="min-h-[42px] px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
              >
                Try Construction Worker
              </button>
              <button
                type="button"
                onClick={() => onSelectSectorAndRole('construction', 'admin')}
                className="min-h-[42px] px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Try Construction Admin
              </button>
            </div>
          </div>

          {/* Sector 2: College Campus */}
          <div className="bg-white rounded-3xl border-2 border-teal-600/70 p-6 shadow-sm flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center">
                  <GraduationCap className="w-6 h-6" aria-hidden="true" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-teal-50 text-teal-900 border border-teal-200">
                  Sector 2: Education & Facilities
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900">
                2. College Campus (S.R.M Institue Of Science and Technology KTR)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Colleges rely on adjunct lecturers, laboratory technicians, campus custodians, and
                student workers across sprawling multi-building campuses where extra prep/cleanup
                hours often go uncounted and lab hazards are slow to reach facilities teams.
              </p>

              <ul className="space-y-2.5 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>
                    <strong>Campus Geofence & Fair Prep Pay:</strong> Lab techs and maintenance
                    staff check in across the 300m campus boundary, ensuring evening lab teardown
                    beyond the 7.5h standard day is transparently compensated.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>
                    <strong>Campus & Lab Safety Categories:</strong> Custom categories for chemical
                    fume hoods, broken stairwell treads, and blocked fire exits with live status
                    tracking (`Reported` → `In Review` → `Resolved`).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>
                    <strong>Retaliation-Free Department Feedback:</strong> Adjuncts and staff rate
                    department supervision and working conditions without any user ID stored.
                  </span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onSelectSectorAndRole('college', 'worker')}
                className="min-h-[42px] px-3 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Try College Staff App
              </button>
              <button
                type="button"
                onClick={() => onSelectSectorAndRole('college', 'admin')}
                className="min-h-[42px] px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Try College Admin
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Architecture & Security Highlights */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2">
          <div className="flex items-center gap-2 text-teal-700 font-bold text-sm">
            <Lock className="w-4 h-4" aria-hidden="true" />
            <span>Zero-Secret & RLS Security</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            No hardcoded credentials. Automatic local seed fallback when `VITE_SUPABASE_URL` is
            unconfigured. Central input sanitization and strict zero-ID feedback table.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2">
          <div className="flex items-center gap-2 text-teal-700 font-bold text-sm">
            <Globe className="w-4 h-4" aria-hidden="true" />
            <span>Accessibility & Voice</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            English, Spanish, and Hindi support with Web Speech API voice input and text-to-speech
            audio readouts for workers with limited literacy.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2">
          <div className="flex items-center gap-2 text-teal-700 font-bold text-sm">
            <Cpu className="w-4 h-4" aria-hidden="true" />
            <span>Lightweight Efficiency</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Zero chart or UI libraries. Pure inline SVG data visualizations, `React.lazy` admin
            code splitting, and 24 unit tests covering all business math.
          </p>
        </div>
      </section>
    </main>
  );
}
