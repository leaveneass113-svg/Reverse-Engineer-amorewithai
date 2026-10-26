import { AUDIO_VOICES } from '../data/mockData.js';

class AudioService {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.currentUtterance = null;
    this.isPlaying = false;
    this.isPaused = false;
    this.currentVoiceId = 'Sophia';
    this.playbackRate = 1.0;
    this.subscribers = new Set();
    this.progressInterval = null;
    this.elapsedSeconds = 0;
    this.totalDurationEstimate = 120;
    this.activeSpeaker = 'Narrator';
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  notify(event, payload) {
    this.subscribers.forEach(fn => {
      try {
        fn(event, payload);
      } catch (err) {
        console.error(err);
      }
    });
  }

  getVoiceConfig(voiceId) {
    return AUDIO_VOICES.find(v => v.id === voiceId) || AUDIO_VOICES[0];
  }

  setPlaybackRate(rate) {
    this.playbackRate = rate;
    this.notify('rate:change', rate);
    if (this.isPlaying && !this.isPaused && this.currentText) {
      // restart with new rate
      const savedText = this.currentText;
      const savedSpeaker = this.activeSpeaker;
      this.stop();
      this.speakText(savedText, this.currentVoiceId, savedSpeaker);
    }
  }

  speakText(text, voiceId = 'Sophia', speaker = 'Narrator') {
    if (!this.synth) return;
    this.stop();

    this.currentText = text;
    this.currentVoiceId = voiceId;
    this.activeSpeaker = speaker;
    const voiceCfg = this.getVoiceConfig(voiceId);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = (voiceCfg.rate || 1.0) * this.playbackRate;
    utterance.pitch = voiceCfg.pitch || 1.0;

    // Try finding matching system voice
    const voices = this.synth.getVoices();
    if (voices.length > 0) {
      const preferred = voices.find(v => v.lang.startsWith('en') && (
        voiceCfg.gender === 'Female' ? v.name.includes('Female') || v.name.includes('Zira') || v.name.includes('Samantha') || v.name.includes('Victoria') :
        v.name.includes('Male') || v.name.includes('David') || v.name.includes('Daniel')
      ));
      if (preferred) utterance.voice = preferred;
    }

    utterance.onstart = () => {
      this.isPlaying = true;
      this.isPaused = false;
      this.elapsedSeconds = 0;
      this.totalDurationEstimate = Math.max(30, Math.ceil(text.split(' ').length / (2.5 * this.playbackRate)));
      this.startProgress();
      this.notify('play:start', { speaker: this.activeSpeaker, voice: voiceCfg });
    };

    utterance.onend = () => {
      this.isPlaying = false;
      this.isPaused = false;
      this.stopProgress();
      this.notify('play:end');
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e);
      this.isPlaying = false;
      this.isPaused = false;
      this.stopProgress();
      this.notify('play:error', e);
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  pause() {
    if (!this.synth) return;
    if (this.isPlaying && !this.isPaused) {
      this.synth.pause();
      this.isPaused = true;
      this.stopProgress();
      this.notify('play:pause');
    }
  }

  resume() {
    if (!this.synth) return;
    if (this.isPlaying && this.isPaused) {
      this.synth.resume();
      this.isPaused = false;
      this.startProgress();
      this.notify('play:resume');
    }
  }

  stop() {
    if (!this.synth) return;
    this.synth.cancel();
    this.isPlaying = false;
    this.isPaused = false;
    this.stopProgress();
    this.notify('play:stop');
  }

  startProgress() {
    this.stopProgress();
    this.progressInterval = setInterval(() => {
      if (this.isPlaying && !this.isPaused) {
        this.elapsedSeconds += 1;
        this.notify('progress', {
          current: this.elapsedSeconds,
          total: this.totalDurationEstimate,
          percent: Math.min(100, Math.round((this.elapsedSeconds / this.totalDurationEstimate) * 100))
        });
      }
    }, 1000);
  }

  stopProgress() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }
}

export const audioService = new AudioService();
