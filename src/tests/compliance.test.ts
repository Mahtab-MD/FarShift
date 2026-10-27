import test from 'node:test';
import assert from 'node:assert/strict';
import { COMPLIANCE_CONFIG } from '../config/constants.ts';
import { COMPLIANCE_TRANSLATIONS } from '../i18n/complianceTranslations.ts';
import { validateContactInquiry } from '../lib/validators.ts';

test('COMPLIANCE_CONFIG contains required attribution, copyright, and explicit placeholders', () => {
  assert.equal(
    COMPLIANCE_CONFIG.attributionLine,
    'FairShift, built for UN SDG 8, Prompt Wars 2026 x SRM ACM Student Chapter.'
  );
  assert.equal(COMPLIANCE_CONFIG.copyrightYear, 2026);
  assert.equal(COMPLIANCE_CONFIG.authorName, 'Mahtab Mohammad');
  assert.equal(
    COMPLIANCE_CONFIG.demoDisclaimer,
    'Demonstration project. Not a production service.'
  );
  assert.equal(COMPLIANCE_CONFIG.contactEmailPlaceholder, '[CONTACT EMAIL]');
  assert.equal(COMPLIANCE_CONFIG.organizationPlaceholder, '[ORGANIZATION NAME]');
  assert.equal(COMPLIANCE_CONFIG.addressPlaceholder, '[MAILING ADDRESS]');
});

test('Privacy Policy translations (EN and HI) cover all 9 required sections and core disclosures', () => {
  const enPrivacy = COMPLIANCE_TRANSLATIONS.en.privacy;
  const hiPrivacy = COMPLIANCE_TRANSLATIONS.hi.privacy;

  assert.equal(enPrivacy.sections.length, 9);
  assert.equal(hiPrivacy.sections.length, 9);

  // Verify demonstration disclaimer and Last updated date exist in EN and HI
  assert.ok(
    COMPLIANCE_TRANSLATIONS.en.demoNoticeBanner.includes(
      'Demonstration project. Not a production service.'
    )
  );
  assert.ok(
    COMPLIANCE_TRANSLATIONS.hi.demoNoticeBanner.includes(
      'Demonstration project. Not a production service.'
    )
  );
  assert.ok(COMPLIANCE_TRANSLATIONS.en.lastUpdatedLabel.includes('2026'));
  assert.ok(COMPLIANCE_TRANSLATIONS.hi.lastUpdatedLabel.includes('2026'));

  // Verify key privacy facts in English policy text
  const fullEnPrivacyText = JSON.stringify(enPrivacy);
  assert.ok(fullEnPrivacyText.includes('GPS'));
  assert.ok(fullEnPrivacyText.includes('NO worker identifier'));
  assert.ok(fullEnPrivacyText.includes('VITE_SUPABASE_URL'));
  assert.ok(fullEnPrivacyText.includes('[CONTACT EMAIL]'));
});

test('Terms of Use translations cover hackathon scope, safety report non-misuse, warranty, and liability', () => {
  const enTerms = COMPLIANCE_TRANSLATIONS.en.terms;
  assert.ok(enTerms.sections.length >= 6);

  const fullTermsText = JSON.stringify(enTerms);
  assert.ok(fullTermsText.includes('Prompt Wars 2026 x SRM ACM Student Chapter'));
  assert.ok(fullTermsText.includes('Acceptable Use'));
  assert.ok(fullTermsText.includes('No Misuse of Safety Reports'));
  assert.ok(fullTermsText.includes('No Warranty'));
  assert.ok(fullTermsText.includes('Limitation of Liability'));
  assert.ok(fullTermsText.includes('[CONTACT EMAIL]'));
});

test('validateContactInquiry validates and sanitizes compliance/accessibility inquiries', () => {
  // Valid inquiry with optional email left blank
  const validNoEmail = validateContactInquiry({
    subject: 'Accessibility Feedback',
    message: 'The voice readout feature works well on Android Chrome.',
    replyEmail: '',
  });
  assert.equal(validNoEmail.isValid, true);

  // Valid inquiry with email
  const validWithEmail = validateContactInquiry({
    subject: 'Data Deletion Request',
    message: 'Please confirm how local storage shift logs are cleared.',
    replyEmail: 'worker@example.org',
  });
  assert.equal(validWithEmail.isValid, true);

  // Rejects short subject
  const shortSubject = validateContactInquiry({
    subject: 'Hi',
    message: 'Valid length message here.',
  });
  assert.equal(shortSubject.isValid, false);

  // Rejects short message
  const shortMsg = validateContactInquiry({
    subject: 'Privacy Question',
    message: 'Short',
  });
  assert.equal(shortMsg.isValid, false);

  // Rejects malformed email when non-empty
  const badEmail = validateContactInquiry({
    subject: 'Privacy Question',
    message: 'This is a valid inquiry message body.',
    replyEmail: 'not-an-email',
  });
  assert.equal(badEmail.isValid, false);
});
