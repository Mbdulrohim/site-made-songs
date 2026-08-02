/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Navbar from './components/Navbar';
import ScrollHero from './components/ScrollHero';
import Footer from './components/Footer';
import GiftLanding from './components/GiftLanding';

export default function App() {
  const giftMatch = window.location.pathname.match(/^\/gift\/([^/]+)\/?$/);
  if (giftMatch) {
    return <GiftLanding token={decodeURIComponent(giftMatch[1])} />;
  }

  return (
    <div className="page">
      <Navbar />
      <ScrollHero />
      <Footer />
    </div>
  );
}
