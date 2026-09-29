/* AVORA Solutions · interacciones ligeras (sin librerías).
   Nada aquí escucha el evento scroll: todo usa IntersectionObserver o resize. */
(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasIO = 'IntersectionObserver' in window;

  // Revelado al entrar en pantalla (una sola vez por elemento).
  // Los barridos "wipe" empiezan con un clip-path de área cero, y el observer nunca
  // los vería intersectar: para esos se observa al padre, que sí ocupa espacio.
  const revealables = document.querySelectorAll('[data-reveal]');
  if (reduceMotion || !hasIO) {
    revealables.forEach((el) => el.classList.add('is-visible'));
  } else {
    const targetsByTrigger = new Map();
    revealables.forEach((el) => {
      const trigger = el.dataset.reveal === 'wipe' ? el.parentElement : el;
      if (!targetsByTrigger.has(trigger)) targetsByTrigger.set(trigger, []);
      targetsByTrigger.get(trigger).push(el);
    });

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        targetsByTrigger.get(entry.target).forEach((el) => el.classList.add('is-visible'));
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.15 });
    targetsByTrigger.forEach((_, trigger) => revealObserver.observe(trigger));
  }

  // Header sólido al bajar (el botón flotante ahora es Avo: js/avo.js)
  const header = document.querySelector('.site-header');
  const sentinel = document.querySelector('.hero__sentinel');

  if (hasIO) {
    new IntersectionObserver(([entry]) => {
      header.classList.toggle('is-solid', !entry.isIntersecting);
    }).observe(sentinel);
  } else {
    header.classList.add('is-solid');
  }

  // Sticky stacking: si un pilar es más alto que la pantalla, se fija por su borde
  // inferior (top negativo) para que se lea completo antes de que el siguiente lo cubra.
  const pillars = document.querySelectorAll('.pillar');
  let frame = 0;
  const setStickyTops = () => {
    frame = 0;
    const base = header.offsetHeight + 16;
    pillars.forEach((pillar, i) => {
      const top = Math.min(base + i * 14, window.innerHeight - pillar.offsetHeight - 16);
      pillar.style.setProperty('--sticky-top', `${top}px`);
    });
  };
  const scheduleStickyTops = () => { if (!frame) frame = requestAnimationFrame(setStickyTops); };

  setStickyTops();
  window.addEventListener('resize', scheduleStickyTops);
  document.fonts?.ready.then(scheduleStickyTops);
})();
