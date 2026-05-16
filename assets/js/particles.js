// ─── PARTICLE GRID CANVAS ───
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let W, H, nodes = [], frame = 0;

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}

function initNodes() {
  nodes = [];
  const cols = Math.floor(W / 80);
  const rows = Math.floor(H / 80);
  for (let i = 0; i <= cols; i++) {
    for (let j = 0; j <= rows; j++) {
      nodes.push({
        x: i * (W / cols), y: j * (H / rows),
        ox: i * (W / cols), oy: j * (H / rows),
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 1.5 + 0.5,
        active: Math.random() > 0.6
      });
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, W, H);
  frame++;

  nodes.forEach(n => {
    n.x += n.vx;
    n.y += n.vy;
    if (Math.abs(n.x - n.ox) > 30) n.vx *= -1;
    if (Math.abs(n.y - n.oy) > 30) n.vy *= -1;
  });

  // connections
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[j].x - nodes[i].x;
      const dy = nodes[j].y - nodes[i].y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 100) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(0,229,255,${0.12 * (1 - d / 100)})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.stroke();
      }
    }
  }

  // data flow packets
  nodes.forEach((n, i) => {
    const pulse = Math.sin(frame * 0.03 + i * 0.7) > 0.85;
    ctx.beginPath();
    ctx.arc(n.x, n.y, pulse ? n.size * 2 : n.size, 0, Math.PI * 2);
    ctx.fillStyle = pulse ? 'rgba(0,255,136,0.8)' : 'rgba(0,229,255,0.4)';
    ctx.fill();
  });

  requestAnimationFrame(draw);
}

resize();
initNodes();
draw();
window.addEventListener('resize', () => { resize(); initNodes(); });
