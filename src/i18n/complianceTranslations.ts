/**
 * Trust, Privacy, Terms, Cookie, Accessibility, and Contact translation registry.
 */

import { Language } from '../types/index.ts';
import { EN_COMPLIANCE } from './locales/en.ts';
import { ES_COMPLIANCE } from './locales/es.ts';
import { HI_COMPLIANCE } from './locales/hi.ts';

export interface PolicySection {
  heading: string;
  body: string;
  bullets?: string[];
}

export interface ComplianceLocaleContent {
  footerAbout: string;
  footerPrivacy: string;
  footerTerms: string;
  footerCookies: string;
  footerAccessibility: string;
  footerContact: string;
  themeLight: string;
  themeDark: string;
  toggleThemeLabel: string;
  demoNoticeBanner: string;
  lastUpdatedLabel: string;
  backToApp: string;

  privacy: {
    title: string;
    subtitle: string;
    sections: PolicySection[];
  };

  terms: {
    title: string;
    subtitle: string;
    sections: PolicySection[];
  };

  cookies: {
    title: string;
    subtitle: string;
    clearStorageBtn: string;
    clearedSuccessMsg: string;
    sections: PolicySection[];
  };

  accessibility: {
    title: string;
    subtitle: string;
    sections: PolicySection[];
  };

  contact: {
    title: string;
    subtitle: string;
    formTitle: string;
    subjectLabel: string;
    emailLabel: string;
    messageLabel: string;
    submitBtn: string;
    successNotice: string;
  };
}

export const COMPLIANCE_TRANSLATIONS: Record<Language, ComplianceLocaleContent> = {
  en: EN_COMPLIANCE,
  hi: HI_COMPLIANCE,
  es: ES_COMPLIANCE,
};
