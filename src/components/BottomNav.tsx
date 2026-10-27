import { MapPin, FileText, ShieldAlert, MessageSquareLock, Info } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext.tsx';

export type WorkerTab = 'shift' | 'payslip' | 'safety' | 'feedback' | 'about';

interface BottomNavProps {
  activeTab: WorkerTab;
  onSelectTab: (tab: WorkerTab) => void;
  activeHazardCount?: number;
}

export function BottomNav({ activeTab, onSelectTab, activeHazardCount = 0 }: BottomNavProps) {
  const { t } = useI18n();

  const items: { id: WorkerTab; label: string; icon: typeof MapPin; badge?: number }[] = [
    { id: 'shift', label: t.navShift, icon: MapPin },
    { id: 'payslip', label: t.navPayslip, icon: FileText },
    { id: 'safety', label: t.navSafety, icon: ShieldAlert, badge: activeHazardCount },
    { id: 'feedback', label: t.navFeedback, icon: MessageSquareLock },
    { id: 'about', label: t.navAbout, icon: Info },
  ];

  return (
    <nav
      aria-label="Worker Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200 shadow-lg"
    >
      <div className="max-w-lg mx-auto grid grid-cols-5">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`relative flex flex-col items-center justify-center min-h-[60px] py-1.5 px-1 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-600 ${
                isActive
                  ? 'text-teal-700 font-bold bg-teal-50/70'
                  : 'text-slate-600 font-medium hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {isActive && (
                <span
                  className="absolute top-0 left-3 right-3 h-0.5 bg-teal-600 rounded-full"
                  aria-hidden="true"
                />
              )}
              <div className="relative">
                <Icon className="w-5 h-5 mb-0.5" aria-hidden="true" />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] leading-tight text-center truncate w-full px-0.5">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
