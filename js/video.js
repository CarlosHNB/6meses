/**
 * video.js
 * ------------------------------------------------------------------
 * Player de vídeo customizado para a Tela 5 ("Six mois avec toi").
 * Substitui os controles nativos por uma interface própria, elegante
 * e coerente com o resto do site. Ao terminar, dispara um evento
 * customizado 'pma:video-ended' que o app.js escuta para avançar
 * automaticamente para a Tela 6.
 *
 * Vídeo esperado em: assets/video/video.mp4
 * ------------------------------------------------------------------
 */

(function () {
  'use strict';

  const player = document.getElementById('player');
  const video = document.getElementById('video');
  if (!player || !video) return;

  const bigPlay = document.getElementById('player-bigplay');
  const btnPlay = document.getElementById('player-play');
  const btnMute = document.getElementById('player-mute');
  const btnFullscreen = document.getElementById('player-fullscreen');
  const bar = document.getElementById('player-bar');
  const barFill = document.getElementById('player-bar-fill');
  const timeEl = document.getElementById('player-time');
  const durationEl = document.getElementById('player-duration');
  const iconPlay = btnPlay.querySelector('.icon--play');
  const iconPause = btnPlay.querySelector('.icon--pause');

  function formatTime(sec) {
    if (!isFinite(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  function togglePlay() {
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  }

  function updatePlayState() {
    const playing = !video.paused && !video.ended;
    player.classList.toggle('is-playing', playing);
    iconPlay.classList.toggle('is-hidden', playing);
    iconPause.classList.toggle('is-hidden', !playing);
  }

  function updateProgress() {
    if (!video.duration) return;
    const pct = (video.currentTime / video.duration) * 100;
    barFill.style.width = pct + '%';
    timeEl.textContent = formatTime(video.currentTime);
  }

  function seekFromEvent(clientX) {
    const rect = bar.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    if (video.duration) video.currentTime = ratio * video.duration;
  }

  // --- Eventos de interação ---
  bigPlay.addEventListener('click', togglePlay);
  btnPlay.addEventListener('click', togglePlay);
  video.addEventListener('click', togglePlay);

  video.addEventListener('play', () => {
    updatePlayState();
    if (window.BgMusic) window.BgMusic.duck();
  });
  video.addEventListener('pause', () => {
    updatePlayState();
    if (window.BgMusic) window.BgMusic.restore();
  });
  video.addEventListener('timeupdate', updateProgress);

  video.addEventListener('loadedmetadata', () => {
    durationEl.textContent = formatTime(video.duration);
    if (video.videoWidth && video.videoHeight) {
      player.style.setProperty('--v-ratio', `${video.videoWidth} / ${video.videoHeight}`);
    }
  });

  bar.addEventListener('click', (e) => seekFromEvent(e.clientX));
  bar.addEventListener('touchstart', (e) => {
    if (e.touches[0]) seekFromEvent(e.touches[0].clientX);
  }, { passive: true });

  btnMute.addEventListener('click', () => {
    video.muted = !video.muted;
    btnMute.style.opacity = video.muted ? '0.5' : '1';
  });

  const musicToggle = document.getElementById('music-toggle');

  function setFullscreen(active) {
    player.classList.toggle('is-fullscreen', active);
    btnFullscreen.setAttribute('aria-label', active ? 'Sair da tela cheia' : 'Tela cheia');
    if (musicToggle) musicToggle.classList.toggle('is-fs-hidden', active);
  }

  btnFullscreen.addEventListener('click', () => {
    setFullscreen(!player.classList.contains('is-fullscreen'));
  });

  // Sai da tela cheia própria com Esc
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && player.classList.contains('is-fullscreen')) {
      setFullscreen(false);
    }
  });

  // Mostra controles ao tocar na tela (mobile)
  player.addEventListener('touchstart', () => {
    player.classList.add('controls-visible');
    clearTimeout(player._hideTimer);
    player._hideTimer = setTimeout(() => player.classList.remove('controls-visible'), 2600);
  }, { passive: true });

  video.addEventListener('ended', () => {
    updatePlayState();
    document.dispatchEvent(new CustomEvent('pma:video-ended'));
  });

  // Pausa o vídeo automaticamente se o usuário sair da cena antes do fim
  document.addEventListener('pma:scene-change', (e) => {
    if (e.detail && e.detail.from === '5') {
      if (!video.paused) video.pause();
      setFullscreen(false);
    }
  });
})();
