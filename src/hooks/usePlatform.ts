/**
 * Detects whether the user is on an Android or Apple (iOS / macOS / iPhone / Mac) device.
 * Returns 'android' | 'ios' so components can swap icons and store links accordingly.
 * Supports '?platform=android' or '?platform=ios' query param override for testing.
 */
export type Platform = 'android' | 'ios';

export function getPlatform(): Platform {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return 'ios';

  // Allow query param override for easy testing
  try {
    const params = new URLSearchParams(window.location.search);
    const p = params.get('platform')?.toLowerCase();
    if (p === 'android') return 'android';
    if (p === 'ios' || p === 'apple' || p === 'mac' || p === 'iphone') return 'ios';
  } catch {
    // Ignore URL parsing errors
  }

  const ua = navigator.userAgent || navigator.vendor || '';

  // Android detection
  if (/android/i.test(ua)) {
    return 'android';
  }

  // Apple / iPhone / iPad / iPod / Mac / default
  return 'ios';
}
