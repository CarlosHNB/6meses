/**
 * audio.js
 * ------------------------------------------------------------------
 * Música de fundo. NÃO toca automaticamente — inicia apenas na
 * primeira interação do usuário (exigido por navegadores e pelo
 * pedido do projeto). Possui fade in / fade out suaves e um botão
 * flutuante para play/pause.
 *
 * Coloque o arquivo de música em: assets/audio/musica.mp3
 * ------------------------------------------------------------------
 */

(function () {
  'use strict';

  const AUDIO_SRC = 'assets/audio/musica.mp3';
  const TARGET_VOLUME = 0.10; // volume baixo, para não competir com o vídeo
  const FADE_MS = 1200;

  const audio = new Audio(AUDIO_SRC);
  audio.loop = true;
  audio.preload = 'auto';
  audio.volume = 0;

  const toggleBtn = document.getElementById('music-toggle');
  let hasStarted = false;
  let fadeTimer = null;
  let wasPlayingBeforeDuck = false; // lembra se a música estava tocando antes do vídeo abafá-la

  function fadeTo(target, duration) {
    clearInterval(fadeTimer);
    const steps = 24;
    const stepTime = duration / steps;
    const startVol = audio.volume;
    const delta = (target - startVol) / steps;
    let count = 0;

    fadeTimer = setInterval(() => {
      count++;
      audio.volume = Math.min(1, Math.max(0, startVol + delta * count));
      if (count >= steps) {
        clearInterval(fadeTimer);
        audio.volume = target;
        if (target === 0) audio.pause();
      }
    }, stepTime);
  }

  function play() {
    audio.play().then(() => fadeTo(TARGET_VOLUME, FADE_MS)).catch(() => {
      /* autoplay bloqueado — silenciosamente ignorado, usuário pode tocar no botão */
    });
    setPressed(true);
  }

  function pause() {
    fadeTo(0, FADE_MS);
    setPressed(false);
  }

  function setPressed(isPlaying) {
    if (!toggleBtn) return;
    toggleBtn.setAttribute('aria-pressed', String(isPlaying));
  }

  function startOnFirstInteraction() {
    if (hasStarted) return;
    hasStarted = true;
    play();
    if (toggleBtn) {
      toggleBtn.classList.remove('is-hidden');
      requestAnimationFrame(() => toggleBtn.classList.add('is-visible'));
    }
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!hasStarted) { startOnFirstInteraction(); return; }
      if (audio.paused) play(); else pause();
    });
  }

  // ------------------------------------------------------------------
  // Duck / Restore — usados pelo video.js para silenciar a música
  // enquanto o vídeo da Tela 5 estiver tocando, e trazê-la de volta
  // (com fade-in) quando o vídeo pausar ou terminar.
  // ------------------------------------------------------------------
  function duck() {
    if (!hasStarted) return; // música nunca foi iniciada, nada a abafar
    wasPlayingBeforeDuck = !audio.paused;
    if (wasPlayingBeforeDuck) fadeTo(0, 500);
  }

  function restore() {
    if (!hasStarted || !wasPlayingBeforeDuck) return;
    audio.play().then(() => fadeTo(TARGET_VOLUME, FADE_MS)).catch(() => {});
    setPressed(true);
  }

  // Expõe API para app.js acionar no primeiro clique geral da página
  window.BgMusic = { startOnFirstInteraction, play, pause, duck, restore, audio };
})();
