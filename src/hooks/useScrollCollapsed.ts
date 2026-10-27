import { useState, useEffect, useRef } from 'react';
import { SCROLL_THRESHOLDS } from '../config/constants.ts';

/**
 * Pure helper that computes the next collapsed state using hysteresis thresholds
 * to prevent layout flicker around the scroll boundary.
 *
 * @param {boolean} currentCollapsed - Whether the header is currently collapsed
 * @param {number} scrollY - Current vertical scroll offset in pixels
 * @param {number} [collapseThreshold=24] - Scroll Y threshold above which the header collapses
 * @param {number} [expandThreshold=8] - Scroll Y threshold below which the header expands
 * @returns {boolean} Next collapsed state
 */
export function computeNextCollapsedState(
  currentCollapsed: boolean,
  scrollY: number,
  collapseThreshold: number = SCROLL_THRESHOLDS.COLLAPSE_SCROLL_Y,
  expandThreshold: number = SCROLL_THRESHOLDS.EXPAND_SCROLL_Y
): boolean {
  const safeScrollY = Number.isFinite(scrollY) ? Math.max(0, scrollY) : 0;
  if (!currentCollapsed && safeScrollY > collapseThreshold) {
    return true;
  }
  if (currentCollapsed && safeScrollY < expandThreshold) {
    return false;
  }
  return currentCollapsed;
}

/**
 * Custom React hook that tracks window scroll position using a passive scroll listener
 * throttled with requestAnimationFrame and hysteresis thresholds (collapse > 24px, expand < 8px).
 *
 * @param {number} [collapseThreshold=24] - Scroll Y in pixels to trigger collapse
 * @param {number} [expandThreshold=8] - Scroll Y in pixels to restore expanded state
 * @returns {boolean} True when the mobile header should be in its compact collapsed state
 */
export function useScrollCollapsed(
  collapseThreshold: number = SCROLL_THRESHOLDS.COLLAPSE_SCROLL_Y,
  expandThreshold: number = SCROLL_THRESHOLDS.EXPAND_SCROLL_Y
): boolean {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return computeNextCollapsedState(false, window.scrollY, collapseThreshold, expandThreshold);
  });

  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const updateScrollState = (): void => {
      rafIdRef.current = null;
      const currentScrollY = window.scrollY;
      setIsCollapsed((prev) =>
        computeNextCollapsedState(prev, currentScrollY, collapseThreshold, expandThreshold)
      );
    };

    const handleScroll = (): void => {
      if (rafIdRef.current !== null) return;
      if (typeof window.requestAnimationFrame === 'function') {
        rafIdRef.current = window.requestAnimationFrame(updateScrollState);
      } else {
        updateScrollState();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafIdRef.current !== null && typeof window.cancelAnimationFrame === 'function') {
        window.cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [collapseThreshold, expandThreshold]);

  return isCollapsed;
}
