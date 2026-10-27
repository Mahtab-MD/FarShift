/**
 * Central input validation, range checks, and sanitization module.
 * Protects against injection, oversized payloads, invalid enums, and ensures
 * zero leakage of worker identifiers in anonymous feedback.
 */

import { GEO_BOUNDS, VALIDATION_LIMITS } from '../config/limits.ts';
import { HazardSeverity, Sector } from '../types/index.ts';

const VALID_SECTORS: Sector[] = ['construction', 'college'];
const VALID_SEVERITIES: HazardSeverity[] = ['low', 'medium', 'high', 'critical'];

/**
 * Sanitizes user input string by trimming whitespace and stripping control characters.
 *
 * @param {unknown} input - Raw string value
 * @param {number} maxLength - Maximum allowable characters
 * @returns {string} Sanitized plain-text string
 */
export function sanitizeText(
  input: unknown,
  maxLength: number = VALIDATION_LIMITS.MAX_SANITIZE_DEFAULT
): string {
  if (typeof input !== 'string') return '';
  const trimmed = input.trim();
  const clean = trimmed.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '');
  return clean.slice(0, maxLength);
}

/**
 * Validates whether an unknown value is an allowed Sector enum value.
 *
 * @param {unknown} sector - Value to check
 * @returns {boolean} True if valid sector
 */
export function isValidSector(sector: unknown): sector is Sector {
  return typeof sector === 'string' && VALID_SECTORS.includes(sector as Sector);
}

/**
 * Validates whether an unknown value is an allowed HazardSeverity enum value.
 *
 * @param {unknown} severity - Value to check
 * @returns {boolean} True if valid hazard severity
 */
export function isValidHazardSeverity(severity: unknown): severity is HazardSeverity {
  return typeof severity === 'string' && VALID_SEVERITIES.includes(severity as HazardSeverity);
}

/**
 * Validates latitude and longitude coordinates within geographic bounds.
 *
 * @param {number} lat - Latitude in degrees
 * @param {number} lng - Longitude in degrees
 * @returns {{ isValid: boolean; error?: string }} Coordinate validation result
 */
export function validateCoordinates(
  lat: number,
  lng: number
): { isValid: boolean; error?: string } {
  if (
    typeof lat !== 'number' ||
    typeof lng !== 'number' ||
    !Number.isFinite(lat) ||
    !Number.isFinite(lng)
  ) {
    return { isValid: false, error: 'Coordinates must be valid numbers' };
  }
  if (lat < GEO_BOUNDS.MIN_LAT || lat > GEO_BOUNDS.MAX_LAT) {
    return { isValid: false, error: 'Latitude must be between -90 and 90' };
  }
  if (lng < GEO_BOUNDS.MIN_LNG || lng > GEO_BOUNDS.MAX_LNG) {
    return { isValid: false, error: 'Longitude must be between -180 and 180' };
  }
  return { isValid: true };
}

export interface ValidatedHazardInput {
  sector: Sector;
  category: string;
  severity: HazardSeverity;
  description: string;
  voiceTranscribed: boolean;
  isValid: boolean;
  error?: string;
}

/**
 * Validates a safety hazard report submission.
 *
 * @param {unknown} raw - Raw form input payload
 * @returns {ValidatedHazardInput} Validation result
 */
export function validateHazardReportInput(raw: unknown): ValidatedHazardInput {
  const invalidHazard = (
    error: string,
    sector: Sector = 'construction',
    category: string = '',
    severity: HazardSeverity = 'medium',
    description: string = ''
  ): ValidatedHazardInput => ({
    sector,
    category,
    severity,
    description,
    voiceTranscribed: false,
    isValid: false,
    error,
  });

  if (!raw || typeof raw !== 'object') {
    return invalidHazard('Invalid payload');
  }

  const record = raw as Record<string, unknown>;
  if (!isValidSector(record.sector)) {
    return invalidHazard('Invalid sector selection');
  }

  const category = sanitizeText(record.category, VALIDATION_LIMITS.MAX_CATEGORY_LEN);
  if (!category || category.length < VALIDATION_LIMITS.MIN_CATEGORY_LEN) {
    return invalidHazard('Hazard category is required', record.sector, category);
  }

  const severity: HazardSeverity = isValidHazardSeverity(record.severity)
    ? record.severity
    : 'medium';
  const description = sanitizeText(record.description, VALIDATION_LIMITS.MAX_DESCRIPTION_LEN);
  if (!description || description.length < VALIDATION_LIMITS.MIN_DESCRIPTION_LEN) {
    return invalidHazard(
      'Description must be at least 5 characters',
      record.sector,
      category,
      severity,
      description
    );
  }

  return {
    sector: record.sector,
    category,
    severity,
    description,
    voiceTranscribed: Boolean(record.voiceTranscribed),
    isValid: true,
  };
}

export {
  validateAnonymousFeedbackInput,
  validateContactInquiry,
  type ValidatedFeedbackInput,
  type ValidatedContactInquiry,
} from './contactValidator.ts';
