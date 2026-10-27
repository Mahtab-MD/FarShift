import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { BarChart3, ShieldAlert, Activity, MessageSquareLock, Settings } from 'lucide-react';
import {
  AnonymousFeedback,
  HazardReport,
  Sector,
  SectorSettings,
  Shift,
} from '../../types/index.ts';
import { DATA_UPDATED_EVENT } from '../../config/constants.ts';
import { evaluateWorkerFatigue } from '../../lib/fatigue.ts';
import { dataSource } from '../../data/index.ts';
import { useI18n } from '../../i18n/I18nContext.tsx';

const AttendanceOverview = React.lazy(() => import('./AttendanceOverview.tsx'));
const HazardManagement = React.lazy(() => import('./HazardManagement.tsx'));
const FatigueAlerts = React.lazy(() => import('./FatigueAlerts.tsx'));
const FeedbackSummary = React.lazy(() => import('./FeedbackSummary.tsx'));
const AdminSettings = React.lazy(() => import('./AdminSettings.tsx'));

type AdminTab = 'overview' | 'hazards' | 'fatigue' | 'feedback' | 'settings';

interface AdminDashboardProps {
  sector: Sector;
  settings: SectorSettings;
  onUpdateSettings: (next: SectorSettings) => Promise<void>;
}

/**
 * Responsive Employer/Admin console for attendance trends, hazard escalation, fatigue alerts, and anonymous sentiment.
 *
 * @param {AdminDashboardProps} props - Component props
 * @returns {React.ReactElement} Rendered AdminDashboard component
 */
export default function AdminDashboard({
  sector,
  settings,
  onUpdateSettings,
}: AdminDashboardProps): React.ReactElement {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [hazards, setHazards] = useState<HazardReport[]>([]);
  const [feedbackList, setFeedbackList] = useState<AnonymousFeedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadAllAdminData = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      const [s, h, fb] = await Promise.all([
        dataSource.getShifts(sector),
        dataSource.getHazardReports(sector),
        dataSource.getFeedback(sector),
      ]);
      setShifts(s);
      setHazards(h);
      setFeedbackList(fb);
    } finally {
      setIsLoading(false);
    }
  }, [sector]);

  useEffect(() => {
    void loadAllAdminData();
    const handleSync = (): void => void loadAllAdminData();
    window.addEventListener(DATA_UPDATED_EVENT, handleSync);
    return () => window.removeEventListener(DATA_UPDATED_EVENT, handleSync);
  }, [loadAllAdminData]);

  const openHazardsCount = hazards.filter((h) => h.status !== 'resolved').length;
  const fatigueAlertsCount = evaluateWorkerFatigue(
    shifts,
    settings.fatigueDailyHoursThreshold,
    settings.fatigueMinRestHoursThreshold
  ).length;

  const tabs: {
    id: AdminTab;
    label: string;
    icon: typeof BarChart3;
    badge?: number;
    badgeTone?: 'rose' | 'amber';
  }[] = [
    { id: 'overview', label: t.navOverview, icon: BarChart3 },
    { id: 'hazards', label: t.navHazards, icon: ShieldAlert, badge: openHazardsCount, badgeTone: 'rose' },
    { id: 'fatigue', label: t.navFatigue, icon: Activity, badge: fatigueAlertsCount, badgeTone: 'amber' },
    { id: 'feedback', label: t.navSentiment, icon: MessageSquareLock, badge: feedbackList.length },
    { id: 'settings', label: t.navSettings, icon: Settings },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-1">
            Employer Workforce Health & Transparency Console
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight">{settings.siteName}</h1>
          <p className="text-xs text-slate-300 mt-1">
            Geofence Radius: {settings.geofenceRadiusMeters}m · Standard Shift:{' '}
            {settings.standardShiftHours}h · Base Rate: ${settings.baseHourlyRate.toFixed(2)}/hr
          </p>
        </div>

        <nav
          aria-label="Employer Dashboard Sections"
          className="flex flex-wrap items-center gap-1.5 bg-slate-800 p-1.5 rounded-xl border border-slate-700"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold min-h-[40px] transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-teal-500 text-slate-950 shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                <Icon className="w-4 h-4" aria-hidden="true" />
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                      isActive
                        ? 'bg-slate-950 text-white'
                        : tab.badgeTone === 'rose'
                        ? 'bg-rose-500 text-white'
                        : tab.badgeTone === 'amber'
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-700 text-slate-200'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-sm text-slate-500">
          Loading workforce telemetry...
        </div>
      ) : (
        <Suspense
          fallback={
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-sm text-slate-500">
              Loading module...
            </div>
          }
        >
          {activeTab === 'overview' && <AttendanceOverview shifts={shifts} />}
          {activeTab === 'hazards' && (
            <HazardManagement hazards={hazards} onHazardUpdated={() => void loadAllAdminData()} />
          )}
          {activeTab === 'fatigue' && (
            <FatigueAlerts shifts={shifts} settings={settings} onUpdateSettings={onUpdateSettings} />
          )}
          {activeTab === 'feedback' && <FeedbackSummary feedbackList={feedbackList} />}
          {activeTab === 'settings' && (
            <AdminSettings settings={settings} onSaveSettings={onUpdateSettings} />
          )}
        </Suspense>
      )}
    </main>
  );
}
