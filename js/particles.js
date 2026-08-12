/**
 * particles.js
 * ------------------------------------------------------------------
 * Sistema de céu estrelado em <canvas>: estrelas fixas que cintilam
 * suavemente + partículas flutuantes (poeira de luz). Leve, sem
 * bibliotecas externas. Pausa quando a aba não está visível para
 * economizar performance (boa prática em dispositivos móveis).
 * ------------------------------------------------------------------
 */

(function () {
  'use strict';

  const canvas = document.getElementById('stars-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: true });

  let width = 0;
  let height = 0;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);

  let stars = [];
  let dust = [];
  let rafId = null;
  let isVisible = true;
  let lastTime = 0;

  const STAR_DENSITY = 0.00028;   // estrelas por pixel²
  const DUST_DENSITY = 0.00004;   // partículas de poeira por pixel²

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildField();
  }

  function buildField() {
    const starCount = Math.round(width * height * STAR_DENSITY);
    const dustCount = Math.round(width * height * DUST_DENSITY);

    stars = new Array(starCount).fill(0).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height * 0.85, // mais estrelas na parte de cima
      r: Math.random() * 1.3 + 0.3,
      baseAlpha: Math.random() * 0.5 + 0.35,
      twinkleSpeed: Math.random() * 0.0016 + 0.0006,
      twinklePhase: Math.random() * Math.PI * 2,
      gold: Math.random() < 0.18 // algumas estrelas com tom dourado
    }));

    dust = new Array(dustCount).fill(0).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.6 + 0.6,
      speedY: -(Math.random() * 0.06 + 0.02),
      speedX: (Math.random() - 0.5) * 0.03,
      alpha: Math.random() * 0.25 + 0.05
    }));
  }

  function drawStars(time) {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      const twinkle = Math.sin(time * s.twinkleSpeed + s.twinklePhase) * 0.5 + 0.5;
      const alpha = s.baseAlpha * (0.55 + twinkle * 0.45);
      ctx.beginPath();
      ctx.fillStyle = s.gold
        ? `rgba(232,207,156,${alpha.toFixed(3)})`
        : `rgba(251,247,239,${alpha.toFixed(3)})`;
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();

      // leve glow para estrelas maiores
      if (s.r > 1.1) {
        ctx.beginPath();
        ctx.fillStyle = s.gold
          ? `rgba(232,207,156,${(alpha * 0.15).toFixed(3)})`
          : `rgba(251,247,239,${(alpha * 0.12).toFixed(3)})`;
        ctx.arc(s.x, s.y, s.r * 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < dust.length; i++) {
      const d = dust[i];
      d.y += d.speedY;
      d.x += d.speedX;
      if (d.y < -10) { d.y = height + 10; d.x = Math.random() * width; }
      if (d.x < -10) d.x = width + 10;
      if (d.x > width + 10) d.x = -10;

      ctx.beginPath();
      ctx.fillStyle = `rgba(203,160,90,${d.alpha.toFixed(3)})`;
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function loop(time) {
    if (!isVisible) return;
    drawStars(time);
    rafId = requestAnimationFrame(loop);
  }

  function start() {
    if (rafId) return;
    rafId = requestAnimationFrame(loop);
  }
  function stop() {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
  }

  document.addEventListener('visibilitychange', () => {
    isVisible = document.visibilityState === 'visible';
    if (isVisible) start(); else stop();
  });

  window.addEventListener('resize', debounce(resize, 200));

  function debounce(fn, wait) {
    let t;
    return function (...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  // ------------------------------------------------------------------
  // Estrela cadente: cria um elemento DOM temporário com trilha animada
  // (CSS cuida da animação — ver .shooting-star em animations.css)
  // ------------------------------------------------------------------
  function shootStar() {
    const el = document.createElement('div');
    el.className = 'shooting-star';
    el.style.top = (8 + Math.random() * 22) + '%';
    document.body.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  }

  // Expõe API mínima para o app.js
  window.StarField = { shootStar };

  resize();
  start();
})();
