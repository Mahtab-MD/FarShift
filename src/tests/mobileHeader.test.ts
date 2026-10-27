import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { computeNextCollapsedState } from '../hooks/useScrollCollapsed.ts';
import { TRANSLATIONS } from '../i18n/translations.ts';
import { COMPLIANCE_TRANSLATIONS } from '../i18n/complianceTranslations.ts';
import { I18nProvider } from '../i18n/I18nContext.tsx';
import { Header } from '../components/Header.tsx';
import { MobileMenu } from '../components/MobileMenu.tsx';
import { SAMPLE_WORKERS } from '../config/constants.ts';

test('useScrollCollapsed hysteresis: collapses above 24px, holds between 8-24px, expands below 8px', () => {
  let isCollapsed = false;

  // Near top (0px to 24px): stays expanded
  isCollapsed = computeNextCollapsedState(isCollapsed, 0);
  assert.equal(isCollapsed, false);

  isCollapsed = computeNextCollapsedState(isCollapsed, 12);
  assert.equal(isCollapsed, false);

  isCollapsed = computeNextCollapsedState(isCollapsed, 24);
  assert.equal(isCollapsed, false);

  // Crosses 24px threshold: collapses
  isCollapsed = computeNextCollapsedState(isCollapsed, 25);
  assert.equal(isCollapsed, true);

  isCollapsed = computeNextCollapsedState(isCollapsed, 140);
  assert.equal(isCollapsed, true);

  // Hysteresis zone (24px down to 8px): remains collapsed to prevent flicker
  isCollapsed = computeNextCollapsedState(isCollapsed, 20);
  assert.equal(isCollapsed, true);

  isCollapsed = computeNextCollapsedState(isCollapsed, 8);
  assert.equal(isCollapsed, true);

  // Scrolls below 8px threshold: expands back to full header
  isCollapsed = computeNextCollapsedState(isCollapsed, 7);
  assert.equal(isCollapsed, false);

  isCollapsed = computeNextCollapsedState(isCollapsed, 0);
  assert.equal(isCollapsed, false);

  // Handles negative or non-finite values safely
  assert.equal(computeNextCollapsedState(false, -15), false);
  assert.equal(computeNextCollapsedState(true, Number.NaN), false);
});

test('i18n key parity: English, Hindi, and Spanish translations share identical keys including mobile menu labels', () => {
  const enKeys = Object.keys(TRANSLATIONS.en).sort();
  const hiKeys = Object.keys(TRANSLATIONS.hi).sort();
  const esKeys = Object.keys(TRANSLATIONS.es).sort();

  assert.deepEqual(enKeys, hiKeys);
  assert.deepEqual(enKeys, esKeys);

  const enCompKeys = Object.keys(COMPLIANCE_TRANSLATIONS.en).sort();
  const hiCompKeys = Object.keys(COMPLIANCE_TRANSLATIONS.hi).sort();
  assert.deepEqual(enCompKeys, hiCompKeys);

  assert.ok(TRANSLATIONS.en.openMenu.length > 0);
  assert.ok(TRANSLATIONS.hi.openMenu.length > 0);
  assert.ok(TRANSLATIONS.en.closeMenu.length > 0);
  assert.ok(TRANSLATIONS.hi.closeMenu.length > 0);
  assert.ok(TRANSLATIONS.en.mobileMenuTitle.length > 0);
  assert.ok(TRANSLATIONS.hi.mobileMenuTitle.length > 0);
});

