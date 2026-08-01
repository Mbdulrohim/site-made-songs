/**
 * Detects whether the user is on an Android device via the User-Agent string.
 * Returns 'android' | 'ios' so components can swap assets accordingly.
 */
export type Platform = 'android' | 'ios';

export function getPlatform(): Platform {
  if (typeof navigator === 'undefined') return 'ios'; // SSR fallback
  return /android/i.test(navigator.userAgent) ? 'android' : 'ios';
}
