import { INITIAL_CHARACTERS, INITIAL_RELATIONSHIPS, INITIAL_STORIES } from '../data/mockData.js';

const STORAGE_KEYS = {
  CHARACTERS: 'amore_characters_th_v2',
  RELATIONSHIPS: 'amore_relationships_th_v2',
  STORIES: 'amore_stories_th_v2',
  CREDITS: 'amore_credits_v1',
  READER_SETTINGS: 'amore_reader_settings_th_v1'
};

class Store {
  constructor() {
    this.listeners = new Set();
    this.init();
  }

  init() {
    if (!localStorage.getItem(STORAGE_KEYS.CHARACTERS)) {
      localStorage.setItem(STORAGE_KEYS.CHARACTERS, JSON.stringify(INITIAL_CHARACTERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.RELATIONSHIPS)) {
      localStorage.setItem(STORAGE_KEYS.RELATIONSHIPS, JSON.stringify(INITIAL_RELATIONSHIPS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.STORIES)) {
      localStorage.setItem(STORAGE_KEYS.STORIES, JSON.stringify(INITIAL_STORIES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CREDITS)) {
      localStorage.setItem(STORAGE_KEYS.CREDITS, '350');
    }
    if (!localStorage.getItem(STORAGE_KEYS.READER_SETTINGS)) {
      localStorage.setItem(STORAGE_KEYS.READER_SETTINGS, JSON.stringify({
        theme: 'dark', // 'dark' | 'sepia' | 'light'
        fontSize: 19, // in px
        lineHeight: 1.85,
        fontFamily: 'Prompt'
      }));
    }
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify(event, data) {
    this.listeners.forEach(cb => {
      try {
        cb(event, data);
      } catch (err) {
        console.error('Store subscriber error:', err);
      }
    });
  }

  // --- Characters ---
  getCharacters() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.CHARACTERS)) || [];
    } catch {
      return INITIAL_CHARACTERS;
    }
  }

  saveCharacter(char) {
    const list = this.getCharacters();
    const existingIndex = list.findIndex(c => c.id === char.id);
    if (existingIndex >= 0) {
      list[existingIndex] = { ...list[existingIndex], ...char, updatedAt: new Date().toISOString() };
    } else {
      const newChar = {
        id: char.id || `char-${Date.now()}`,
        name: char.name || 'ตัวละครใหม่',
        role: char.role || 'ตัวเอก',
        avatar: char.avatar || '/assets/character_elena.jpg',
        bio: char.bio || '',
        traits: char.traits || [],
        voice: char.voice || 'Sophia',
        storiesCount: 0,
        createdAt: new Date().toISOString(),
        ...char
      };
      list.unshift(newChar);
    }
    localStorage.setItem(STORAGE_KEYS.CHARACTERS, JSON.stringify(list));
    this.notify('characters:change', list);
    return char;
  }

  deleteCharacter(id) {
    let list = this.getCharacters();
    list = list.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.CHARACTERS, JSON.stringify(list));
    this.notify('characters:change', list);
  }

  // --- Relationships ---
  getRelationships() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.RELATIONSHIPS)) || [];
    } catch {
      return INITIAL_RELATIONSHIPS;
    }
  }

  saveRelationship(rel) {
    const list = this.getRelationships();
    const existingIndex = list.findIndex(r => r.id === rel.id);
    if (existingIndex >= 0) {
      list[existingIndex] = { ...list[existingIndex], ...rel };
    } else {
      list.push({ id: rel.id || `rel-${Date.now()}`, ...rel });
    }
    localStorage.setItem(STORAGE_KEYS.RELATIONSHIPS, JSON.stringify(list));
    this.notify('relationships:change', list);
  }

  deleteRelationship(id) {
    let list = this.getRelationships().filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.RELATIONSHIPS, JSON.stringify(list));
    this.notify('relationships:change', list);
  }

  // --- Stories ---
  getStories() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.STORIES)) || [];
    } catch {
      return INITIAL_STORIES;
    }
  }

  getStoryById(id) {
    const stories = this.getStories();
    return stories.find(s => s.id === id) || null;
  }

  saveStory(story) {
    const list = this.getStories();
    const existingIndex = list.findIndex(s => s.id === story.id);
    if (existingIndex >= 0) {
      list[existingIndex] = { ...list[existingIndex], ...story, updatedAt: new Date().toISOString() };
    } else {
      list.unshift({
        id: story.id || `story-${Date.now()}`,
        progress: 0,
        createdAt: new Date().toISOString(),
        ...story
      });
    }
    localStorage.setItem(STORAGE_KEYS.STORIES, JSON.stringify(list));
    this.notify('stories:change', list);
    return story;
  }

  // --- Credits ---
  getCredits() {
    return parseInt(localStorage.getItem(STORAGE_KEYS.CREDITS) || '350', 10);
  }

  useCredits(amount) {
    const current = this.getCredits();
    if (current < amount) return false;
    const next = current - amount;
    localStorage.setItem(STORAGE_KEYS.CREDITS, next.toString());
    this.notify('credits:change', next);
    return true;
  }

  addCredits(amount) {
    const next = this.getCredits() + amount;
    localStorage.setItem(STORAGE_KEYS.CREDITS, next.toString());
    this.notify('credits:change', next);
    return next;
  }

  // --- Reader Settings ---
  getReaderSettings() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.READER_SETTINGS)) || {};
    } catch {
      return { theme: 'dark', fontSize: 19, lineHeight: 1.8, fontFamily: 'Literata' };
    }
  }

  updateReaderSettings(settings) {
    const current = this.getReaderSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(STORAGE_KEYS.READER_SETTINGS, JSON.stringify(updated));
    this.notify('reader_settings:change', updated);
    return updated;
  }
}

export const store = new Store();
