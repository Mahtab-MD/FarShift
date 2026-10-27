import React from 'react';
import {
  ShieldCheck,
  FileText,
  Cookie,
  Accessibility,
  Mail,
  ArrowLeft,
  AlertTriangle,
} from 'lucide-react';
import { CompliancePageId } from '../types/index.ts';
import { useI18n } from '../i18n/I18nContext.tsx';
import { AudioReadoutButton } from '../components/AudioReadoutButton.tsx';
import { PolicySection } from '../i18n/complianceTranslations.ts';
import {
  ContactComplianceSection,
  CookieStorageResetSection,
} from '../components/ComplianceSections.tsx';

interface ComplianceViewProps {
  page: Exclude<CompliancePageId, 'about'>;
  onBack: () => void;
  onNavigatePage: (page: CompliancePageId) => void;
}

/**
 * Renders the trust, privacy, terms, cookie/storage, accessibility, and contact compliance pages.
 *
 * @param {ComplianceViewProps} props - Component props
 * @returns {React.ReactElement} Rendered compliance page
 */
export function CompliancePages({
  page,
  onBack,
  onNavigatePage,
}: ComplianceViewProps): React.ReactElement {
  const { c } = useI18n();

  const renderPolicySections = (sections: PolicySection[]): React.ReactElement => (
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

      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-800 space-y-3">
        <div className="flex items-center gap-2.5 text-teal-400 text-xs font-bold uppercase tracking-wider">
          <Icon className="w-4 h-4" aria-hidden="true" />
          <span>Trust, Transparency & Compliance</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{pageMeta.title}</h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">{pageMeta.subtitle}</p>

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

      {page !== 'contact' && renderPolicySections(pageMeta.sections)}
      {page === 'cookies' && <CookieStorageResetSection c={c} />}
      {page === 'contact' && <ContactComplianceSection c={c} />}
    </main>
  );
}
