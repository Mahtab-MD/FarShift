import React, { useMemo } from 'react';
import { MessageSquareLock, Star, ShieldCheck } from 'lucide-react';
import { AnonymousFeedback } from '../../types/index.ts';

interface FeedbackSummaryProps {
  feedbackList: AnonymousFeedback[];
}

/**
 * Employer anonymous sentiment summary view showing average ratings and unredacted comments with zero author identity.
 *
 * @param {FeedbackSummaryProps} props - Component props
 * @returns {React.ReactElement} Rendered FeedbackSummary component
 */
export default function FeedbackSummary({
  feedbackList,
}: FeedbackSummaryProps): React.ReactElement {
  const averages = useMemo(() => {
    if (feedbackList.length === 0) {
      return { avgManager: 0, avgConditions: 0, count: 0 };
    }
    let sumManager = 0;
    let sumConditions = 0;
    for (const f of feedbackList) {
      sumManager += f.managerRating;
      sumConditions += f.conditionsRating;
    }
    return {
      avgManager: Math.round((sumManager / feedbackList.length) * 10) / 10,
      avgConditions: Math.round((sumConditions / feedbackList.length) * 10) / 10,
      count: feedbackList.length,
    };
  }, [feedbackList]);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
            Avg. Manager Rating
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-slate-900">
              {averages.avgManager}
            </span>
            <span className="text-xs text-slate-500 font-semibold">/ 5.0</span>
          </div>
          <div className="flex items-center gap-1 mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  star <= Math.round(averages.avgManager)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-slate-300'
                }`}
                aria-hidden="true"
              />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
            Avg. Working Conditions
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-teal-700">
              {averages.avgConditions}
            </span>
            <span className="text-xs text-slate-500 font-semibold">/ 5.0</span>
          </div>
          <div className="flex items-center gap-1 mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  star <= Math.round(averages.avgConditions)
                    ? 'fill-teal-600 text-teal-600'
                    : 'text-slate-300'
                }`}
                aria-hidden="true"
              />
            ))}
          </div>
        </div>

        <div className="bg-teal-950 text-white rounded-2xl border border-teal-800 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
              Anonymity Audit
            </span>
            <ShieldCheck className="w-5 h-5 text-teal-400" aria-hidden="true" />
          </div>
          <div className="my-1">
            <span className="text-2xl font-extrabold font-mono">{averages.count}</span>
            <span className="text-xs text-teal-200 ml-2">Verified Anonymous Submissions</span>
          </div>
          <p className="text-[11px] text-teal-300">
            Zero identity columns stored in `public.feedback`.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <MessageSquareLock className="w-4 h-4 text-teal-700" aria-hidden="true" />
          Unfiltered Anonymous Worker Comments
        </h2>

        {feedbackList.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center">
            No anonymous feedback submitted for this sector yet.
          </p>
        ) : (
          <div className="space-y-3">
            {feedbackList.map((f) => (
              <div
                key={f.id}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-3 font-semibold text-slate-700">
                    <span className="px-2 py-0.5 rounded bg-white border border-slate-200">
                      Manager: <strong>{f.managerRating}/5</strong>
                    </span>
                    <span className="px-2 py-0.5 rounded bg-white border border-slate-200">
                      Conditions: <strong>{f.conditionsRating}/5</strong>
                    </span>
                  </div>
                  <span className="text-slate-400 font-mono text-[11px]">
                    Anonymous · {new Date(f.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {f.comment ? (
                  <p className="text-sm text-slate-800 leading-relaxed">{f.comment}</p>
                ) : (
                  <p className="text-xs italic text-slate-400">Rating submitted without comment.</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
