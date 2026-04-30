/* ════════════════════════════════════════
   JASMIN ✦ SOB O LUAR — script.js (v3)
════════════════════════════════════════ */

// ── CONFIG ──────────────────────────────
const CFG = {
  startDate: new Date('2026-04-24T00:00:00'),
  toasts: [
    'Você é a minha lua ✦',
    'Te amo mais a cada segundo 🌙',
    'Cada momento com você é mágico ✨',
    'Você perfuma minha vida, Jasmin 🌸',
    'Meu coração só bate por você 💝',
    'Para sempre ao seu lado 💫',
    'Você é minha estrela favorita ✦',
    'Amor eterno e sem fim ❤️',
    'Você ilumina até a noite mais escura 🌙',
    'Obrigado por me escolher 💕',
    'Com você o mundo é mais bonito 🌸',
    'Você é meu jardim de jasmim ✦',
  ],
  particles: ['✦','❤️','💕','💖','🌸','✨','💫','🌙','🌼','💝','☽','🌟'],
  updateMs: 10,
};

// ── UTILS ───────────────────────────────
const $  = id => document.getElementById(id);
const pad = (n, l=2) => String(n).padStart(l, '0');

function calcTime() {
  const diff = Date.now() - CFG.startDate;
  if (diff < 0) return { years:0,months:0,weeks:0,days:0,hours:0,minutes:0,seconds:0,ms:0,totalH:0,totalM:0 };
  const ms   = diff % 1000;
  const totS = Math.floor(diff / 1000);
  const totM = Math.floor(totS / 60);
  const totH = Math.floor(totM / 60);
  const days = Math.floor(totH / 24);
  return {
    years:  Math.floor(days / 365.25),
    months: Math.floor(days / 30.44),
    weeks:  Math.floor(days / 7),
    days, hours: totH%24, minutes: totM%60, seconds: totS%60, ms,
    totalH: totH, totalM: totM,
  };
}

function setTxt(id, v) {
  const el = $(id);
  if (el && el.textContent !== String(v)) el.textContent = v;
}

function updateCounters() {
  const t = calcTime();
  setTxt('years',         t.years.toLocaleString('pt-BR'));
  setTxt('days',          t.days.toLocaleString('pt-BR'));
  setTxt('months',        t.months.toLocaleString('pt-BR'));
  setTxt('weeks',         t.weeks.toLocaleString('pt-BR'));
  setTxt('total-hours',   t.totalH.toLocaleString('pt-BR'));
  setTxt('total-minutes', t.totalM.toLocaleString('pt-BR'));
  setTxt('hours',         pad(t.hours));
  setTxt('minutes',       pad(t.minutes));
  setTxt('seconds',       pad(t.seconds));
  setTxt('milliseconds',  pad(t.ms, 3));
}

function animateCount(id, end, dur=2200) {
  const el = $(id);
  if (!el) return;
  const t0 = performance.now();
  const tick = now => {
    const p = Math.min((now-t0)/dur, 1);
    const e = 1 - Math.pow(1-p, 4);
    el.textContent = Math.floor(end * e).toLocaleString('pt-BR');
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

// ══════════════════════════════════════════
// LUA — canvas com textura realista
// ══════════════════════════════════════════
(function drawMoon() {
  const cv  = $('moonCanvas');
  if (!cv) return;
  const ctx = cv.getContext('2d');
  const W = 160, H = 160, R = 72, cx = 80, cy = 80;

  // Base lunar
  const baseGrad = ctx.createRadialGradient(cx-18, cy-18, 0, cx, cy, R);
  baseGrad.addColorStop(0.0, '#fdfaf2');
  baseGrad.addColorStop(0.3, '#f5eedb');
  baseGrad.addColorStop(0.6, '#e8d9b0');
  baseGrad.addColorStop(0.85,'#d4be86');
  baseGrad.addColorStop(1.0, '#b89c5a');
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI*2);
  ctx.fillStyle = baseGrad; ctx.fill();

  // Sombra lateral (fase quase cheia)
  const shadowGrad = ctx.createRadialGradient(cx+40, cy, 10, cx+55, cy, R*1.1);
  shadowGrad.addColorStop(0,   'rgba(60,30,10,0.0)');
  shadowGrad.addColorStop(0.5, 'rgba(40,20,8,0.12)');
  shadowGrad.addColorStop(1.0, 'rgba(20,10,4,0.35)');
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI*2);
  ctx.fillStyle = shadowGrad; ctx.fill();

  // Textura — maria (manchas escuras)
  const maria = [
    { x:55, y:52, rx:18, ry:12, a:-0.3, op:0.10 },
    { x:72, y:68, rx:14, ry:10, a: 0.2, op:0.08 },
    { x:48, y:82, rx:10, ry: 7, a:-0.1, op:0.07 },
    { x:88, y:58, rx: 9, ry: 6, a: 0.4, op:0.06 },
    { x:65, y:95, rx:12, ry: 8, a:-0.2, op:0.07 },
    { x:38, y:62, rx: 8, ry: 5, a: 0.1, op:0.06 },
  ];
  for (const m of maria) {
    ctx.save();
    ctx.translate(m.x, m.y);
    ctx.rotate(m.a);
    ctx.beginPath();
    ctx.ellipse(0, 0, m.rx, m.ry, 0, 0, Math.PI*2);
    ctx.fillStyle = `rgba(120,85,30,${m.op})`;
    ctx.fill();
    ctx.restore();
  }

  // Crateras pequenas
  const craters = [
    { x:48, y:48, r:6,  depth:0.18 },
    { x:100,y:62, r:5,  depth:0.16 },
    { x:64, y:95, r:4,  depth:0.14 },
    { x:38, y:78, r:3.5,depth:0.12 },
    { x:88, y:88, r:4,  depth:0.14 },
    { x:112,y:50, r:3,  depth:0.10 },
    { x:58, y:110,r:3.5,depth:0.12 },
    { x:30, y:55, r:2.5,depth:0.10 },
    { x:105,y:100,r:3,  depth:0.10 },
  ];
  for (const c of craters) {
    // Borda iluminada
    ctx.beginPath(); ctx.arc(c.x-1, c.y-1, c.r, 0, Math.PI*2);
    ctx.fillStyle = `rgba(255,248,230,${c.depth*0.5})`; ctx.fill();
    // Fundo escuro
    ctx.beginPath(); ctx.arc(c.x+0.5, c.y+0.5, c.r*0.8, 0, Math.PI*2);
    ctx.fillStyle = `rgba(80,50,15,${c.depth})`; ctx.fill();
    // Anel sombra
    const rg = ctx.createRadialGradient(c.x, c.y, c.r*0.3, c.x, c.y, c.r);
    rg.addColorStop(0, 'transparent');
    rg.addColorStop(1, `rgba(60,35,10,${c.depth*0.6})`);
    ctx.beginPath(); ctx.arc(c.x, c.y, c.r, 0, Math.PI*2);
    ctx.fillStyle = rg; ctx.fill();
  }

  // Highlight especular
  const hiGrad = ctx.createRadialGradient(cx-25, cy-28, 0, cx-25, cy-28, 55);
  hiGrad.addColorStop(0,   'rgba(255,252,245,0.38)');
  hiGrad.addColorStop(0.4, 'rgba(255,248,235,0.10)');
  hiGrad.addColorStop(1,   'transparent');
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI*2);
  ctx.fillStyle = hiGrad; ctx.fill();

  // Borda suave
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI*2);
  ctx.strokeStyle = 'rgba(245,240,220,0.15)'; ctx.lineWidth = 1; ctx.stroke();
})();

