import React from 'react';
import {
  Building2,
  GraduationCap,
  Globe,
  UserCheck,
  Info,
  ArrowLeftRight,
  Sun,
  Moon,
  Check,
} from 'lucide-react';
import { Language, Sector, UserRole, Worker } from '../types/index.ts';
import { useI18n } from '../i18n/I18nContext.tsx';

export interface SharedHeaderControlsProps {
  role: UserRole | null;
  onChangeRole: (role: UserRole | null) => void;
  sector: Sector;
  onChangeSector: (sector: Sector) => void;
  workers: Worker[];
  activeWorker: Worker | null;
  onSelectWorker: (worker: Worker) => void;
  onOpenAbout: () => void;
  showingAbout: boolean;
  layout?: 'inline' | 'drawer';
  onActionComplete?: () => void;
}

/**
 * Shared navigation and preference controls reused between the main Header and MobileMenu drawer.
 * Avoids duplicating sector, language, theme, worker, and info handlers.
 *
 * @param {SharedHeaderControlsProps} props - Shared control props
 * @returns {React.ReactElement} Rendered control group
 */
export function HeaderControls({
  role,
  onChangeRole,
  sector,
  onChangeSector,
  workers,
  activeWorker,
  onSelectWorker,
  onOpenAbout,
  showingAbout,
  layout = 'inline',
  onActionComplete,
}: SharedHeaderControlsProps): React.ReactElement {
  const { language, setLanguage, theme, toggleTheme, t, c } = useI18n();
  const isDrawer = layout === 'drawer';
  const idPrefix = isDrawer ? 'mobile-drawer' : 'header-bar';

  return (
    <div className={isDrawer ? 'flex flex-col gap-3 w-full' : 'flex flex-wrap items-center gap-1.5 sm:gap-2'}>
      <div
        role="group"
        aria-label={t.switchSector}
        className={
          isDrawer
            ? 'grid grid-cols-2 gap-1.5 rounded-xl bg-slate-800 p-1 border border-slate-700 w-full'
            : 'inline-flex rounded-lg bg-slate-800 p-0.5 border border-slate-700'
        }
      >
        <button
          type="button"
          onClick={() => {
            onChangeSector('construction');
            onActionComplete?.();
          }}
          aria-pressed={sector === 'construction'}
          className={`inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-colors min-h-[38px] focus:outline-none focus:ring-2 focus:ring-teal-400 ${
            sector === 'construction' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-300 hover:text-white'
          }`}
        >
          <Building2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span>Construction</span>
          {sector === 'construction' && <Check className="w-3 h-3 shrink-0" aria-hidden="true" />}
        </button>
        <button
          type="button"
          onClick={() => {
            onChangeSector('college');
            onActionComplete?.();
          }}
          aria-pressed={sector === 'college'}
          className={`inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-colors min-h-[38px] focus:outline-none focus:ring-2 focus:ring-teal-400 ${
            sector === 'college' ? 'bg-teal-400 text-slate-950 shadow-xs' : 'text-slate-300 hover:text-white'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span>College</span>
          {sector === 'college' && <Check className="w-3 h-3 shrink-0" aria-hidden="true" />}
        </button>
      </div>

      {role === 'worker' && workers.length > 0 && (
        <div className={isDrawer ? 'w-full' : 'flex items-center'}>
          <label htmlFor={`${idPrefix}-worker-select`} className="sr-only">
            Select Active Worker Profile
          </label>
          <div className="relative flex items-center w-full">
            <UserCheck className="w-3.5 h-3.5 text-teal-400 absolute left-2.5 pointer-events-none" aria-hidden="true" />
            <select
              id={`${idPrefix}-worker-select`}
              value={activeWorker?.id || ''}
              onChange={(e) => {
                const found = workers.find((w) => w.id === e.target.value);
                if (found) onSelectWorker(found);
              }}
              className={`bg-slate-800 text-white text-xs font-medium pl-7 pr-6 py-1.5 min-h-[38px] rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-400 ${
                isDrawer ? 'w-full' : ''
              }`}
            >
              {workers.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name} ({w.roleTitle})
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className={isDrawer ? 'w-full' : 'flex items-center'}>
        <label htmlFor={`${idPrefix}-language-select`} className="sr-only">
          Select Language
        </label>
        <div className="relative flex items-center w-full">
          <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" aria-hidden="true" />
          <select
            id={`${idPrefix}-language-select`}
            aria-label="Select Language"
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className={`bg-slate-800 text-white text-xs font-semibold pl-7 pr-5 py-1.5 min-h-[38px] rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-400 ${
              isDrawer ? 'w-full' : ''
            }`}
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
        className={`inline-flex items-center gap-2 px-3 py-1.5 min-h-[38px] rounded-lg text-xs font-semibold bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-400 ${
          isDrawer ? 'w-full justify-between' : ''
        }`}
      >
        <span className="inline-flex items-center gap-1.5">
          {theme === 'light' ? (
            <Moon className="w-3.5 h-3.5 text-amber-300" aria-hidden="true" />
          ) : (
            <Sun className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
          )}
          <span className={isDrawer ? 'inline' : 'hidden lg:inline'}>
            {theme === 'light' ? c.themeDark : c.themeLight}
          </span>
        </span>
        {isDrawer && <span className="text-[11px] text-slate-400 uppercase">{theme}</span>}
      </button>

      <button
        type="button"
        onClick={() => {
          onOpenAbout();
          onActionComplete?.();
        }}
        aria-pressed={showingAbout}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[38px] rounded-lg text-xs font-semibold border transition-colors focus:outline-none focus:ring-2 focus:ring-teal-400 ${
          showingAbout
            ? 'bg-teal-500 text-slate-950 border-teal-400'
            : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
        } ${isDrawer ? 'w-full justify-start' : ''}`}
      >
        <Info className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
        <span className={isDrawer ? 'inline' : 'hidden sm:inline'}>{t.navAbout}</span>
      </button>

      {role && (
        <button
          type="button"
          onClick={() => {
            onChangeRole(role === 'worker' ? 'admin' : 'worker');
            onActionComplete?.();
          }}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[38px] rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-400 ${
            isDrawer ? 'w-full justify-start' : ''
          }`}
          title={t.switchRole}
        >
          <ArrowLeftRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span>{role === 'worker' ? t.roleAdmin : t.roleWorker}</span>
        </button>
      )}
    </div>
  );
}
