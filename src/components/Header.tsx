import React from 'react';
import {
  Building2,
  GraduationCap,
  Globe,
  ShieldCheck,
  UserCheck,
  Info,
  ArrowLeftRight,
  Sun,
  Moon,
} from 'lucide-react';
import { Language, Sector, UserRole, Worker } from '../types/index.ts';
import { useI18n } from '../i18n/I18nContext.tsx';
import { isSampleMode } from '../data/index.ts';

interface HeaderProps {
  role: UserRole | null;
  onChangeRole: (role: UserRole | null) => void;
  sector: Sector;
  onChangeSector: (sector: Sector) => void;
  workers: Worker[];
  activeWorker: Worker | null;
  onSelectWorker: (worker: Worker) => void;
  onOpenAbout: () => void;
  showingAbout: boolean;
}

/**
 * Sticky global navigation header with sector switcher, worker profile selector, language toggle, and theme toggle.
 *
 * @param {HeaderProps} props - Component props
 * @returns {React.ReactElement} Rendered Header element
 */
export function Header({
  role,
  onChangeRole,
  sector,
  onChangeSector,
  workers,
  activeWorker,
  onSelectWorker,
  onOpenAbout,
  showingAbout,
}: HeaderProps): React.ReactElement {
  const { language, setLanguage, theme, toggleTheme, t, c } = useI18n();

  return (
    <header className="sticky top-0 z-30 bg-slate-900 text-white border-b border-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => onChangeRole(null)}
              aria-label="FairShift Home and Role Picker"
              className="flex items-center gap-2 text-left group focus:outline-none focus:ring-2 focus:ring-teal-400 rounded-lg p-1"
            >
              <div className="w-9 h-9 rounded-xl bg-teal-500 text-slate-950 flex items-center justify-center font-black text-lg shadow-sm group-hover:bg-teal-400 transition-colors">
                FS
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-base tracking-tight text-white">{t.appName}</span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800">
                    SDG 8
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 hidden sm:block leading-none">
                  {sector === 'construction' ? t.sectorConstruction : t.sectorCollege}
                </p>
              </div>
            </button>

            {isSampleMode && (
              <span
                title="Running on local sample data fallback (No Supabase credentials required)"
                className="hidden md:inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30"
              >
                <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                {t.sampleModeBadge}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <div role="group" aria-label={t.switchSector} className="inline-flex rounded-lg bg-slate-800 p-0.5 border border-slate-700">
              <button
                type="button"
                onClick={() => onChangeSector('construction')}
                aria-pressed={sector === 'construction'}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-colors min-h-[36px] ${
                  sector === 'construction' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Construction</span>
              </button>
              <button
                type="button"
                onClick={() => onChangeSector('college')}
                aria-pressed={sector === 'college'}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-colors min-h-[36px] ${
                  sector === 'college' ? 'bg-teal-400 text-slate-950 shadow-xs' : 'text-slate-300 hover:text-white'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" aria-hidden="true" />
                <span>College</span>
              </button>
            </div>

            {role === 'worker' && workers.length > 0 && (
              <div className="flex items-center">
                <label htmlFor="worker-select" className="sr-only">Select Active Worker Profile</label>
                <div className="relative flex items-center">
                  <UserCheck className="w-3.5 h-3.5 text-teal-400 absolute left-2.5 pointer-events-none" aria-hidden="true" />
                  <select
                    id="worker-select"
                    value={activeWorker?.id || ''}
                    onChange={(e) => {
                      const found = workers.find((w) => w.id === e.target.value);
                      if (found) onSelectWorker(found);
                    }}
                    className="bg-slate-800 text-white text-xs font-medium pl-7 pr-6 py-1.5 min-h-[36px] rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
                  >
                    {workers.map((w) => (
                      <option key={w.id} value={w.id}>{w.name} ({w.roleTitle})</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <div className="flex items-center">
              <label htmlFor="language-select" className="sr-only">Select Language</label>
              <div className="relative flex items-center">
                <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" aria-hidden="true" />
                <select
                  id="language-select"
                  aria-label="Select Language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as Language)}
                  className="bg-slate-800 text-white text-xs font-semibold pl-7 pr-5 py-1.5 min-h-[36px] rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
                >
                  <option value="en">English (EN)</option>
                  <option value="es">Español (ES)</option>
                  <option value="hi">हिन्दी (HI)</option>
                </select>
              </div>
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={c.toggleThemeLabel}
              title={theme === 'light' ? c.themeDark : c.themeLight}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 min-h-[36px] rounded-lg text-xs font-semibold bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 transition-colors cursor-pointer"
            >
              {theme === 'light' ? (
                <Moon className="w-3.5 h-3.5 text-amber-300" aria-hidden="true" />
              ) : (
                <Sun className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
              )}
              <span className="hidden lg:inline">{theme === 'light' ? c.themeDark : c.themeLight}</span>
            </button>

            <button
              type="button"
              onClick={onOpenAbout}
              aria-pressed={showingAbout}
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 min-h-[36px] rounded-lg text-xs font-semibold border transition-colors ${
                showingAbout ? 'bg-teal-500 text-slate-950 border-teal-400' : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
              }`}
            >
              <Info className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">{t.navAbout}</span>
            </button>

            {role && (
              <button
                type="button"
                onClick={() => onChangeRole(role === 'worker' ? 'admin' : 'worker')}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 min-h-[36px] rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 transition-colors"
                title={t.switchRole}
              >
                <ArrowLeftRight className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{role === 'worker' ? t.roleAdmin : t.roleWorker}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
