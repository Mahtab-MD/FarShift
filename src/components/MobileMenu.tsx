import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext.tsx';
import { HeaderControls, SharedHeaderControlsProps } from './HeaderControls.tsx';

export interface MobileMenuProps extends Omit<SharedHeaderControlsProps, 'layout' | 'onActionComplete'> {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), select:not([disabled]), input:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])';

/**
 * Accessible mobile slide-in drawer dialog containing sector switcher, language selector,
 * theme toggle, and info (About) controls. Traps focus, locks body scroll, and closes on Escape or outside click.
 *
 * @param {MobileMenuProps} props - MobileMenu component props
 * @returns {React.ReactElement | null} Rendered modal drawer or null when closed
 */
export function MobileMenu({
  id,
  isOpen,
  onClose,
  triggerRef,
  role,
  onChangeRole,
  sector,
  onChangeSector,
  workers,
  activeWorker,
  onSelectWorker,
  onOpenAbout,
  showingAbout,
}: MobileMenuProps): React.ReactElement | null {
  const { t } = useI18n();
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!isOpen || typeof document === 'undefined') return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        triggerRef.current?.focus();
        return;
      }

      if (event.key === 'Tab' && dialogRef.current) {
        const focusableNodes = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
        );
        if (focusableNodes.length === 0) return;

        const firstNode = focusableNodes[0];
        const lastNode = focusableNodes[focusableNodes.length - 1];
        const activeElement = document.activeElement as HTMLElement | null;

        if (event.shiftKey) {
          if (!activeElement || activeElement === firstNode || !dialogRef.current.contains(activeElement)) {
            event.preventDefault();
            lastNode.focus();
          }
        } else if (!activeElement || activeElement === lastNode || !dialogRef.current.contains(activeElement)) {
          event.preventDefault();
          firstNode.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) {
    return null;
  }

  const handleBackdropClick = (): void => {
    onClose();
    triggerRef.current?.focus();
  };

  return (
    <div className="fixed inset-0 z-50 md:hidden flex">
      <div
        data-testid="mobile-menu-backdrop"
        onClick={handleBackdropClick}
        aria-hidden="true"
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs transition-opacity duration-200 motion-reduce:transition-none"
      />

      <div
        ref={dialogRef}
        id={id}
        role="dialog"
        aria-modal="true"
        aria-label={t.mobileMenuTitle}
        className="relative z-10 w-80 max-w-[85vw] h-full bg-slate-900 text-white border-r border-slate-800 shadow-2xl p-4 flex flex-col gap-4 overflow-y-auto transition-transform duration-200 ease-out motion-reduce:transition-none"
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-500 text-slate-950 flex items-center justify-center font-black text-base">
              FS
            </div>
            <div>
              <span className="font-bold text-sm text-white block">{t.appName}</span>
              <span className="text-[11px] text-slate-300 block">{t.mobileMenuTitle}</span>
            </div>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={() => {
              onClose();
              triggerRef.current?.focus();
            }}
            aria-label={t.closeMenu}
            className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-lg bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-colors duration-150 motion-reduce:transition-none"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
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
          layout="drawer"
          onActionComplete={() => {
            onClose();
            triggerRef.current?.focus();
          }}
        />
      </div>
    </div>
  );
}
