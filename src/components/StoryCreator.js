import { SURPRISE_PROMPTS } from '../data/mockData.js';
import { store } from '../services/store.js';

export class StoryCreator {
  constructor(container, onStoryCreated) {
    this.container = container;
    this.onStoryCreated = onStoryCreated;
    this.promptIndex = 0;
    this.isGenerating = false;
    this.isListening = false;
    this.recognition = null;
    this.initSpeech();
    this.render();
  }

  initSpeech() {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRec) {
      this.recognition = new SpeechRec();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        const textarea = this.container.querySelector('#prompt-textarea');
        if (textarea) {
          textarea.value = (textarea.value ? textarea.value + ' ' : '') + transcript;
        }
        this.setListening(false);
      };
      this.recognition.onerror = () => this.setListening(false);
      this.recognition.onend = () => this.setListening(false);
    }
  }

  setListening(val) {
    this.isListening = val;
    const micBtn = this.container.querySelector('#btn-voice-input');
    if (micBtn) {
      micBtn.style.color = val ? '#ef4444' : '';
      micBtn.title = val ? 'Listening... speak now' : 'Voice input';
    }
  }

  toggleVoice() {
    if (!this.recognition) {
      alert('Speech recognition is not supported in this browser. Please type your story idea.');
      return;
    }
    if (this.isListening) {
      this.recognition.stop();
      this.setListening(false);
    } else {
      try {
        this.recognition.start();
        this.setListening(true);
      } catch (err) {
        console.warn(err);
      }
    }
  }

  cycleSurprisePrompt() {
    const textarea = this.container.querySelector('#prompt-textarea');
    if (!textarea) return;
    this.promptIndex = (this.promptIndex + 1) % SURPRISE_PROMPTS.length;
    textarea.value = SURPRISE_PROMPTS[this.promptIndex];
    textarea.focus();
  }

  async startGeneration() {
    const textarea = this.container.querySelector('#prompt-textarea');
    const promptText = textarea ? textarea.value.trim() : '';

    if (!promptText) {
      alert('Please enter a description or idea for your story, or click "Surprise me"!');
      return;
    }

    if (store.getCredits() < 6) {
      alert('Not enough credits! Please click "Upgrade" to get more credits.');
      return;
    }

    store.useCredits(6);
    this.isGenerating = true;

    // Render streaming box
    const cardContainer = this.container.querySelector('#prompt-card-wrapper');
    const streamContainer = this.container.querySelector('#streaming-container');
    if (streamContainer) {
      streamContainer.style.display = 'block';
      streamContainer.scrollIntoView({ behavior: 'smooth' });
    }

    const titleTarget = this.container.querySelector('#gen-story-title');
    const contentTarget = this.container.querySelector('#gen-stream-text');

    const generatedTitle = "Midnight Echoes in the Velvet Hall";
    if (titleTarget) titleTarget.textContent = generatedTitle;

    const sampleStreamParagraphs = [
      "The rain tapped in staccato rhythms against the tall archway windows of Blackwood Manor.",
      "Elena tightened her grasp upon the leather-bound ledger, the faint golden script warm beneath her fingertips. In the stillness of the midnight library, every footfall was amplified.",
      "\"I wondered how long it would take you to find this room, Miss Vance,\" Lord Julian Thorne's voice murmured from the shadows between the mahogany shelves.",
      "She turned to meet his gaze. His eyes held an ember of danger and devotion, unresolved tensions from a lifetime of unspoken longing."
    ];

    let fullText = "";
    for (const paragraph of sampleStreamParagraphs) {
      for (let i = 0; i < paragraph.length; i++) {
        fullText += paragraph[i];
        if (contentTarget) {
          contentTarget.textContent = fullText;
          contentTarget.scrollTop = contentTarget.scrollHeight;
        }
        await new Promise(r => setTimeout(r, 18));
      }
      fullText += "\n\n";
    }

    // Save story to store
    const newStory = {
      id: `story-${Date.now()}`,
      title: generatedTitle,
      subtitle: promptText.substring(0, 90) + '...',
      cover: "/assets/story_cover_midnight.jpg",
      author: "You & Amore AI",
      tags: ["Dark Romance", "Intrigue", "Original"],
      wordCount: 3200,
      estimatedMinutes: 14,
      progress: 10,
      lastRead: "Just now",
      characters: ["Elena Vance", "Julian Thorne"],
      chapters: [
        {
          number: 1,
          title: "The Midnight Encounter",
          paragraphs: sampleStreamParagraphs
        },
        {
          number: 2,
          title: "The Unspoken Accord",
          paragraphs: [
            "Julian stepped forward until the candlelight cast their shadows together against the ancient tapestries.",
            "\"You know why I cannot let you leave this library tonight,\" he whispered, his hand gently lifting her chin.",
            "Elena's breath caught, the paper fluttering to the table between them as the storm raged outside."
          ]
        }
      ]
    };

    store.saveStory(newStory);
    this.isGenerating = false;

    // Transition to reader
    setTimeout(() => {
      this.onStoryCreated(newStory.id);
    }, 900);
  }

  render() {
    this.container.innerHTML = `
      <section class="hero-view">
        <h1 class="hero-title">
          Turn your fantasy into a story you can <em>read, see and hear</em>
        </h1>
        <p class="hero-subtitle">
          Describe it in a few words. AI writes the rest, with no filters.
        </p>

        <div class="prompt-card" id="prompt-card-wrapper">
          <textarea 
            class="prompt-textarea" 
            id="prompt-textarea"
            placeholder="A character, a situation, or a scene you have in mind. Start with a few words, or add the details that matter to you."
          >${SURPRISE_PROMPTS[0]}</textarea>

          <div class="prompt-tags">
            <span class="prompt-tag" data-tag="Dark Academia">🏛️ Dark Academia</span>
            <span class="prompt-tag" data-tag="Enemies to Lovers">⚔️ Enemies to Lovers</span>
            <span class="prompt-tag" data-tag="Forbidden Romance">🥀 Forbidden Romance</span>
            <span class="prompt-tag" data-tag="Billionaire & Scholar">💎 Billionaire & Scholar</span>
            <span class="prompt-tag" data-tag="Slow Burn">🔥 Slow Burn</span>
          </div>

          <div class="prompt-toolbar">
            <div class="prompt-tool-actions">
              <button class="tool-btn" id="btn-voice-input" title="Voice input">
                <span>🎙️</span>
              </button>
              <button class="tool-btn" id="btn-surprise-me" title="Get a random story prompt">
                <span>🔀</span>
                <span>Surprise me</span>
              </button>
            </div>

            <button class="btn-generate-submit" id="btn-write-story">
              <span>✨</span>
              <span>Write my story</span>
              <span>💎 6</span>
            </button>
          </div>
        </div>

        <div class="features-badges">
          <span>Uncensored</span>
          <span style="color: var(--primary)">♥</span>
          <span>Private</span>
          <span style="color: var(--primary)">♥</span>
          <span>In your language</span>
        </div>

        <div class="social-proof">
          <div class="avatar-stack">
            <div class="avatar-stack-item" style="background:#be185d; color:#fff">C</div>
            <div class="avatar-stack-item" style="background:#7c3aed; color:#fff">R</div>
            <div class="avatar-stack-item" style="background:#0284c7; color:#fff">H</div>
            <div class="avatar-stack-item" style="background:#059669; color:#fff">U</div>
          </div>
          <span>Join <strong>53,800+</strong> writers • ⭐⭐⭐⭐⭐ <strong>4.8/5</strong></span>
        </div>

        <div class="section-divider"></div>

        <!-- Animated Streaming Preview Container -->
        <div class="generating-overlay" id="streaming-container" style="display: none;">
          <div class="generating-header">
            <div class="generating-badge">
              <span class="pulse-dot"></span>
              <span>Weaving your story with AI...</span>
            </div>
            <h4 id="gen-story-title" style="font-family: var(--font-serif); font-size: 1.1rem; color: #fff;"></h4>
          </div>
          <div class="generating-content" id="gen-stream-text"></div>
        </div>
      </section>
    `;

    // Attach listeners
    this.container.querySelector('#btn-surprise-me').addEventListener('click', () => this.cycleSurprisePrompt());
    this.container.querySelector('#btn-voice-input').addEventListener('click', () => this.toggleVoice());
    this.container.querySelector('#btn-write-story').addEventListener('click', () => this.startGeneration());

    // Prompt tags click
    this.container.querySelectorAll('.prompt-tag').forEach(tag => {
      tag.addEventListener('click', () => {
        const textarea = this.container.querySelector('#prompt-textarea');
        const tagText = tag.dataset.tag;
        if (textarea && !textarea.value.includes(tagText)) {
          textarea.value = (textarea.value.trim() ? textarea.value.trim() + ' — ' : '') + tagText;
        }
      });
    });
  }
}