// ══════════════════════════════════════════
// CÉU — estrelas + meteoros ocasionais
// ══════════════════════════════════════════
(function initUniverse() {
  const cv  = $('universeCanvas');
  if (!cv) return;
  const ctx = cv.getContext('2d');
  let W, H, stars = [], meteors = [];

  function resize() {
    W = cv.width  = window.innerWidth;
    H = cv.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Gera estrelas
  for (let i = 0; i < 320; i++) {
    stars.push({
      x:   Math.random(),
      y:   Math.random() * 0.80,
      r:   0.35 + Math.random() * 1.35,
      a:   0.15 + Math.random() * 0.85,
      sp:  0.004 + Math.random() * 0.014,
      ph:  Math.random() * Math.PI * 2,
      gold:Math.random() < 0.10,
      big: Math.random() < 0.06,
    });
  }

  // Meteoro
  function spawnMeteor() {
    meteors.push({
      x: Math.random() * W * 0.7,
      y: Math.random() * H * 0.35,
      vx: 5 + Math.random() * 6,
      vy: 2 + Math.random() * 3,
      len: 80 + Math.random() * 120,
      alpha: 0.9,
      life: 1,
    });
  }
  // Meteoro a cada 14–28s
  setInterval(() => { if (Math.random() < 0.5) spawnMeteor(); },
    14000 + Math.random() * 14000);

  let t = 0;
  function drawNebula() {
    const g1 = ctx.createRadialGradient(W*.18, H*.14, 0, W*.18, H*.14, W*.3);
    g1.addColorStop(0, 'rgba(138,114,184,0.04)');
    g1.addColorStop(1, 'transparent');
    ctx.fillStyle = g1; ctx.fillRect(0,0,W,H);
    const g2 = ctx.createRadialGradient(W*.78, H*.20, 0, W*.78, H*.20, W*.22);
    g2.addColorStop(0, 'rgba(200,168,75,0.025)');
    g2.addColorStop(1, 'transparent');
    ctx.fillStyle = g2; ctx.fillRect(0,0,W,H);
  }

  function loop() {
    ctx.clearRect(0,0,W,H);
    drawNebula();
    t += 0.007;

    // Estrelas
    for (const s of stars) {
      const flicker = s.a * (0.45 + 0.55 * Math.sin(t * s.sp * 90 + s.ph));
      ctx.beginPath();
      ctx.arc(s.x*W, s.y*H, s.r, 0, Math.PI*2);
      ctx.fillStyle = s.gold
        ? `rgba(200,168,75,${flicker})`
        : `rgba(245,240,232,${flicker})`;
      ctx.fill();

      // Brilho em cruz para estrelas maiores
      if (s.big) {
        ctx.save();
        ctx.globalAlpha = flicker * 0.5;
        ctx.strokeStyle = s.gold ? 'rgba(200,168,75,0.8)' : 'rgba(245,240,232,0.8)';
        ctx.lineWidth = 0.6;
        const cx2 = s.x*W, cy2 = s.y*H, len = s.r * 5;
        ctx.beginPath();
        ctx.moveTo(cx2-len, cy2); ctx.lineTo(cx2+len, cy2);
        ctx.moveTo(cx2, cy2-len); ctx.lineTo(cx2, cy2+len);
        ctx.stroke();
        ctx.restore();
      }
    }

    // Meteoros
    for (let i = meteors.length-1; i >= 0; i--) {
      const m = meteors[i];
      const grad = ctx.createLinearGradient(m.x, m.y, m.x-m.len, m.y-m.len*0.4);
      grad.addColorStop(0, `rgba(245,240,232,${m.alpha})`);
      grad.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.moveTo(m.x, m.y);
      ctx.lineTo(m.x - m.len, m.y - m.len * 0.4);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      m.x += m.vx; m.y += m.vy;
      m.alpha -= 0.025;
      if (m.alpha <= 0) meteors.splice(i, 1);
    }

    requestAnimationFrame(loop);
  }
  loop();
})();

// ══════════════════════════════════════════
// VAGA-LUMES
// ══════════════════════════════════════════
(function initFireflies() {
  const cv  = $('fireflyCanvas');
  if (!cv) return;
  const ctx = cv.getContext('2d');
  let W, H;
  function resize() { W = cv.width = window.innerWidth; H = cv.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  const flies = Array.from({length: 22}, () => ({
    x:  Math.random() * window.innerWidth,
    y:  0.35*window.innerHeight + Math.random()*0.6*window.innerHeight,
    vx: (Math.random()-0.5)*0.4,
    vy: (Math.random()-0.5)*0.3,
    r:  1 + Math.random()*1.5,
    ph: Math.random()*Math.PI*2,
    sp: 0.03 + Math.random()*0.05,
    gold: Math.random() < 0.4,
  }));

  function loop() {
    ctx.clearRect(0,0,W,H);
    for (const f of flies) {
      f.ph += f.sp;
      f.x += f.vx + Math.sin(f.ph*0.7)*0.5;
      f.y += f.vy + Math.cos(f.ph*0.5)*0.3;
      if (f.x < 0) f.x = W; if (f.x > W) f.x = 0;
      if (f.y < H*0.3) f.y = H*0.9; if (f.y > H) f.y = H*0.35;

      const glow = 0.3 + 0.7 * (0.5 + 0.5*Math.sin(f.ph));
      const color = f.gold ? `rgba(200,168,75,${glow})` : `rgba(220,240,200,${glow*0.7})`;

      // Halo
      const gr = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r*6);
      gr.addColorStop(0, color);
      gr.addColorStop(1, 'transparent');
      ctx.beginPath(); ctx.arc(f.x, f.y, f.r*6, 0, Math.PI*2);
      ctx.fillStyle = gr; ctx.fill();

      // Núcleo
      ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, Math.PI*2);
      ctx.fillStyle = f.gold ? `rgba(240,220,140,${glow})` : `rgba(200,230,160,${glow*0.8})`;
      ctx.fill();
    }
    requestAnimationFrame(loop);
  }
  loop();
})();

