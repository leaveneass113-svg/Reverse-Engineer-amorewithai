import { store } from '../services/store.js';

export class UpgradeModal {
  constructor(container, onClose) {
    this.container = container;
    this.onClose = onClose;
    this.render();
  }

  addCredits(amount) {
    store.addCredits(amount);
    alert(`เติมเครดิต 💎 ${amount} เข้าบัญชีของคุณเรียบร้อยแล้ว!`);
    this.onClose();
  }

  render() {
    this.container.innerHTML = `
      <div class="modal-backdrop" id="upgrade-modal-backdrop">
        <div class="modal-content">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1.5rem;">
            <div>
              <span style="font-size:0.8rem; color:var(--primary); font-weight:700; text-transform:uppercase; letter-spacing:0.06em;">สมาชิก & เครดิต</span>
              <h2 style="font-size:2rem; font-weight:700; margin-top:0.25rem;">ปลดล็อกสตูดิโอแต่งนิยายเต็มรูปแบบ</h2>
            </div>
            <button class="icon-btn" id="btn-close-upgrade" style="font-size:1.5rem;">×</button>
          </div>

          <p style="color:var(--text-secondary); margin-bottom:2rem; line-height:1.6;">
            แต่งนิยายรักได้ไม่จำกัด ออกแบบตัวละครพร้อมเสียงพากย์ AI เฉพาะตัว และฟังหนังสือเสียงได้แบบไร้ขีดจำกัด
          </p>

          <div style="background:var(--bg-surface-elevated); border:1px solid var(--border-medium); border-radius:var(--radius-lg); padding:1.5rem; margin-bottom:1.75rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
              <h3 style="font-size:1.3rem; font-weight:700;">แพ็กเกจนักเขียน (Author Plan)</h3>
              <span style="font-size:1.4rem; font-weight:700; color:#ff6896;">฿690 <span style="font-size:0.85rem; color:var(--text-muted); font-weight:400;">/ เดือน</span></span>
            </div>
            <ul style="color:var(--text-secondary); font-size:0.92rem; list-style:none; display:flex; flex-direction:column; gap:0.6rem;">
              <li>✨ <strong>600 เครดิต</strong> ทุกเดือน (แต่งนิยายได้สูงสุด 100 ตอน)</li>
              <li>🎙️ <strong>สิทธิ์เข้าถึงเสียงพากย์พรีเมียม</strong> (Sophia, Liam, Alexander, Emma)</li>
              <li>👥 <strong>สร้างตัวละครและผังความสัมพันธ์ได้ไม่จำกัด</strong></li>
              <li>⚡ <strong>ระบบ AI สร้างเรื่องราวความเร็วสูง ไร้การปิดกั้น</strong></li>
            </ul>
          </div>

          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1rem; margin-bottom:1.5rem;">
            <button class="btn-secondary" id="btn-add-150" style="padding:0.75rem; justify-content:center; text-align:center;">
              + 150 เครดิต (ทดลองใช้งาน)
            </button>
            <button class="btn-create-story" id="btn-add-600" style="padding:0.75rem; justify-content:center; text-align:center;">
              + 600 เครดิต (นักเขียน)
            </button>
          </div>

          <p style="text-align:center; font-size:0.78rem; color:var(--text-muted);">
            ไม่มีข้อผูกมัด ยกเลิกหรือเปลี่ยนแผนได้ตลอดเวลาเพียงคลิกเดียว
          </p>
        </div>
      </div>
    `;

    this.container.querySelector('#upgrade-modal-backdrop').addEventListener('click', (e) => {
      if (e.target.id === 'upgrade-modal-backdrop') this.onClose();
    });
    this.container.querySelector('#btn-close-upgrade').addEventListener('click', () => this.onClose());
    this.container.querySelector('#btn-add-150').addEventListener('click', () => this.addCredits(150));
    this.container.querySelector('#btn-add-600').addEventListener('click', () => this.addCredits(600));
  }
}
