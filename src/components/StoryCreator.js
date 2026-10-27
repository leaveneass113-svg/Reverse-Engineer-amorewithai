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
      this.recognition.lang = 'th-TH';
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
      micBtn.title = val ? 'กำลังฟัง... กรุณาพูดไอเดียของคุณ' : 'สั่งงานด้วยเสียง';
    }
  }

  toggleVoice() {
    if (!this.recognition) {
      alert('เบราว์เซอร์นี้ไม่รองรับการสั่งงานด้วยเสียง กรุณาพิมพ์ไอเดียเรื่องราวของคุณ');
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
      alert('กรุณากรอกคำอธิบายหรือไอเดียเรื่องราวของคุณ หรือกด "สุ่มไอเดียพล็อต"!');
      return;
    }

    if (store.getCredits() < 6) {
      alert('เครดิตไม่เพียงพอ! กรุณากด "อัปเกรด" เพื่อรับเครดิตเพิ่ม');
      return;
    }

    store.useCredits(6);
    this.isGenerating = true;

    // Render streaming box
    const streamContainer = this.container.querySelector('#streaming-container');
    if (streamContainer) {
      streamContainer.style.display = 'block';
      streamContainer.scrollIntoView({ behavior: 'smooth' });
    }

    const titleTarget = this.container.querySelector('#gen-story-title');
    const contentTarget = this.container.querySelector('#gen-stream-text');

    const generatedTitle = "เสียงสะท้อนเที่ยงคืนในโถงกำมะหยี่";
    if (titleTarget) titleTarget.textContent = generatedTitle;

    const sampleStreamParagraphs = [
      "สายฝนโปรยปรายกระทบหน้าต่างกระจกโค้งบานสูงของคฤหาสน์แบล็กวูดเป็นจังหวะต่อเนื่อง",
      "เอเลน่ากระชับสมุดบันทึกโบราณปกหนังไว้แน่น ตัวอักษรสีทองจางๆ อุ่นวาบอยู่ใต้ปลายนิ้ว ในความเงียบสงัดยามเที่ยงคืน ทุกย่างก้าวสะท้อนก้องอย่างชัดเจน",
      "\"ผมสงสัยอยู่ว่าคุณต้องใช้เวลานานแค่ไหนกว่าจะพบห้องนี้ คุณแวนซ์\" เสียงกระซิบทุ้มต่ำของลอร์ดจูเลียน ธอร์น ดังขึ้นจากเงามืดระหว่างชั้นหนังสือไม้มะฮอกกานี",
      "เธอหันกลับไปสบสายตาเขา ดวงตาสีรัตติกาลคู่นั้นมีทั้งประกายอันตรายและความผูกพันลึกซึ้ง ความตึงเครียดที่สะสมมาตลอดหลายปีแห่งความปรารถนาที่มิอาจเอ่ยคำ"
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
      author: "คุณ & Amore AI",
      tags: ["ดาร์ก โรแมนซ์", "ความลับในคฤหาสน์", "ออริจินัล"],
      wordCount: 3200,
      estimatedMinutes: 14,
      progress: 10,
      lastRead: "เมื่อสักครู่",
      characters: ["Elena Vance (เอเลน่า)", "Julian Thorne (จูเลียน)"],
      chapters: [
        {
          number: 1,
          title: "การพบกันยามเที่ยงคืน",
          paragraphs: sampleStreamParagraphs
        },
        {
          number: 2,
          title: "ข้อตกลงที่ไร้เสียง",
          paragraphs: [
            "จูเลียนก้าวเข้ามาจนเงาของทั้งคู่ทาบทับลงบนผืนพรมทอมือโบราณใต้แสงเทียน",
            "\"คุณก็รู้ดีว่าทำไมผมถึงปล่อยให้คุณก้าวออกจากห้องสมุดนี้ในคืนนี้ไม่ได้\" เขากระซิบ ปลายนิ้วสัมผัสคางเธออย่างแผ่วเบา",
            "เอเลน่าลืมหายใจ แผ่นกระดาษร่วงหล่นลงบนโต๊ะระหว่างทั้งสอง ขณะที่พายุด้านนอกยังคงโหมกระหน่ำ"
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
          เปลี่ยนจินตนาการของคุณ ให้เป็นนิยายรักที่<em>อ่าน เห็นภาพ และรับฟังได้</em>
        </h1>
        <p class="hero-subtitle">
          อธิบายเพียงไม่กี่คำ AI จะรังสรรค์เรื่องราวที่เหลือให้อย่างไร้ขอบเขต
        </p>

        <div class="prompt-card" id="prompt-card-wrapper">
          <textarea 
            class="prompt-textarea" 
            id="prompt-textarea"
            placeholder="ตัวละคร เหตุการณ์ หรือฉากที่คุณคิดไว้... เริ่มต้นด้วยคำสั้นๆ หรือใส่รายละเอียดที่คุณต้องการได้ตามใจ"
          >${SURPRISE_PROMPTS[0]}</textarea>

          <div class="prompt-tags">
            <span class="prompt-tag" data-tag="ดาร์ก อะคาเดเมีย">🏛️ ดาร์ก อะคาเดเมีย</span>
            <span class="prompt-tag" data-tag="จากคู่ปรับสู่คู่รัก">⚔️ จากคู่ปรับสู่คู่รัก</span>
            <span class="prompt-tag" data-tag="ความรักต้องห้าม">🥀 ความรักต้องห้าม</span>
            <span class="prompt-tag" data-tag="มหาเศรษฐี & บัณฑิตสาว">💎 มหาเศรษฐี & บัณฑิตสาว</span>
            <span class="prompt-tag" data-tag="รักค่อยเป็นค่อยไป">🔥 รักค่อยเป็นค่อยไป</span>
          </div>

          <div class="prompt-toolbar">
            <div class="prompt-tool-actions">
              <button class="tool-btn" id="btn-voice-input" title="สั่งงานด้วยเสียง">
                <span>🎙️</span>
              </button>
              <button class="tool-btn" id="btn-surprise-me" title="สุ่มไอเดียพล็อตนิยาย">
                <span>🔀</span>
                <span>สุ่มไอเดียพล็อต</span>
              </button>
            </div>

            <button class="btn-generate-submit" id="btn-write-story">
              <span>✨</span>
              <span>แต่งนิยายของฉัน</span>
              <span>💎 6</span>
            </button>
          </div>
        </div>

        <div class="features-badges">
          <span>ไร้การปิดกั้น</span>
          <span style="color: var(--primary)">♥</span>
          <span>ความเป็นส่วนตัว</span>
          <span style="color: var(--primary)">♥</span>
          <span>ภาษาไทยสมบูรณ์แบบ</span>
        </div>

        <div class="social-proof">
          <div class="avatar-stack">
            <div class="avatar-stack-item" style="background:#be185d; color:#fff">C</div>
            <div class="avatar-stack-item" style="background:#7c3aed; color:#fff">R</div>
            <div class="avatar-stack-item" style="background:#0284c7; color:#fff">H</div>
            <div class="avatar-stack-item" style="background:#059669; color:#fff">U</div>
          </div>
          <span>ร่วมแต่งกับนักเขียนกว่า <strong>53,800+</strong> คน • ⭐⭐⭐⭐⭐ <strong>4.8/5</strong></span>
        </div>

        <div class="section-divider"></div>

        <!-- Animated Streaming Preview Container -->
        <div class="generating-overlay" id="streaming-container" style="display: none;">
          <div class="generating-header">
            <div class="generating-badge">
              <span class="pulse-dot"></span>
              <span>กำลังถักทอเรื่องราวของคุณด้วย AI...</span>
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
