import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ScrollHero.css';
import { getPlatform } from '../hooks/usePlatform';

/* ── iOS assets ────────────────────────────────────────────── */
import appStoreIcon from '../assets/App Store Icon.svg';
import phoneHero from '../assets/iPhone Mockup Hero.png';
import phoneImg1 from '../assets/iPhone Mockup 1.png';
import phoneImg2 from '../assets/iPhone Mockup 2.png';
import phoneImg3 from '../assets/iPhone Mockup 3.png';

/* ── Android assets ────────────────────────────────────────── */
import googlePlayIcon from '../assets/Android /google_play.svg';
import androidHero from '../assets/Android /Android mockup.png';
import androidImg1 from '../assets/Android /Android Mockup 1.png';
import androidImg2 from '../assets/Android /Android Mockup 2.png';
import androidImg3 from '../assets/Android /Android Mockup 3.png';

gsap.registerPlugin(ScrollTrigger);

const platform = getPlatform();
const isAndroid = platform === 'android';

/* ── Step copy ─────────────────────────────────────────────── */
const STEPS = [
  { id: 1, lines: ['Choose', 'presets.'] },
  { id: 2, lines: ['Personalise', 'the song.'] },
  { id: 3, lines: ['Gift them', 'a song.'] },
];

const MOCKUP_IMAGES = isAndroid
  ? [androidHero, androidImg1, androidImg2, androidImg3]
  : [phoneHero, phoneImg1, phoneImg2, phoneImg3];

const ctaIcon = isAndroid ? googlePlayIcon : appStoreIcon;

