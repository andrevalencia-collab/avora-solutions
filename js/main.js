/* AVORA Solutions · interacciones de la página (sin librerías propias).
   Nada escucha el evento scroll: las apariciones usan un solo IntersectionObserver.
   Lenis (scroll con inercia) se descarga solo en computadora con mouse. */
(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Apariciones: cada elemento con data-reveal recibe .is-visible una sola vez,
  // cuando entra un 15 % en pantalla. El CSS hace el resto (fundido, subida o
  // líneas que suben dentro de su máscara). Lo que ya está en pantalla al cargar
  // (header y portada) aparece en secuencia gracias a sus retrasos --d.
  const elementos = document.querySelectorAll('[data-reveal]');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    elementos.forEach((el) => el.classList.add('is-visible'));
  } else {
    const observador = new IntersectionObserver((entradas, obs) => {
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;
        entrada.target.classList.add('is-visible');
        obs.unobserve(entrada.target);
      });
    }, { threshold: 0.15 });
    elementos.forEach((el) => observador.observe(el));
  }

  // Scroll con inercia, suave y ligero, SOLO en computadora con mouse: en celular,
  // en pantallas táctiles y con movimiento reducido ni siquiera se descarga.
  const conMouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const tactil = window.matchMedia('(any-pointer: coarse)').matches;
  if (conMouse && !tactil && !reduceMotion) {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/lenis@1.3.26/dist/lenis.min.js';
    // Huella del archivo: si el CDN lo cambiara, el navegador no lo ejecuta
    script.integrity = 'sha384-jqpi9VmOdhyLoLURgjCn7EpnG9BbnHW57ibIZoeaIU+erWDH3k8fQQg0xH2ySjnw';
    script.crossOrigin = 'anonymous';
    script.onload = () => {
      if (!window.Lenis) return;
      window.lenis = new window.Lenis({
        autoRaf: true,
        lerp: 0.12,                  // más alto = frena antes (ligero, sin sensación pesada)
      });
    };
    document.head.appendChild(script);
  }

  // Enlaces internos (Servicios, Proyectos, Planes…). Se manejan aquí por dos motivos:
  // Lenis no cancela el salto nativo (los dos se pisan), y una sección que todavía no
  // apareció conserva su desplazamiento de animación, que movería el destino.
  // offsetTop mide la posición real, sin ese desplazamiento. Como el navegador, se
  // actualiza la dirección y el foco pasa a la sección (teclado y lectores de pantalla).
  const posicionReal = (el) => {
    let y = 0;
    for (let nodo = el; nodo; nodo = nodo.offsetParent) y += nodo.offsetTop;
    return y - (parseFloat(getComputedStyle(el).scrollMarginTop) || 0);
  };
  document.addEventListener('click', (e) => {
    const enlace = e.target instanceof Element && e.target.closest('a[href^="#"]');
    if (!enlace || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
    const hash = enlace.getAttribute('href');
    const destino = hash.length > 1 && document.getElementById(decodeURIComponent(hash.slice(1)));
    if (!destino) return;
    e.preventDefault();
    const y = posicionReal(destino);
    if (window.lenis) window.lenis.scrollTo(y);
    else window.scrollTo({ top: y, behavior: reduceMotion ? 'auto' : 'smooth' });
    history.pushState(null, '', hash);
    if (!destino.hasAttribute('tabindex')) destino.setAttribute('tabindex', '-1');
    destino.focus({ preventScroll: true });
  });
})();
