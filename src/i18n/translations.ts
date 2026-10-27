/**
 * Multi-language UI translation registry for FairShift (English, Spanish, Hindi).
 */

import { Language } from '../types/index.ts';
import { EN_TRANSLATIONS } from './locales/en.ts';
import { ES_TRANSLATIONS } from './locales/es.ts';
import { HI_TRANSLATIONS } from './locales/hi.ts';

export interface Translations {
  appName: string;
  tagline: string;
  sdgGoal: string;
  roleWorker: string;
  roleAdmin: string;
  switchRole: string;
  sampleModeBadge: string;
  sectorConstruction: string;
  sectorCollege: string;
  switchSector: string;

  // Nav
  navShift: string;
  navPayslip: string;
  navSafety: string;
  navFeedback: string;
  navOverview: string;
  navHazards: string;
  navFatigue: string;
  navSentiment: string;
  navSettings: string;
  navAbout: string;

  // Shift Check-in / Out
  checkInTitle: string;
  checkOutTitle: string;
  checkInButton: string;
  checkOutButton: string;
  manualCheckInFallback: string;
  gpsActive: string;
  gpsError: string;
  distanceToSite: string;
  withinSite: string;
  outsideSite: string;
  lowAccuracyWarning: string;
  shiftInProgress: string;
  elapsedTime: string;
  manualFlag: string;
  standardHours: string;
  overtimeHours: string;

  // Payslip
  payslipTitle: string;
  grossPay: string;
  regularPay: string;
  overtimePay: string;
  deductions: string;
  netPay: string;
  hourlyRate: string;
  overtimeRate: string;
  itemizedSummary: string;
  printPayslip: string;

  // Safety
  safetyTitle: string;
  reportHazardButton: string;
  category: string;
  severity: string;
  description: string;
  voiceInput: string;
  listeningNow: string;
  stopListening: string;
  statusReported: string;
  statusInReview: string;
  statusResolved: string;
  myReports: string;

  // Feedback
  feedbackTitle: string;
  anonymousBanner: string;
  rateManager: string;
  rateConditions: string;
  optionalComment: string;
  submitFeedback: string;
  feedbackSubmittedNotice: string;

  // Accessibility / Audio / Mobile Menu
  readAloud: string;
  listenToSummary: string;
  openMenu: string;
  closeMenu: string;
  mobileMenuTitle: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: EN_TRANSLATIONS,
  es: ES_TRANSLATIONS,
  hi: HI_TRANSLATIONS,
};
