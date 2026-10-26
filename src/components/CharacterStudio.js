import { store } from '../services/store.js';
import { audioService } from '../services/audioService.js';
import { AUDIO_VOICES } from '../data/mockData.js';
import { RelationshipGraph } from './RelationshipGraph.js';

export class CharacterStudio {
  constructor(container) {
    this.container = container;
    this.currentTab = 'characters'; // 'characters' | 'graph'
    this.editingCharacter = null;
    this.isDrawerOpen = false;

    store.subscribe((event) => {
      if (event === 'characters:change' || event === 'relationships:change') {
        this.render();
      }
    });

    this.render();
  }

  openDrawer(char = null) {
    this.editingCharacter = char;
    this.isDrawerOpen = true;
    this.render();
  }

  closeDrawer() {
    this.isDrawerOpen = false;
    this.editingCharacter = null;
    this.render();
  }

  saveCharacterFromDrawer() {
    const name = this.container.querySelector('#drawer-char-name')?.value.trim();
    const role = this.container.querySelector('#drawer-char-role')?.value.trim();
    const bio = this.container.querySelector('#drawer-char-bio')?.value.trim();
    const voice = this.container.querySelector('#drawer-char-voice')?.value;
    const avatar = this.container.querySelector('#drawer-char-avatar-img')?.src || '/assets/character_elena.jpg';

    if (!name) {
      alert('Please enter a name for your character');
      return;
    }

    const traits = Array.from(this.container.querySelectorAll('.drawer-trait-chip.active'))
      .map(el => el.textContent.trim());

    store.saveCharacter({
      id: this.editingCharacter ? this.editingCharacter.id : undefined,
      name,
      role: role || 'Protagonist',
      bio,
      voice: voice || 'Sophia',
      avatar,
      traits
    });

    this.closeDrawer();
  }

