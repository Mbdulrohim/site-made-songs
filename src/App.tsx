/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Navbar from './components/Navbar';
import ScrollHero from './components/ScrollHero';
import Footer from './components/Footer';
import GiftLanding from './components/GiftLanding';
import GiftPlayer from './components/GiftPlayer';

export default function App() {
  const pathname = window.location.pathname;
  const searchParams = new URLSearchParams(window.location.search);
  const hostname = window.location.hostname;

  // Subdomain match: player.madesongs.com or player.localhost
  const isPlayerDomain = hostname.startsWith('player.') || hostname.includes('player.madesongs.com');

  // Player route matches
  const playerMatch = pathname.match(/^\/player(?:\/([^/]+))?\/?$/);
  const giftMatch = pathname.match(/^\/gift\/([^/]+)\/?$/);
  const shortMatch = pathname.match(/^\/p\/([^/]+)\/?$/);

  // If on player subdomain, or explicit /player route, or ?player=1 query param
  if (isPlayerDomain || playerMatch || searchParams.has('player')) {
    const token = playerMatch?.[1] || searchParams.get('token') || undefined;
    return <GiftPlayer token={token} />;
  }

  // If on /p/:token route
  if (shortMatch) {
    return <GiftPlayer token={decodeURIComponent(shortMatch[1])} />;
  }

  // If on /gift/:token route
  if (giftMatch) {
    const token = decodeURIComponent(giftMatch[1]);
    // Allow toggle to legacy landing if ?view=app or ?landing=true is requested
    if (searchParams.get('view') === 'landing' || searchParams.get('landing') === 'true') {
      return <GiftLanding token={token} />;
    }
    // Default to the 3-screen web player gift experience
    return <GiftPlayer token={token} />;
  }

  // Standard landing website
  return (
    <div className="page">
      <Navbar />
      <ScrollHero />
      <Footer />
    </div>
  );
}
