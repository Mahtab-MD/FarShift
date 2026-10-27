/**
 * Focused validators for anonymous worker feedback and compliance contact inquiries.
 * Enforces strict zero-identifier guarantees on anonymous feedback payloads.
 */

import { VALIDATION_LIMITS } from '../config/limits.ts';
import { Sector } from '../types/index.ts';
import { isValidSector, sanitizeText } from './validators.ts';

const FORBIDDEN_IDENTITY_KEYS = [
  'workerId',
  'worker_id',
  'userId',
  'user_id',
  'email',
  'name',
  'phone',
] as const;

export interface ValidatedFeedbackInput {
  sector: Sector;
  managerRating: number;
  conditionsRating: number;
  comment: string;
  isValid: boolean;
  error?: string;
}

/**
 * Checks whether an object contains any forbidden personal identifier fields.
 *
 * @param {Record<string, unknown>} record - Input payload object
 * @returns {string | null} Forbidden key name if found, otherwise null
 */
function findForbiddenIdentityKey(record: Record<string, unknown>): string | null {
  for (const key of FORBIDDEN_IDENTITY_KEYS) {
    if (key in record && record[key] !== undefined && record[key] !== null && record[key] !== '') {
      return key;
    }
  }
  return null;
}

/**
 * Validates whether a numeric rating is an integer within [MIN_RATING, MAX_RATING].
 *
 * @param {number} rating - Numeric rating
 * @returns {boolean} True if rating is a valid integer in [1, 5]
 */
function isValidStarRating(rating: number): boolean {
  return (
    Number.isInteger(rating) &&
    rating >= VALIDATION_LIMITS.MIN_RATING &&
    rating <= VALIDATION_LIMITS.MAX_RATING
  );
}

/**
 * Validates anonymous feedback submission.
 * CRITICAL SECURITY INVARIANT: Ensures NO user identifier, workerId, name, or email exists in the payload.
 *
 * @param {unknown} raw - Raw form input
 * @returns {ValidatedFeedbackInput} Validated feedback result
 */
export function validateAnonymousFeedbackInput(raw: unknown): ValidatedFeedbackInput {
  const defaultInvalid = (error: string, sector: Sector = 'construction'): ValidatedFeedbackInput => ({
    sector,
    managerRating: VALIDATION_LIMITS.MAX_RATING,
    conditionsRating: VALIDATION_LIMITS.MAX_RATING,
    comment: '',
    isValid: false,
    error,
  });

  if (!raw || typeof raw !== 'object') {
    return defaultInvalid('Invalid feedback submission');
  }

  const record = raw as Record<string, unknown>;
  const forbiddenKey = findForbiddenIdentityKey(record);
  if (forbiddenKey) {
    return defaultInvalid(
      `Security violation: Anonymous feedback must not contain '${forbiddenKey}'`
    );
  }

  if (!isValidSector(record.sector)) {
    return defaultInvalid('Invalid sector');
  }

  const managerRating = Number(record.managerRating);
  if (!isValidStarRating(managerRating)) {
    return defaultInvalid('Manager rating must be an integer between 1 and 5', record.sector);
  }

  const conditionsRating = Number(record.conditionsRating);
  if (!isValidStarRating(conditionsRating)) {
    return {
      ...defaultInvalid('Working conditions rating must be an integer between 1 and 5', record.sector),
      managerRating,
    };
  }

  return {
    sector: record.sector,
    managerRating,
    conditionsRating,
    comment: sanitizeText(record.comment, VALIDATION_LIMITS.MAX_COMMENT_LEN),
    isValid: true,
  };
}

export interface ValidatedContactInquiry {
  subject: string;
  message: string;
  replyEmail: string;
  isValid: boolean;
  error?: string;
}

/**
 * Validates and sanitizes a trust/compliance or accessibility contact inquiry.
 *
 * @param {unknown} raw - Raw inquiry input object
 * @returns {ValidatedContactInquiry} Validated and sanitized inquiry result
 */
export function validateContactInquiry(raw: unknown): ValidatedContactInquiry {
  if (!raw || typeof raw !== 'object') {
    return {
      subject: '',
      message: '',
      replyEmail: '',
      isValid: false,
      error: 'Invalid inquiry payload',
    };
  }

  const record = raw as Record<string, unknown>;
  const subject = sanitizeText(record.subject, VALIDATION_LIMITS.MAX_SUBJECT_LEN);
  const message = sanitizeText(record.message, VALIDATION_LIMITS.MAX_DESCRIPTION_LEN);
  const replyEmail = sanitizeText(record.replyEmail, VALIDATION_LIMITS.MAX_EMAIL_LEN);

  if (subject.length < VALIDATION_LIMITS.MIN_SUBJECT_LEN) {
    return {
      subject,
      message,
      replyEmail,
      isValid: false,
      error: 'Subject must be at least 3 characters',
    };
  }

  if (message.length < VALIDATION_LIMITS.MIN_INQUIRY_LEN) {
    return {
      subject,
      message,
      replyEmail,
      isValid: false,
      error: 'Message must be at least 10 characters',
    };
  }

  if (replyEmail.length > 0 && (!replyEmail.includes('@') || !replyEmail.includes('.'))) {
    return {
      subject,
      message,
      replyEmail,
      isValid: false,
      error: 'Please enter a valid email address or leave optional email blank',
    };
  }

  return {
    subject,
    message,
    replyEmail,
    isValid: true,
  };
}
