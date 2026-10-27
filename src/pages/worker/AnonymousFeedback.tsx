import React, { useState } from 'react';
import { MessageSquareLock, ShieldCheck, Star, Send, CheckCircle2 } from 'lucide-react';
import { Sector } from '../../types/index.ts';
import { validateAnonymousFeedbackInput } from '../../lib/validators.ts';
import { dataSource } from '../../data/index.ts';
import { useI18n } from '../../i18n/I18nContext.tsx';
import { AudioReadoutButton } from '../../components/AudioReadoutButton.tsx';

interface AnonymousFeedbackProps {
  sector: Sector;
}

/**
 * Worker Anonymous Feedback & Manager Rating view with strict zero-identifier guarantee.
 *
 * @param {AnonymousFeedbackProps} props - Component props
 * @returns {React.ReactElement} Rendered AnonymousFeedback view
 */
export function AnonymousFeedback({ sector }: AnonymousFeedbackProps): React.ReactElement {
  const { t } = useI18n();
  const [managerRating, setManagerRating] = useState<number>(4);
  const [conditionsRating, setConditionsRating] = useState<number>(4);
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setStatusMessage(null);
    const validated = validateAnonymousFeedbackInput({
      sector,
      managerRating,
      conditionsRating,
      comment,
    });
    if (!validated.isValid) {
      setStatusMessage({ type: 'error', text: validated.error || 'Invalid feedback rating.' });
      return;
    }

    setIsSubmitting(true);
    try {
      await dataSource.submitFeedback({
        sector: validated.sector,
        managerRating: validated.managerRating,
        conditionsRating: validated.conditionsRating,
        comment: validated.comment,
      });
      setComment('');
      setStatusMessage({ type: 'success', text: t.feedbackSubmittedNotice });
    } catch {
      setStatusMessage({ type: 'error', text: 'Could not submit feedback. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderRatingSelector = (
    label: string,
    currentValue: number,
    onSelect: (val: number) => void,
    groupId: string
  ): React.ReactElement => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span id={groupId} className="text-xs font-bold text-slate-800">{label}</span>
        <span className="text-xs font-mono font-bold text-teal-700">{currentValue} / 5</span>
      </div>
      <div role="group" aria-labelledby={groupId} className="grid grid-cols-5 gap-2">
        {[1, 2, 3, 4, 5].map((score) => {
          const isActive = score <= currentValue;
          return (
            <button
              key={score}
              type="button"
              onClick={() => onSelect(score)}
              aria-label={`Rate ${score} out of 5 for ${label}`}
              aria-pressed={score === currentValue}
              className={`min-h-[48px] rounded-xl border flex flex-col items-center justify-center gap-0.5 font-bold text-xs transition-all cursor-pointer ${
                score === currentValue
                  ? 'bg-teal-700 text-white border-teal-800 ring-2 ring-teal-500/40'
                  : isActive
                  ? 'bg-teal-50 text-teal-900 border-teal-300'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Star
                className={`w-4 h-4 ${
                  score === currentValue
                    ? 'fill-amber-300 text-amber-300'
                    : isActive
                    ? 'fill-teal-600 text-teal-600'
                    : 'text-slate-400'
                }`}
                aria-hidden="true"
              />
              <span>{score}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 block">
              Protected Worker Voice
            </span>
            <h1 className="text-xl font-bold text-slate-900">{t.feedbackTitle}</h1>
          </div>
          <AudioReadoutButton
            textToRead={`${t.feedbackTitle}. ${t.anonymousBanner}. Rate your manager from 1 to 5, rate working conditions from 1 to 5, and tap ${t.submitFeedback}.`}
          />
        </div>

        <div className="mt-3 p-3.5 rounded-xl bg-teal-950 text-teal-100 border border-teal-800 flex items-start gap-2.5 text-xs">
          <ShieldCheck className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="font-bold text-white">{t.anonymousBanner}</p>
            <p className="text-teal-300 mt-0.5 leading-relaxed">
              Technical Guarantee: The database schema (`public.feedback`) has no worker_id, name,
              or device column, and the client payload validator rejects any identity field.
            </p>
          </div>
        </div>
      </div>

      {statusMessage && (
        <div
          role="status"
          className={`p-4 rounded-xl border text-sm font-medium flex items-center gap-2 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-rose-50 border-rose-300 text-rose-900'
          }`}
        >
          <CheckCircle2 className="w-5 h-5 shrink-0" aria-hidden="true" />
          <span>{statusMessage.text}</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-5"
      >
        {renderRatingSelector(t.rateManager, managerRating, setManagerRating, 'rate-manager-group')}
        {renderRatingSelector(t.rateConditions, conditionsRating, setConditionsRating, 'rate-conditions-group')}

        <div>
          <label htmlFor="anonymous-comment" className="block text-xs font-bold text-slate-800 mb-1.5">
            {t.optionalComment}
          </label>
          <textarea
            id="anonymous-comment"
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share honest feedback about shift schedules, rest breaks, or site morale (no name attached)..."
            className="w-full p-3 text-sm rounded-xl border border-slate-300 bg-slate-50 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full min-h-[52px] inline-flex items-center justify-center gap-2 bg-teal-700 hover:bg-teal-800 text-white font-bold text-base rounded-xl px-5 py-3 shadow-sm transition-colors cursor-pointer"
        >
          <MessageSquareLock className="w-5 h-5" aria-hidden="true" />
          <span>{isSubmitting ? 'Sending...' : t.submitFeedback}</span>
          <Send className="w-4 h-4 ml-1" aria-hidden="true" />
        </button>
      </form>
    </div>
  );
}
