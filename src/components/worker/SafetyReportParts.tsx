import React from 'react';
import { ShieldAlert, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { HazardReport, Language } from '../../types/index.ts';
import { Translations } from '../../i18n/translations.ts';

interface SpeechRecognitionAlternative {
  transcript: string;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
}

export interface SpeechRecognitionEvent {
  results: {
    [index: number]: SpeechRecognitionResult;
    length: number;
  };
}

export interface BrowserSpeechRecognition {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

/**
 * Checks whether the current browser environment supports the Web Speech Recognition API.
 *
 * @returns {boolean} True if SpeechRecognition is supported
 */
export function isBrowserSpeechSupported(): boolean {
  if (typeof window === 'undefined') return false;
  const win = window as unknown as Record<string, unknown>;
  return Boolean(win.SpeechRecognition || win.webkitSpeechRecognition);
}

/**
 * Starts a single-utterance browser speech recognition session.
 *
 * @param {Language} language - Active UI language
 * @param {(transcript: string) => void} onTranscript - Callback when speech is transcribed
 * @param {() => void} onError - Callback when speech recognition fails
 * @param {() => void} onEnd - Callback when recognition ends
 * @returns {boolean} True if recognition was started
 */
export function startBrowserSpeechRecognition(
  language: Language,
  onTranscript: (transcript: string) => void,
  onError: () => void,
  onEnd: () => void
): boolean {
  if (typeof window === 'undefined') return false;
  const win = window as unknown as {
    SpeechRecognition?: new () => BrowserSpeechRecognition;
    webkitSpeechRecognition?: new () => BrowserSpeechRecognition;
  };
  const SpeechConstructor = win.SpeechRecognition || win.webkitSpeechRecognition;
  if (!SpeechConstructor) return false;

  const recognition = new SpeechConstructor();
  recognition.lang = language === 'es' ? 'es-ES' : language === 'hi' ? 'hi-IN' : 'en-US';
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onresult = (event: SpeechRecognitionEvent): void => {
    const transcript = event.results[0]?.[0]?.transcript || '';
    if (transcript) {
      onTranscript(transcript);
    }
    onEnd();
  };

  recognition.onerror = (): void => {
    onError();
  };

  recognition.onend = (): void => {
    onEnd();
  };

  recognition.start();
  return true;
}

interface HazardReportListProps {
  reports: HazardReport[];
  isLoading: boolean;
  t: Translations;
}

/**
 * Renders the live list of worker-submitted safety hazard reports and their resolution status.
 *
 * @param {HazardReportListProps} props - Hazard report list props
 * @returns {React.ReactElement} Rendered report status list
 */
export function HazardReportList({
  reports,
  isLoading,
  t,
}: HazardReportListProps): React.ReactElement {
  const getStatusBadge = (status: HazardReport['status']): React.ReactElement => {
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
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
      <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
        <ShieldAlert className="w-4 h-4 text-rose-600" aria-hidden="true" />
        {t.myReports} (Live Status)
      </h2>

      {isLoading ? (
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
  );
}