  render() {
    const characters = store.getCharacters();
    const relationships = store.getRelationships();

    this.container.innerHTML = `
      <section class="characters-view">
        <div class="view-header">
          <div class="view-title-group">
            <h2>My Characters</h2>
            <p>Everyone you've created, all in one place.</p>
          </div>

          <div class="header-action-group">
            <button class="btn-secondary ${this.currentTab === 'graph' ? 'active' : ''}" id="btn-toggle-graph">
              <span>🕸️</span>
              <span>${this.currentTab === 'graph' ? 'View Character Cards' : 'Relationship Map'}</span>
            </button>
            <button class="btn-create-story" id="btn-open-create-char">
              <span>+</span>
              <span>Create character</span>
            </button>
          </div>
        </div>

        ${this.currentTab === 'graph' ? `
          <div id="relationship-graph-mount"></div>
        ` : `
          <div class="characters-grid">
            ${characters.map(char => `
              <div class="character-card" data-id="${char.id}">
                <div class="character-card-header">
                  <div class="character-avatar-wrap">
                    <img src="${char.avatar}" alt="${char.name}" onerror="this.src='/assets/character_elena.jpg'">
                  </div>
                  <div class="character-meta">
                    <h3>${char.name}</h3>
                    <span class="character-role-tag">${char.role || 'Character'}</span>
                  </div>
                </div>

                <p class="character-bio">${char.bio || 'No biography written yet.'}</p>

                <div class="character-traits">
                  ${(char.traits || []).map(t => `<span class="trait-pill">${t}</span>`).join('')}
                </div>

                <div class="character-card-footer">
                  <div class="voice-tag" data-voice="${char.voice}" data-name="${char.name}" title="Click to hear voice sample">
                    <span>🎙️</span>
                    <span>${char.voice || 'Default'} voice</span>
                  </div>

                  <div class="character-card-actions">
                    <button class="icon-btn btn-edit-char" data-id="${char.id}" title="Edit character">✏️</button>
                    <button class="icon-btn danger btn-del-char" data-id="${char.id}" title="Delete character">🗑️</button>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        `}

        <!-- Slide-over Drawer for Character Creation / Edit -->
        ${this.isDrawerOpen ? `
          <div class="drawer-backdrop" id="char-drawer-backdrop"></div>
          <div class="drawer-panel" id="char-drawer-panel">
            <div class="drawer-header">
              <h3>${this.editingCharacter ? 'Edit character' : 'Create a character'}</h3>
              <button class="icon-btn" id="btn-close-drawer" style="font-size: 1.4rem;">×</button>
            </div>

            <div class="avatar-picker-row">
              <div class="avatar-preview-lg">
                <img id="drawer-char-avatar-img" src="${this.editingCharacter?.avatar || '/assets/character_elena.jpg'}" alt="Avatar Preview">
              </div>
              <div style="flex:1;">
                <button class="btn-secondary" id="btn-generate-avatar" style="font-size: 0.82rem; padding: 0.4rem 0.85rem;">
                  <span>✨</span>
                  <span>Switch / Generate Avatar</span>
                </button>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="drawer-char-name">Character Name</label>
              <input class="form-input" id="drawer-char-name" placeholder="e.g. Elena" value="${this.editingCharacter?.name || ''}">
            </div>

            <div class="form-group">
              <label class="form-label" for="drawer-char-role">Role / Archetype</label>
              <input class="form-input" id="drawer-char-role" placeholder="e.g. Archivist & Scholar, Enigmatic Lord" value="${this.editingCharacter?.role || ''}">
            </div>

            <div class="form-group">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
                <label class="form-label" style="margin-bottom:0;" for="drawer-char-bio">Biography</label>
                <span id="char-bio-counter" style="font-size:0.75rem; color:var(--text-muted);">0/500</span>
              </div>
              <textarea class="form-textarea" id="drawer-char-bio" rows="4" maxlength="500" placeholder="Who they are: nature, the couple of traits that matter, where their story has left them...">${this.editingCharacter?.bio || ''}</textarea>
            </div>

            <div class="form-group">
              <label class="form-label">Personality Traits</label>
              <div class="prompt-tags" id="drawer-traits-container">
                ${['Intelligent', 'Observant', 'Reserved', 'Passionate', 'Commanding', 'Brooding', 'Protective', 'Charismatic', 'Ambitious', 'Sharp-tongued', 'Mysterious', 'Seductive'].map(trait => {
                  const isActive = (this.editingCharacter?.traits || []).includes(trait);
                  return `<button class="drawer-trait-chip prompt-tag ${isActive ? 'active' : ''}" style="${isActive ? 'background:var(--primary); color:#fff; border-color:var(--primary);' : ''}">${trait}</button>`;
                }).join('')}
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="drawer-char-voice">Audiobook Voice</label>
              <div style="display: flex; gap: 0.5rem; align-items: center;">
                <select class="form-select" id="drawer-char-voice" style="flex:1;">
                  ${AUDIO_VOICES.map(v => `
                    <option value="${v.id}" ${this.editingCharacter?.voice === v.id ? 'selected' : ''}>
                      ${v.name} (${v.tone})
                    </option>
                  `).join('')}
                </select>
                <button class="btn-secondary" id="btn-preview-voice" title="Test this voice sample">
                  <span>🔊 Test</span>
                </button>
              </div>
            </div>

            <button class="btn-create-story" id="btn-save-character" style="margin-top: 1.5rem; width: 100%; justify-content: center; padding: 0.8rem;">
              <span>✨</span>
              <span>Save character</span>
            </button>
          </div>
        ` : ''}
      </section>
    `;

    // Attach listeners
    const toggleGraphBtn = this.container.querySelector('#btn-toggle-graph');
    if (toggleGraphBtn) {
      toggleGraphBtn.addEventListener('click', () => {
        this.currentTab = this.currentTab === 'graph' ? 'characters' : 'graph';
        this.render();
      });
    }

    if (this.currentTab === 'graph') {
      const graphMount = this.container.querySelector('#relationship-graph-mount');
      if (graphMount) {
        new RelationshipGraph(graphMount);
      }
    }

    const openCreateBtn = this.container.querySelector('#btn-open-create-char');
    if (openCreateBtn) openCreateBtn.addEventListener('click', () => this.openDrawer());

    // Edit and Delete buttons on cards
    this.container.querySelectorAll('.btn-edit-char').forEach(btn => {
      btn.addEventListener('click', () => {
        const char = characters.find(c => c.id === btn.dataset.id);
        if (char) this.openDrawer(char);
      });
    });

    this.container.querySelectorAll('.btn-del-char').forEach(btn => {
      btn.addEventListener('click', () => {
        if (confirm('Are you sure you want to remove this character?')) {
          store.deleteCharacter(btn.dataset.id);
        }
      });
    });

    // Voice test on card
    this.container.querySelectorAll('.voice-tag').forEach(tag => {
      tag.addEventListener('click', () => {
        const voice = tag.dataset.voice;
        const name = tag.dataset.name;
        audioService.speakText(`Hello, I am ${name}. My voice has been tuned for your romance stories.`, voice, name);
      });
    });

    // Drawer listeners
    if (this.isDrawerOpen) {
      this.container.querySelector('#char-drawer-backdrop')?.addEventListener('click', () => this.closeDrawer());
      this.container.querySelector('#btn-close-drawer')?.addEventListener('click', () => this.closeDrawer());
      this.container.querySelector('#btn-save-character')?.addEventListener('click', () => this.saveCharacterFromDrawer());

      // Bio counter
      const bioInput = this.container.querySelector('#drawer-char-bio');
      const counter = this.container.querySelector('#char-bio-counter');
      if (bioInput && counter) {
        counter.textContent = `${bioInput.value.length}/500`;
        bioInput.addEventListener('input', () => {
          counter.textContent = `${bioInput.value.length}/500`;
        });
      }

      // Traits toggle
      this.container.querySelectorAll('.drawer-trait-chip').forEach(chip => {
        chip.addEventListener('click', () => {
          chip.classList.toggle('active');
          if (chip.classList.contains('active')) {
            chip.style.background = 'var(--primary)';
            chip.style.color = '#fff';
            chip.style.borderColor = 'var(--primary)';
          } else {
            chip.style.background = '';
            chip.style.color = '';
            chip.style.borderColor = '';
          }
        });
      });

      // Voice preview in drawer
      this.container.querySelector('#btn-preview-voice')?.addEventListener('click', () => {
        const voice = this.container.querySelector('#drawer-char-voice')?.value;
        const name = this.container.querySelector('#drawer-char-name')?.value || 'this character';
        audioService.speakText(`This is a sample audio narration preview in the voice of ${name}.`, voice, name);
      });

      // Avatar cycle/generate
      this.container.querySelector('#btn-generate-avatar')?.addEventListener('click', () => {
        const avatars = [
          '/assets/character_elena.jpg',
          '/assets/character_julian.jpg',
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
          'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80'
        ];
        const img = this.container.querySelector('#drawer-char-avatar-img');
        if (img) {
          const nextIndex = (avatars.indexOf(img.getAttribute('src')) + 1) % avatars.length;
          img.src = avatars[nextIndex];
        }
      });
    }
  }
}
