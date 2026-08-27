import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Play,
  Pause,
  Zap,
  Layers,
  User,
  Share2,
  ExternalLink,
  Download,
  Volume2,
  VolumeX,
} from 'lucide-react';
import GiftBagVisual from './GiftBagVisual';
import SaveSongModal from './SaveSongModal';
import albumArtImg from '../assets/album_art_landscape.jpg';
import { playerSynth } from '../utils/audioSynth';
import { getPlatform } from '../hooks/usePlatform';
import { getStoreUrl } from '../config/storeLinks';
import './GiftPlayer.css';

interface SongData {
  title: string;
  subtitle: string;
  genre: string;
  senderName: string;
  recipientName: string;
  note: string;
  albumArt: string;
  duration: number;
}

interface LyricLine {
  id: number;
  time: number;
  text: string;
}

const DEFAULT_LYRICS: LyricLine[] = [
  { id: 1, time: 0, text: "The city whispers secrets that it's only told to me," },
  { id: 2, time: 10, text: "And the stars are like old letters, drifting out across the sea." },
  { id: 3, time: 22, text: "I've been standing at the edge where fear and hope collide," },
  { id: 4, time: 35, text: "Fighting ghosts I built from echoes, but they never seem to hide." },
  { id: 5, time: 48, text: "Your voice is like a beacon pulling me through every storm," },
  { id: 6, time: 62, text: "And your touch becomes the fire that keeps my frozen soul warm." },
  { id: 7, time: 76, text: "We wrote melodies in rainstorms, chasing rhythms in the night," },
  { id: 8, time: 92, text: "Every heartbeat is a promise under neon summer light." },
  { id: 9, time: 108, text: "Now the music carries memories we will never let slip away," },
  { id: 10, time: 125, text: "In every note and chord, our story's here to stay." },
];

const DEFAULT_SONG: SongData = {
  title: 'Sample 1',
  subtitle: 'Electric Chorus Jingle',
  genre: 'Electric Pop',
  senderName: 'Reiss Tibby',
  recipientName: 'You',
  note: 'I made this custom song for you to capture our best moments.',
  albumArt: albumArtImg,
  duration: 155,
};

