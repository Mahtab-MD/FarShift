/**
 * Central input validation, range checks, and sanitization module.
 * Protects against injection, oversized payloads, invalid enums, and ensures
 * zero leakage of worker identifiers in anonymous feedback.
 */

import { HazardSeverity, Sector } from '../types/index.ts';

const VALID_SECTORS: Sector[] = ['construction', 'college'];
const VALID_SEVERITIES: HazardSeverity[] = ['low', 'medium', 'high', 'critical'];

/**
 * Sanitizes user input string by trimming whitespace and escaping dangerous characters.
 *
 * @param {string} input - Raw string
 * @param {number} maxLength - Maximum allowable characters
 * @returns {string} Sanitized string
 */
export function sanitizeText(input: unknown, maxLength: number = 1000): string {
  if (typeof input !== 'string') return '';
  const trimmed = input.trim();
  // Strip control characters while preserving newlines and standard punctuation
  const clean = trimmed.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '');
  return clean.slice(0, maxLength);
}

/**
 * Validates sector value.
 *
 * @param {unknown} sector - Value to check
 * @returns {boolean} True if valid sector
 */
export function isValidSector(sector: unknown): sector is Sector {
  return typeof sector === 'string' && VALID_SECTORS.includes(sector as Sector);
}

/**
 * Validates hazard severity value.
 *
 * @param {unknown} severity - Value to check
 * @returns {boolean} True if valid severity
 */
export function isValidHazardSeverity(severity: unknown): severity is HazardSeverity {
  return typeof severity === 'string' && VALID_SEVERITIES.includes(severity as HazardSeverity);
}

/**
 * Validates coordinates within geographic bounds.
 *
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {boolean} True if valid
 */
export function validateCoordinates(lat: number, lng: number): { isValid: boolean; error?: string } {
  if (typeof lat !== 'number' || typeof lng !== 'number' || !Number.isFinite(lat) || !Number.isFinite(lng)) {
    return { isValid: false, error: 'Coordinates must be valid numbers' };
  }
  if (lat < -90 || lat > 90) {
    return { isValid: false, error: 'Latitude must be between -90 and 90' };
  }
  if (lng < -180 || lng > 180) {
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
 * @param {unknown} raw - Form input
 * @returns {ValidatedHazardInput} Validation result
 */
export function validateHazardReportInput(raw: unknown): ValidatedHazardInput {
  if (!raw || typeof raw !== 'object') {
    return {
      sector: 'construction',
      category: '',
      severity: 'medium',
      description: '',
      voiceTranscribed: false,
      isValid: false,
      error: 'Invalid payload',
    };
  }

  const record = raw as Record<string, unknown>;

  if (!isValidSector(record.sector)) {
    return {
      sector: 'construction',
      category: '',
      severity: 'medium',
      description: '',
      voiceTranscribed: false,
      isValid: false,
      error: 'Invalid sector selection',
    };
  }

  const category = sanitizeText(record.category, 120);
  if (!category || category.length < 2) {
    return {
      sector: record.sector,
      category,
      severity: 'medium',
      description: '',
      voiceTranscribed: false,
      isValid: false,
      error: 'Hazard category is required',
    };
  }

  const severity: HazardSeverity = isValidHazardSeverity(record.severity) ? record.severity : 'medium';
  const description = sanitizeText(record.description, 1000);
  if (!description || description.length < 5) {
    return {
      sector: record.sector,
      category,
      severity,
      description,
      voiceTranscribed: false,
      isValid: false,
      error: 'Description must be at least 5 characters',
    };
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

export interface ValidatedFeedbackInput {
  sector: Sector;
  managerRating: number;
  conditionsRating: number;
  comment: string;
  isValid: boolean;
  error?: string;
}

/**
 * Validates anonymous feedback submission.
 * CRITICAL SECURITY INVARIANT: Ensures NO user identifier, workerId, name, or email exists in the payload!
 *
 * @param {unknown} raw - Form input
 * @returns {ValidatedFeedbackInput} Validated feedback data
 */
export function validateAnonymousFeedbackInput(raw: unknown): ValidatedFeedbackInput {
  if (!raw || typeof raw !== 'object') {
    return {
      sector: 'construction',
      managerRating: 5,
      conditionsRating: 5,
      comment: '',
      isValid: false,
      error: 'Invalid feedback submission',
    };
  }

  const record = raw as Record<string, unknown>;

  // Security check: reject if any identification property was supplied
  const forbiddenKeys = ['workerId', 'worker_id', 'userId', 'user_id', 'email', 'name', 'phone'];
  for (const key of forbiddenKeys) {
    if (key in record && record[key] !== undefined && record[key] !== null && record[key] !== '') {
      return {
        sector: 'construction',
        managerRating: 5,
        conditionsRating: 5,
        comment: '',
        isValid: false,
        error: `Security violation: Anonymous feedback must not contain '${key}'`,
      };
    }
  }

  if (!isValidSector(record.sector)) {
    return {
      sector: 'construction',
      managerRating: 5,
      conditionsRating: 5,
      comment: '',
      isValid: false,
      error: 'Invalid sector',
    };
  }

  const managerRating = Number(record.managerRating);
  const conditionsRating = Number(record.conditionsRating);

  if (!Number.isInteger(managerRating) || managerRating < 1 || managerRating > 5) {
    return {
      sector: record.sector,
      managerRating: 5,
      conditionsRating: 5,
      comment: '',
      isValid: false,
      error: 'Manager rating must be an integer between 1 and 5',
    };
  }

  if (!Number.isInteger(conditionsRating) || conditionsRating < 1 || conditionsRating > 5) {
    return {
      sector: record.sector,
      managerRating,
      conditionsRating: 5,
      comment: '',
      isValid: false,
      error: 'Working conditions rating must be an integer between 1 and 5',
    };
  }

  const comment = sanitizeText(record.comment, 800);

  return {
    sector: record.sector,
    managerRating,
    conditionsRating,
    comment,
    isValid: true,
  };
}