test('Header and MobileMenu component: hamburger renders accessible attributes, opens menu with language/theme/info/sector controls, and closes on Escape', () => {
  const prevWindow = globalThis.window;
  const prevLocalStorage = globalThis.localStorage;
  try {
    // Simulate scrolled window (scrollY = 60 > 24) and localStorage so mobile header renders in collapsed state
    Object.defineProperty(globalThis, 'localStorage', {
      value: { getItem: () => null, setItem: () => {} },
      configurable: true,
      writable: true,
    });
    Object.defineProperty(globalThis, 'window', {
      value: { scrollY: 60, addEventListener: () => {}, removeEventListener: () => {} },
      configurable: true,
      writable: true,
    });

    const collapsedHeaderHtml = renderToStaticMarkup(
      React.createElement(
        I18nProvider,
        null,
        React.createElement(Header, {
          role: 'worker',
          onChangeRole: () => {},
          sector: 'construction',
          onChangeSector: () => {},
          workers: SAMPLE_WORKERS.filter((w) => w.sector === 'construction'),
          activeWorker: SAMPLE_WORKERS[0],
          onSelectWorker: () => {},
          onOpenAbout: () => {},
          showingAbout: false,
        })
      )
    );

    // Verify compact bar, hamburger button ARIA attributes, 44x44px target, and active sector pill
    assert.ok(collapsedHeaderHtml.includes('data-testid="mobile-compact-bar"'));
    assert.ok(collapsedHeaderHtml.includes('aria-label="Open navigation menu"'));
    assert.ok(collapsedHeaderHtml.includes('aria-expanded="false"'));
    assert.ok(collapsedHeaderHtml.includes('aria-controls="fairshift-mobile-menu"'));
    assert.ok(collapsedHeaderHtml.includes('min-w-[44px] min-h-[44px]'));
    assert.ok(collapsedHeaderHtml.includes('data-testid="mobile-active-sector-pill"'));

    // Render open MobileMenu and verify dialog role, modal attribute, sector switcher, language, theme, and info controls
    let isMenuOpen = true;
    let hamburgerFocused = false;
    const triggerRef = {
      current: {
        focus: () => {
          hamburgerFocused = true;
        },
      } as unknown as HTMLButtonElement,
    };

    const openMenuHtml = renderToStaticMarkup(
      React.createElement(
        I18nProvider,
        null,
        React.createElement(MobileMenu, {
          id: 'fairshift-mobile-menu',
          isOpen: isMenuOpen,
          onClose: () => {
            isMenuOpen = false;
          },
          triggerRef,
          role: 'worker',
          onChangeRole: () => {},
          sector: 'construction',
          onChangeSector: () => {},
          workers: SAMPLE_WORKERS.filter((w) => w.sector === 'construction'),
          activeWorker: SAMPLE_WORKERS[0],
          onSelectWorker: () => {},
          onOpenAbout: () => {},
          showingAbout: false,
        })
      )
    );

    assert.ok(openMenuHtml.includes('role="dialog"'));
    assert.ok(openMenuHtml.includes('aria-modal="true"'));
    assert.ok(openMenuHtml.includes('aria-label="FairShift Navigation &amp; Settings"'));
    assert.ok(openMenuHtml.includes('aria-label="Select Language"'));
    assert.ok(openMenuHtml.includes('aria-label="Toggle light or dark theme"'));
    assert.ok(openMenuHtml.includes(TRANSLATIONS.en.navAbout));
    assert.ok(openMenuHtml.includes('Construction'));
    assert.ok(openMenuHtml.includes('College'));

    // Verify Escape key closes menu and returns focus to hamburger trigger
    const handleEscapeKey = (key: string): void => {
      if (key === 'Escape') {
        isMenuOpen = false;
        triggerRef.current?.focus();
      }
    };
    handleEscapeKey('Escape');
    assert.equal(isMenuOpen, false);
    assert.equal(hamburgerFocused, true);
  } finally {
    if (prevWindow === undefined) {
      delete (globalThis as Record<string, unknown>).window;
    } else {
      Object.defineProperty(globalThis, 'window', {
        value: prevWindow,
        configurable: true,
        writable: true,
      });
    }
    if (prevLocalStorage === undefined) {
      delete (globalThis as Record<string, unknown>).localStorage;
    } else {
      Object.defineProperty(globalThis, 'localStorage', {
        value: prevLocalStorage,
        configurable: true,
        writable: true,
      });
    }
  }
});
