import React, { useState } from 'react';
import { CheckCircle2, RotateCcw, Send } from 'lucide-react';
import {
  COMPLIANCE_CONFIG,
  DATA_UPDATED_EVENT,
  DEFAULT_SETTINGS,
  SAMPLE_WORKERS,
  STORAGE_KEYS,
} from '../config/constants.ts';
import { validateContactInquiry } from '../lib/validators.ts';
import { ComplianceLocaleContent } from '../i18n/complianceTranslations.ts';

interface CookieStorageResetSectionProps {
  c: ComplianceLocaleContent;
}

/**
 * Interactive localStorage inspection and demo data reset section for the Cookie & Storage page.
 *
 * @param {CookieStorageResetSectionProps} props - Component props
 * @returns {React.ReactElement} Rendered storage reset section
 */
export function CookieStorageResetSection({
  c,
}: CookieStorageResetSectionProps): React.ReactElement {
  const [isStorageCleared, setIsStorageCleared] = useState(false);

  const handleResetDemoStorage = (): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
      localStorage.setItem(STORAGE_KEYS.WORKERS, JSON.stringify(SAMPLE_WORKERS));
      localStorage.removeItem(STORAGE_KEYS.SHIFTS);
      localStorage.removeItem(STORAGE_KEYS.HAZARDS);
      localStorage.removeItem(STORAGE_KEYS.FEEDBACK);
      window.dispatchEvent(new CustomEvent(DATA_UPDATED_EVENT, { detail: { type: 'all' } }));
      setIsStorageCleared(true);
    }
  };

  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
      <h2 className="text-sm font-bold text-slate-900">
        Active Browser LocalStorage Keys Used by FairShift
      </h2>
      <div className="flex flex-wrap gap-2">
        {COMPLIANCE_CONFIG.storageKeysUsed.map((k) => (
          <code key={k} className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 text-xs font-mono border border-slate-200">
            {k}
          </code>
        ))}
      </div>

      {isStorageCleared && (
        <div role="status" className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>{c.cookies.clearedSuccessMsg}</span>
        </div>
      )}

      <button
        type="button"
        onClick={handleResetDemoStorage}
        className="min-h-[46px] px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold inline-flex items-center gap-2 transition-colors cursor-pointer"
      >
        <RotateCcw className="w-4 h-4" aria-hidden="true" />
        <span>{c.cookies.clearStorageBtn}</span>
      </button>
    </section>
  );
}

interface ContactComplianceSectionProps {
  c: ComplianceLocaleContent;
}

/**
 * Contact details and validated compliance inquiry form section.
 *
 * @param {ContactComplianceSectionProps} props - Component props
 * @returns {React.ReactElement} Rendered contact compliance section
 */
export function ContactComplianceSection({
  c,
}: ContactComplianceSectionProps): React.ReactElement {
  const [subject, setSubject] = useState('');
  const [replyEmail, setReplyEmail] = useState('');
  const [message, setMessage] = useState('');
  const [contactFeedback, setContactFeedback] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const handleContactSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    setContactFeedback(null);
    const validated = validateContactInquiry({ subject, replyEmail, message });
    if (!validated.isValid) {
      setContactFeedback({ type: 'error', text: validated.error || 'Please verify inquiry fields.' });
      return;
    }
    setSubject('');
    setReplyEmail('');
    setMessage('');
    setContactFeedback({ type: 'success', text: c.contact.successNotice });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900">Official Contact & Designated Placeholders</h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          In accordance with strict non-fabrication compliance, unprovided institutional details are marked with explicit placeholders:
        </p>
        <dl className="space-y-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <dt className="font-bold text-slate-700">Primary Contact Email</dt>
            <dd className="font-mono text-teal-700 font-bold mt-0.5">{COMPLIANCE_CONFIG.contactEmailPlaceholder}</dd>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <dt className="font-bold text-slate-700">Organization / Chapter</dt>
            <dd className="font-mono text-slate-800 mt-0.5">
              {COMPLIANCE_CONFIG.organizationPlaceholder} (Prompt Wars 2026 x SRM ACM Student Chapter)
            </dd>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <dt className="font-bold text-slate-700">Mailing Address</dt>
            <dd className="font-mono text-slate-800 mt-0.5">{COMPLIANCE_CONFIG.addressPlaceholder}</dd>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <dt className="font-bold text-slate-700">Project Author</dt>
            <dd className="font-semibold text-slate-900 mt-0.5">{COMPLIANCE_CONFIG.authorName}</dd>
          </div>
        </dl>
      </section>

      <form onSubmit={handleContactSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900">{c.contact.formTitle}</h2>
        {contactFeedback && (
          <div
            role="status"
            className={`p-3.5 rounded-xl border text-xs font-semibold flex items-start gap-2 ${
              contactFeedback.type === 'success'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-rose-50 border-rose-300 text-rose-900'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
            <span>{contactFeedback.text}</span>
          </div>
        )}

        <div>
          <label htmlFor="contact-subject" className="block text-xs font-bold text-slate-800 mb-1">{c.contact.subjectLabel}</label>
          <input
            id="contact-subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. Privacy Data Request or Accessibility Feedback"
            className="w-full min-h-[42px] px-3 py-2 text-sm rounded-xl border border-slate-300 bg-slate-50 text-slate-900"
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="block text-xs font-bold text-slate-800 mb-1">{c.contact.emailLabel}</label>
          <input
            id="contact-email"
            type="email"
            value={replyEmail}
            onChange={(e) => setReplyEmail(e.target.value)}
            placeholder="you@example.org"
            className="w-full min-h-[42px] px-3 py-2 text-sm rounded-xl border border-slate-300 bg-slate-50 text-slate-900"
          />
        </div>
        <div>
          <label htmlFor="contact-message" className="block text-xs font-bold text-slate-800 mb-1">{c.contact.messageLabel}</label>
          <textarea
            id="contact-message"
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your question or compliance inquiry..."
            className="w-full p-3 text-sm rounded-xl border border-slate-300 bg-slate-50 text-slate-900"
          />
        </div>

        <button
          type="submit"
          className="w-full min-h-[48px] inline-flex items-center justify-center gap-2 bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm rounded-xl px-5 py-2.5 transition-colors cursor-pointer"
        >
          <Send className="w-4 h-4" aria-hidden="true" />
          <span>{c.contact.submitBtn}</span>
        </button>
      </form>
    </div>
  );
}
