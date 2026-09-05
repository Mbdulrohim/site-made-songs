/**
 * Web Audio Synthesizer for "Electric Chorus Jingle"
 * Generates an upbeat, soulful, warm electric chorus jingle chord progression & melody.
 */

class AudioSynthesizer {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private timer: number | null = null;
  private startTime = 0;
  private pauseOffset = 0;
  private gainNode: GainNode | null = null;
  private onTimeUpdateCallback: ((time: number, duration: number) => void) | null = null;
  private onEndedCallback: (() => void) | null = null;
  public readonly duration = 155; // 2 minutes 35 seconds

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(0.3, this.ctx.currentTime);
      this.gainNode.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
  }

  private playTone(freq: number, time: number, duration: number, type: OscillatorType = 'sine', volume = 0.15) {
    if (!this.ctx || !this.gainNode) return;
    const osc = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, time);

    // Chorus vibrato
    const vibrato = this.ctx.createOscillator();
    const vibratoGain = this.ctx.createGain();
    vibrato.frequency.setValueAtTime(4.5, time); // 4.5Hz
    vibratoGain.gain.setValueAtTime(2.5, time);
    vibrato.connect(osc.frequency);
    vibrato.start(time);
    vibrato.stop(time + duration);

    // Envelope
    noteGain.gain.setValueAtTime(0, time);
    noteGain.gain.linearRampToValueAtTime(volume, time + 0.05);
    noteGain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.connect(noteGain);
    noteGain.connect(this.gainNode);

    osc.start(time);
    osc.stop(time + duration);
  }

  // Harmonic chord pattern (Electric Chorus warm progression: Cmaj7 - Am7 - Fmaj7 - G7sus)
  private scheduleMusicLoop(fromOffset: number) {
    if (!this.ctx) return;

    const chords = [
      [261.63, 329.63, 392.00, 493.88], // Cmaj7
      [220.00, 261.63, 329.63, 392.00], // Am7
      [174.61, 220.00, 261.63, 329.63], // Fmaj7
      [196.00, 261.63, 293.66, 392.00], // G7sus
    ];

    const melodyNotes = [
      523.25, 659.25, 587.33, 493.88, 523.25, 392.00, 440.00, 523.25,
      587.33, 659.25, 783.99, 659.25, 587.33, 523.25, 440.00, 493.88
    ];

    const chordDuration = 3.0; // 3 seconds per chord = 12s per loop
    const loopDuration = chords.length * chordDuration;

    const now = this.ctx.currentTime;
    const loopIndexStart = Math.floor(fromOffset / loopDuration);

    // Schedule 16 bars ahead
    for (let l = loopIndexStart; l < loopIndexStart + 8; l++) {
      const loopStartTime = now + (l * loopDuration - fromOffset);
      if (loopStartTime + loopDuration < now) continue;

      chords.forEach((chord, cIdx) => {
        const chordTime = loopStartTime + cIdx * chordDuration;
        if (chordTime >= now - 0.1) {
          // Play Electric Chorus Pad
          chord.forEach((freq) => {
            this.playTone(freq, Math.max(now, chordTime), chordDuration * 0.95, 'triangle', 0.08);
            this.playTone(freq * 2, Math.max(now, chordTime + 0.02), chordDuration * 0.8, 'sine', 0.04);
          });

          // Play subtle bass note
          this.playTone(chord[0] / 2, Math.max(now, chordTime), chordDuration * 0.9, 'sine', 0.14);
        }
      });

      // Melody arpeggios
      melodyNotes.forEach((freq, mIdx) => {
        const noteTime = loopStartTime + mIdx * (loopDuration / melodyNotes.length);
        if (noteTime >= now - 0.1) {
          this.playTone(freq, Math.max(now, noteTime), 0.5, 'sine', 0.06);
          this.playTone(freq, Math.max(now, noteTime + 0.08), 0.35, 'triangle', 0.03);
        }
      });
    }
  }

  public play(fromTime = this.pauseOffset) {
    this.initContext();
    if (this.isPlaying) return;

    this.isPlaying = true;
    this.pauseOffset = fromTime;
    if (this.ctx) {
      this.startTime = this.ctx.currentTime - this.pauseOffset;
      this.scheduleMusicLoop(this.pauseOffset);
    }

    const tick = () => {
      if (!this.isPlaying || !this.ctx) return;
      const current = this.ctx.currentTime - this.startTime;

      if (current >= this.duration) {
        this.pause();
        this.pauseOffset = 0;
        this.onEndedCallback?.();
        return;
      }

      this.onTimeUpdateCallback?.(current, this.duration);
      this.timer = window.requestAnimationFrame(tick);
    };

    this.timer = window.requestAnimationFrame(tick);
  }

  public pause() {
    if (!this.isPlaying) return;
    this.isPlaying = false;
    if (this.timer) {
      window.cancelAnimationFrame(this.timer);
      this.timer = null;
    }
    if (this.ctx) {
      this.pauseOffset = this.ctx.currentTime - this.startTime;
    }
  }

  public seek(targetTime: number) {
    const wasPlaying = this.isPlaying;
    if (wasPlaying) {
      this.pause();
    }
    this.pauseOffset = Math.max(0, Math.min(this.duration, targetTime));
    this.onTimeUpdateCallback?.(this.pauseOffset, this.duration);
    if (wasPlaying) {
      this.play(this.pauseOffset);
    }
  }

  public onTimeUpdate(cb: (time: number, duration: number) => void) {
    this.onTimeUpdateCallback = cb;
  }

  public onEnded(cb: () => void) {
    this.onEndedCallback = cb;
  }

  public setVolume(vol: number) {
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(Math.max(0, Math.min(1, vol)) * 0.35, this.ctx.currentTime);
    }
  }

  public getCurrentTime(): number {
    if (this.isPlaying && this.ctx) {
      return this.ctx.currentTime - this.startTime;
    }
    return this.pauseOffset;
  }
}

export const playerSynth = new AudioSynthesizer();