export default function GiftPlayer({ token }: { token?: string }) {
  const searchParams = useMemo(() => new URLSearchParams(window.location.search), []);

  const [currentScreen, setCurrentScreen] = useState<1 | 2 | 3>(() => {
    const s = searchParams.get('screen');
    if (s === '2') return 2;
    if (s === '3') return 3;
    return 1;
  });

  const [song] = useState<SongData>(() => ({
    title: searchParams.get('title') || DEFAULT_SONG.title,
    subtitle: searchParams.get('subtitle') || searchParams.get('genre') || DEFAULT_SONG.subtitle,
    genre: searchParams.get('genre') || DEFAULT_SONG.genre,
    senderName: searchParams.get('sender') || DEFAULT_SONG.senderName,
    recipientName: searchParams.get('recipient') || DEFAULT_SONG.recipientName,
    note: searchParams.get('note') || DEFAULT_SONG.note,
    albumArt: DEFAULT_SONG.albumArt,
    duration: DEFAULT_SONG.duration,
  }));

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeTab, setActiveTab] = useState<'lyrics' | 'layers' | 'user'>('lyrics');
  const [isMuted, setIsMuted] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);

  const lyricsContainerRef = useRef<HTMLDivElement>(null);
  const platform = useMemo(() => getPlatform(), []);
  const storeUrl = getStoreUrl(platform);
  const storeName = platform === 'android' ? 'Google Play' : 'App Store';

  // Load from API if token provided
  useEffect(() => {
    if (!token || token === 'preview') return;
    const fetchGift = async () => {
      try {
        const res = await fetch(`https://api.madesongs.com/api/gifts/public/${encodeURIComponent(token)}`);
        const data = await res.json();
        // setSong if needed
        void data;
      } catch {
        // graceful fallback
      }
    };
    void fetchGift();
  }, [token]);

  useEffect(() => {
    playerSynth.onTimeUpdate((time) => setCurrentTime(time));
    playerSynth.onEnded(() => {
      setIsPlaying(false);
      setCurrentTime(0);
    });
    return () => { playerSynth.pause(); };
  }, []);

  const activeLyricId = useMemo(() => {
    let id = DEFAULT_LYRICS[0].id;
    for (const line of DEFAULT_LYRICS) {
      if (currentTime >= line.time) id = line.id;
    }
    return id;
  }, [currentTime]);

  useEffect(() => {
    if (activeTab !== 'lyrics') return;
    const el = document.getElementById(`lyric-line-${activeLyricId}`);
    if (el && lyricsContainerRef.current) {
      const container = lyricsContainerRef.current;
      container.scrollTo({
        top: el.offsetTop - container.offsetTop - container.clientHeight / 2 + el.clientHeight / 2,
        behavior: 'smooth',
      });
    }
  }, [activeLyricId, activeTab]);

  const togglePlay = () => {
    if (isPlaying) {
      playerSynth.pause();
      setIsPlaying(false);
    } else {
      playerSynth.play(currentTime);
      setIsPlaying(true);
    }
  };

  const handleSeek = (time: number) => {
    setCurrentTime(time);
    playerSynth.seek(time);
  };

  const toggleMute = () => {
    playerSynth.setVolume(isMuted ? 1 : 0);
    setIsMuted(!isMuted);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: `${song.title} - Made Songs`, url: window.location.href }).catch(() => {});
    } else {
      void navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  const openInApp = () => {
    window.location.href = `madesongs://gift/${encodeURIComponent(token || 'preview')}`;
  };

  const radius = 106;
  const circumference = 2 * Math.PI * radius;
  const progressRatio = Math.min(1, Math.max(0, currentTime / song.duration));
  const strokeDashoffset = circumference - progressRatio * circumference;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="gp-app">
      {/* Atmospheric background */}
      <div className="gp-bg" aria-hidden="true">
        <div className="gp-bg-red" />
      </div>

      {/* ═══ SCREEN 1: GIFT TEASER ═══ */}
      {currentScreen === 1 && (
        <div className="gp-screen gp-s1">
          <div className="gp-s1-center">
            <GiftBagVisual size="lg" animate />
          </div>
          <div className="gp-bottom-action">
            <button className="gp-pill-btn" onClick={() => setCurrentScreen(2)} aria-label="Next">
              <ArrowRight size={24} strokeWidth={2.4} />
            </button>
          </div>
        </div>
      )}

      {/* ═══ SCREEN 2: GIFT REVEAL ═══ */}
      {currentScreen === 2 && (
        <div className="gp-screen gp-s2">
          <div className="gp-s2-body">
            <GiftBagVisual size="md" animate />
            <div className="gp-s2-text">
              <h1 className="gp-headline">YOU HAVE BEEN<br />GIFTED A SONG</h1>
              <div className="gp-subtext-group">
                <p className="gp-subtext-sender">
                  <span className="gp-sender">{song.senderName}</span> sent you a song,
                  <br />made just for you!
                </p>
                <p className="gp-subtext-action">
                  Click the button to listen to your song.
                </p>
              </div>
            </div>
          </div>
          <div className="gp-bottom-action">
            <button
              className="gp-pill-btn"
              onClick={() => {
                setCurrentScreen(3);
                setShowSaveModal(true);
              }}
              aria-label="Listen"
            >
              <ArrowRight size={24} strokeWidth={2.4} />
            </button>
          </div>
        </div>
      )}

      {/* ═══ SCREEN 3: PLAYER ═══ */}
      {currentScreen === 3 && (
        <div className="gp-screen gp-s3">
          {/* Top bar */}
          <div className="gp-topbar">
            <button className="gp-circle-btn" onClick={() => setCurrentScreen(2)} aria-label="Back">
              <ArrowLeft size={18} />
            </button>
            <div className="gp-track-meta">
              <h2 className="gp-track-title">{song.title}</h2>
              <p className="gp-track-sub">{song.subtitle}</p>
            </div>
            <button className="gp-circle-btn" onClick={() => handleSeek(0)} aria-label="Replay">
              <RotateCcw size={18} />
            </button>
          </div>

          {/* Vinyl + scrubber */}
          <div className="gp-vinyl-section">
            <div className={`gp-vinyl-wrap ${isPlaying ? 'spinning' : ''}`} onClick={togglePlay} role="button" tabIndex={0}>
              <svg className="gp-progress-ring" viewBox="0 0 230 230">
                <circle cx="115" cy="115" r={radius} className="gp-ring-bg" />
                <circle cx="115" cy="115" r={radius} className="gp-ring-fg" style={{ strokeDasharray: circumference, strokeDashoffset }} />
              </svg>
              <div className="gp-vinyl-disc">
                <div className="gp-groove g1" />
                <div className="gp-groove g2" />
                <div className="gp-groove g3" />
                <div className="gp-groove g4" />
                <div className="gp-vinyl-shine" />
                <div className="gp-vinyl-label">
                  <img src={song.albumArt} alt={song.title} />
                  <div className="gp-spindle" />
                </div>
              </div>
              <div className={`gp-play-overlay ${isPlaying ? 'playing' : ''}`}>
                {isPlaying ? <Pause size={22} /> : <Play size={22} className="shifted" />}
              </div>
            </div>
            <div className="gp-timeline">
              <span className="gp-time">{formatTime(currentTime)}</span>
              <input type="range" min={0} max={song.duration} step={0.5} value={currentTime} onChange={(e) => handleSeek(parseFloat(e.target.value))} className="gp-slider" />
              <span className="gp-time">{formatTime(song.duration)}</span>
            </div>
          </div>

          {/* Tab content */}
          <div className="gp-content">
            {activeTab === 'lyrics' && (
              <div className="gp-lyrics" ref={lyricsContainerRef}>
                {DEFAULT_LYRICS.map((line) => (
                  <p
                    key={line.id}
                    id={`lyric-line-${line.id}`}
                    className={`gp-lyric ${line.id === activeLyricId ? 'active' : ''}`}
                    onClick={() => handleSeek(line.time)}
                    role="button"
                    tabIndex={0}
                  >
                    {line.text}
                  </p>
                ))}
              </div>
            )}

            {activeTab === 'layers' && (
              <div className="gp-panel">
                <div className="gp-card">
                  <span className="gp-badge">Track Details</span>
                  <h3>{song.title}</h3>
                  <p className="gp-card-sub">{song.subtitle}</p>
                  <div className="gp-meta-grid">
                    <div><span className="gp-meta-label">Genre</span><span>{song.genre}</span></div>
                    <div><span className="gp-meta-label">Occasion</span><span>Special Gift</span></div>
                    <div><span className="gp-meta-label">Quality</span><span>24-bit Lossless</span></div>
                    <div><span className="gp-meta-label">Made With</span><span>Made Songs AI</span></div>
                  </div>
                  {song.note && (
                    <div className="gp-note">
                      <span className="gp-note-label">Sender's Note:</span>
                      <blockquote>"{song.note}"</blockquote>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'user' && (
              <div className="gp-panel">
                <div className="gp-card">
                  <div className="gp-avatar">🎁</div>
                  <h3>Gift from {song.senderName}</h3>
                  <p className="gp-card-sub">This song was exclusively created and gifted to you.</p>
                  <div className="gp-app-actions">
                    <button className="gp-btn-primary" onClick={openInApp}>
                      <ExternalLink size={18} /> Open in Made Songs
                    </button>
                    <a className="gp-btn-secondary" href={storeUrl} target="_blank" rel="noreferrer">
                      <Download size={18} /> Get on {storeName}
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom dock */}
          <div className="gp-dock">
            <div className="gp-dock-tabs">
              <div className={`gp-dock-indicator pos-${activeTab}`} />
              <button className={`gp-dock-btn ${activeTab === 'lyrics' ? 'active' : ''}`} onClick={() => setActiveTab('lyrics')}><Zap size={18} /></button>
              <button className={`gp-dock-btn ${activeTab === 'layers' ? 'active' : ''}`} onClick={() => setActiveTab('layers')}><Layers size={18} /></button>
              <button className={`gp-dock-btn ${activeTab === 'user' ? 'active' : ''}`} onClick={() => setActiveTab('user')}><User size={18} /></button>
            </div>
            <div className="gp-dock-actions">
              <button className="gp-action-btn" onClick={toggleMute}>{isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}</button>
              <button className="gp-action-btn" onClick={handleShare}><Share2 size={16} /></button>
            </div>
          </div>

          {copiedShare && <div className="gp-toast">Link copied!</div>}
        </div>
      )}

      {/* Modal shown before listening to the song */}
      <SaveSongModal
        isOpen={showSaveModal}
        onClose={() => {
          setShowSaveModal(false);
          if (!isPlaying) {
            playerSynth.play(currentTime);
            setIsPlaying(true);
          }
        }}
        onContinueWeb={() => {
          setShowSaveModal(false);
          if (!isPlaying) {
            playerSynth.play(currentTime);
            setIsPlaying(true);
          }
        }}
        token={token}
      />
    </div>
  );
}
