import React, { useState, useEffect, useCallback } from 'react';
import { HazardReport, HazardSeverity, Sector, Worker } from '../../types/index.ts';
import { DATA_UPDATED_EVENT, SECTOR_HAZARD_CATEGORIES } from '../../config/constants.ts';
import { validateHazardReportInput } from '../../lib/validators.ts';
import { dataSource } from '../../data/index.ts';
import { useI18n } from '../../i18n/I18nContext.tsx';
import { AudioReadoutButton } from '../../components/AudioReadoutButton.tsx';
import {
  HazardReportList,
  isBrowserSpeechSupported,
  startBrowserSpeechRecognition,
} from '../../components/worker/SafetyReportParts.tsx';
import { SafetyReportForm } from '../../components/worker/SafetyReportForm.tsx';

interface SafetyReportProps {
  worker: Worker;
  sector: Sector;
  onReportSubmitted: () => void;
}

/**
 * Worker Safety & Hazard Reporting view with Web Speech API voice input and live resolution status.
 *
 * @param {SafetyReportProps} props - Component props
 * @returns {React.ReactElement} Rendered SafetyReport view
 */
export function SafetyReport({
  worker,
  sector,
  onReportSubmitted,
}: SafetyReportProps): React.ReactElement {
  const { t, language } = useI18n();
  const categories = SECTOR_HAZARD_CATEGORIES[sector];

  const [category, setCategory] = useState(categories[0]);
  const [severity, setSeverity] = useState<HazardSeverity>('high');
  const [description, setDescription] = useState('');
  const [isVoiceTranscribed, setIsVoiceTranscribed] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);
  const [reports, setReports] = useState<HazardReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => setCategory(SECTOR_HAZARD_CATEGORIES[sector][0]), [sector]);
  useEffect(() => setIsSpeechSupported(isBrowserSpeechSupported()), []);

  const loadReports = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      setReports(await dataSource.getHazardReports(sector));
    } finally {
      setIsLoading(false);
    }
  }, [sector]);

  useEffect(() => {
    void loadReports();
    const handleUpdate = (): void => void loadReports();
    window.addEventListener(DATA_UPDATED_EVENT, handleUpdate);
    return () => window.removeEventListener(DATA_UPDATED_EVENT, handleUpdate);
  }, [loadReports]);

  const handleStartVoice = (): void => {
    if (!isSpeechSupported) {
      const sampleText =
        sector === 'construction'
          ? 'Unsecured perimeter net on Floor 3 north edge near freight hoist.'
          : 'Emergency eyewash station valve in Biology Lab 102 is stuck.';
      setDescription((prev) => (prev ? `${prev} ${sampleText}` : sampleText));
      setIsVoiceTranscribed(true);
      return;
    }

    try {
      setIsRecording(true);
      const started = startBrowserSpeechRecognition(
        language,
        (transcript) => {
          setDescription((prev) => (prev ? `${prev} ${transcript}` : transcript));
          setIsVoiceTranscribed(true);
        },
        () => {
          setIsRecording(false);
          setFeedbackMsg({
            type: 'error',
            text: 'Voice recognition interrupted or mic unavailable. Text input or Voice Sample button is ready below.',
          });
        },
        () => setIsRecording(false)
      );
      if (!started) setIsRecording(false);
    } catch {
      setIsRecording(false);
    }
  };

  const insertSampleVoiceNote = (): void => {
    const sample =
      sector === 'construction'
        ? 'Exposed high-voltage conduit near wet excavation trench B2.'
        : 'Broken handrail bracket on West Library concrete steps.';
    setDescription(sample);
    setIsVoiceTranscribed(true);
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setFeedbackMsg(null);
    const validated = validateHazardReportInput({
      sector,
      category,
      severity,
      description,
      voiceTranscribed: isVoiceTranscribed,
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
      setIsVoiceTranscribed(false);
      setFeedbackMsg({
        type: 'success',
        text: 'Safety hazard reported! Supervisors have been alerted in real time.',
      });
      onReportSubmitted();
      await loadReports();
    } catch {
      setFeedbackMsg({ type: 'error', text: 'Failed to submit safety report.' });
    }
  };

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700 block">OSHA / ILO Safe Work Environment</span>
            <h1 className="text-xl font-bold text-slate-900">{t.safetyTitle}</h1>
          </div>
          <AudioReadoutButton textToRead={`${t.safetyTitle}. Choose a ${t.category}, tap ${t.voiceInput} or type a description, then press ${t.reportHazardButton}.`} />
        </div>
        <p className="text-xs text-slate-600">
          Speak in your language or type below. Live status updates appear immediately as supervisors review and resolve the issue.
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

      <SafetyReportForm
        sector={sector}
        categories={categories}
        category={category}
        severity={severity}
        description={description}
        isVoiceTranscribed={isVoiceTranscribed}
        isRecording={isRecording}
        onChangeCategory={setCategory}
        onChangeSeverity={setSeverity}
        onChangeDescription={setDescription}
        onStartVoice={handleStartVoice}
        onInsertSampleVoice={insertSampleVoiceNote}
        onSubmit={handleSubmit}
        t={t}
      />

      <HazardReportList reports={reports} isLoading={isLoading} t={t} />
    </div>
  );
}
