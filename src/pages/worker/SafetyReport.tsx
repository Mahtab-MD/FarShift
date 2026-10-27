import React, { useState, useEffect, useCallback } from 'react';
import {
  ShieldAlert,
  Mic,
  MicOff,
  Send,
  CheckCircle2,
  Clock,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { HazardReport, HazardSeverity, Sector, Worker } from '../../types/index.ts';
import { SECTOR_HAZARD_CATEGORIES } from '../../config/constants.ts';
import { validateHazardReportInput } from '../../lib/validators.ts';
import { dataSource } from '../../data/index.ts';
import { useI18n } from '../../i18n/I18nContext.tsx';
import { AudioReadoutButton } from '../../components/AudioReadoutButton.tsx';

interface SafetyReportProps {
  worker: Worker;
  sector: Sector;
  onReportSubmitted: () => void;
}

interface SpeechRecognitionAlternative {
  transcript: string;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionEvent {
  results: {
    [index: number]: SpeechRecognitionResult;
    length: number;
  };
}

interface BrowserSpeechRecognition {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

export function SafetyReport({ worker, sector, onReportSubmitted }: SafetyReportProps) {
  const { t, language } = useI18n();
  const categories = SECTOR_HAZARD_CATEGORIES[sector];

  const [category, setCategory] = useState(categories[0]);
  const [severity, setSeverity] = useState<HazardSeverity>('high');
  const [description, setDescription] = useState('');
  const [voiceTranscribed, setVoiceTranscribed] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [reports, setReports] = useState<HazardReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );

  useEffect(() => {
    setCategory(SECTOR_HAZARD_CATEGORIES[sector][0]);
  }, [sector]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const win = window as unknown as Record<string, unknown>;
      const hasApi = Boolean(win.SpeechRecognition || win.webkitSpeechRecognition);
      setSpeechSupported(hasApi);
    }
  }, []);

  const loadReports = useCallback(async () => {
    setLoading(true);
    try {
      const list = await dataSource.getHazardReports(sector);
      setReports(list);
    } finally {
      setLoading(false);
    }
  }, [sector]);

  useEffect(() => {
    loadReports();
    const handleUpdate = () => loadReports();
    window.addEventListener('fairshift-data-updated', handleUpdate);
    return () => window.removeEventListener('fairshift-data-updated', handleUpdate);
  }, [loadReports]);

  const handleStartVoice = () => {
    if (!speechSupported) {
      // Graceful voice simulation fallback if browser lacks Web Speech API
      const sampleText =
        sector === 'construction'
          ? 'Unsecured perimeter net on Floor 3 north edge near freight hoist.'
          : 'Emergency eyewash station valve in Biology Lab 102 is stuck.';
      setDescription((prev) => (prev ? `${prev} ${sampleText}` : sampleText));
      setVoiceTranscribed(true);
      return;
    }

    try {
      const win = window as unknown as {
        SpeechRecognition?: new () => BrowserSpeechRecognition;
        webkitSpeechRecognition?: new () => BrowserSpeechRecognition;
      };
      const SpeechConstructor = win.SpeechRecognition || win.webkitSpeechRecognition;
      if (!SpeechConstructor) return;

      const recognition = new SpeechConstructor();
      recognition.lang = language === 'es' ? 'es-ES' : language === 'hi' ? 'hi-IN' : 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      setIsRecording(true);

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0]?.[0]?.transcript || '';
        if (transcript) {
          setDescription((prev) => (prev ? `${prev} ${transcript}` : transcript));
          setVoiceTranscribed(true);
        }
        setIsRecording(false);
      };

      recognition.onerror = () => {
        setIsRecording(false);
        setFeedbackMsg({
          type: 'error',
          text: 'Voice recognition interrupted or mic unavailable. Text input or Voice Sample button is ready below.',
        });
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
    } catch {
      setIsRecording(false);
    }
  };

  const insertSampleVoiceNote = () => {
    const sample =
      sector === 'construction'
        ? 'Exposed high-voltage conduit near wet excavation trench B2.'
        : 'Broken handrail bracket on West Library concrete steps.';
    setDescription(sample);
    setVoiceTranscribed(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackMsg(null);

    const validated = validateHazardReportInput({
      sector,
      category,
      severity,
      description,
      voiceTranscribed,
    });

    if (!validated.isValid) {
      setFeedbackMsg({
        type: 'error',
        text: validated.error || 'Please provide a valid hazard description.',
      });
      return;
    }

    try {
      await dataSource.createHazardReport({
        sector: validated.sector,
        category: validated.category,
        severity: validated.severity,
        description: validated.description,
        voiceTranscribed: validated.voiceTranscribed,
        reportedByName: `${worker.name} (${validated.voiceTranscribed ? 'Voice' : 'Text'})`,
      });
      setDescription('');
      setVoiceTranscribed(false);
      setFeedbackMsg({
        type: 'success',
        text: 'Safety hazard reported! Supervisors have been alerted in real time.',
      });
      onReportSubmitted();
      loadReports();
    } catch {
      setFeedbackMsg({ type: 'error', text: 'Failed to submit safety report.' });
    }
  };

  const getStatusBadge = (status: HazardReport['status']) => {
    if (status === 'resolved') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900">
          <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
          {t.statusResolved}
        </span>
      );
    }
    if (status === 'in_review') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900">
          <Clock className="w-3.5 h-3.5" aria-hidden="true" />
          {t.statusInReview}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-900">
        <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
        {t.statusReported}
      </span>
    );
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700 block">
              OSHA / ILO Safe Work Environment
            </span>
            <h1 className="text-xl font-bold text-slate-900">{t.safetyTitle}</h1>
          </div>
          <AudioReadoutButton
            textToRead={`${t.safetyTitle}. Choose a ${t.category}, tap ${t.voiceInput} or type a description, then press ${t.reportHazardButton}.`}
          />
        </div>
        <p className="text-xs text-slate-600">
          Speak in your language or type below. Live status updates appear immediately as
          supervisors review and resolve the issue.
        </p>
      </div>

      {feedbackMsg && (
        <div
          role="alert"
          className={`p-4 rounded-xl border text-sm font-medium ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-rose-50 border-rose-300 text-rose-900'
          }`}
        >
          {feedbackMsg.text}
        </div>
      )}

      {/* Report Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4"
      >
        <div>
          <label
            htmlFor="hazard-category"
            className="block text-xs font-bold text-slate-800 mb-1.5"
          >
            {t.category} ({sector === 'construction' ? 'Construction Site' : 'College Campus'})
          </label>
          <select
            id="hazard-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full min-h-[46px] px-3 py-2 text-sm font-medium rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <span className="block text-xs font-bold text-slate-800 mb-1.5">{t.severity}</span>
          <div className="grid grid-cols-4 gap-2" role="group" aria-label={t.severity}>
            {(['low', 'medium', 'high', 'critical'] as HazardSeverity[]).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setSeverity(lvl)}
                aria-pressed={severity === lvl}
                className={`min-h-[42px] py-2 px-2 rounded-xl text-xs font-bold uppercase tracking-wide border transition-all cursor-pointer ${
                  severity === lvl
                    ? lvl === 'critical'
                      ? 'bg-rose-600 text-white border-rose-700 shadow-xs'
                      : lvl === 'high'
                      ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs'
                      : 'bg-teal-700 text-white border-teal-800 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Voice-to-Text Input Controls */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label htmlFor="hazard-description" className="text-xs font-bold text-slate-800">
              {t.description}
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleStartVoice}
                className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isRecording
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200'
                }`}
              >
                {isRecording ? (
                  <>
                    <MicOff className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{t.listeningNow}</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-3.5 h-3.5 text-teal-700" aria-hidden="true" />
                    <span>{t.voiceInput}</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={insertSampleVoiceNote}
                className="min-h-[38px] px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" aria-hidden="true" />
                <span>Sample Voice Note</span>
              </button>
            </div>
          </div>

          <textarea
            id="hazard-description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the safety risk and exact location..."
            className="w-full p-3 text-sm rounded-xl border border-slate-300 bg-slate-50 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
          {voiceTranscribed && (
            <p className="text-[11px] text-teal-700 font-semibold flex items-center gap-1">
              <Mic className="w-3 h-3" aria-hidden="true" />
              Transcribed via Voice Input
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full min-h-[52px] inline-flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-base rounded-xl px-5 py-3 shadow-sm transition-colors cursor-pointer"
        >
          <Send className="w-4 h-4" aria-hidden="true" />
          <span>{t.reportHazardButton}</span>
        </button>
      </form>

      {/* Live Status of Reports */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 text-rose-600" aria-hidden="true" />
          {t.myReports} (Live Status)
        </h2>

        {loading ? (
          <p className="text-xs text-slate-500 py-4 text-center">Loading hazard reports...</p>
        ) : reports.length === 0 ? (
          <p className="text-xs text-slate-500 py-4 text-center">
            No safety hazards reported for this sector.
          </p>
        ) : (
          <div className="space-y-3">
            {reports.map((r) => (
              <div
                key={r.id}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-900">{r.category}</span>
                  {getStatusBadge(r.status)}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">{r.description}</p>
                {r.resolutionNotes && (
                  <div className="p-2.5 rounded-lg bg-teal-50/80 border border-teal-200 text-xs text-teal-950">
                    <strong>Supervisor Action:</strong> {r.resolutionNotes}
                  </div>
                )}
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span className="uppercase font-semibold">Severity: {r.severity}</span>
                  <span>{new Date(r.createdAt).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
