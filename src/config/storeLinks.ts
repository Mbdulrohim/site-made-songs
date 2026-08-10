import { getPlatform, type Platform } from '../hooks/usePlatform';

export const APP_STORE_URL = 'https://apps.apple.com/app/id6784178507';
export const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.madesongs.app';

export function getStoreUrl(platform: Platform = getPlatform()): string {
  return platform === 'android' ? PLAY_STORE_URL : APP_STORE_URL;
}
