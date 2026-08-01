import './Hero.css';
import appStoreIcon from '../assets/App Store Icon.svg';
import phoneImg from '../assets/iPhone Mockup Hero.png';
import googlePlayIcon from '../assets/Android /google_play.svg';
import androidPhoneImg from '../assets/Android /Android mockup.png';
import { getPlatform } from '../hooks/usePlatform';

const isAndroid = getPlatform() === 'android';
const ctaIcon = isAndroid ? googlePlayIcon : appStoreIcon;
const heroMockup = isAndroid ? androidPhoneImg : phoneImg;

export default function Hero() {
  return (
    <section className="hero" aria-label="Hero">

      {/* Left half: headline + CTA */}
      <div className="hero-left">
        <div className="hero-text-block">
          <h1 className="hero-headline">
            Make a song,<br />gift a song.
          </h1>

          <a href="#" className="hero-btn" id="hero-get-app" aria-label="Get the Made Songs app">
            <span className="hero-btn-text">Get the App</span>
            <img src={ctaIcon} alt="" className="hero-btn-icon" aria-hidden="true" />
          </a>
        </div>
      </div>

      {/* Right half: phone mockup */}
      <div className="hero-right">
        <img
          src={heroMockup}
          alt={`Made Songs app on ${isAndroid ? 'Android' : 'iPhone'}`}
          className="hero-mockup-img"
        />
      </div>

    </section>
  );
}