// ══════════════════════════════════════════
// PÉTALAS
// ══════════════════════════════════════════
(function initPetals() {
  const cv  = $('petalCanvas');
  if (!cv) return;
  const ctx = cv.getContext('2d');
  let W, H;
  function resize() { W = cv.width = window.innerWidth; H = cv.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  const COLS = [
    'rgba(245,240,232,0.55)',
    'rgba(240,230,200,0.50)',
    'rgba(212,196,144,0.45)',
    'rgba(200,168,75, 0.35)',
    'rgba(138,114,184,0.30)',
    'rgba(220,190,180,0.40)',
  ];

  const petals = Array.from({length:32}, (_, i) => {
    const p = newPetal();
    p.y = Math.random() * window.innerHeight;
    return p;
  });

  function newPetal() {
    return {
      x:   Math.random() * (W || window.innerWidth),
      y:   -20,
      rx:  3 + Math.random()*7,
      ry:  2 + Math.random()*4,
      col: COLS[Math.floor(Math.random()*COLS.length)],
      sp:  0.45 + Math.random()*0.9,
      drift: (Math.random()-0.5)*0.55,
      rot:  Math.random()*Math.PI*2,
      rotV: (Math.random()-0.5)*0.035,
      wb:  Math.random()*Math.PI*2,
      wbS: 0.018 + Math.random()*0.022,
    };
  }

  function loop() {
    ctx.clearRect(0,0,W,H);
    for (const p of petals) {
      p.wb  += p.wbS;
      p.x   += p.drift + Math.sin(p.wb)*0.7;
      p.y   += p.sp;
      p.rot += p.rotV;
      if (p.y > H+20) Object.assign(p, newPetal());

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.beginPath();
      ctx.ellipse(0, 0, p.rx, p.ry, 0, 0, Math.PI*2);
      ctx.fillStyle = p.col;
      ctx.fill();
      ctx.restore();
    }
    requestAnimationFrame(loop);
  }
  loop();
})();

// ══════════════════════════════════════════
// GALHOS DE JASMIM (SVG botânico)
// ══════════════════════════════════════════
(function initBranches() {
  function makeSVG() {
    // Funções de forma
    function leaf(x, y, angle, scale, op) {
      const s = scale;
      return `<g transform="translate(${x},${y}) rotate(${angle})">
        <path d="M 0 0 C ${-8*s} ${-12*s} ${-6*s} ${-24*s} 0 ${-28*s}
                       C ${6*s} ${-24*s} ${8*s} ${-12*s} 0 0 Z"
              fill="rgba(140,185,120,${op})" stroke="rgba(100,150,80,${op*0.6})" stroke-width="0.5"/>
        <line x1="0" y1="0" x2="0" y2="${-26*s}"
              stroke="rgba(90,130,70,${op*0.5})" stroke-width="0.5"/>
      </g>`;
    }

    function flower(x, y, scale, bright) {
      const s = scale;
      // Lírio azul — 6 pétalas longas e elegantes em azul/violeta
      const petCols = bright
        ? ['rgba(120,150,230,0.90)','rgba(100,130,220,0.88)','rgba(140,160,240,0.92)','rgba(110,140,225,0.86)','rgba(130,155,235,0.90)','rgba(105,135,222,0.87)']
        : ['rgba(90,115,195,0.72)','rgba(80,105,185,0.70)','rgba(100,125,205,0.74)','rgba(85,110,190,0.68)','rgba(95,120,200,0.72)','rgba(82,108,188,0.69)'];
      const veins = bright ? 'rgba(180,200,255,0.45)' : 'rgba(150,170,230,0.30)';
      const centerCol = bright ? 'rgba(255,240,150,0.90)' : 'rgba(220,200,100,0.75)';
      let petals = '';
      for (let i = 0; i < 6; i++) {
        const a = i * 60;
        // Pétalas longas e estreitas do lírio
        petals += `<g transform="rotate(${a} ${x} ${y})">
          <ellipse cx="${x}" cy="${y - 13*s}" rx="${3.5*s}" ry="${12*s}"
            fill="${petCols[i]}" opacity="0.92"/>
          <line x1="${x}" y1="${y-2*s}" x2="${x}" y2="${y-23*s}"
            stroke="${veins}" stroke-width="${0.6*s}" opacity="0.5"/>
        </g>`;
      }
      return `<g filter="url(#lglow)">
        ${petals}
        <circle cx="${x}" cy="${y}" r="${3.2*s}" fill="${centerCol}"/>
        <circle cx="${x}" cy="${y}" r="${1.4*s}" fill="rgba(255,252,200,0.95)"/>
        <circle cx="${x}" cy="${y}" r="${0.6*s}" fill="rgba(255,255,240,1)"/>
      </g>`;
    }

    function bud(x, y, scale) {
      const s = scale;
      return `<g>
        <ellipse cx="${x}" cy="${y}" rx="${2.8*s}" ry="${5*s}"
          fill="rgba(110,140,215,0.55)" stroke="rgba(130,160,230,0.40)" stroke-width="0.5"/>
        <ellipse cx="${x}" cy="${y+1*s}" rx="${2.2*s}" ry="${4*s}"
          fill="rgba(140,165,235,0.65)"/>
      </g>`;
    }

    return `<svg viewBox="0 0 340 960" xmlns="http://www.w3.org/2000/svg"
        style="width:100%;height:100%;position:absolute;top:0;left:0">
      <defs>
        <filter id="jglow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="2" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="lglow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      <!-- Caule principal -->
      <path d="M 300 960 C 285 820 265 700 240 590
                           C 218 490 185 400 160 305
                           C 138 220 130 130 145 40"
            fill="none" stroke="rgba(120,155,210,0.20)" stroke-width="2.8"
            stroke-linecap="round" stroke-linejoin="round"/>

      <!-- Galhos -->
      <path d="M 258 730 C 228 708 195 702 162 710"
            fill="none" stroke="rgba(120,155,210,0.18)" stroke-width="2" stroke-linecap="round"/>
      <path d="M 248 590 C 272 565 288 545 295 520"
            fill="none" stroke="rgba(120,155,210,0.18)" stroke-width="1.8" stroke-linecap="round"/>
      <path d="M 222 455 C 190 430 165 418 140 424"
            fill="none" stroke="rgba(120,155,210,0.17)" stroke-width="1.7" stroke-linecap="round"/>
      <path d="M 200 330 C 228 308 248 290 255 265"
            fill="none" stroke="rgba(120,155,210,0.17)" stroke-width="1.6" stroke-linecap="round"/>
      <path d="M 175 215 C 145 193 120 178 118 155"
            fill="none" stroke="rgba(120,155,210,0.15)" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M 155 110 C 178 90 190 72 192 50"
            fill="none" stroke="rgba(120,155,210,0.14)" stroke-width="1.4" stroke-linecap="round"/>

      <!-- Folhas -->
      ${leaf(245, 640, -35, 1.0, 0.30)} ${leaf(258, 630,  30, 0.9, 0.25)}
      ${leaf(230, 510, -28, 0.95,0.28)} ${leaf(245, 500,  38, 0.85,0.22)}
      ${leaf(208, 382, -32, 0.9, 0.26)} ${leaf(222, 372,  35, 0.80,0.22)}
      ${leaf(195, 268, -25, 0.85,0.24)} ${leaf(208, 258,  40, 0.75,0.20)}
      ${leaf(175, 170, -20, 0.80,0.22)} ${leaf(185, 160,  32, 0.70,0.18)}
      ${leaf(160,  85, -18, 0.75,0.20)} ${leaf(168,  75,  28, 0.65,0.17)}
      ${leaf(282, 565,  22, 0.75,0.18)} ${leaf(190, 420, -22, 0.70,0.18)}

      <!-- Flores abertas -->
      ${flower(162, 712, 1.00, true)}
      ${flower(295, 518, 0.90, true)}
      ${flower(140, 426, 0.95, true)}
      ${flower(253, 262, 0.85, true)}
      ${flower(118, 154, 0.90, true)}
      ${flower(192,  48, 0.80, true)}
      ${flower(310, 420, 0.70, false)}
      ${flower(178, 560, 0.75, false)}
      ${flower(148, 310, 0.78, false)}
      ${flower(240, 660, 0.65, false)}
      ${flower(100, 195, 0.70, false)}

      <!-- Botões -->
      ${bud(200, 685, 0.85)}
      ${bud(275, 495, 0.80)}
      ${bud(165, 398, 0.75)}
      ${bud(232, 240, 0.70)}
      ${bud(136, 130, 0.72)}
      ${bud(168,  22, 0.65)}
    </svg>`;
  }

  const svg = makeSVG();
  const L = $('branchLeft');
  const R = $('branchRight');
  if (L) L.innerHTML = svg;
  if (R) R.innerHTML = svg;

  // Florzinha pequena no footer
  const FJ = $('footerJasmine');
  if (FJ) {
    FJ.innerHTML = `<svg viewBox="0 80 340 120" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
      <defs>
        <filter id="lglow2" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <path d="M 80 200 C 120 170 200 165 260 195" fill="none" stroke="rgba(120,155,210,0.2)" stroke-width="1.5" stroke-linecap="round"/>
      <g filter="url(#lglow2)">
        ${[100,160,220].map(x => {
          const s = 0.7;
          let p = '';
          for(let i=0;i<6;i++){
            const a=i*60;
            p+=`<g transform="rotate(${a} ${x} 185)"><ellipse cx="${x}" cy="${185-13*s}" rx="${3.5*s}" ry="${12*s}" fill="rgba(110,140,220,0.72)"/></g>`;
          }
          return p + `<circle cx="${x}" cy="185" r="${3*s}" fill="rgba(255,240,140,0.80)"/>`;
        }).join('')}
      </g>
    </svg>`;
  }
})();

// ══════════════════════════════════════════
// CONSTELAÇÃO INTERATIVA
// ══════════════════════════════════════════
(function initConstellation() {
  const wrap = document.querySelector('.constellation-wrap');
  if (!wrap) return;

  const cv  = document.createElement('canvas');
  cv.id = 'constellationCanvas';
  const W = 800, H = 380;
  cv.width = W; cv.height = H;
  cv.style.cssText = 'display:block;width:100%;';
  wrap.appendChild(cv);
  const ctx = cv.getContext('2d');

  // Estrelas da constelação — um coração feito de estrelas
  const STARS = [
    // Nome, x, y, mensagem, cor
    { name:'Jasmin Vitória',     x:400, y:140, msg:'O centro de tudo ❤️',         r:10, special:true, col:['#fff0f2','#be41e7','#ff3f7a'] },
    { name:'Kaio',     x:400, y:268, msg:'Que te ama infinitamente 💕',  r:9.0,   col:['#fff0f2','#be41e7','#ff3f7a'] },
    { name:'Amor',     x:272, y:108, msg:'Que nasceu sob o luar 🌙',     r:5.5, col:['#db1530','#942525','#760f2c'] },
    { name:'Sorriso',  x:528, y:108, msg:'Que ilumina meu mundo ✨',      r:5.5, col:['#e8ddff','#b89ef0','#8a72b8'] },
    { name:'Lírio Azul',   x:200, y:188, msg:'Que floresce toda noite 🌸',   r:5,   col:['#280aaa','#0d0b75','#3021a2'] },
    { name:'Estrela',  x:600, y:188, msg:'Que me guia até você ✦',      r:5,   col:['#d0f5e8','#60d8a8','#28a870'] },
    { name:'Beijo',    x:308, y:318, msg:'Dado com todo meu amor 💋',        r:4.8, col:['#ffe0d8','#ff9080','#e05040'] },
    { name:'Abraço',   x:492, y:318, msg:'Que aquece a alma inteira 🤗', r:4.8, col:['#ffe0d8','#ff9080','#e05040'] },
    { name:'Futuro',   x:170, y:278, msg:'Que construiremos juntos 💫',  r:4.2, col:['#d8eeff','#80c8f8','#4090e0'] },
    { name:'Saudade',  x:630, y:278, msg:'Que antecede cada encontro 🌹',r:4.2, col:['#d8eeff','#80c8f8','#4090e0'] },
    { name:'Confiança',x:400, y:350, msg:'A base do nosso amor 💎',       r:4.2, col:['#fff8d0','#f8e870','#d0b830'] },
    { name:'Luz',      x:338, y:65,  msg:'Que você traz à minha vida ☀️', r:4,  col:['#fff0c0','#ffd060','#e0a020'] },
    { name:'Magia',    x:462, y:65,  msg:'De cada momento seu 🪄',       r:4,   col:['#f0d8ff','#d090ff','#9040e0'] },
  ];

  // Arestas (índices)
  const EDGES = [
    [0,2],[0,3],[0,1],[0,4],[0,5],
    [2,3],[2,4],[3,5],[4,9],[5,8],
    [4,6],[5,7],[6,10],[7,10],[8,6],[9,7],
    [1,6],[1,7],[6,7],[11,2],[12,3],[11,12],
  ];

  let hovered = -1, tooltip = null, twinkle = 0;

  // Tooltip
  tooltip = document.createElement('div');
  tooltip.style.cssText = `
    position:absolute;pointer-events:none;
    background:linear-gradient(135deg,rgba(13,8,32,0.97),rgba(20,14,40,0.97));
    border:1px solid rgba(200,168,75,0.35);border-radius:14px;
    padding:0.75rem 1.3rem;font-family:'Cormorant Infant',serif;
    font-style:italic;font-size:1rem;color:#f0e6c8;
    backdrop-filter:blur(20px);box-shadow:0 8px 40px rgba(0,0,0,0.7),0 0 20px rgba(138,114,184,0.15);
    opacity:0;transition:opacity 0.3s;white-space:nowrap;z-index:100;
    max-width:250px;white-space:normal;text-align:center;
  `;
  wrap.style.position = 'relative';
  wrap.appendChild(tooltip);

  // Nebula background particles
  const nebPts = Array.from({length:60}, () => ({
    x: Math.random()*W, y: Math.random()*H,
    r: 0.3 + Math.random()*1.2,
    a: 0.05 + Math.random()*0.25,
    ph: Math.random()*Math.PI*2,
    sp: 0.005 + Math.random()*0.01,
    col: ['rgba(138,114,184,','rgba(200,168,75,','rgba(80,160,220,','rgba(255,100,150,'][Math.floor(Math.random()*4)],
  }));

  function draw() {
    twinkle += 0.018;
    ctx.clearRect(0,0,W,H);

    // Nebula glow clouds
    const nebColors = [
      {x:220,y:160,r:180,c1:'rgba(138,114,184,0.07)',c2:'rgba(80,50,160,0.03)'},
      {x:580,y:200,r:160,c1:'rgba(200,168,75,0.06)', c2:'rgba(200,120,60,0.02)'},
      {x:400,y:280,r:200,c1:'rgba(80,160,220,0.05)', c2:'rgba(40,80,180,0.02)'},
      {x:310,y:90, r:120,c1:'rgba(200,80,150,0.05)', c2:'transparent'},
      {x:490,y:90, r:120,c1:'rgba(160,80,220,0.05)', c2:'transparent'},
    ];
    for (const n of nebColors) {
      const g = ctx.createRadialGradient(n.x,n.y,0,n.x,n.y,n.r);
      g.addColorStop(0, n.c1); g.addColorStop(1, n.c2);
      ctx.fillStyle = g; ctx.fillRect(0,0,W,H);
    }

    // Micro background stars
    for (const p of nebPts) {
      p.ph += p.sp;
      const a = p.a * (0.5 + 0.5*Math.sin(p.ph));
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = p.col + a + ')'; ctx.fill();
    }

    // Arestas — coloridas com gradiente entre estrelas
    for (const [a,b] of EDGES) {
      const sa = STARS[a], sb = STARS[b];
      const grd = ctx.createLinearGradient(sa.x,sa.y,sb.x,sb.y);
      grd.addColorStop(0, sa.col[1].replace(')',',0.55)').replace('rgb','rgba'));
      grd.addColorStop(0.5,'rgba(255,255,255,0.12)');
      grd.addColorStop(1, sb.col[1].replace(')',',0.55)').replace('rgb','rgba'));

      // Glow sob a linha
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(sa.x, sa.y); ctx.lineTo(sb.x, sb.y);
      ctx.strokeStyle = grd;
      ctx.lineWidth = 4;
      ctx.globalAlpha = 0.18;
      ctx.filter = 'blur(3px)';
      ctx.stroke();
      ctx.restore();

      // Linha principal
      ctx.beginPath();
      ctx.moveTo(sa.x, sa.y); ctx.lineTo(sb.x, sb.y);
      ctx.strokeStyle = grd;
      ctx.lineWidth = 1.2;
      ctx.globalAlpha = 1;
      ctx.setLineDash([5,7]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Estrelas
    for (let i = 0; i < STARS.length; i++) {
      const s = STARS[i];
      const isHov = i === hovered;
      const isSpecial = !!s.special;
      const tw = 0.75 + 0.25 * Math.sin(twinkle * (1.2+i*0.12) + i);
      const r = isHov ? s.r * 1.8 : s.r * tw * (isSpecial ? 1.18 : 1);
      const [c0,c1,c2] = s.col;

      // Outer nebula halo
      const outerSize = isSpecial ? r * 10 : r * 9;
      const outerH = ctx.createRadialGradient(s.x,s.y,0,s.x,s.y,outerSize);
      outerH.addColorStop(0, c2.replace(')', `,${isSpecial?0.35:0.25})`).replace('rgb','rgba'));
      outerH.addColorStop(0.4, c1.replace(')',`,`+ (isSpecial?0.12:0.08) +')').replace('rgb','rgba'));
      outerH.addColorStop(1, 'transparent');
      ctx.beginPath(); ctx.arc(s.x,s.y,outerSize,0,Math.PI*2);
      ctx.fillStyle = outerH; ctx.fill();

      // Inner glow
      const halo = ctx.createRadialGradient(s.x,s.y,0,s.x,s.y,r*4);
      halo.addColorStop(0, c1.replace(')',`,`+ (isHov?0.95:(isSpecial?0.75:0.5)) +')').replace('rgb','rgba'));
      halo.addColorStop(1, 'transparent');
      ctx.beginPath(); ctx.arc(s.x,s.y,r*4,0,Math.PI*2);
      ctx.fillStyle = halo; ctx.fill();

      // Núcleo com cor
      const core = ctx.createRadialGradient(s.x-r*0.3,s.y-r*0.4,0,s.x,s.y,r);
      core.addColorStop(0, '#ffffff');
      core.addColorStop(0.3, c0);
      core.addColorStop(0.7, c1);
      core.addColorStop(1,   c2);
      ctx.beginPath(); ctx.arc(s.x,s.y,r,0,Math.PI*2);
      ctx.fillStyle = core; ctx.fill();

      if (isSpecial) {
        ctx.save();
        ctx.strokeStyle = 'rgba(255,255,255,0.18)';
        ctx.lineWidth = 1;
        ctx.setLineDash([3,4]);
        ctx.beginPath(); ctx.arc(s.x, s.y, r * 5.8, 0, Math.PI*2);
        ctx.stroke();
        ctx.restore();
      }

      // Brilho em cruz colorido
      ctx.save();
      ctx.globalAlpha = isHov ? 0.9 : 0.5 * tw;
      ctx.strokeStyle = isHov ? c1 : c0;
      ctx.lineWidth = isHov ? 1.2 : 0.7;
      const len = r * (isHov ? 7 : 5);
      ctx.beginPath();
      ctx.moveTo(s.x-len,s.y); ctx.lineTo(s.x+len,s.y);
      ctx.moveTo(s.x,s.y-len); ctx.lineTo(s.x,s.y+len);
      ctx.stroke();
      // Diagonal faint
      ctx.globalAlpha = (isHov ? 0.4 : 0.18) * tw;
      const dLen = len * 0.65;
      ctx.beginPath();
      ctx.moveTo(s.x-dLen,s.y-dLen); ctx.lineTo(s.x+dLen,s.y+dLen);
      ctx.moveTo(s.x+dLen,s.y-dLen); ctx.lineTo(s.x-dLen,s.y+dLen);
      ctx.stroke();
      ctx.restore();

      // Rótulo
      ctx.save();
      ctx.font = `${isHov || isSpecial ? '600':'300'} ${isHov ? '13px' : isSpecial ? '12px' : '10.5px'} "Cinzel Decorative", serif`;
      ctx.fillStyle = isHov ? c0 : isSpecial ? '#ffd6ea' : 'rgba(200,185,160,0.55)';
      if (isHov || isSpecial) { ctx.shadowColor = c1; ctx.shadowBlur = 8; }
      ctx.textAlign = 'center';
      ctx.fillText(s.name, s.x, s.y + r + 17);
      ctx.restore();
    }

    requestAnimationFrame(draw);
  }
  draw();

  // Mouse / toque
  function getHit(mx, my) {
    const rect = cv.getBoundingClientRect();
    const scaleX = W / rect.width;
    const scaleY = H / rect.height;
    const cx2 = (mx - rect.left) * scaleX;
    const cy2 = (my - rect.top)  * scaleY;
    for (let i = 0; i < STARS.length; i++) {
      const s = STARS[i];
      const dist = Math.hypot(cx2-s.x, cy2-s.y);
      if (dist < s.r*4 + 10) return i;
    }
    return -1;
  }

  cv.addEventListener('mousemove', e => {
    const idx = getHit(e.clientX, e.clientY);
    hovered = idx;
    cv.style.cursor = idx >= 0 ? 'pointer' : 'default';
    if (idx >= 0) {
      const s = STARS[idx];
      const rect = cv.getBoundingClientRect();
      const sx = s.x / W * rect.width + rect.left - wrap.getBoundingClientRect().left;
      const sy = s.y / H * rect.height + rect.top  - wrap.getBoundingClientRect().top;
      tooltip.innerHTML = `<strong style="color:#e2c07a">${s.name}</strong><br>${s.msg}`;
      tooltip.style.left = (sx - 90) + 'px';
      tooltip.style.top  = (sy - 72) + 'px';
      tooltip.style.opacity = '1';
    } else {
      tooltip.style.opacity = '0';
    }
  });

  cv.addEventListener('mouseleave', () => { hovered=-1; tooltip.style.opacity='0'; });

  cv.addEventListener('click', e => {
    const idx = getHit(e.clientX, e.clientY);
    if (idx >= 0) {
      showToast(STARS[idx].msg);
      const rect = cv.getBoundingClientRect();
      const sx = STARS[idx].x / W * rect.width + rect.left;
      const sy = STARS[idx].y / H * rect.height + rect.top;
      for (let i=0;i<8;i++) setTimeout(()=>spawnP(sx+(Math.random()-.5)*50, sy+(Math.random()-.5)*50), i*60);
    }
  });
})();

// ══════════════════════════════════════════
// PARTÍCULAS
// ══════════════════════════════════════════
function spawnP(x, y, count=1) {
  const layer = $('particles');
  if (!layer) return;
  for (let k=0;k<count;k++){
    const el = document.createElement('div');
    const em = CFG.particles[Math.floor(Math.random()*CFG.particles.length)];
    el.textContent = em;
    el.style.cssText = `
      position:fixed;left:${x}px;top:${y}px;
      pointer-events:none;z-index:9999;user-select:none;
      font-size:${13+Math.random()*18}px;
      filter:drop-shadow(0 0 8px rgba(200,168,75,0.7));
    `;
    layer.appendChild(el);
    const ox  = (Math.random()-.5)*140;
    const oy  = -120 - Math.random()*80;
    const rot = Math.random()*360;
    el.animate([
      { transform:'translate(0,0) rotate(0deg) scale(1)', opacity:1 },
      { transform:`translate(${ox}px,${oy}px) rotate(${rot}deg) scale(0.1)`, opacity:0 }
    ], { duration:1500+Math.random()*700, easing:'cubic-bezier(0.25,0.46,0.45,0.94)' })
    .onfinish = () => el.remove();
  }
}

function burstAt(x, y) {
  const ems = ['✦','💫','🌸','❤️','✨','🌙','☽','🌟','💕'];
  for (let i=0; i<22; i++) {
    setTimeout(() => {
      const angle = (Math.PI*2*i)/22;
      const vel   = 110 + Math.random()*110;
      const el = document.createElement('div');
      el.textContent = ems[Math.floor(Math.random()*ems.length)];
      el.style.cssText = `position:fixed;left:${x}px;top:${y}px;pointer-events:none;z-index:9999;font-size:${11+Math.random()*13}px;user-select:none;`;
      document.body.appendChild(el);
      el.animate([
        { transform:'translate(0,0) scale(1)', opacity:1 },
        { transform:`translate(${Math.cos(angle)*vel}px,${Math.sin(angle)*vel}px) scale(0.05)`, opacity:0 }
      ], { duration:1400, easing:'cubic-bezier(0.25,0.46,0.45,0.94)' })
      .onfinish = () => el.remove();
    }, i*16);
  }
}

// ══════════════════════════════════════════
// TOAST
// ══════════════════════════════════════════
let toastTimer;
function showToast(msg) {
  const t = $('toast');
  if (!t) return;
  clearTimeout(toastTimer);
  t.textContent = msg;
  t.classList.add('show');
  toastTimer = setTimeout(() => t.classList.remove('show'), 3200);
}

// ══════════════════════════════════════════
// INTERAÇÕES
// ══════════════════════════════════════════
function celebrate(card) {
  const r = card.getBoundingClientRect();
  const cx = r.left + r.width/2, cy = r.top + r.height/2;
  burstAt(cx, cy);
  showToast(CFG.toasts[Math.floor(Math.random()*CFG.toasts.length)]);
  // Pulsa o card
  card.animate([
    {transform:'scale(1)'},{transform:'scale(1.06)'},{transform:'scale(1)'}
  ], { duration:400, easing:'cubic-bezier(0.34,1.56,0.64,1)' });
}

function sparkHere(e) {
  for (let i=0;i<6;i++) setTimeout(()=>spawnP(e.clientX+(Math.random()-.5)*40, e.clientY+(Math.random()-.5)*40), i*45);
  showToast(CFG.toasts[Math.floor(Math.random()*CFG.toasts.length)]);
}

function bloomCard(card, e) {
  card.animate([
    {transform:'scale(1)'},{transform:'scale(0.96)'},{transform:'scale(1)'}
  ], { duration:300, easing:'cubic-bezier(0.34,1.56,0.64,1)' });
  for (let i=0;i<8;i++) setTimeout(()=>spawnP(e.clientX+(Math.random()-.5)*55, e.clientY+(Math.random()-.5)*55), i*55);
  showToast(CFG.toasts[Math.floor(Math.random()*CFG.toasts.length)]);
}

function tileClick(tile, e) {
  for (let i=0;i<10;i++) setTimeout(()=>spawnP(e.clientX+(Math.random()-.5)*65, e.clientY+(Math.random()-.5)*65), i*45);
  showToast('📷 Nossa memória favorita ❤️');
}

function saveVowState() {
  const state = {};
  document.querySelectorAll('.vow').forEach((vow, index) => {
    let id = vow.dataset.vowId;
    if (!id) {
      id = String(index);
      vow.dataset.vowId = id;
    }
    state[id] = vow.classList.contains('sealed');
  });
  localStorage.setItem('sealedVows', JSON.stringify(state));
}

function loadVowState() {
  const raw = localStorage.getItem('sealedVows');
  if (!raw) return;
  try {
    const state = JSON.parse(raw);
    document.querySelectorAll('.vow').forEach((vow, index) => {
      let id = vow.dataset.vowId;
      if (!id) {
        id = String(index);
        vow.dataset.vowId = id;
      }
      if (state[id]) vow.classList.add('sealed');
      else vow.classList.remove('sealed');
    });
  } catch (err) {
    console.warn('Não foi possível carregar o estado das promessas:', err);
  }
}

function sealVow(btn) {
  const row = btn.closest('.vow');
  if (!row) return;
  const sealed = row.classList.toggle('sealed');
  if (sealed) {
    row.classList.add('sealed-highlight');
    setTimeout(() => row.classList.remove('sealed-highlight'), 1100);
  }
  saveVowState();
  if (sealed) {
    const r = row.getBoundingClientRect();
    for (let i=0;i<10;i++) setTimeout(()=>spawnP(r.left+Math.random()*r.width, r.top+r.height/2), i*55);
    showToast('Promessa selada sob o luar ✦');
  }
}

// Player com duas músicas
const SONGS = [
  { file: 'K a m a i t a c h i - Julieta - k a m a i t a c h i.mp3', title: 'Julieta', artist: 'Kamaïtachi' },
  { file: '𝐆𝐎𝐋𝐃𝐄𝐍 𝐁𝐑𝐎𝐖𝐍.mp3', title: 'Golden Brown', artist: 'Nossa canção' },
];
let currentSong = 1;
let playing = false;
let audio = null;

function buildAudio(idx) {
  if (audio) { audio.pause(); audio = null; }
  audio = new Audio(encodeURI(SONGS[idx].file));
  audio.preload = 'auto';
  audio.loop = false;
  audio.volume = 0.5;
  audio.addEventListener('canplay', () => {
    console.log('Áudio carregado:', SONGS[idx].file);
  });
  audio.addEventListener('error', () => {
    showToast('Erro ao carregar a música: ' + SONGS[idx].file);
    console.error('Falha ao carregar áudio:', SONGS[idx].file);
  });
  audio.addEventListener('ended', () => {
    const next = (currentSong + 1) % SONGS.length;
    switchSong(next);
  });
}

function startMusic() {
  if (!audio) buildAudio(currentSong);
  if (playing) return;
  audio.play().then(() => {
    playing = true;
    updateMusicUI();
    showToast('🎵 ' + SONGS[currentSong].title + ' tocando...');
  }).catch(err => {
    console.warn('Autoplay bloqueado ou não permitido:', err);
    showToast('Toque na página para iniciar a música');
    document.addEventListener('click', playMusicOnUserGesture, { once:true, passive:true });
    document.addEventListener('touchstart', playMusicOnUserGesture, { once:true, passive:true });
  });
}

function playMusicOnUserGesture() {
  if (!audio) buildAudio(currentSong);
  audio.play().then(() => {
    playing = true;
    updateMusicUI();
    showToast('🎵 Agora a música está tocando!');
  }).catch(err => {
    console.error('Erro ao reproduzir áudio após gesto do usuário:', err);
  });
}

function updateMusicUI() {
  const orb  = $('musicOrb');
  const icon = $('musicIcon');
  const songEl = document.querySelector('.music-song');
  const subEl  = document.querySelector('.music-sub');
  if (orb)  orb.classList.toggle('playing', playing);
  if (icon) icon.textContent = playing ? '⏸' : '▶';
  if (songEl) songEl.textContent = SONGS[currentSong].title;
  if (subEl)  subEl.textContent  = SONGS[currentSong].artist;
  // Update active button
  document.querySelectorAll('.song-btn').forEach((btn, i) => {
    btn.classList.toggle('active', i === currentSong);
  });
}

function toggleMusic() {
  if (!audio) buildAudio(currentSong);
  playing = !playing;
  if (playing) {
    audio.play().catch(err => {
      showToast('Não foi possível tocar a música. Verifique os arquivos.');
      console.error('Erro ao reproduzir áudio:', err);
    });
    showToast('🎵 ' + SONGS[currentSong].title + ' tocando...');
  } else {
    audio.pause();
    showToast('⏸ Em pausa com amor');
  }
  updateMusicUI();
}

function switchSong(idx) {
  if (idx === currentSong && audio) return;
  const wasPlaying = playing;
  if (audio) { audio.pause(); audio = null; }
  currentSong = idx;
  playing = false;
  buildAudio(currentSong);
  if (wasPlaying) {
    playing = true;
    audio.play().catch(err => {
      showToast('Não foi possível tocar a música. Verifique os arquivos.');
      console.error('Erro ao reproduzir áudio:', err);
    });
    showToast('🎵 ' + SONGS[currentSong].title + ' tocando...');
  }
  updateMusicUI();
}

// ══════════════════════════════════════════
// CLIQUE GLOBAL
// ══════════════════════════════════════════
document.addEventListener('click', e => {
  const n = 2 + Math.floor(Math.random()*3);
  for (let i=0;i<n;i++) setTimeout(()=>spawnP(
    e.clientX+(Math.random()-.5)*40, e.clientY+(Math.random()-.5)*40
  ), i*40);
});

let lastDbl = 0;
document.addEventListener('click', e => {
  const now = Date.now();
  if (now-lastDbl < 310) burstAt(e.clientX, e.clientY);
  lastDbl = now;
});

document.addEventListener('touchstart', e => {
  if (e.touches.length > 0) {
    const t = e.touches[0];
    for (let i=0;i<3;i++) setTimeout(()=>spawnP(t.clientX+(Math.random()-.5)*35, t.clientY+(Math.random()-.5)*35), i*45);
  }
}, {passive:true});

let lastTouchEnd = 0;
document.addEventListener('touchend', e => {
  const now = Date.now();
  if (now-lastTouchEnd <= 300) e.preventDefault();
  lastTouchEnd = now;
}, {passive:false});

// ══════════════════════════════════════════
// PARALLAX
// ══════════════════════════════════════════
let scrollTick = false;
window.addEventListener('scroll', () => {
  if (!scrollTick) {
    requestAnimationFrame(() => {
      const s  = window.pageYOffset;
      const ms = $('moonSystem');
      if (ms) ms.style.transform = `translateX(-50%) translateY(${s*0.10}px)`;
      scrollTick = false;
    });
    scrollTick = true;
  }
});

// ══════════════════════════════════════════
// SCROLL REVEAL
// ══════════════════════════════════════════
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        const d = parseInt(en.target.dataset.delay || 0);
        setTimeout(() => en.target.classList.add('in'), d);
        obs.unobserve(en.target);
      }
    });
  }, { threshold:0.08 });
  els.forEach(el => obs.observe(el));
}

