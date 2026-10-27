import React, { useState } from 'react';
import {
  ShieldCheck,
  FileText,
  Cookie,
  Accessibility,
  Mail,
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  RotateCcw,
  Send,
} from 'lucide-react';
import { CompliancePageId } from '../types/index.ts';
import { COMPLIANCE_CONFIG, DEFAULT_SETTINGS, SAMPLE_WORKERS } from '../config/constants.ts';
import { validateContactInquiry } from '../lib/validators.ts';
import { useI18n } from '../i18n/I18nContext.tsx';
import { AudioReadoutButton } from '../components/AudioReadoutButton.tsx';
import { PolicySection } from '../i18n/complianceTranslations.ts';

interface ComplianceViewProps {
  page: Exclude<CompliancePageId, 'about'>;
  onBack: () => void;
  onNavigatePage: (page: CompliancePageId) => void;
}

export function CompliancePages({ page, onBack, onNavigatePage }: ComplianceViewProps) {
  const { c } = useI18n();
  const [storageCleared, setStorageCleared] = useState(false);

  // Contact form state
  const [subject, setSubject] = useState('');
  const [replyEmail, setReplyEmail] = useState('');
  const [message, setMessage] = useState('');
  const [contactFeedback, setContactFeedback] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const handleResetDemoStorage = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('fairshift_settings_v1', JSON.stringify(DEFAULT_SETTINGS));
      localStorage.setItem('fairshift_workers_v1', JSON.stringify(SAMPLE_WORKERS));
      localStorage.removeItem('fairshift_shifts_v1');
      localStorage.removeItem('fairshift_hazards_v1');
      localStorage.removeItem('fairshift_feedback_v1');
      window.dispatchEvent(new CustomEvent('fairshift-data-updated', { detail: { type: 'all' } }));
      setStorageCleared(true);
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactFeedback(null);

    const validated = validateContactInquiry({
      subject,
      replyEmail,
      message,
    });

    if (!validated.isValid) {
      setContactFeedback({
        type: 'error',
        text: validated.error || 'Please verify inquiry fields.',
      });
      return;
    }

    setSubject('');
    setReplyEmail('');
    setMessage('');
    setContactFeedback({
      type: 'success',
      text: c.contact.successNotice,
    });
  };

  const renderPolicySections = (sections: PolicySection[]) => (
    <div className="space-y-4">
      {sections.map((sec) => (
        <section
          key={sec.heading}
          className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-2.5"
        >
          <h2 className="text-base font-bold text-slate-900">{sec.heading}</h2>
          <p className="text-sm text-slate-700 leading-relaxed">{sec.body}</p>
          {sec.bullets && sec.bullets.length > 0 && (
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-slate-700 pt-1">
              {sec.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </div>
  );

  const pageMeta = {
    privacy: {
      title: c.privacy.title,
      subtitle: c.privacy.subtitle,
      icon: ShieldCheck,
      sections: c.privacy.sections,
    },
    terms: {
      title: c.terms.title,
      subtitle: c.terms.subtitle,
      icon: FileText,
      sections: c.terms.sections,
    },
    cookies: {
      title: c.cookies.title,
      subtitle: c.cookies.subtitle,
      icon: Cookie,
      sections: c.cookies.sections,
    },
    accessibility: {
      title: c.accessibility.title,
      subtitle: c.accessibility.subtitle,
      icon: Accessibility,
      sections: c.accessibility.sections,
    },
    contact: {
      title: c.contact.title,
      subtitle: c.contact.subtitle,
      icon: Mail,
      sections: [],
    },
  }[page];

  const Icon = pageMeta.icon;
  const audioText = `${pageMeta.title}. ${c.demoNoticeBanner}. ${c.lastUpdatedLabel}. ${pageMeta.subtitle}`;

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 min-h-[42px] px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs border border-slate-300 shadow-xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>{c.backToApp}</span>
        </button>

        <AudioReadoutButton textToRead={audioText} />
      </div>

      {/* Mandatory Visible Demonstration Disclaimer Banner */}
      <div
        role="note"
        aria-label="Demonstration Disclaimer"
        className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
      >
        <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold">
          <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" aria-hidden="true" />
          <span>{c.demoNoticeBanner}</span>
        </div>
        <span className="text-xs font-mono font-semibold text-amber-900 shrink-0">
          {c.lastUpdatedLabel}
        </span>
      </div>

      {/* Hero Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-800 space-y-3">
        <div className="flex items-center gap-2.5 text-teal-400 text-xs font-bold uppercase tracking-wider">
          <Icon className="w-4 h-4" aria-hidden="true" />
          <span>Trust, Transparency & Compliance</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{pageMeta.title}</h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">{pageMeta.subtitle}</p>

        {/* Sub-navigation pills across compliance pages */}
        <div className="pt-3 flex flex-wrap gap-2">
          {(
            [
              { id: 'privacy', label: c.footerPrivacy },
              { id: 'terms', label: c.footerTerms },
              { id: 'cookies', label: c.footerCookies },
              { id: 'accessibility', label: c.footerAccessibility },
              { id: 'contact', label: c.footerContact },
            ] as { id: CompliancePageId; label: string }[]
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onNavigatePage(tab.id)}
              aria-current={page === tab.id ? 'page' : undefined}
              className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                page === tab.id
                  ? 'bg-teal-400 text-slate-950'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Page Body Content */}
      {page !== 'contact' && renderPolicySections(pageMeta.sections)}

      {/* Cookie & Storage Interactive Reset Box */}
      {page === 'cookies' && (
        <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900">
            Active Browser LocalStorage Keys Used by FairShift
          </h2>
          <div className="flex flex-wrap gap-2">
            {COMPLIANCE_CONFIG.storageKeysUsed.map((k) => (
              <code
                key={k}
                className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 text-xs font-mono border border-slate-200"
              >
                {k}
              </code>
            ))}
          </div>

          {storageCleared && (
            <div
              role="status"
              className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2"
            >
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
      )}

      {/* Contact Page Details & Validated Form */}
      {page === 'contact' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900">
              Official Contact & Designated Placeholders
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              In accordance with strict non-fabrication compliance, unprovided institutional
              details are marked with explicit placeholders:
            </p>
            <dl className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <dt className="font-bold text-slate-700">Primary Contact Email</dt>
                <dd className="font-mono text-teal-700 font-bold mt-0.5">
                  {COMPLIANCE_CONFIG.contactEmailPlaceholder}
                </dd>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <dt className="font-bold text-slate-700">Organization / Chapter</dt>
                <dd className="font-mono text-slate-800 mt-0.5">
                  {COMPLIANCE_CONFIG.organizationPlaceholder} (Prompt Wars 2026 x SRM ACM Student
                  Chapter)
                </dd>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <dt className="font-bold text-slate-700">Mailing Address</dt>
                <dd className="font-mono text-slate-800 mt-0.5">
                  {COMPLIANCE_CONFIG.addressPlaceholder}
                </dd>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <dt className="font-bold text-slate-700">Project Author</dt>
                <dd className="font-semibold text-slate-900 mt-0.5">
                  {COMPLIANCE_CONFIG.authorName}
                </dd>
              </div>
            </dl>
          </section>

          <form
            onSubmit={handleContactSubmit}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4"
          >
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
              <label
                htmlFor="contact-subject"
                className="block text-xs font-bold text-slate-800 mb-1"
              >
                {c.contact.subjectLabel}
              </label>
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
              <label
                htmlFor="contact-email"
                className="block text-xs font-bold text-slate-800 mb-1"
              >
                {c.contact.emailLabel}
              </label>
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
              <label
                htmlFor="contact-message"
                className="block text-xs font-bold text-slate-800 mb-1"
              >
                {c.contact.messageLabel}
              </label>
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
      )}
    </main>
  );
}
