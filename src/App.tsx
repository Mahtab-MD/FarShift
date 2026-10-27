/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { CompliancePageId, Sector, SectorSettings, UserRole, Worker } from './types/index.ts';
import { DATA_UPDATED_EVENT, DEFAULT_SETTINGS, SAMPLE_WORKERS } from './config/constants.ts';
import { dataSource } from './data/index.ts';
import { I18nProvider } from './i18n/I18nContext.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import { Header } from './components/Header.tsx';
import { Footer } from './components/Footer.tsx';
import { RoleSelector } from './components/RoleSelector.tsx';
import { BottomNav, WorkerTab } from './components/BottomNav.tsx';
import { ShiftCheckIn } from './pages/worker/ShiftCheckIn.tsx';
import { PayslipView } from './pages/worker/PayslipView.tsx';
import { SafetyReport } from './pages/worker/SafetyReport.tsx';
import { AnonymousFeedback } from './pages/worker/AnonymousFeedback.tsx';
import { AboutPage } from './pages/AboutPage.tsx';
import { CompliancePages } from './pages/CompliancePages.tsx';

const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard.tsx'));

/**
 * Determines initial role from URL search parameters if provided.
 *
 * @returns {UserRole | null} Initial user role or null for role picker
 */
function getInitialRoleFromUrl(): UserRole | null {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1' || params.get('role') === 'worker') return 'worker';
    if (params.get('role') === 'admin') return 'admin';
  }
  return null;
}

function FairShiftContent(): React.ReactElement {
  const [role, setRole] = useState<UserRole | null>(getInitialRoleFromUrl);
  const [sector, setSector] = useState<Sector>('college');
  const [workerTab, setWorkerTab] = useState<WorkerTab>('shift');
  const [activeCompliancePage, setActiveCompliancePage] = useState<CompliancePageId | null>(null);

  const [workers, setWorkers] = useState<Worker[]>(SAMPLE_WORKERS.filter((w) => w.sector === 'college'));
  const [activeWorker, setActiveWorker] = useState<Worker | null>(
    SAMPLE_WORKERS.find((w) => w.sector === 'college') || null
  );
  const [settings, setSettings] = useState<SectorSettings>(DEFAULT_SETTINGS.college);
  const [activeHazardCount, setActiveHazardCount] = useState(0);

  const loadSectorState = useCallback(async (targetSector: Sector): Promise<void> => {
    const [sectorWorkers, sectorSettings, sectorHazards] = await Promise.all([
      dataSource.getWorkers(targetSector),
      dataSource.getSettings(targetSector),
      dataSource.getHazardReports(targetSector),
    ]);
    setWorkers(sectorWorkers);
    setActiveWorker((prev) => {
      if (prev && prev.sector === targetSector) {
        return sectorWorkers.find((w) => w.id === prev.id) || sectorWorkers[0] || null;
      }
      return sectorWorkers[0] || null;
    });
    setSettings(sectorSettings);
    setActiveHazardCount(sectorHazards.filter((h) => h.status !== 'resolved').length);
  }, []);

  useEffect(() => {
    void loadSectorState(sector);
    const handleSync = (): void => void loadSectorState(sector);
    window.addEventListener(DATA_UPDATED_EVENT, handleSync);
    return () => window.removeEventListener(DATA_UPDATED_EVENT, handleSync);
  }, [sector, loadSectorState]);

  const handleUpdateSettings = async (nextSettings: SectorSettings): Promise<void> => {
    const updated = await dataSource.updateSettings(nextSettings);
    setSettings(updated);
  };

  const handleSelectSectorAndRole = (nextSector: Sector, nextRole: UserRole): void => {
    setSector(nextSector);
    setRole(nextRole);
    setActiveCompliancePage(null);
    if (nextRole === 'worker') setWorkerTab('shift');
  };

  const isWorkerBottomNavVisible = role === 'worker' && activeCompliancePage === null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header
        role={role}
        onChangeRole={(r) => {
          setRole(r);
          setActiveCompliancePage(null);
        }}
        sector={sector}
        onChangeSector={setSector}
        workers={workers}
        activeWorker={activeWorker}
        onSelectWorker={setActiveWorker}
        onOpenAbout={() => setActiveCompliancePage((prev) => (prev === 'about' ? null : 'about'))}
        showingAbout={activeCompliancePage === 'about'}
      />

      <div className="flex-1">
        {activeCompliancePage === 'about' ? (
          <AboutPage onBack={() => setActiveCompliancePage(null)} onSelectSectorAndRole={handleSelectSectorAndRole} />
        ) : activeCompliancePage !== null ? (
          <CompliancePages
            page={activeCompliancePage}
            onBack={() => setActiveCompliancePage(null)}
            onNavigatePage={setActiveCompliancePage}
          />
        ) : role === null ? (
          <RoleSelector
            sector={sector}
            onChangeSector={setSector}
            onSelectRole={(selectedRole) => {
              setRole(selectedRole);
              setActiveCompliancePage(null);
            }}
            onOpenAbout={() => setActiveCompliancePage('about')}
          />
        ) : role === 'worker' ? (
          <div className="pb-12">
            <main className="max-w-lg mx-auto px-4 pt-5">
              {workerTab === 'shift' && activeWorker && (
                <ShiftCheckIn
                  worker={activeWorker}
                  sector={sector}
                  settings={settings}
                  onShiftUpdated={() => void loadSectorState(sector)}
                />
              )}
              {workerTab === 'payslip' && activeWorker && (
                <PayslipView worker={activeWorker} sector={sector} settings={settings} />
              )}
              {workerTab === 'safety' && activeWorker && (
                <SafetyReport
                  worker={activeWorker}
                  sector={sector}
                  onReportSubmitted={() => void loadSectorState(sector)}
                />
              )}
              {workerTab === 'feedback' && <AnonymousFeedback sector={sector} />}
              {workerTab === 'about' && (
                <AboutPage onBack={() => setWorkerTab('shift')} onSelectSectorAndRole={handleSelectSectorAndRole} />
              )}
            </main>
            <BottomNav activeTab={workerTab} onSelectTab={setWorkerTab} activeHazardCount={activeHazardCount} />
          </div>
        ) : (
          <div className="pb-12">
            <Suspense
              fallback={
                <div className="max-w-7xl mx-auto p-12 text-center text-sm text-slate-500">
                  Loading Employer Dashboard...
                </div>
              }
            >
              <AdminDashboard sector={sector} settings={settings} onUpdateSettings={handleUpdateSettings} />
            </Suspense>
          </div>
        )}
      </div>

      <Footer
        activeCompliancePage={activeCompliancePage}
        onSelectCompliancePage={(page) => {
          setActiveCompliancePage(page);
          if (typeof window !== 'undefined') window.scrollTo(0, 0);
        }}
        hasBottomNav={isWorkerBottomNavVisible}
      />
    </div>
  );
}

/**
 * Root FairShift application component wrapped in ErrorBoundary and I18nProvider.
 *
 * @returns {React.ReactElement} Root application element
 */
export default function App(): React.ReactElement {
  return (
    <ErrorBoundary>
      <I18nProvider>
        <FairShiftContent />
      </I18nProvider>
    </ErrorBoundary>
  );
}
