import React, { useMemo } from 'react';
import { X } from 'lucide-react';
import appStoreIcon from '../assets/App Store Icon.svg';
import googlePlayIcon from '../assets/Android /google_play.svg';
import { getPlatform } from '../hooks/usePlatform';
import { getStoreUrl } from '../config/storeLinks';
import './SaveSongModal.css';

interface SaveSongModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinueWeb: () => void;
  token?: string;
}

export const SaveSongModal: React.FC<SaveSongModalProps> = ({
  isOpen,
  onClose,
  onContinueWeb,
  token,
}) => {
  const platform = useMemo(() => getPlatform(), []);
  const storeUrl = getStoreUrl(platform);
  const isAndroid = platform === 'android';
  const ctaIcon = isAndroid ? googlePlayIcon : appStoreIcon;
  const storeAlt = isAndroid ? 'Google Play' : 'App Store';

  if (!isOpen) return null;

  const handleGetApp = () => {
    // Attempt deep link then fall back to store
    const appUrl = `madesongs://gift/${encodeURIComponent(token || 'preview')}`;
    window.location.href = appUrl;
    setTimeout(() => {
      window.open(storeUrl, '_blank');
    }, 500);
  };

  return (
    <div className="save-modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="save-modal-backdrop" />

      <div className="save-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="save-modal-close" onClick={onClose} aria-label="Close modal">
          <X size={20} strokeWidth={2} />
        </button>

        {/* Frame 1000015337 */}
        <div className="save-modal-inner">
          {/* Frame 1000015335 */}
          <div className="save-modal-text-group">
            <h2 id="modal-title" className="save-modal-title">
              SAVE THIS SONG AS YOURS
            </h2>
            <p className="save-modal-sub">
              Download the app for better experience.
            </p>
          </div>

          {/* Frame 1000015117 - Get the app Button */}
          <div className="save-modal-actions">
            <a
              href={storeUrl}
              onClick={(e) => {
                e.preventDefault();
                handleGetApp();
              }}
              className="save-modal-get-app-btn"
              aria-label={`Get the app on ${storeAlt}`}
            >
              <span className="save-modal-btn-text">Get the app</span>
              <img
                src={ctaIcon}
                alt={storeAlt}
                className="save-modal-btn-icon"
              />
            </a>

            {/* Secondary Option: Listen on Web */}
            <button className="save-modal-web-btn" onClick={onContinueWeb}>
              Listen on web first
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaveSongModal;
