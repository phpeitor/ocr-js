(function () {
  'use strict';

  // Personaliza estos valores para reutilizar el componente en otra landing.
  const LOGO_CONFIG = {
    sparkEmojis: ['✨', '🎁', '🎉', '🎂'],
    reactionEmoji: '🥳',
    reactionClass: 'brain'
  };

  function initLogo(logo) {
    if (!logo || logo.dataset.logoReady === 'true') return;

    const image = logo.querySelector('.box img');
    const box = logo.querySelector('.box');
    if (!image || !box) return;

    logo.dataset.logoReady = 'true';
    logo.classList.add('haunt');

    box.dataset.logoReaction = LOGO_CONFIG.reactionEmoji;
    let sparkTimer = null;

    function makeSpark() {
      const rect = logo.getBoundingClientRect();
      const spark = document.createElement('span');
      spark.className = 'logo-spark';
      const emojis = LOGO_CONFIG.sparkEmojis;
      spark.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      spark.style.left = `${rect.left + rect.width * (Math.random() * 1.2 - .1)}px`;
      spark.style.top = `${rect.top + rect.height * (Math.random() * 1.2 - .1)}px`;
      spark.style.setProperty('--sx', '-50%');
      spark.style.setProperty('--sy', '-50%');
      spark.style.setProperty('--dx', `${Math.random() * 120 - 60}px`);
      spark.style.setProperty('--dy', `${Math.random() * -120}px`);
      document.body.appendChild(spark);
      window.setTimeout(() => spark.remove(), 1100);
    }

    function startSparks() {
      if (sparkTimer) return;
      const loop = () => {
        makeSpark();
        sparkTimer = window.setTimeout(loop, 400 + Math.random() * 400);
      };
      loop();
    }

    function stopSparks() {
      window.clearTimeout(sparkTimer);
      sparkTimer = null;
    }

    function openLightbox() {
      if (document.querySelector('.logo-lightbox')) return;

      const rect = logo.getBoundingClientRect();
      const overlay = document.createElement('div');
      overlay.className = 'logo-lightbox';
      overlay.style.setProperty('--lbx', `${rect.left + rect.width / 2 - innerWidth / 2}px`);
      overlay.style.setProperty('--lby', `${rect.top + rect.height / 2 - innerHeight / 2}px`);

      const largeImage = document.createElement('img');
      largeImage.src = image.currentSrc || image.src;
      largeImage.alt = image.alt;
      largeImage.className = 'logo-lightbox__img';
      const close = document.createElement('button');
      close.type = 'button';
      close.className = 'logo-lightbox__close';
      close.setAttribute('aria-label', 'Cerrar logo');
      close.innerHTML = '&times;';
      overlay.append(largeImage, close);
      document.body.appendChild(overlay);

      const closeLightbox = () => {
        document.removeEventListener('keydown', onKey);
        overlay.classList.remove('logo-lightbox--open');
        overlay.classList.add('logo-lightbox--closing');
        window.setTimeout(() => overlay.remove(), 420);
      };
      const onKey = event => {
        if (event.key === 'Escape') closeLightbox();
      };

      close.addEventListener('click', closeLightbox);
      overlay.addEventListener('click', event => {
        if (event.target === overlay) closeLightbox();
      });
      document.addEventListener('keydown', onKey);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        overlay.classList.add('logo-lightbox--open');
      }));
    }

    function triggerBrainEffect() {
      logo.classList.toggle(LOGO_CONFIG.reactionClass);
      if (logo.classList.contains(LOGO_CONFIG.reactionClass)) {
        Array.from({ length: 10 }, (_, index) => {
          window.setTimeout(makeSpark, Math.random() * 350 + index * 10);
        });
      }
    }

    startSparks();
    logo.addEventListener('mouseenter', stopSparks);
    logo.addEventListener('mouseleave', startSparks);
    logo.addEventListener('click', () => {
      openLightbox();
      triggerBrainEffect();
    });
    logo.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openLightbox();
      }
    });
  }

  function init() {
    document.querySelectorAll('.logo').forEach(initLogo);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.HalloweenLogo = { init: initLogo };
})();
