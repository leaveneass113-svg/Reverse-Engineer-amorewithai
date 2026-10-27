import { store } from '../services/store.js';

export class RelationshipGraph {
  constructor(container) {
    this.container = container;
    this.characters = store.getCharacters();
    this.relationships = store.getRelationships();
    this.canvas = null;
    this.ctx = null;
    this.nodes = [];
    this.draggedNode = null;
    this.hoveredNode = null;
    this.animationId = null;

    this.render();
    this.initNodes();
    this.initCanvas();
  }

  initNodes() {
    const width = 800;
    const height = 500;
    const count = this.characters.length || 1;
    const radius = 170;
    const centerX = width / 2;
    const centerY = height / 2;

    this.nodes = this.characters.map((char, i) => {
      const angle = (i / count) * 2 * Math.PI - Math.PI / 2;
      const img = new Image();
      img.src = char.avatar;
      return {
        id: char.id,
        name: char.name,
        role: char.role,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        vx: 0,
        vy: 0,
        r: 34,
        img
      };
    });
  }

  initCanvas() {
    this.canvas = this.container.querySelector('#relation-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    // Resize handling
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width * window.devicePixelRatio;
    this.canvas.height = rect.height * window.devicePixelRatio;
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    this.setupEvents();
    this.startLoop();
  }

  setupEvents() {
    const getPos = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    this.canvas.addEventListener('mousedown', (e) => {
      const pos = getPos(e);
      for (const node of this.nodes) {
        const dx = pos.x - node.x;
        const dy = pos.y - node.y;
        if (Math.sqrt(dx * dx + dy * dy) <= node.r) {
          this.draggedNode = node;
          break;
        }
      }
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.canvas) return;
      const pos = getPos(e);
      if (this.draggedNode) {
        this.draggedNode.x = pos.x;
        this.draggedNode.y = pos.y;
      } else {
        let found = null;
        for (const node of this.nodes) {
          const dx = pos.x - node.x;
          const dy = pos.y - node.y;
          if (Math.sqrt(dx * dx + dy * dy) <= node.r) {
            found = node;
            break;
          }
        }
        this.hoveredNode = found;
        this.canvas.style.cursor = found ? 'grab' : 'default';
      }
    });

    window.addEventListener('mouseup', () => {
      this.draggedNode = null;
    });
  }

  startLoop() {
    const draw = () => {
      if (!this.ctx || !this.canvas) return;
      const rect = this.canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      this.ctx.clearRect(0, 0, w, h);

      // Draw subtle grid
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      this.ctx.lineWidth = 1;
      const step = 40;
      for (let x = 0; x < w; x += step) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, 0);
        this.ctx.lineTo(x, h);
        this.ctx.stroke();
      }
      for (let y = 0; y < h; y += step) {
        this.ctx.beginPath();
        this.ctx.moveTo(0, y);
        this.ctx.lineTo(w, y);
        this.ctx.stroke();
      }

      // Draw relationship links
      for (const rel of this.relationships) {
        const n1 = this.nodes.find(n => n.id === rel.char1Id);
        const n2 = this.nodes.find(n => n.id === rel.char2Id);
        if (!n1 || !n2) continue;

        // Line
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.moveTo(n1.x, n1.y);
        this.ctx.lineTo(n2.x, n2.y);

        let strokeColor = 'rgba(207, 41, 97, 0.6)';
        if (rel.kind === 'Rivals' || rel.kind.includes('คู่ปรับ')) strokeColor = 'rgba(239, 68, 68, 0.6)';
        if (rel.kind === 'Exes' || rel.kind.includes('อดีต')) strokeColor = 'rgba(156, 163, 175, 0.6)';

        this.ctx.strokeStyle = strokeColor;
        this.ctx.lineWidth = 2.5;
        this.ctx.setLineDash([4, 4]);
        this.ctx.stroke();
        this.ctx.restore();

        // Badge at midpoint
        const mx = (n1.x + n2.x) / 2;
        const my = (n1.y + n2.y) / 2;

        this.ctx.save();
        this.ctx.font = '600 11px Prompt, DM Sans, sans-serif';
        const label = rel.kind;
        const metrics = this.ctx.measureText(label);
        const padX = 8;
        const padY = 4;
        const bw = metrics.width + padX * 2;
        const bh = 18;

        this.ctx.fillStyle = '#1c1b24';
        this.ctx.strokeStyle = strokeColor;
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.roundRect(mx - bw / 2, my - bh / 2, bw, bh, 9);
        this.ctx.fill();
        this.ctx.stroke();

        this.ctx.fillStyle = '#f5f4f8';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(label, mx, my);
        this.ctx.restore();
      }

