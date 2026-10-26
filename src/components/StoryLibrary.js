import { store } from '../services/store.js';

export class StoryLibrary {
  constructor(container, onSelectStory, onCreateStory) {
    this.container = container;
    this.onSelectStory = onSelectStory;
    this.onCreateStory = onCreateStory;

    store.subscribe((event) => {
      if (event === 'stories:change') {
        this.render();
      }
    });

    this.render();
  }

  render() {
    const stories = store.getStories();

    this.container.innerHTML = `
      <section class="library-view">
        <div class="view-header">
          <div class="view-title-group">
            <h2>My Library</h2>
            <p>Your curated collection of stories, ready to read and listen.</p>
          </div>

          <div class="header-action-group">
            <button class="btn-create-story" id="btn-lib-new-story">
              <span>+</span>
              <span>Create story</span>
            </button>
          </div>
        </div>

        <div class="library-grid">
          ${stories.map(story => `
            <div class="story-card" data-id="${story.id}">
              <div class="story-card-cover">
                <img src="${story.cover || '/assets/story_cover_midnight.jpg'}" alt="${story.title}" onerror="this.src='/assets/story_cover_midnight.jpg'">
                <span class="story-card-badge">${story.estimatedMinutes || 15} min read</span>
              </div>

              <div class="story-card-body">
                <h3>${story.title}</h3>
                <p class="story-card-subtitle">${story.subtitle || ''}</p>

                <div class="story-card-tags">
                  ${(story.tags || []).map(t => `<span class="story-card-tag">${t}</span>`).join('')}
                </div>
              </div>

              <div class="story-card-footer">
                <span>${story.characters ? story.characters.join(' & ') : 'Original'}</span>
                <span>${story.progress || 0}% read</span>
              </div>
            </div>
          `).join('')}
        </div>
      </section>
    `;

    // Event listeners
    this.container.querySelector('#btn-lib-new-story')?.addEventListener('click', () => this.onCreateStory());

    this.container.querySelectorAll('.story-card').forEach(card => {
      card.addEventListener('click', () => {
        const storyId = card.dataset.id;
        this.onSelectStory(storyId);
      });
    });
  }
}
