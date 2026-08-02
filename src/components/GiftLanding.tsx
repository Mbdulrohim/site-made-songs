import { useEffect, useMemo, useState } from 'react';
import { Download, ExternalLink, Gift, Music2, RefreshCw } from 'lucide-react';
import logoIcon from '../assets/Logo Icon.svg';
import { getPlatform } from '../hooks/usePlatform';
import './GiftLanding.css';

const API_URL = 'https://api.madesongs.com/api/gifts/public';
const APP_STORE_URL = 'https://apps.apple.com/app/id6784178507';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.madesongs.app';

interface GiftPreview {
  recipientName: string;
  note: string | null;
  cardColor: 'gold' | 'silver' | string;
  status: string;
  song: {
    title: string;
    genre: string;
    occasion: string;
    albumArt: string | null;
  } | null;
}

type ViewState =
  | { status: 'loading' }
  | { status: 'ready'; gift: GiftPreview }
  | { status: 'error'; message: string };

export default function GiftLanding({ token }: { token: string }) {
  const [state, setState] = useState<ViewState>({ status: 'loading' });
  const platform = useMemo(() => getPlatform(), []);
  const storeUrl = platform === 'android' ? PLAY_STORE_URL : APP_STORE_URL;
  const storeName = platform === 'android' ? 'Google Play' : 'App Store';

  const loadGift = async () => {
    setState({ status: 'loading' });
    if (import.meta.env.DEV && token === 'preview') {
      setState({
        status: 'ready',
        gift: {
          recipientName: 'Amara',
          note: 'I made this for every moment that feels like home.',
          cardColor: 'gold',
          status: 'sent',
          song: {
            title: 'Our Golden Days',
            genre: 'Afropop',
            occasion: 'Just because',
            albumArt: null,
          },
        },
      });
      return;
    }
    try {
      const response = await fetch(`${API_URL}/${encodeURIComponent(token)}`);
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.gift) {
        throw new Error(payload?.message || 'This gift link is no longer available.');
      }
      setState({ status: 'ready', gift: payload.gift });
    } catch (error) {
      setState({
        status: 'error',
        message: error instanceof Error ? error.message : 'We could not load this gift.',
      });
    }
  };

  useEffect(() => {
    void loadGift();
  }, [token]);

  const openApp = () => {
    window.location.href = `madesongs://gift/${encodeURIComponent(token)}`;
  };

  return (
    <main className="gift-page">
      <header className="gift-header">
        <a href="/" aria-label="Made Songs home">
          <img src={logoIcon} alt="Made Songs" className="gift-logo" />
        </a>
      </header>

      {state.status === 'loading' && (
        <section className="gift-status" aria-live="polite">
          <div className="gift-spinner" />
          <p>Opening your gift...</p>
        </section>
      )}

      {state.status === 'error' && (
        <section className="gift-status" aria-live="polite">
          <Gift size={42} strokeWidth={1.5} />
          <h1>We could not open this gift</h1>
          <p>{state.message}</p>
          <button className="gift-secondary-button" onClick={loadGift}>
            <RefreshCw size={18} />
            Try again
          </button>
        </section>
      )}

      {state.status === 'ready' && (
        <section className="gift-content">
          <div className={`gift-art gift-art-${state.gift.cardColor}`}>
            {state.gift.song?.albumArt ? (
              <img src={state.gift.song.albumArt} alt={`Cover for ${state.gift.song.title}`} />
            ) : (
              <Music2 size={68} strokeWidth={1.4} aria-hidden="true" />
            )}
          </div>

          <div className="gift-copy">
            <p className="gift-eyebrow">A song was made for</p>
            <h1>{state.gift.recipientName}</h1>
            {state.gift.song && (
              <p className="gift-song-title">{state.gift.song.title}</p>
            )}
            {state.gift.note && <blockquote>{state.gift.note}</blockquote>}
          </div>

          <div className="gift-actions">
            <button className="gift-primary-button" onClick={openApp}>
              <ExternalLink size={19} />
              Open in Made Songs
            </button>
            <a className="gift-secondary-button" href={storeUrl}>
              <Download size={19} />
              Get it on {storeName}
            </a>
          </div>

          <p className="gift-help">
            New to Made Songs? Install the app, sign in, then return to this link to add the song to your Gifts.
          </p>
        </section>
      )}
    </main>
  );
}
