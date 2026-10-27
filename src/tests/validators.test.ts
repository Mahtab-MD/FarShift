import test from 'node:test';
import assert from 'node:assert/strict';
import {
  sanitizeText,
  validateCoordinates,
  validateHazardReportInput,
  validateAnonymousFeedbackInput,
} from '../lib/validators.ts';

test('sanitizeText strips dangerous control characters and enforces length bounds', () => {
  const dirty = 'Hello\u0000World\u0007!  ';
  const clean = sanitizeText(dirty, 50);
  assert.equal(clean, 'HelloWorld!');

  const oversized = 'a'.repeat(200);
  assert.equal(sanitizeText(oversized, 10).length, 10);
});

test('validateCoordinates checks valid latitudes and longitudes', () => {
  assert.equal(validateCoordinates(37.77, -122.41).isValid, true);
  assert.equal(validateCoordinates(95, -122.41).isValid, false);
  assert.equal(validateCoordinates(37.77, 190).isValid, false);
  assert.equal(validateCoordinates(NaN, 0).isValid, false);
});

test('validateHazardReportInput validates categories, severity, and length', () => {
  const valid = validateHazardReportInput({
    sector: 'construction',
    category: 'Scaffolding & Heights',
    severity: 'high',
    description: 'Loose plank on 4th floor scaffold',
    voiceTranscribed: false,
  });
  assert.equal(valid.isValid, true);

  const tooShort = validateHazardReportInput({
    sector: 'construction',
    category: 'Scaffolding',
    severity: 'high',
    description: 'oops',
  });
  assert.equal(tooShort.isValid, false);
});

test('validateAnonymousFeedbackInput rejects ANY worker/user identification', () => {
  // CRITICAL SECURITY REQUIREMENT: Anonymous feedback must never contain identity
  const withWorkerId = {
    sector: 'construction',
    managerRating: 4,
    conditionsRating: 5,
    comment: 'Great work environment',
    workerId: 'w-c1',
  };
  const result1 = validateAnonymousFeedbackInput(withWorkerId);
  assert.equal(result1.isValid, false);
  assert.ok(result1.error?.includes('Security violation'));

  const withEmail = {
    sector: 'college',
    managerRating: 3,
    conditionsRating: 3,
    email: 'worker@site.org',
  };
  const result2 = validateAnonymousFeedbackInput(withEmail);
  assert.equal(result2.isValid, false);

  // Pure anonymous feedback passes
  const validPure = {
    sector: 'construction',
    managerRating: 4,
    conditionsRating: 5,
    comment: 'Hydration breaks are well managed today.',
  };
  const result3 = validateAnonymousFeedbackInput(validPure);
  assert.equal(result3.isValid, true);
});
