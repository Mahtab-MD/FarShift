/**
 * Shared validation bounds, time constants, and browser storage keys for FairShift.
 * Centralizes all numeric thresholds and string literals to eliminate magic numbers.
 */

export const STORAGE_KEYS = {
  WORKERS: 'fairshift_workers_v1',
  SHIFTS: 'fairshift_shifts_v1',
  HAZARDS: 'fairshift_hazards_v1',
  FEEDBACK: 'fairshift_feedback_v1',
  SETTINGS: 'fairshift_settings_v1',
  LANG: 'fairshift_lang',
  THEME: 'fairshift_theme',
} as const;

export const DATA_UPDATED_EVENT = 'fairshift-data-updated';

export const GEO_BOUNDS = {
  MIN_LAT: -90,
  MAX_LAT: 90,
  MIN_LNG: -180,
  MAX_LNG: 180,
  MIN_RADIUS_METERS: 20,
  MAX_RADIUS_METERS: 10000,
  SIMULATED_LAT_OFFSET: 0.0002,
  SIMULATED_LNG_OFFSET: 0.0001,
  SIMULATED_ACCURACY_METERS: 18,
  DEFAULT_ACCURACY_FALLBACK_METERS: 15,
} as const;

export const VALIDATION_LIMITS = {
  MAX_SANITIZE_DEFAULT: 1000,
  MIN_CATEGORY_LEN: 2,
  MAX_CATEGORY_LEN: 120,
  MIN_DESCRIPTION_LEN: 5,
  MAX_DESCRIPTION_LEN: 1000,
  MAX_COMMENT_LEN: 800,
  MIN_SUBJECT_LEN: 3,
  MAX_SUBJECT_LEN: 120,
  MIN_INQUIRY_LEN: 10,
  MAX_EMAIL_LEN: 160,
  MIN_RATING: 1,
  MAX_RATING: 5,
} as const;

export const TIME_CONSTANTS = {
  MS_PER_SECOND: 1000,
  SECONDS_PER_MINUTE: 60,
  MINUTES_PER_HOUR: 60,
  MS_PER_MINUTE: 60000,
  MS_PER_HOUR: 3600000,
  MS_PER_DAY: 86400000,
  TIMER_INTERVAL_MS: 30000,
  GEOLOCATION_TIMEOUT_MS: 7000,
  GEOLOCATION_MAX_AGE_MS: 10000,
  DEMO_SHORT_SHIFT_THRESHOLD_MS: 60000,
  DEMO_FALLBACK_SHIFT_HOURS: 8.5,
  TREND_DAYS_COUNT: 7,
  SPEECH_SYNTHESIS_RATE: 0.95,
} as const;

export const FATIGUE_LIMITS = {
  MIN_DAILY_THRESHOLD_HOURS: 4,
  MAX_DAILY_THRESHOLD_HOURS: 20,
  MIN_REST_THRESHOLD_HOURS: 4,
  MAX_REST_THRESHOLD_HOURS: 24,
  CRITICAL_EXCESS_HOURS_DELTA: 2,
  CRITICAL_REST_DEFICIT_HOURS_DELTA: 3,
} as const;

export const SCROLL_THRESHOLDS = {
  COLLAPSE_SCROLL_Y: 24,
  EXPAND_SCROLL_Y: 8,
} as const;
