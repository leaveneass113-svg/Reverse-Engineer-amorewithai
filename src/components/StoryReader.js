import { store } from '../services/store.js';
import { audioService } from '../services/audioService.js';

export class StoryReader {
  constructor(container, storyId, onBack) {
    this.container = container;
    this.storyId = storyId;
    this.onBack = onBack;
    this.story = store.getStoryById(storyId) || store.getStories()[0];
    this.settings = store.getReaderSettings();

    store.subscribe((event, data) => {
      if (event === 'reader_settings:change') {
        this.settings = data;
        this.applyStyles();
      }
    });

    this.render();
  }

  setTheme(theme) {
    store.updateReaderSettings({ theme });
    this.applyStyles();
  }

  changeFontSize(delta) {
    const newSize = Math.max(14, Math.min(28, (this.settings.fontSize || 19) + delta));
    store.updateReaderSettings({ fontSize: newSize });
    this.applyStyles();
  }

  applyStyles() {
    const box = this.container.querySelector('.reader-box');
    const prose = this.container.querySelector('.reader-prose');
    if (!box || !prose) return;

    box.className = `reader-box reader-theme-${this.settings.theme || 'dark'}`;
    prose.style.setProperty('--prose-size', `${this.settings.fontSize || 19}px`);
    prose.style.setProperty('--prose-height', `${this.settings.lineHeight || 1.85}`);

    // Update active theme button
    this.container.querySelectorAll('.theme-btn').forEach(b => {
      if (b.dataset.theme === this.settings.theme) {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    });
  }

  listenChapter(chapterIndex = 0) {
    const chapter = this.story.chapters[chapterIndex];
    if (!chapter) return;
    const fullChapterText = `${this.story.title}. Chapter ${chapter.number}: ${chapter.title}. ` + chapter.paragraphs.join(' ');
    audioService.speakText(fullChapterText, 'Sophia', this.story.characters?.[0] || 'Narrator');
  }

  render() {
    if (!this.story) {
      this.container.innerHTML = `
        <div style="text-align:center; padding: 4rem;">
          <h2 style="font-family:var(--font-serif); font-size:2rem; margin-bottom:1rem;">We couldn't open this story</h2>
          <p style="color:var(--text-secondary); margin-bottom:2rem;">It may still be finishing, or the link isn't quite right.</p>
          <button class="btn-create-story" id="btn-reader-back">Back to library</button>
        </div>
      `;
      this.container.querySelector('#btn-reader-back')?.addEventListener('click', () => this.onBack());
      return;
    }

    this.container.innerHTML = `
      <div class="reader-container">
        <!-- Floating Reader Controls -->
        <div class="reader-controls-floating">
          <div class="reader-controls-group">
            <button class="reader-ctrl-btn" id="btn-reader-back">← Library</button>
          </div>

          <div class="reader-controls-group">
            <button class="reader-ctrl-btn theme-btn ${this.settings.theme === 'dark' ? 'active' : ''}" data-theme="dark" title="Dark theme">🌙 Dark</button>
            <button class="reader-ctrl-btn theme-btn ${this.settings.theme === 'sepia' ? 'active' : ''}" data-theme="sepia" title="Sepia book theme">📜 Sepia</button>
            <button class="reader-ctrl-btn theme-btn ${this.settings.theme === 'light' ? 'active' : ''}" data-theme="light" title="Light theme">☀️ Light</button>
          </div>

          <div class="reader-controls-group">
            <button class="reader-ctrl-btn" id="btn-font-dec" title="Decrease font size">A-</button>
            <button class="reader-ctrl-btn" id="btn-font-inc" title="Increase font size">A+</button>
            <button class="btn-create-story" id="btn-listen-story" style="padding: 0.35rem 0.85rem; font-size: 0.82rem;">
              <span>🎧 Listen</span>
            </button>
          </div>
        </div>

        <article class="reader-box reader-theme-${this.settings.theme || 'dark'}">
          <header class="reader-header">
            <h1 class="reader-story-title">${this.story.title}</h1>
            <p class="reader-story-subtitle">${this.story.subtitle || ''}</p>
            <div class="reader-meta-bar">
              <span>By ${this.story.author || 'Amore With AI'}</span>
              <span>•</span>
              <span>${this.story.wordCount || 4000} words</span>
              <span>•</span>
              <span>${this.story.characters ? this.story.characters.join(' & ') : 'Characters'}</span>
            </div>
          </header>

          ${(this.story.chapters || []).map((chapter, idx) => `
            <section class="reader-chapter" data-chapter="${idx}">
              <h2 class="reader-chapter-title">Chapter ${chapter.number}: ${chapter.title}</h2>
              <div class="reader-prose">
                ${chapter.paragraphs.map(p => `<p>${p}</p>`).join('')}
              </div>
            </section>
          `).join('')}
        </article>
      </div>
    `;

    // Apply reader styles
    this.applyStyles();

    // Attach listeners
    this.container.querySelector('#btn-reader-back')?.addEventListener('click', () => this.onBack());
    this.container.querySelector('#btn-font-dec')?.addEventListener('click', () => this.changeFontSize(-2));
    this.container.querySelector('#btn-font-inc')?.addEventListener('click', () => this.changeFontSize(+2));
    this.container.querySelector('#btn-listen-story')?.addEventListener('click', () => this.listenChapter(0));

    this.container.querySelectorAll('.theme-btn').forEach(btn => {
      btn.addEventListener('click', () => this.setTheme(btn.dataset.theme));
    });
  }
}
