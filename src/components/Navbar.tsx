import './Navbar.css';
import logoMark from '../assets/Logo Mark.svg';
import appStoreIcon from '../assets/App Store Icon.svg';
import googlePlayIcon from '../assets/Android /google_play.svg';
import { getPlatform } from '../hooks/usePlatform';
import { getStoreUrl } from '../config/storeLinks';

const ctaIcon = getPlatform() === 'android' ? googlePlayIcon : appStoreIcon;
const storeUrl = getStoreUrl();

export default function Navbar() {
  return (
    <nav className="nav-wrap" aria-label="Main navigation">
      <div className="nav-pill">

        {/* Logo Mark (icon + wordmark in one SVG) */}
        <div className="nav-logo">
          <img src={logoMark} alt="Made Songs" className="nav-logo-mark" />
        </div>

        {/* Get the App CTA */}
        <a href={storeUrl} className="nav-cta" id="nav-get-app" aria-label="Get the Made Songs app">
          <span className="nav-cta-text">Get the App</span>
          <img src={ctaIcon} alt="" className="nav-cta-icon" aria-hidden="true" />
        </a>

      </div>
    </nav>
  );
}