// ══════════════════════════════════════════
// KONAMI CODE
// ══════════════════════════════════════════
const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let ki = 0;
document.addEventListener('keydown', e => {
  if (e.key === KONAMI[ki]) {
    ki++;
    if (ki === KONAMI.length) {
      ki = 0;
      for (let i=0;i<12;i++) setTimeout(()=>burstAt(Math.random()*window.innerWidth, Math.random()*window.innerHeight), i*250);
      showToast('🌸 Surpresa especial para você, Jasmin! 🌸');
    }
  } else ki = 0;
});

// ══════════════════════════════════════════
// TÍTULO DINÂMICO
// ══════════════════════════════════════════
const titleIcons = ['✦','🌙','🌸','☽','✨','💕'];
let ti = 0;
setInterval(() => {
  const t = calcTime();
  document.title = `${titleIcons[ti%titleIcons.length]} Jasmin — ${t.days} dias de amor`;
  ti++;
}, 1500);

// ══════════════════════════════════════════
// INIT
// ══════════════════════════════════════════
function init() {
  initReveal();
  loadVowState();
  buildAudio(currentSong);
  startMusic();

  // Anima contadores
  setTimeout(() => {
    const t = calcTime();
    animateCount('years',         t.years,  2000);
    animateCount('days',          t.days,   2500);
    setTimeout(() => {
      animateCount('months',        t.months, 1500);
      animateCount('weeks',         t.weeks,  1500);
      animateCount('total-hours',   t.totalH, 1800);
      animateCount('total-minutes', t.totalM, 2000);
    }, 900);
  }, 1600);

  setInterval(updateCounters, CFG.updateMs);

  // Console romântico
  console.log('%c✦ Jasmin ✦ Sob o Luar', 'color:#f0e6c8;font-size:26px;font-family:serif;font-style:italic;padding:18px;text-shadow:0 0 20px gold;');
  console.log('%cFeito com amor infinito 🌙', 'color:#c8a84b;font-size:14px;font-style:italic;');
  const t = calcTime();
  console.log(`%c✨ ${t.years} anos, ${t.days} dias e contando... ✨`, 'color:#f07ca0;font-size:13px;');
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();

// Limpeza
setInterval(() => {
  document.querySelectorAll('#particles > *').forEach(el => {
    if (parseFloat(getComputedStyle(el).opacity) < 0.01) el.remove();
  });
}, 8000);

document.addEventListener('visibilitychange', () => {
  if (!document.hidden) updateCounters();
});
