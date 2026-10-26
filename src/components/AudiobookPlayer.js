import { audioService } from '../services/audioService.js';
import { store } from '../services/store.js';

export class AudiobookPlayer {
  constructor(container) {
    this.container = container;
    this.isPlaying = false;
    this.isPaused = false;
    this.currentStory = store.getStories()[0];
    this.currentSpeaker = 'Elena Vance';
    this.currentVoice = 'Sophia';
    this.currentTime = '0:00';
    this.totalTime = '3:15';
    this.progressPercent = 0;
    this.speed = 1.0;

    audioService.subscribe((event, data) => {
      if (event === 'play:start') {
        this.isPlaying = true;
        this.isPaused = false;
        if (data?.speaker) this.currentSpeaker = data.speaker;
        this.updatePlayState();
      } else if (event === 'play:pause') {
        this.isPaused = true;
        this.updatePlayState();
      } else if (event === 'play:resume') {
        this.isPaused = false;
        this.updatePlayState();
      } else if (event === 'play:stop' || event === 'play:end') {
        this.isPlaying = false;
        this.isPaused = false;
        this.progressPercent = 0;
        this.updatePlayState();
      } else if (event === 'progress') {
        this.progressPercent = data.percent;
        this.currentTime = this.formatTime(data.current);
        this.totalTime = this.formatTime(data.total);
        this.updateProgress();
      }
    });

    this.render();
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  cycleSpeed() {
    const speeds = [1.0, 1.25, 1.5, 0.85];
    const nextIndex = (speeds.indexOf(this.speed) + 1) % speeds.length;
    this.speed = speeds[nextIndex];
    audioService.setPlaybackRate(this.speed);
    const btn = this.container.querySelector('#btn-audio-speed');
    if (btn) btn.textContent = `${this.speed}x`;
  }

  togglePlay() {
    if (this.isPlaying && !this.isPaused) {
      audioService.pause();
    } else if (this.isPlaying && this.isPaused) {
      audioService.resume();
    } else {
      // Start reading chapter 1 of current story
      const story = store.getStories()[0];
      if (story?.chapters?.[0]) {
        const text = `${story.title}. Chapter 1: ${story.chapters[0].title}. ${story.chapters[0].paragraphs.join(' ')}`;
        audioService.speakText(text, 'Sophia', story.characters?.[0] || 'Narrator');
      }
    }
  }

  updatePlayState() {
    const btn = this.container.querySelector('#btn-play-pause-icon');
    const speakerLabel = this.container.querySelector('#audio-speaker-label');
    const waveBars = this.container.querySelectorAll('.soundwave-bar');

    if (btn) {
      btn.textContent = (this.isPlaying && !this.isPaused) ? '⏸' : '▶';
    }

    if (speakerLabel) {
      speakerLabel.textContent = `🎙️ ${this.currentSpeaker} (${this.currentVoice})`;
    }

    waveBars.forEach(b => {
      if (this.isPlaying && !this.isPaused) {
        b.classList.add('playing');
      } else {
        b.classList.remove('playing');
      }
    });
  }

  updateProgress() {
    const fill = this.container.querySelector('#audio-progress-fill');
    const curTimeEl = this.container.querySelector('#audio-time-current');
    const totTimeEl = this.container.querySelector('#audio-time-total');

    if (fill) fill.style.width = `${this.progressPercent}%`;
    if (curTimeEl) curTimeEl.textContent = this.currentTime;
    if (totTimeEl) totTimeEl.textContent = this.totalTime;
  }

  render() {
    this.container.innerHTML = `
      <div class="audio-player-bar" id="audio-player-bar">
        <div class="audio-track-info">
          <div class="audio-track-cover">
            <img src="${this.currentStory?.cover || '/assets/story_cover_midnight.jpg'}" alt="Cover">
          </div>
          <div class="audio-track-text">
            <h4>${this.currentStory?.title ? this.currentStory.title.split(':')[0] : 'Midnight Whispers'}</h4>
            <div class="audio-track-speaker" id="audio-speaker-label">
              <span>🎙️</span>
              <span>${this.currentSpeaker} (${this.currentVoice})</span>
            </div>
          </div>
        </div>

        <div class="audio-center-controls">
          <div class="audio-button-row">
            <button class="audio-btn" id="btn-audio-rw" title="Rewind 10 seconds" style="font-size: 1.1rem;">⏮</button>
            <button class="audio-btn btn-play-pause" id="btn-audio-toggle" title="Play / Pause">
              <span id="btn-play-pause-icon" style="font-size: 1.15rem; margin-left: 2px;">▶</span>
            </button>
            <button class="audio-btn" id="btn-audio-ff" title="Forward 10 seconds" style="font-size: 1.1rem;">⏭</button>
          </div>

          <div class="audio-scrubber-row">
            <span class="audio-time" id="audio-time-current">${this.currentTime}</span>
            <div class="audio-progress-bar" id="audio-progress-bar">
              <div class="audio-progress-fill" id="audio-progress-fill" style="width: ${this.progressPercent}%">
                <span class="audio-progress-thumb"></span>
              </div>
            </div>
            <span class="audio-time" id="audio-time-total">${this.totalTime}</span>
          </div>
        </div>

        <div class="audio-right-tools">
          <div class="soundwave-box" title="Audio narration frequency">
            <span class="soundwave-bar"></span>
            <span class="soundwave-bar"></span>
            <span class="soundwave-bar"></span>
            <span class="soundwave-bar"></span>
          </div>
          <button class="rate-badge" id="btn-audio-speed" title="Adjust playback rate">${this.speed}x</button>
        </div>
      </div>
    `;

    // Attach listeners
    this.container.querySelector('#btn-audio-toggle')?.addEventListener('click', () => this.togglePlay());
    this.container.querySelector('#btn-audio-speed')?.addEventListener('click', () => this.cycleSpeed());
    this.container.querySelector('#btn-audio-rw')?.addEventListener('click', () => {
      audioService.speakText("Rewinding audio narration.", 'Sophia', this.currentSpeaker);
    });
    this.container.querySelector('#btn-audio-ff')?.addEventListener('click', () => {
      audioService.speakText("Skipping to next scene.", 'Sophia', this.currentSpeaker);
    });
  }
}
