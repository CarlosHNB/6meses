/**
 * app.js
 * ------------------------------------------------------------------
 * Orquestra a experiência: navegação entre as 6 telas, abertura do
 * envelope + texto letra-por-letra da carta, pontos de progresso,
 * estrela cadente na tela final e reinício (replay).
 * ------------------------------------------------------------------
 */

(function () {
  'use strict';

  // -------------------- Texto da carta (Tela 3) --------------------
  // Edite livremente o conteúdo abaixo — cada string vira um parágrafo.
  const LETTER_PARAGRAPHS = [
    'Seis meses podem parecer pouco para algumas pessoas, mas para mim foram o tempo de aprender, todos os dias, uma nova forma de amar você.',
    'Aprendi o jeito como você ri antes de terminar a piada, o silêncio que você faz quando está pensando em algo importante, e o quanto o meu dia fica mais leve só por saber que você existe nele.',
    'Estou aprendendo francês, aos poucos, palavra por palavra — assim como aprendo você, todos os dias, com a mesma paciência e a mesma vontade de acertar.',
    'Essa carta é só o começo de uma noite que preparei com todo o cuidado que você merece. Vem comigo?'
  ];

  const stage = document.getElementById('stage');
  const scenes = Array.from(document.querySelectorAll('.scene'));
  const dotsWrap = document.getElementById('scene-dots');
  const dots = dotsWrap ? Array.from(dotsWrap.querySelectorAll('.dot')) : [];

  let currentScene = 1;
  let isTransitioning = false;

  function getScene(n) {
    return document.getElementById('scene-' + n);
  }

  function updateDots(n) {
    dots.forEach((d) => d.classList.toggle('is-active', Number(d.dataset.dot) === n));
    if (n > 1 && dotsWrap) dotsWrap.classList.add('is-visible');
  }

  function goToScene(n) {
    if (isTransitioning || n === currentScene) return;
    const from = getScene(currentScene);
    const to = getScene(n);
    if (!from || !to) return;

    isTransitioning = true;

    document.dispatchEvent(new CustomEvent('pma:scene-change', {
      detail: { from: String(currentScene), to: String(n) }
    }));

    from.classList.add('is-leaving');
    from.classList.remove('is-active');

    // Reinicia as animações .reveal da próxima cena antes de mostrá-la
    resetReveals(to);

    window.setTimeout(() => {
      from.classList.remove('is-leaving');
      to.classList.add('is-active');
      updateDots(n);
      currentScene = n;
      isTransitioning = false;
      onSceneEnter(n);
    }, 550);
  }

  function resetReveals(sceneEl) {
    sceneEl.querySelectorAll('.reveal').forEach((el) => {
      el.style.animation = 'none';
      // força reflow para permitir reiniciar a animação
      void el.offsetWidth;
      el.style.animation = '';
    });
  }

  function onSceneEnter(n) {
    if (n === 6) {
      // estrela cadente cruza a tela pouco depois do texto final aparecer
      window.setTimeout(() => {
        if (window.StarField) window.StarField.shootStar();
      }, 3400);
    }
  }

  // -------------------- Navegação por botões [data-next] --------------------
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-next]');
    if (btn) goToScene(Number(btn.dataset.next));
  });

  // -------------------- Tela 1: transição especial de "zoom" --------------------
  const btnOpen = document.getElementById('btn-open');
  if (btnOpen) {
    btnOpen.addEventListener('click', () => {
      const scene1 = getScene(1);
      scene1.classList.add('is-leaving'); // usa o keyframe de zoom definido em animations.css
    });
  }

  // -------------------- Tela 3: envelope + carta letra por letra --------------------
  const envelope = document.getElementById('envelope');
  const letter = document.getElementById('letter');
  const letterTextEl = document.getElementById('letter-text');
  const btnLetterNext = document.getElementById('btn-letter-next');
  let letterTyped = false;

  function typeLetter() {
    if (letterTyped) return;
    letterTyped = true;

    // Texto completo exibido de uma vez (sem digitação progressiva).
    // Cada parágrafo entra com um leve fade + subida, em cascata curta.
    letterTextEl.innerHTML = '';
    LETTER_PARAGRAPHS.forEach((text, i) => {
      const p = document.createElement('p');
      p.className = 'letter__para';
      p.textContent = text;
      p.style.animationDelay = (i * 0.18) + 's';
      letterTextEl.appendChild(p);
    });

    if (btnLetterNext) btnLetterNext.classList.remove('is-hidden');
  }

  if (envelope) {
    envelope.addEventListener('click', () => {
      if (envelope.classList.contains('is-open')) return;
      envelope.classList.add('is-open');
      window.setTimeout(() => {
        letter.classList.add('is-visible');
        typeLetter();
      }, 650);
    });
  }

  // -------------------- Tela 5: fim do vídeo avança para Tela 6 --------------------
  document.addEventListener('pma:video-ended', () => {
    window.setTimeout(() => goToScene(6), 900);
  });

  // -------------------- Tela 6: revoir (reinicia a experiência) --------------------
  const btnReplay = document.getElementById('btn-replay');
  if (btnReplay) {
    btnReplay.addEventListener('click', () => {
      // Reseta estado da carta para poder ser reaberta
      letterTyped = false;
      if (envelope) envelope.classList.remove('is-open');
      if (letter) { letter.classList.remove('is-visible'); letterTextEl.innerHTML = ''; }
      if (btnLetterNext) btnLetterNext.classList.add('is-hidden');
      goToScene(1);
    });
  }

  // -------------------- Música: inicia no primeiro toque da página --------------------
  document.addEventListener('click', function firstClick() {
    if (window.BgMusic) window.BgMusic.startOnFirstInteraction();
    document.removeEventListener('click', firstClick);
  }, { once: true });

  // -------------------- Navegação por teclado (setas) — acessibilidade extra --------------------
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      const visibleBtn = getScene(currentScene).querySelector('[data-next]');
      if (visibleBtn && !visibleBtn.classList.contains('is-hidden')) visibleBtn.click();
    }
  });

  updateDots(1);
})();
