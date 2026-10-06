/* AVORA Solutions · interacciones de la página (sin librerías propias).
   Nada escucha el evento scroll del navegador: las apariciones usan un solo
   IntersectionObserver, y la profundidad de la palabra AVORA usa el scroll de Lenis.
   Lenis (scroll con inercia) se descarga solo en computadora con mouse. */
(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const conMouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const tactil = window.matchMedia('(any-pointer: coarse)').matches;

  /* ---------- Borde de los paneles que se "dibuja" ----------
     Cada panel recibe una capa con 4 tramos rectos y 4 esquinas, en el orden del
     recorrido: empieza en la esquina superior izquierda (la de la barrita azul) y
     sigue en el sentido del reloj. La curva --ease se aplica al contorno completo:
     para cada pieza se busca en qué momento de la curva la línea llega a ella, y la
     pieza avanza en línea recta entre ese momento y el siguiente. Así no frena en
     cada esquina. */
  const DURACION_BORDE = 900;
  const RADIO = 27;                             // radio interior (28px menos el borde de 1px)
  const ARCO = (Math.PI / 2) * RADIO;           // largo de cada esquina
  const PIEZAS = ['esquina--1', 'arriba', 'esquina--2', 'derecha', 'esquina--3', 'abajo', 'esquina--4', 'izquierda'];

  // cubic-bezier(.22, 1, .36, 1): dado un avance del recorrido (0 a 1), devuelve en
  // qué fracción del tiempo ocurre. La curva es creciente, así que basta una búsqueda binaria.
  const bezier = (t, a, b) => 3 * (1 - t) ** 2 * t * a + 3 * (1 - t) * t * t * b + t ** 3;
  const tiempoDeAvance = (avance) => {
    let bajo = 0;
    let alto = 1;
    for (let k = 0; k < 24; k++) {
      const u = (bajo + alto) / 2;
      if (bezier(u, 1, 1) < avance) bajo = u; else alto = u;
    }
    return bezier((bajo + alto) / 2, 0.22, 0.36);
  };

  const ajustarBorde = (panel, capa) => {
    const ancho = Math.max(panel.clientWidth - 2 * RADIO, 0);
    const alto = Math.max(panel.clientHeight - 2 * RADIO, 0);
    const largos = [ARCO, ancho, ARCO, alto, ARCO, ancho, ARCO, alto];
    const total = largos.reduce((a, b) => a + b, 0);
    let recorrido = 0;
    [...capa.children].forEach((pieza, i) => {
      const inicio = tiempoDeAvance(recorrido / total) * DURACION_BORDE;
      recorrido += largos[i];
      const fin = tiempoDeAvance(recorrido / total) * DURACION_BORDE;
      pieza.style.setProperty('--ret', `${Math.round(inicio)}ms`);
      pieza.style.setProperty('--dur', `${Math.max(Math.round(fin - inicio), 1)}ms`);
    });
  };

  const medidorBordes = 'ResizeObserver' in window
    ? new ResizeObserver((entradas) => entradas.forEach((e) => {
      const capa = e.target.querySelector(':scope > .panel__borde');
      if (capa) ajustarBorde(e.target, capa);
    }))
    : null;
  document.querySelectorAll('.panel').forEach((panel) => {
    const capa = document.createElement('span');
    capa.className = 'panel__borde';
    capa.setAttribute('aria-hidden', 'true');
    PIEZAS.forEach((nombre) => {
      const pieza = document.createElement('span');
      pieza.className = nombre.startsWith('esquina') ? `borde-esquina borde-${nombre}` : `borde-tramo borde-${nombre}`;
      capa.appendChild(pieza);
    });
    panel.prepend(capa);
    ajustarBorde(panel, capa);
    medidorBordes?.observe(panel);
  });

  /* ---------- Apariciones ----------
     Cada elemento con data-reveal recibe .is-visible una sola vez, cuando entra un
     15 % en pantalla. El CSS hace el resto: fundido, subida, líneas que suben en su
     máscara, el borde que se dibuja o la cascada de un grupo ([data-paso]). Lo que ya
     está en pantalla al cargar (header y portada) aparece en secuencia por sus --d. */
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

  /* ---------- Botones principales: relleno y efecto magnético ----------
     El relleno (capa .btn__relleno) recorre el botón con hover, en CSS. El imán solo
     existe con mouse real y sin movimiento reducido: el botón se acerca al cursor hasta
     8px, el círculo se desplaza un poco más y la flecha gira levemente. Cada movimiento
     fija un destino nuevo y una transición corta (150 ms) lo persigue desde donde va,
     como un resorte; al salir vuelve en 400 ms. Se usan translate y rotate, aparte de
     transform, para no pisar la reducción de escala al presionar. */
  const botones = [...document.querySelectorAll('.btn--primary')].filter((b) => !b.closest('.avo'));
  botones.forEach((btn) => {
    const relleno = document.createElement('span');
    relleno.className = 'btn__relleno';
    relleno.setAttribute('aria-hidden', 'true');
    btn.prepend(relleno);
  });

  if (conMouse && !reduceMotion) {
    const MAX_BOTON = 8;
    const EXTRA_CIRCULO = 3;
    const GIRO = 12;
    botones.forEach((btn) => {
      const circulo = btn.querySelector('.btn__circulo');
      const flecha = circulo?.querySelector('svg');
      let caja = null;                           // medida al entrar, sin el desplazamiento

      btn.addEventListener('pointerenter', (e) => {
        if (e.pointerType !== 'mouse') return;
        caja = btn.getBoundingClientRect();
        btn.classList.add('es-magnetico');
      });
      btn.addEventListener('pointermove', (e) => {
        if (e.pointerType !== 'mouse' || !caja) return;
        // Posición del cursor respecto al centro, de -1 a 1 en cada eje
        let x = (e.clientX - (caja.left + caja.width / 2)) / (caja.width / 2);
        let y = (e.clientY - (caja.top + caja.height / 2)) / (caja.height / 2);
        x = Math.max(-1, Math.min(1, x));
        y = Math.max(-1, Math.min(1, y));
        // Que en diagonal tampoco pase de 8px
        const largo = Math.hypot(x, y);
        const escala = largo > 1 ? 1 / largo : 1;
        btn.style.translate = `${(x * escala * MAX_BOTON).toFixed(2)}px ${(y * escala * MAX_BOTON).toFixed(2)}px`;
        if (circulo) circulo.style.translate = `${(x * EXTRA_CIRCULO).toFixed(2)}px ${(y * EXTRA_CIRCULO).toFixed(2)}px`;
        if (flecha) flecha.style.rotate = `${(y * GIRO).toFixed(1)}deg`;
      });
      btn.addEventListener('pointerleave', () => {
        caja = null;
        btn.classList.remove('es-magnetico');
        btn.style.translate = '';
        if (circulo) circulo.style.translate = '';
        if (flecha) flecha.style.rotate = '';
      });
    });
  }

  /* ---------- Scroll con inercia y profundidad ----------
     Lenis, suave y ligero, SOLO en computadora con mouse: en celular, en pantallas
     táctiles y con movimiento reducido ni siquiera se descarga. Cuando existe, también
     mueve la palabra AVORA de la portada más lento que el scroll (efecto de profundidad),
     solo mientras la portada está en pantalla. En celular la palabra queda fija. */
  if (conMouse && !tactil && !reduceMotion) {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/lenis@1.3.26/dist/lenis.min.js';
    // Huella del archivo: si el CDN lo cambiara, el navegador no lo ejecuta
    script.integrity = 'sha384-jqpi9VmOdhyLoLURgjCn7EpnG9BbnHW57ibIZoeaIU+erWDH3k8fQQg0xH2ySjnw';
    script.crossOrigin = 'anonymous';
    script.onload = () => {
      if (!window.Lenis) return;
      const lenis = new window.Lenis({
        autoRaf: true,
        lerp: 0.12,                  // más alto = frena antes (ligero, sin sensación pesada)
      });
      window.lenis = lenis;

      const palabra = document.querySelector('.hero__palabra');
      const portada = document.querySelector('.hero');
      if (palabra && portada && 'IntersectionObserver' in window) {
        const PROFUNDIDAD = 0.25;    // la palabra baja un 25 % de lo que sube la página
        let portadaVisible = true;
        new IntersectionObserver(([e]) => { portadaVisible = e.isIntersecting; }).observe(portada);
        lenis.on('scroll', ({ scroll }) => {
          if (portadaVisible) palabra.style.transform = `translate3d(0, ${(scroll * PROFUNDIDAD).toFixed(1)}px, 0)`;
        });
      }
    };
    document.head.appendChild(script);
  }

  /* ---------- Enlaces internos (Servicios, Proyectos, Planes…) ----------
     Se manejan aquí por dos motivos: Lenis no cancela el salto nativo (los dos se
     pisan), y una sección que todavía no apareció conserva su desplazamiento de
     animación, que movería el destino. offsetTop mide la posición real, sin ese
     desplazamiento. Como el navegador, se actualiza la dirección y el foco pasa a la
     sección (teclado y lectores de pantalla). */
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