      // Draw nodes
      for (const node of this.nodes) {
        this.ctx.save();
        // Outer halo
        this.ctx.beginPath();
        this.ctx.arc(node.x, node.y, node.r + 4, 0, Math.PI * 2);
        this.ctx.fillStyle = node === this.hoveredNode ? 'rgba(207, 41, 97, 0.4)' : 'rgba(255, 255, 255, 0.05)';
        this.ctx.fill();

        // Avatar circle clip
        this.ctx.beginPath();
        this.ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
        this.ctx.clip();

        if (node.img && node.img.complete && node.img.naturalWidth > 0) {
          this.ctx.drawImage(node.img, node.x - node.r, node.y - node.r, node.r * 2, node.r * 2);
        } else {
          this.ctx.fillStyle = '#372338';
          this.ctx.fill();
        }

        // Border
        this.ctx.restore();
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
        this.ctx.strokeStyle = '#cf2961';
        this.ctx.lineWidth = 2.5;
        this.ctx.stroke();

        // Node label
        this.ctx.font = '700 13px Prompt, DM Sans, sans-serif';
        this.ctx.fillStyle = '#f5f4f8';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(node.name, node.x, node.y + node.r + 16);

        this.ctx.font = '500 10px Prompt, DM Sans, sans-serif';
        this.ctx.fillStyle = '#9e99ab';
        this.ctx.fillText(node.role, node.x, node.y + node.r + 29);
        this.ctx.restore();
      }

      this.animationId = requestAnimationFrame(draw);
    };

    draw();
  }

  resetView() {
    this.initNodes();
  }

  render() {
    this.container.innerHTML = `
      <div class="relationship-canvas-container">
        <div class="relationship-canvas-toolbar">
          <button class="btn-secondary" id="btn-reset-layout" style="font-size: 0.8rem; padding: 0.35rem 0.75rem;">
            <span>🔄</span>
            <span>รีเซ็ตมุมมอง</span>
          </button>
          <button class="btn-secondary" id="btn-tidy-layout" style="font-size: 0.8rem; padding: 0.35rem 0.75rem;">
            <span>✨</span>
            <span>จัดระเบียบผัง</span>
          </button>
        </div>
        <canvas class="relationship-canvas" id="relation-canvas"></canvas>
      </div>

      <div class="relationship-legend">
        <div class="legend-item"><span class="legend-badge" style="background:#cf2961"></span><span>คนรัก / ความสัมพันธ์ลึกซึ้ง</span></div>
        <div class="legend-item"><span class="legend-badge" style="background:#ef4444"></span><span>คู่ปรับ / คู่แข่ง</span></div>
        <div class="legend-item"><span class="legend-badge" style="background:#9ca3af"></span><span>อดีตคนรัก</span></div>
        <div class="legend-item"><span class="legend-badge" style="background:#10b981"></span><span>พันธมิตร / สหายสนิท</span></div>
      </div>
    `;

    this.container.querySelector('#btn-reset-layout')?.addEventListener('click', () => this.resetView());
    this.container.querySelector('#btn-tidy-layout')?.addEventListener('click', () => this.resetView());
  }
}
