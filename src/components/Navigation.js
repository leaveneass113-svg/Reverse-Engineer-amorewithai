import { store } from '../services/store.js';

export class Navigation {
  constructor(container, onNavigate, onOpenUpgrade) {
    this.container = container;
    this.onNavigate = onNavigate;
    this.onOpenUpgrade = onOpenUpgrade;
    this.activeTab = 'creator'; // 'creator' | 'characters' | 'library' | 'reader'
    this.credits = store.getCredits();

    store.subscribe((event, data) => {
      if (event === 'credits:change') {
        this.credits = data;
        this.renderCredits();
      }
    });

    this.render();
  }

  setActiveTab(tab) {
    this.activeTab = tab;
    this.container.querySelectorAll('.nav-item').forEach(el => {
      if (el.dataset.tab === tab) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });
  }

  renderCredits() {
    const badge = this.container.querySelector('.credits-badge');
    if (badge) {
      badge.innerHTML = `<span>💎</span> <span>${this.credits}</span>`;
    }
  }

  render() {
    this.container.innerHTML = `
      <header class="app-header" id="app-header">
        <div class="logo-container" id="nav-logo" title="AmoreWithAI Home">
          <span class="logo-text">Amorewithai<span class="logo-heart">♥</span></span>
        </div>

        <nav class="nav-links">
          <button class="nav-item ${this.activeTab === 'library' ? 'active' : ''}" data-tab="library" id="nav-tab-library">
            <span>📚</span>
            <span>Library</span>
          </button>
          <button class="nav-item ${this.activeTab === 'characters' ? 'active' : ''}" data-tab="characters" id="nav-tab-characters">
            <span>👥</span>
            <span>Characters</span>
          </button>
          <button class="nav-item" id="nav-btn-upgrade">
            <span>💎</span>
            <span>Upgrade</span>
          </button>
        </nav>

        <div class="nav-actions">
          <div class="credits-badge" id="nav-credits-badge" title="Your available credits">
            <span>💎</span>
            <span>${this.credits}</span>
          </div>

          <button class="btn-create-story" id="nav-btn-create-story">
            <span>✨</span>
            <span>Create story</span>
          </button>

          <div class="user-avatar-btn" id="nav-user-profile" title="Account settings">
            <span>I</span>
          </div>
        </div>
      </header>
    `;

    // Event listeners
    this.container.querySelector('#nav-logo').addEventListener('click', () => this.onNavigate('creator'));
    this.container.querySelector('#nav-tab-library').addEventListener('click', () => this.onNavigate('library'));
    this.container.querySelector('#nav-tab-characters').addEventListener('click', () => this.onNavigate('characters'));
    this.container.querySelector('#nav-btn-upgrade').addEventListener('click', () => this.onOpenUpgrade());
    this.container.querySelector('#nav-credits-badge').addEventListener('click', () => this.onOpenUpgrade());
    this.container.querySelector('#nav-btn-create-story').addEventListener('click', () => this.onNavigate('creator'));
  }
}
