import { useState } from 'react';
import { ShieldAlert, CheckCircle2, Clock, AlertCircle, Mic } from 'lucide-react';
import { HazardReport, HazardStatus } from '../../types/index.ts';
import { dataSource } from '../../data/index.ts';

interface HazardManagementProps {
  hazards: HazardReport[];
  onHazardUpdated: () => void;
}

export default function HazardManagement({ hazards, onHazardUpdated }: HazardManagementProps) {
  const [notesMap, setNotesMap] = useState<Record<string, string>>({});
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | HazardStatus>('all');

  const handleStatusChange = async (reportId: string, nextStatus: HazardStatus) => {
    setUpdatingId(reportId);
    try {
      const notes = notesMap[reportId];
      await dataSource.updateHazardReportStatus(reportId, nextStatus, notes);
      onHazardUpdated();
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = hazards.filter((h) =>
    filterStatus === 'all' ? true : h.status === filterStatus
  );

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" aria-hidden="true" />
            Safety & Hazard Escalation Queue
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Update status and add corrective action notes. Changes reflect immediately in the
            Worker app.
          </p>
        </div>

        <div className="inline-flex rounded-lg bg-slate-100 p-1 border border-slate-200">
          {(['all', 'reported', 'in_review', 'resolved'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-md text-xs font-bold capitalize min-h-[34px] transition-colors cursor-pointer ${
                filterStatus === st
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-sm text-slate-500">
          No hazard reports matching the selected filter.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((h) => (
            <div
              key={h.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase ${
                        h.severity === 'critical'
                          ? 'bg-rose-600 text-white'
                          : h.severity === 'high'
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-slate-200 text-slate-800'
                      }`}
                    >
                      {h.severity}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">{h.category}</h3>
                    {h.voiceTranscribed && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200 text-[11px] font-semibold">
                        <Mic className="w-3 h-3" aria-hidden="true" />
                        Voice Report
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">
                    Reported by: <strong>{h.reportedByName}</strong> ·{' '}
                    {new Date(h.createdAt).toLocaleString()}
                  </p>
                </div>

                {/* Current Status Badge */}
                <div>
                  {h.status === 'resolved' ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900">
                      <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                      Resolved
                    </span>
                  ) : h.status === 'in_review' ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900">
                      <Clock className="w-4 h-4" aria-hidden="true" />
                      In Review
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-900">
                      <AlertCircle className="w-4 h-4" aria-hidden="true" />
                      Reported
                    </span>
                  )}
                </div>
              </div>

              <p className="text-sm text-slate-800 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                {h.description}
              </p>

              {/* Resolution Note Input + Status Actions */}
              <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex-1">
                  <label htmlFor={`note-${h.id}`} className="sr-only">
                    Corrective Action Note
                  </label>
                  <input
                    id={`note-${h.id}`}
                    type="text"
                    value={notesMap[h.id] ?? h.resolutionNotes ?? ''}
                    onChange={(e) =>
                      setNotesMap((prev) => ({ ...prev, [h.id]: e.target.value }))
                    }
                    placeholder="Add supervisor corrective action note..."
                    className="w-full min-h-[40px] px-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    disabled={updatingId === h.id || h.status === 'reported'}
                    onClick={() => handleStatusChange(h.id, 'reported')}
                    className={`min-h-[40px] px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                      h.status === 'reported'
                        ? 'bg-rose-600 text-white border-rose-700'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    Reported
                  </button>
                  <button
                    type="button"
                    disabled={updatingId === h.id || h.status === 'in_review'}
                    onClick={() => handleStatusChange(h.id, 'in_review')}
                    className={`min-h-[40px] px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                      h.status === 'in_review'
                        ? 'bg-amber-500 text-slate-950 border-amber-600'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    Mark In Review
                  </button>
                  <button
                    type="button"
                    disabled={updatingId === h.id || h.status === 'resolved'}
                    onClick={() => handleStatusChange(h.id, 'resolved')}
                    className={`min-h-[40px] px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                      h.status === 'resolved'
                        ? 'bg-emerald-600 text-white border-emerald-700'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    Mark Resolved
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
