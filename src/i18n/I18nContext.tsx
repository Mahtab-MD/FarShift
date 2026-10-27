import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, ThemeMode } from '../types/index.ts';
import { STORAGE_KEYS, TIME_CONSTANTS } from '../config/constants.ts';
import { TRANSLATIONS, Translations } from './translations.ts';
import {
  COMPLIANCE_TRANSLATIONS,
  ComplianceLocaleContent,
} from './complianceTranslations.ts';

interface I18nContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: ThemeMode;
  toggleTheme: () => void;
  t: Translations;
  c: ComplianceLocaleContent;
  speakText: (text: string) => void;
  isSpeaking: boolean;
  stopSpeaking: () => void;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

/**
 * Provides multi-language translations (EN, ES, HI), light/dark theme persistence, and text-to-speech synthesis.
 *
 * @param {{ children: React.ReactNode }} props - Provider children
 * @returns {React.ReactElement} Context provider element
 */
export function I18nProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.LANG) as Language;
      if (saved && (saved === 'en' || saved === 'es' || saved === 'hi')) return saved;
    }
    return 'en';
  });

  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME) as ThemeMode;
      if (saved === 'light' || saved === 'dark') return saved;
    }
    return 'light';
  });

  const [isSpeaking, setIsSpeaking] = useState(false);

  const setLanguage = (lang: Language): void => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.LANG, lang);
    }
  };

  const toggleTheme = (): void => {
    setThemeState((prev) => {
      const next: ThemeMode = prev === 'light' ? 'dark' : 'light';
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.THEME, next);
      }
      return next;
    });
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [theme]);

  const stopSpeaking = (): void => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const speakText = (text: string): void => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'es' ? 'es-ES' : language === 'hi' ? 'hi-IN' : 'en-US';
    utterance.rate = TIME_CONSTANTS.SPEECH_SYNTHESIS_RATE;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  const value: I18nContextValue = {
    language,
    setLanguage,
    theme,
    toggleTheme,
    t: TRANSLATIONS[language],
    c: COMPLIANCE_TRANSLATIONS[language],
    speakText,
    isSpeaking,
    stopSpeaking,
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

/**
 * Custom hook to access FairShift translations, theme controls, and speech synthesis.
 *
 * @returns {I18nContextValue} Active i18n and theme context value
 */
export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return ctx;
}