export default function ScrollHero() {
  const containerRef = useRef<HTMLDivElement>(null);

  /* ── Text layer refs ──────────────────────────────────────── */
  const heroTextRef  = useRef<HTMLDivElement>(null);
  const textRefs     = useRef<(HTMLDivElement | null)[]>([]);

  /* ── Step indicator refs ──────────────────────────────────── */
  const indicatorRef = useRef<HTMLDivElement>(null);
  const dotRefs      = useRef<(HTMLDivElement | null)[]>([]);

  /* ── Mockup refs ──────────────────────────────────────────── */
  const mockupRefs   = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {

      /* ── Initial hidden states ──────────────────────────── */
      gsap.set(indicatorRef.current, { opacity: 0, y: -10 });
      textRefs.current.forEach(el => {
        if (el) gsap.set(el, { opacity: 0, y: 44, filter: 'blur(8px)' });
      });
      mockupRefs.current.slice(1).forEach(el => {
        if (el) gsap.set(el, { opacity: 0, scale: 0.97 });
      });

      /* ── Dot initial sizes ──────────────────────────────── */
      gsap.set(dotRefs.current[0], { width: 12, backgroundColor: '#2D2D2D' });
      gsap.set(dotRefs.current[1], { width: 4,  backgroundColor: '#C3C3C3' });
      gsap.set(dotRefs.current[2], { width: 4,  backgroundColor: '#C3C3C3' });

      /*
       *  Container: 400vh   →   scroll distance: 300vh
       *  Timeline duration: 8 units = 37.5vh per unit
       *
       *  0   (0vh):   hero headline holds
       *  2  (75vh):   hero exits / step 1 + indicator enter
       *  3 (112vh):   step 1 holds
       *  4 (150vh):   step 1 → step 2  (dot 0 → dot 1)
       *  5 (187vh):   step 2 holds
       *  6 (225vh):   step 2 → step 3  (dot 1 → dot 2)
       *  7 (262vh):   step 3 holds
       *  8 (300vh):   end
       */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.5,
        },
        defaults: { ease: 'power2.inOut' },
      });

      tl
        /* ── Hero headline exits ────────────────────────── */
        .to(heroTextRef.current, {
          opacity: 0, y: -44, filter: 'blur(8px)', duration: 0.8,
        }, 2)

        /* ── Step indicator fades in ────────────────────── */
        .to(indicatorRef.current, {
          opacity: 1, y: 0, duration: 0.5,
        }, 2.1)

        /* ── Step 1 enters ──────────────────────────────── */
        .to(textRefs.current[0], {
          opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8,
        }, 2.2)
        .to(mockupRefs.current[0], { opacity: 0, scale: 1.03, duration: 0.6 }, 2)
        .to(mockupRefs.current[1], { opacity: 1, scale: 1,    duration: 0.6 }, 2.3)

        /* ── Step 1 → Step 2 ────────────────────────────── */
        .to(textRefs.current[0], {
          opacity: 0, y: -44, filter: 'blur(8px)', duration: 0.7,
        }, 4)
        .to(textRefs.current[1], {
          opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7,
        }, 4.2)
        .to(dotRefs.current[0], { width: 4,  backgroundColor: '#C3C3C3', duration: 0.4 }, 4)
        .to(dotRefs.current[1], { width: 12, backgroundColor: '#2D2D2D', duration: 0.4 }, 4.2)
        .to(mockupRefs.current[1], { opacity: 0, scale: 1.03, duration: 0.6 }, 4)
        .to(mockupRefs.current[2], { opacity: 1, scale: 1,    duration: 0.6 }, 4.3)

        /* ── Step 2 → Step 3 ────────────────────────────── */
        .to(textRefs.current[1], {
          opacity: 0, y: -44, filter: 'blur(8px)', duration: 0.7,
        }, 6)
        .to(textRefs.current[2], {
          opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7,
        }, 6.2)
        .to(dotRefs.current[1], { width: 4,  backgroundColor: '#C3C3C3', duration: 0.4 }, 6)
        .to(dotRefs.current[2], { width: 12, backgroundColor: '#2D2D2D', duration: 0.4 }, 6.2)
        .to(mockupRefs.current[2], { opacity: 0, scale: 1.03, duration: 0.6 }, 6)
        .to(mockupRefs.current[3], { opacity: 1, scale: 1,    duration: 0.6 }, 6.3);

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="scroll-hero-container" ref={containerRef}>
      <div className="scroll-hero-sticky">

        {/* ── LEFT ──────────────────────────────────────────── */}
        <div className="scroll-hero-left">

          {/* All text layers stack here */}
          <div className="scroll-copy-area">

            <div className="scroll-steps-wrapper">
              {/* Layer 0: initial hero headline */}
              <div className="scroll-initial-headline" ref={heroTextRef}>
                <h1 className="scroll-initial-h1">
                  Make a song,<br />gift a song.
                </h1>
              </div>

              {/* Step indicator pill — hidden until steps begin */}
              <div className="step-indicator" ref={indicatorRef}>
                <div className="step-dot" ref={el => { dotRefs.current[0] = el; }} />
                <div className="step-dot" ref={el => { dotRefs.current[1] = el; }} />
                <div className="step-dot" ref={el => { dotRefs.current[2] = el; }} />
              </div>

              {/* Step copy blocks — stacked, all hidden initially */}
              {STEPS.map((step, i) => (
                <div
                  key={step.id}
                  className="scroll-step-text"
                  ref={el => { textRefs.current[i] = el; }}
                >
                  <h2 className="scroll-step-headline">
                    {step.lines[0]}<br />{step.lines[1]}
                  </h2>
                </div>
              ))}
            </div>

            {/* CTA — nested inside copy area so it aligns perfectly with the text */}
            <a
              href="#"
              className="scroll-hero-btn"
              id="scroll-get-app"
              aria-label="Get the Made Songs app"
            >
              <span className="scroll-hero-btn-text">Get the App</span>
              <img
                src={ctaIcon}
                alt=""
                className="scroll-hero-btn-icon"
                aria-hidden="true"
              />
            </a>

          </div>

        </div>

        {/* ── RIGHT: mockup stack ───────────────────────────── */}
        <div className="scroll-hero-right">
          <div className="scroll-mockup-stack">
            {MOCKUP_IMAGES.map((img, i) => (
              <div
                key={i}
                className="scroll-mockup-wrap"
                ref={el => { mockupRefs.current[i] = el; }}
              >
                <img
                  src={img}
                  alt={i === 0 ? `Made Songs Hero Mockup (${isAndroid ? 'Android' : 'iPhone'})` : `Made Songs Step ${i} Mockup`}
                  className="scroll-mockup-img"
                  draggable={false}
                  loading={i === 0 || i === 1 ? "eager" : "lazy"}
                  {...(i === 0 ? { fetchPriority: "high" } : {})}
                />
              </div>
            ))}
            <div className="scroll-mockup-shadow" />
          </div>
        </div>

      </div>
    </div>
  );
}
