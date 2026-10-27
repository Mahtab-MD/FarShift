import React from 'react';
import { Mic, MicOff, Send, Sparkles } from 'lucide-react';
import { HazardSeverity, Sector } from '../../types/index.ts';
import { Translations } from '../../i18n/translations.ts';

interface SafetyReportFormProps {
  sector: Sector;
  categories: string[];
  category: string;
  severity: HazardSeverity;
  description: string;
  isVoiceTranscribed: boolean;
  isRecording: boolean;
  onChangeCategory: (cat: string) => void;
  onChangeSeverity: (sev: HazardSeverity) => void;
  onChangeDescription: (desc: string) => void;
  onStartVoice: () => void;
  onInsertSampleVoice: () => void;
  onSubmit: (e: React.FormEvent) => void;
  t: Translations;
}

/**
 * Renders the safety hazard report form with category picker, severity buttons, and voice input controls.
 *
 * @param {SafetyReportFormProps} props - Form props
 * @returns {React.ReactElement} Rendered safety report form
 */
export function SafetyReportForm({
  sector,
  categories,
  category,
  severity,
  description,
  isVoiceTranscribed,
  isRecording,
  onChangeCategory,
  onChangeSeverity,
  onChangeDescription,
  onStartVoice,
  onInsertSampleVoice,
  onSubmit,
  t,
}: SafetyReportFormProps): React.ReactElement {
  return (
    <form
      onSubmit={onSubmit}
      className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4"
    >
      <div>
        <label htmlFor="hazard-category" className="block text-xs font-bold text-slate-800 mb-1.5">
          {t.category} ({sector === 'construction' ? 'Construction Site' : 'College Campus'})
        </label>
        <select
          id="hazard-category"
          value={category}
          onChange={(e) => onChangeCategory(e.target.value)}
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
              onClick={() => onChangeSeverity(lvl)}
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

      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label htmlFor="hazard-description" className="text-xs font-bold text-slate-800">
            {t.description}
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onStartVoice}
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
              onClick={onInsertSampleVoice}
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
          onChange={(e) => onChangeDescription(e.target.value)}
          placeholder="Describe the safety risk and exact location..."
          className="w-full p-3 text-sm rounded-xl border border-slate-300 bg-slate-50 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
        />
        {isVoiceTranscribed && (
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
  );
}
