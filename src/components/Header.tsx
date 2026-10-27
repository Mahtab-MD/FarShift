import React, { useState, useRef, useEffect } from 'react';
import { Building2, GraduationCap, Menu, ShieldCheck } from 'lucide-react';
import { Sector, UserRole, Worker } from '../types/index.ts';
import { useI18n } from '../i18n/I18nContext.tsx';
import { isSampleMode } from '../data/index.ts';
import { useScrollCollapsed } from '../hooks/useScrollCollapsed.ts';
import { HeaderControls } from './HeaderControls.tsx';
import { MobileMenu } from './MobileMenu.tsx';

export interface HeaderProps {
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

const MOBILE_MENU_ID = 'fairshift-mobile-menu';

/**
 * Sticky global navigation header.
 * Keeps desktop/tablet (>= 768px) layout unchanged while automatically collapsing
 * into a 56px compact bar with a hamburger menu on mobile (< 768px) when scrolled past 24px.
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
  const { t } = useI18n();
  const isCollapsed = useScrollCollapsed();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const hamburgerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!isCollapsed && isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [isCollapsed, isMobileMenuOpen]);

  const BrandLogoButton = (
    <button
      type="button"
      onClick={() => onChangeRole(null)}
      aria-label="FairShift Home and Role Picker"
      className="flex items-center gap-2 text-left group focus:outline-none focus:ring-2 focus:ring-teal-400 rounded-lg p-1"
    >
      <div className="w-9 h-9 rounded-xl bg-teal-500 text-slate-950 flex items-center justify-center font-black text-lg shadow-sm group-hover:bg-teal-400 transition-colors duration-150 motion-reduce:transition-none">
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
  );

  return (
    <header className="sticky top-0 z-30 bg-slate-900 text-white border-b border-slate-800 shadow-sm transition-all duration-200 ease-out motion-reduce:transition-none">
      {/* Desktop & Tablet Header (>= 768px): Unchanged */}
      <div className="hidden md:block max-w-7xl mx-auto px-3 sm:px-6 py-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            {BrandLogoButton}
            {isSampleMode && (
              <span
                title="Running on local sample data fallback (No Supabase credentials required)"
                className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30"
              >
                <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                {t.sampleModeBadge}
              </span>
            )}
          </div>
          <HeaderControls
            role={role}
            onChangeRole={onChangeRole}
            sector={sector}
            onChangeSector={onChangeSector}
            workers={workers}
            activeWorker={activeWorker}
            onSelectWorker={onSelectWorker}
            onOpenAbout={onOpenAbout}
            showingAbout={showingAbout}
            layout="inline"
          />
        </div>
      </div>

      {/* Mobile Header (< 768px): Full at top, compact 56px bar when scrolled */}
      <div className="md:hidden max-w-7xl mx-auto px-3 transition-all duration-200 ease-out motion-reduce:transition-none">
        {isCollapsed ? (
          <div
            data-testid="mobile-compact-bar"
            className="h-14 flex items-center justify-between gap-2 transition-all duration-200 ease-out motion-reduce:transition-none"
          >
            <div className="flex items-center gap-2">
              <button
                ref={hamburgerRef}
                type="button"
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                aria-label={t.openMenu}
                aria-expanded={isMobileMenuOpen}
                aria-controls={MOBILE_MENU_ID}
                className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-lg bg-slate-800 text-slate-100 hover:bg-slate-700 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-colors duration-150 motion-reduce:transition-none"
              >
                <Menu className="w-5 h-5" aria-hidden="true" />
              </button>
              {BrandLogoButton}
            </div>

            <span
              data-testid="mobile-active-sector-pill"
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border ${
                sector === 'construction'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-teal-500/20 text-teal-300 border-teal-500/40'
              }`}
            >
              {sector === 'construction' ? (
                <Building2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              ) : (
                <GraduationCap className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              )}
              <span>{sector === 'construction' ? 'Construction' : 'College'}</span>
            </span>
          </div>
        ) : (
          <div
            data-testid="mobile-expanded-bar"
            className="py-2.5 flex flex-wrap items-center justify-between gap-2 transition-all duration-200 ease-out motion-reduce:transition-none"
          >
            <div className="flex items-center gap-2.5">{BrandLogoButton}</div>
            <HeaderControls
              role={role}
              onChangeRole={onChangeRole}
              sector={sector}
              onChangeSector={onChangeSector}
              workers={workers}
              activeWorker={activeWorker}
              onSelectWorker={onSelectWorker}
              onOpenAbout={onOpenAbout}
              showingAbout={showingAbout}
              layout="inline"
            />
          </div>
        )}
      </div>

      <MobileMenu
        id={MOBILE_MENU_ID}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        triggerRef={hamburgerRef}
        role={role}
        onChangeRole={onChangeRole}
        sector={sector}
        onChangeSector={onChangeSector}
        workers={workers}
        activeWorker={activeWorker}
        onSelectWorker={onSelectWorker}
        onOpenAbout={onOpenAbout}
        showingAbout={showingAbout}
      />
    </header>
  );
}
