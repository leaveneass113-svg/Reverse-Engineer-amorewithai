import { Navigation } from './components/Navigation.js';
import { StoryCreator } from './components/StoryCreator.js';
import { CharacterStudio } from './components/CharacterStudio.js';
import { StoryLibrary } from './components/StoryLibrary.js';
import { StoryReader } from './components/StoryReader.js';
import { AudiobookPlayer } from './components/AudiobookPlayer.js';
import { UpgradeModal } from './components/UpgradeModal.js';
import { store } from './services/store.js';

class App {
  constructor() {
    this.navContainer = document.getElementById('nav-root');
    this.mainContainer = document.getElementById('main-root');
    this.audioContainer = document.getElementById('audio-root');
    this.modalContainer = document.getElementById('modal-root');

    this.currentView = 'creator'; // 'creator' | 'characters' | 'library' | 'reader'
    this.currentStoryId = '8760f9fd-3c2e-4ed2-8d4a-ac1f0249cbee';

    this.init();
  }

  init() {
    // Check URL parameters (e.g. ?view=reader&id=8760f9fd-3c2e-4ed2-8d4a-ac1f0249cbee or path /library/8760f9fd-3c2e-4ed2-8d4a-ac1f0249cbee)
    const url = new URL(window.location.href);
    const path = url.pathname;
    const viewParam = url.searchParams.get('view');
    const idParam = url.searchParams.get('id');

    if (idParam) {
      this.currentStoryId = idParam;
      this.currentView = 'reader';
    } else if (path.includes('/library/') || viewParam === 'reader') {
      const match = path.match(/\/library\/([a-zA-Z0-9-]+)/);
      if (match) {
        this.currentStoryId = match[1];
      }
      this.currentView = 'reader';
    } else if (viewParam) {
      this.currentView = viewParam;
    }

    // Initialize Navigation
    this.nav = new Navigation(
      this.navContainer,
      (tab) => this.navigateTo(tab),
      () => this.openUpgradeModal()
    );

    // Initialize Audiobook Player bar
    this.audioPlayer = new AudiobookPlayer(this.audioContainer);

    // Render Current View
    this.renderView();
  }

  navigateTo(view, payload = null) {
    this.currentView = view;
    if (view === 'reader' && payload) {
      this.currentStoryId = payload;
    }

    // Update browser URL history without reload
    const newUrl = view === 'reader' 
      ? `?view=reader&id=${this.currentStoryId}` 
      : `?view=${view}`;
    window.history.pushState({}, '', newUrl);

    this.nav.setActiveTab(view);
    this.renderView();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  openUpgradeModal() {
    new UpgradeModal(this.modalContainer, () => {
      this.modalContainer.innerHTML = '';
    });
  }

  renderView() {
    this.mainContainer.innerHTML = '';

    switch (this.currentView) {
      case 'creator':
        new StoryCreator(this.mainContainer, (newStoryId) => {
          this.navigateTo('reader', newStoryId);
        });
        break;

      case 'characters':
        new CharacterStudio(this.mainContainer);
        break;

      case 'library':
        new StoryLibrary(
          this.mainContainer,
          (storyId) => this.navigateTo('reader', storyId),
          () => this.navigateTo('creator')
        );
        break;

      case 'reader':
        new StoryReader(
          this.mainContainer,
          this.currentStoryId,
          () => this.navigateTo('library')
        );
        break;

      default:
        this.navigateTo('creator');
        break;
    }
  }
}

// Mount App on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  new App();
});
