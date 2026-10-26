# AmoreWithAI — AI Romance Story Studio & Audiobook Reader

> เว็บแอปพลิเคชันต้นแบบที่ผ่านการ Reverse Engineer และพัฒนาเลียนแบบโครงสร้าง ประสบการณ์ผู้ใช้ และฟีเจอร์ของ **[AmoreWithAI](https://amorewithai.com/library/8760f9fd-3c2e-4ed2-8d4a-ac1f0249cbee)** อย่างครบถ้วนระดับ 1:1

![AmoreWithAI Hero](/assets/story_cover_midnight.jpg)

---

## 🌟 ฟีเจอร์หลัก (Key Features)

### 1. เครื่องมือสร้างนิยายอัจฉริยะ (AI Story Studio)
- **Prompt Generator**: กล่องป้อนไอเดียและฉากนิยาย พร้อมรองรับคำแนะนำแนวเรื่อง (Dark Academia, Enemies to Lovers, Forbidden Romance, Billionaire & Scholar, Slow Burn)
- **🔀 ปุ่ม Surprise Me**: สุ่มไอเดียพล็อตนิยายโรแมนติกที่น่าสนใจให้อัตโนมัติ
- **🎙️ ระบบสั่งการด้วยเสียง (Voice Input)**: รองรับการพูดเล่าไอเดียผ่าน Web Speech API
- **✨ Streaming Story Generation**: จำลองขั้นตอนการสร้างเรื่องแบบเรียลไทม์ พร้อมแบ่งตอนและฉากอัตโนมัติ

### 2. สตูดิโอตัวละครและความสัมพันธ์ (Character Studio & Relationship Map)
- **My Characters**: จัดเก็บโปรไฟล์ตัวละครทั้งหมดไว้ในที่เดียว พร้อมอวาตาร์ภาพวาดความละเอียดสูง (Elena Vance, Lord Julian Thorne, Lady Genevieve)
- **Slide-over Panel**: แถบหน้าต่างด้านข้างสำหรับสร้าง/แก้ไขตัวละคร ระบุชื่อ บทบาท ประวัติย่อ (นับจำนวนตัวอักษร 0/500), บุคลิกภาพ (Traits)
- **🎙️ Audiobook Voice**: เลือกเสียงพากย์เฉพาะตัว (Sophia, Liam, Emma, Alexander, The Narrator) พร้อมปุ่มทดลองฟังเสียงพากย์ตัวอย่าง
- **🕸️ แผนผังความสัมพันธ์ (Interactive Relationship Canvas)**: กราฟความสัมพันธ์เชื่อมโยงตัวละครแบบอินเตอร์แอคทีฟ (Lovers, Rivals, Exes, Allies) พร้อมฟังก์ชันจัดระเบียบผัง (Tidy Up) และรีเซ็ตมุมมอง

### 3. ระบบอ่านนิยายและเครื่องเล่นออดิโอบุ๊ค (Story Reader & Audiobook Player)
- **รูปแบบการอ่านระดับหนังสือเล่มจริง**: จัดวางหน้ากระดาษและฟอนต์ `Literata` พร้อมตัวอักษรนำบทขนาดใหญ่ (Illuminated Drop Caps)
- **Reader Themes**: ปรับธีมการอ่านได้ 3 โหมด (🌙 Dark Mode / 📜 Warm Sepia / ☀️ Paper Light)
- **Font Controls**: ปรับเพิ่ม/ลดขนาดตัวอักษรตามความสบายตา
- **Sticky Audiobook Bar**: แถบเครื่องเล่นเสียงพากย์ติดขอบล่างหน้าจอ พร้อมแอนิเมชัน Soundwave แบบเรียลไทม์, แถบ Scrubber เลื่อนเวลา, ปรับความเร็วเสียง (0.85x, 1x, 1.25x, 1.5x) และระบุชื่อตัวละครที่กำลังพากย์เสียง

### 4. ระบบเครดิตและแผนบริการ (Credits & Membership Modal)
- แสดงยอดเครดิต 💎 แบบเรียลไทม์ (หัก 6 เครดิตต่อการสร้างเรื่องใหม่ 1 เรื่อง)
- หน้าต่าง Upgrade แผน Author Plan ($19/เดือน) พร้อมปุ่มทดสอบเติมเครดิต

---

## 🛠️ สแต็กเทคโนโลยี (Technology Stack)
- **Frontend Core**: Vanilla JavaScript (Modern ES Modules)
- **Styling**: Vanilla CSS3 Custom Properties (ดีไซน์ Luxury Dark, Glassmorphism, Micro-animations)
- **Canvas / Graphics**: HTML5 Canvas สำหรับแผนผังความสัมพันธ์ (Relationship Graph)
- **Audio & Speech**: Web Speech API (`SpeechSynthesis` & `webkitSpeechRecognition`)
- **Build Tool / Dev Server**: [Vite](https://vitejs.dev/)

---

## 🚀 วิธีการติดตั้งและรันใช้งาน (Getting Started)

1. **ติดตั้ง Dependencies:**
   ```bash
   npm install
   ```

2. **เปิด Dev Server:**
   ```bash
   npm run dev
   ```
   เข้าใช้งานผ่านเบราว์เซอร์ที่: `http://localhost:3000/`

3. **บิลด์สำหรับ Production:**
   ```bash
   npm run build
   ```

---

## 📂 โครงสร้างโปรเจกต์ (Project Structure)
```
├── assets/                  # ไฟล์รูปภาพตัวละครและหน้าปกนิยาย
├── src/
│   ├── components/
│   │   ├── Navigation.js        # แถบเมนูด้านบนและเครดิต
│   │   ├── StoryCreator.js      # กล่องป้อนพล็อตและสร้างนิยาย
│   │   ├── CharacterStudio.js   # สตูดิโอตัวละครและแถบ Drawer
│   │   ├── RelationshipGraph.js # กราฟความสัมพันธ์บน Canvas
│   │   ├── StoryLibrary.js      # หน้ารวมคอลเลกชันนิยาย
│   │   ├── StoryReader.js       # หน้าอ่านนิยายและปรับแต่งฟอนต์/ธีม
│   │   ├── AudiobookPlayer.js   # แถบเล่นเสียงพากย์ด้านล่าง
│   │   └── UpgradeModal.js      # ป๊อปอัปแผนและเครดิต
│   ├── data/
│   │   └── mockData.js          # ข้อมูลเริ่มต้น (ตัวละคร, นิยาย, เสียง)
│   ├── services/
│   │   ├── store.js             # LocalStorage Reactive State Management
│   │   └── audioService.js      # ตัวจัดการระบบเสียงพากย์ SpeechSynthesis
│   └── main.js                  # จุดเริ่มต้นของแอปพลิเคชันและการสลับหน้า
├── index.html               # หน้า HTML หลัก
├── index.css                # ดีไซน์ระบบสี ตัวอักษร และแอนิเมชัน
└── package.json
```
