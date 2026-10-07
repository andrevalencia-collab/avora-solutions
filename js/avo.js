/* Avo · asistente GUIADO de AVORA (sin IA, sin API y sin texto libre).
   Hace 3 preguntas con botones (negocio, qué mejorar, si ya tiene página) y
   recomienda uno de los planes de la sección Planes. El botón final abre WhatsApp
   con las respuestas ya escritas (js/mensajes.js → resultadoAvo). No se guarda nada
   en servidores: solo se recuerda, en la pestaña, si la persona ya vio a Avo saludar.
   Sin librerías. Todo el texto se inserta con textContent, nunca como HTML. */
(() => {
  const THINK_MS = 1000;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isDesktop = () => window.matchMedia('(min-width: 900px)').matches;
  const { enlace: waLink, resultadoAvo } = window.AVORA_WHATSAPP;

  /* ---------- Contenido del asistente guiado ----------
     Solo con lo que ya dice la landing (precios del panel Planes): sin cifras ni
     promesas nuevas. Si un precio cambia en index.html, se cambia también en PLANES. */
  const BIENVENIDA = '¡Hola! Soy Avo, el asistente guiado de AVORA. Te hago 3 preguntas y te digo qué plan le conviene a tu negocio.';

  const PREGUNTAS = [
    { clave: 'negocio', texto: '¿Qué negocio tienes?', opciones: ['Restaurante', 'Clínica o salud', 'Gimnasio', 'Inmobiliaria', 'Tienda', 'Otro'] },
    { clave: 'mejorar', texto: '¿Qué quieres mejorar?', opciones: ['Que más gente me conozca', 'Que me escriban más', 'Responder más rápido'] },
    { clave: 'pagina', texto: '¿Ya tienes página web?', opciones: ['Sí', 'No'] },
  ];

  const PLANES = {
    pagina: 'Solo la página (desde $350)',
    web: 'Web + Automatización ($650 + $90/mes)',
    medida: 'A tu medida (según evaluación)',
  };
  const FUNDADORES = 'Si eres de nuestros primeros 5 clientes, tienes 30% de descuento en la instalación.';

  /**
   * Recomendación honesta según lo que quiere mejorar:
   * - Que más gente me conozca → A tu medida: es el único plan con campañas en Meta.
   * - Responder más rápido    → Web + Automatización: página + asistente + WhatsApp Business.
   * - Que me escriban más     → Solo la página: el primer paso, enfocada en que te escriban.
   * Devuelve { plan, lineas }; las líneas vacías (null) se descartan.
   */
  function recomendar({ mejorar, pagina }) {
    const tienePagina = pagina === 'Sí';
    if (mejorar === 'Que más gente me conozca') {
      return {
        plan: PLANES.medida,
        lineas: [
          `Te recomiendo: ${PLANES.medida}.`,
          'Para que más gente te conozca hacen falta anuncios y redes, y eso solo lo incluye este plan, junto con la página y WhatsApp automatizado.',
          tienePagina
            ? 'En la evaluación revisamos tu página actual y te enviamos una propuesta clara.'
            : 'Conversamos, evaluamos tu negocio y te enviamos una propuesta clara.',
        ],
      };
    }
    if (mejorar === 'Responder más rápido') {
      return {
        plan: PLANES.web,
        lineas: [
          `Te recomiendo: ${PLANES.web}.`,
          'Tu página a medida y un asistente que responde por ti, con WhatsApp Business configurado. Es para negocios que pierden clientes por no responder a tiempo.',
          tienePagina ? 'Como ya tienes página, en la llamada la revisamos juntos.' : null,
          FUNDADORES,
        ],
      };
    }
    return {
      plan: PLANES.pagina,
      lineas: [
        `Te recomiendo: ${PLANES.pagina}.`,
        tienePagina
          ? 'Si tu página actual no te trae mensajes, la rehacemos con una sola meta: que quien te visita te escriba por WhatsApp.'
          : 'Una página hecha para una sola cosa: que quien te visita te escriba por WhatsApp.',
        'Es el primer paso. Cuando estés listo, sumamos lo demás.',
        FUNDADORES,
      ],
    };
  }

  /* ---------- Interfaz ---------- */

  const CARAS = ['normal', 'parpadeo', 'saludo', 'pensando', 'feliz', 'hablando'];
  const img = (cara) => `img/avo/avo-${cara}.svg`;
  CARAS.forEach((c) => { new Image().src = img(c); });

  const root = document.createElement('div');
  root.className = 'avo';
  root.innerHTML = `
    <button class="avo-bubble" type="button"></button>
    <button class="avo-launcher" type="button" aria-expanded="false" aria-controls="avo-panel"
            aria-label="Abre a Avo, el asistente guiado de AVORA">
      <span class="avo-ventana"><img class="avo-face" src="${img('normal')}" alt="" width="48" height="48"></span>
      <span class="avo-fx" aria-hidden="true"></span>
    </button>
    <section class="avo-panel" id="avo-panel" role="dialog" aria-modal="true" aria-labelledby="avo-title" data-lenis-prevent hidden>
      <header class="avo-panel__head">
        <span class="avo-panel__avatar">
          <span class="avo-ventana"><img class="avo-face" src="${img('normal')}" alt="" width="48" height="48"></span>
          <span class="avo-fx" aria-hidden="true"></span>
        </span>
        <div class="avo-panel__who">
          <h2 class="avo-panel__title" id="avo-title" tabindex="-1">Avo</h2>
          <p class="avo-panel__sub">Asistente guiado de AVORA</p>
        </div>
        <button class="avo-panel__close" type="button" aria-label="Cerrar a Avo">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>
        </button>
      </header>
      <div class="avo-log" role="log" aria-live="polite" aria-label="Conversación con Avo" tabindex="-1"></div>
      <p class="avo-typing" role="status"></p>
      <div class="avo-pie">
        <a class="btn btn--primary avo-cta" href="${waLink('llamada')}" target="_blank" rel="noopener">Agenda una llamada</a>
      </div>
    </section>`;
  document.body.appendChild(root);

  const $ = (sel) => root.querySelector(sel);
  const launcher = $('.avo-launcher');
  const bubble = $('.avo-bubble');
  const panel = $('.avo-panel');
  const title = $('.avo-panel__title');
  const closeBtn = $('.avo-panel__close');
  const log = $('.avo-log');
  const typing = $('.avo-typing');
  const avatar = $('.avo-panel__avatar');
  const faces = root.querySelectorAll('.avo-face');

  /* ---------- Estados de Avo ----------
     Una sola tabla decide qué cara pone, qué animación hace y cuánto dura.
     El movimiento vive en css/avo.css: aquí solo se escriben atributos data-*
     en .avo (data-estado, data-anim, data-fx) y el CSS reacciona a ellos.
     Así, con movimiento reducido, el CSS apaga los saltos y las caras siguen cambiando.
     "habla": mientras dura, alterna las caras "hablando" y "normal". */
  const ESTADOS = {
    espera:     { cara: 'normal',   prioridad: 0 },               // respira, parpadea y mira
    durmiendo:  { cara: 'parpadeo', prioridad: 0, fx: 'zzz' },
    atento:     { cara: 'feliz',    prioridad: 1, anim: 'saltito', dura: 900 },
    saludando:  { cara: 'saludo',   prioridad: 2, dura: 2000 },
    contento:   { cara: 'feliz',    prioridad: 2, dura: 2500 },
    pensativo:  { cara: 'pensando', prioridad: 2, dura: 2500 },   // al pasar por Servicios
    aplastar:   { cara: 'normal',   prioridad: 3, anim: 'aplastar', dura: 600, luego: 'saludando' },
    celebrando: { cara: 'feliz',    prioridad: 3, anim: 'celebrar', dura: 1200 },
    hablando:   { cara: 'hablando', prioridad: 4, habla: true, dura: 2400, luego: 'contento' },
    bailando:   { cara: 'feliz',    prioridad: 4, anim: 'bailar', dura: 3000 },
    pensando:   { cara: 'pensando', prioridad: 5, fx: 'puntos' },
  };

  let estado = 'espera';
  let estadoTimer = 0;
  let hablaTimer = 0;
  const showFace = (cara) => faces.forEach((f) => { f.src = img(cara); });

  // Quitar y volver a poner data-anim reinicia la animación CSS, así el mismo
  // saltito puede repetirse. "void offsetWidth" obliga al navegador a notar el hueco.
  const reiniciarAnim = (anim) => {
    delete root.dataset.anim;
    if (!anim) return;
    void root.offsetWidth;
    root.dataset.anim = anim;
  };

  // Un estado puede interrumpir a otro de igual o mayor prioridad (nunca a uno más importante)
  const puedeCambiar = (actual, nuevo) => ESTADOS[nuevo].prioridad >= ESTADOS[actual].prioridad;

  // forzar = true se salta la regla: lo usan los temporizadores y el asistente.
  // dura (opcional) reemplaza la duración de la tabla: "hablando" es más corto en las preguntas.
  const cambiarEstado = (nombre, forzar = false, dura = ESTADOS[nombre].dura) => {
    if (!forzar && !puedeCambiar(estado, nombre)) return false;
    const e = ESTADOS[nombre];
    clearTimeout(estadoTimer);
    clearInterval(hablaTimer);
    estado = nombre;
    showFace(e.cara);
    root.dataset.estado = nombre;
    if (e.fx) root.dataset.fx = e.fx; else delete root.dataset.fx;
    reiniciarAnim(e.anim);
    if (e.habla) {
      let boca = true;
      hablaTimer = setInterval(() => { boca = !boca; showFace(boca ? 'hablando' : 'normal'); }, 180);
    }
    if (dura) estadoTimer = setTimeout(() => cambiarEstado(e.luego || 'espera', true), dura);
    return true;
  };
  root.dataset.estado = estado;

  // Parpadeo cada 3 a 6 segundos, solo en espera. Es solo un cambio de cara,
  // por eso sigue activo con movimiento reducido.
  const blink = () => {
    if (estado === 'espera') {
      showFace('parpadeo');
      setTimeout(() => { if (estado === 'espera') showFace('normal'); }, 160);
    }
    setTimeout(blink, 3000 + Math.random() * 3000);
  };
  setTimeout(blink, 3000);

  // Cada tanto se inclina un poco a un lado, como mirando (sin cambiar de estado)
  const mirar = () => {
    if (estado === 'espera' && !root.dataset.anim) {
      reiniciarAnim('mirar');
      setTimeout(() => { if (root.dataset.anim === 'mirar') delete root.dataset.anim; }, 1400);
    }
    setTimeout(mirar, 8000 + Math.random() * 7000);
  };
  setTimeout(mirar, 6000);

  // Pixel art de los efectos: cada unidad del viewBox es un pixel del dibujo
  const PUNTOS = '<svg class="avo-fx__puntos" viewBox="0 0 8 2" shape-rendering="crispEdges">'
    + '<rect width="2" height="2"/><rect x="3" width="2" height="2"/><rect x="6" width="2" height="2"/></svg>';
  const ZETA = '<svg class="avo-fx__z" viewBox="0 0 5 5" shape-rendering="crispEdges">'
    + '<path d="M0 0h5v1H0zM3 1h1v1H3zM2 2h1v1H2zM1 3h1v1H1zM0 4h5v1H0z"/></svg>';
  root.querySelectorAll('.avo-fx').forEach((fx) => { fx.innerHTML = PUNTOS + ZETA + ZETA + ZETA; });

  /* ---------- Burbuja del botón flotante ----------
     Cambia de texto con un fundido: primero se va (200 ms), después vuelve con el texto nuevo. */
  let textoBurbuja = null;
  let burbujaTimer = 0;
  const setBurbuja = (texto) => {
    if (texto === textoBurbuja) return;
    textoBurbuja = texto;
    clearTimeout(burbujaTimer);
    const mostrar = () => { bubble.textContent = texto; root.classList.add('has-burbuja'); };
    if (!root.classList.contains('has-burbuja')) {
      if (texto) mostrar();
      return;
    }
    root.classList.remove('has-burbuja');
    if (texto) burbujaTimer = setTimeout(mostrar, 200);
  };

  /* ---------- Conversación guiada ---------- */
  const scrollToEnd = () => { log.scrollTop = log.scrollHeight; };
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  const addMessage = (quien, texto) => {
    const msg = document.createElement('div');
    msg.className = `avo-msg avo-msg--${quien}`;
    texto.split('\n').forEach((linea) => {
      const p = document.createElement('p');
      p.textContent = linea;           // siempre texto plano, nunca HTML
      msg.appendChild(p);
    });
    log.appendChild(msg);
    scrollToEnd();
    return msg;
  };

  // Enlace a una sección de la landing (ej. #planes). main.js maneja el salto;
  // en celular el chat tapa toda la página, así que se cierra para que se vea la sección.
  const addLink = (msg, href, texto) => {
    const a = document.createElement('a');
    a.className = 'avo-link';
    a.href = href;
    a.innerHTML = '<span></span><span aria-hidden="true">↓</span>';
    a.firstChild.textContent = texto;
    a.addEventListener('click', () => { if (!isDesktop()) close(); });
    msg.appendChild(a);
  };

  // Un solo grupo de opciones a la vez, siempre al final. El foco pasa a la primera
  // opción para que con teclado se pueda seguir sin buscarla.
  const quitarOpciones = () => log.querySelectorAll('.avo-chips').forEach((g) => g.remove());
  const addOpciones = (opciones) => {
    quitarOpciones();
    const group = document.createElement('div');
    group.className = 'avo-chips';
    group.setAttribute('role', 'group');
    group.setAttribute('aria-label', 'Opciones');
    opciones.forEach(({ texto, accion, secundaria }) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = secundaria ? 'avo-chip avo-chip--sec' : 'avo-chip';
      b.textContent = texto;
      b.addEventListener('click', accion);
      group.appendChild(b);
    });
    log.appendChild(group);
    scrollToEnd();
    if (!panel.hidden) group.firstChild.focus({ preventScroll: true });
  };

  let paso = 0;
  let respuestas = {};
  let busy = false;

  // "Pensando" un segundo antes de cada respuesta de Avo
  const pensar = async () => {
    cambiarEstado('pensando', true);
    typing.textContent = 'Avo está pensando…';
    root.classList.add('is-thinking');
    await wait(THINK_MS);
    typing.textContent = '';
    root.classList.remove('is-thinking');
  };

  const preguntar = () => {
    const q = PREGUNTAS[paso];
    addMessage('avo', q.texto);
    cambiarEstado('hablando', true, 900);
    const opciones = q.opciones.map((texto) => ({ texto, accion: () => responder(texto) }));
    if (paso > 0) opciones.push({ texto: 'Volver', accion: volver, secundaria: true });
    addOpciones(opciones);
  };

  // El usuario tocó una opción (o "Volver"): se muestra su elección, Avo piensa y sigue
  const turno = async (textoUsuario, siguiente) => {
    if (busy) return;
    busy = true;
    log.focus({ preventScroll: true });   // las opciones se van: el foco no debe perderse
    quitarOpciones();
    addMessage('user', textoUsuario);
    await pensar();
    siguiente();
    busy = false;
  };

  function responder(opcion) {
    turno(opcion, () => {
      respuestas[PREGUNTAS[paso].clave] = opcion;
      paso += 1;
      if (paso < PREGUNTAS.length) preguntar(); else mostrarResultado();
    });
  }

  function volver() {
    turno('Volver', () => { paso -= 1; preguntar(); });
  }

  function mostrarResultado() {
    const { plan, lineas } = recomendar(respuestas);
    const msg = addMessage('avo', lineas.filter(Boolean).join('\n'));

    const cta = document.createElement('a');
    cta.className = 'btn btn--primary avo-resultado__cta';
    cta.href = resultadoAvo({ plan, ...respuestas });
    cta.target = '_blank';
    cta.rel = 'noopener';
    cta.textContent = 'Agenda una llamada';
    msg.appendChild(cta);
    addLink(msg, '#planes', 'Ver los planes');

    cambiarEstado('hablando', true);
    addOpciones([{ texto: 'Empezar de nuevo', accion: reiniciar, secundaria: true }]);
  }

  function reiniciar() {
    turno('Empezar de nuevo', () => {
      paso = 0;
      respuestas = {};
      preguntar();
    });
  }

  /* ---------- Abrir y cerrar ---------- */
  let started = false;
  let closeTimer = 0;
  let abridor = launcher;              // quien abrió el chat recibe el foco al cerrarlo

  const open = (desde = launcher) => {
    abridor = desde;
    clearTimeout(closeTimer);
    panel.hidden = false;
    document.documentElement.classList.add('avo-open');
    launcher.setAttribute('aria-expanded', 'true');
    requestAnimationFrame(() => root.classList.add('is-open'));
    // El salto se ve en la cara del panel (el botón flotante se oculta al abrir)
    cambiarEstado('aplastar');

    if (!started) {
      started = true;
      addMessage('avo', BIENVENIDA);
      preguntar();
    }
    // En computadora el foco va a la primera opción; en celular, al título del chat
    const opcion = log.querySelector('.avo-chip');
    (isDesktop() && opcion ? opcion : title).focus({ preventScroll: true });
  };

  const close = () => {
    root.classList.remove('is-open');
    document.documentElement.classList.remove('avo-open');
    launcher.setAttribute('aria-expanded', 'false');
    // Espera a que termine la transición de cierre (con movimiento reducido es solo el fundido)
    closeTimer = setTimeout(() => { panel.hidden = true; }, reduceMotion ? 180 : 220);
    // Si lo abrió el botón flotante pero ahora está escondido (portada), no hay a dónde volver
    const oculto = abridor === launcher && root.classList.contains('is-oculto');
    if (!oculto) abridor.focus({ preventScroll: true });
  };

  launcher.addEventListener('click', () => (panel.hidden ? open(launcher) : close()));
  bubble.addEventListener('click', () => open(launcher));
  closeBtn.addEventListener('click', close);
  // Cualquier [data-abrir-avo] de la página abre el asistente (la burbuja de la portada)
  document.addEventListener('click', (e) => {
    const disparador = e.target instanceof Element && e.target.closest('[data-abrir-avo]');
    if (disparador) open(disparador);
  });

  /* ---------- Reacciones ---------- */

  // Pasar el mouse (o tocarlo en celular): se alegra y da un saltito
  [launcher, avatar].forEach((el) => el.addEventListener('pointerenter', () => cambiarEstado('atento')));

  // Cualquier botón de WhatsApp (de la página o del chat): celebra.
  // El enlace abre otra pestaña o la app, así que si la página se oculta justo
  // después, la celebración se repite una vez cuando la persona vuelve.
  let clicWhatsApp = 0;
  let celebrarAlVolver = false;
  document.addEventListener('click', (e) => {
    if (!(e.target instanceof Element) || !e.target.closest('a[href^="https://wa.me/"]')) return;
    clicWhatsApp = Date.now();
    cambiarEstado('celebrando');
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      celebrarAlVolver = Date.now() - clicWhatsApp < 2000;
    } else if (celebrarAlVolver) {
      celebrarAlVolver = false;
      ultimaActividad = Date.now();
      cambiarEstado('celebrando');
    }
  });

  // Sin actividad en 30 segundos: se duerme. Los listeners solo guardan la hora
  // (son "passive": nunca frenan el scroll). "capture" atrapa también el scroll
  // de dentro del chat, que no sube hasta document por sí solo.
  const DORMIR_MS = 30000;
  let ultimaActividad = Date.now();
  const actividad = () => {
    ultimaActividad = Date.now();
    if (estado === 'durmiendo') cambiarEstado('espera');
  };
  ['mousemove', 'scroll', 'wheel', 'touchstart', 'pointerdown', 'keydown'].forEach((ev) => {
    document.addEventListener(ev, actividad, { passive: true, capture: true });
  });
  setInterval(() => {
    if (estado === 'espera' && Date.now() - ultimaActividad > DORMIR_MS) cambiarEstado('durmiendo');
  }, 1000);

  // Secreto: 5 clics seguidos en Avo (cada uno a menos de 800 ms del anterior) y baila.
  // El primer clic en el botón abre el chat; los demás caen en su cara del panel.
  const SECRETO_CLICS = 5;
  const SECRETO_MS = 800;
  let clics = 0;
  let ultimoClic = 0;
  const contarClic = () => {
    const ahora = Date.now();
    clics = ahora - ultimoClic < SECRETO_MS ? clics + 1 : 1;
    ultimoClic = ahora;
    if (clics >= SECRETO_CLICS) {
      clics = 0;
      cambiarEstado('bailando');
    }
  };
  [launcher, avatar].forEach((el) => el.addEventListener('click', contarClic));

  // Escape cierra; Tab no se escapa del chat abierto
  panel.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { e.preventDefault(); close(); return; }
    if (e.key !== 'Tab') return;
    const focusables = [...panel.querySelectorAll('button:not([disabled]), a[href]')]
      .filter((el) => el.offsetParent !== null);
    const i = focusables.indexOf(document.activeElement);
    if (e.shiftKey && (i === 0 || document.activeElement === title)) {
      e.preventDefault(); focusables[focusables.length - 1].focus();
    } else if (!e.shiftKey && i === focusables.length - 1) {
      e.preventDefault(); focusables[0].focus();
    }
  });

  if (!('IntersectionObserver' in window)) return;

  /* ---------- Aparece al salir de la portada ----------
     En la portada ya está Avo gigante: el botón flotante espera escondido hasta que
     el final de la portada sube por encima del 40 % de la pantalla, y entonces entra
     con un fundido y saluda. Si se vuelve a la portada, se esconde otra vez. */
  const portada = document.querySelector('.hero');
  if (portada) {
    root.classList.add('is-oculto');
    new IntersectionObserver(([entrada]) => {
      const enPortada = entrada.isIntersecting;
      const estabaOculto = root.classList.contains('is-oculto');
      root.classList.toggle('is-oculto', enPortada);
      if (estabaOculto && !enPortada && panel.hidden) cambiarEstado('saludando');
    }, { rootMargin: '-40% 0px 0px 0px' }).observe(portada);
  }

  /* ---------- Reacciones al pasar por cada sección ----------
     Cuando el centro de la pantalla entra en una sección: Servicios lo pone a pensar,
     Proyectos lo alegra, Planes ofrece el diagnóstico en la burbuja y el cierre saluda. */
  const REACCIONES = { servicios: 'pensativo', proyectos: 'contento', planes: null, contacto: 'saludando' };
  const BURBUJA_PLANES = '¿Te ayudo a elegir plan?';
  const observadorSecciones = new IntersectionObserver((entradas) => {
    entradas.forEach(({ target, isIntersecting }) => {
      if (target.id === 'planes') setBurbuja(isIntersecting ? BURBUJA_PLANES : null);
      if (!isIntersecting || !panel.hidden || root.classList.contains('is-oculto')) return;
      if (REACCIONES[target.id]) cambiarEstado(REACCIONES[target.id]);
    });
  }, { rootMargin: '-50% 0px -50% 0px' });
  Object.keys(REACCIONES).forEach((id) => {
    const seccion = document.getElementById(id);
    if (seccion) observadorSecciones.observe(seccion);
  });

  /* No tapar los botones de la página.
     Se vigila solo la franja de abajo donde vive Avo: si un botón principal
     pasa por esa franja y por el lado derecho, Avo se aparta mientras tanto. */
  const ZONE = 104;   // alto de la franja que ocupa Avo (64px + márgenes)
  const pageCtas = [...document.querySelectorAll('.btn--primary, .flecha, .cta__whatsapp')]
    .filter((b) => !b.closest('.site-header') && !root.contains(b));
  const covering = new Set();
  let observer = null;

  // Fondo detrás de Avo: si una franja clara (Servicios, Planes) pasa por su zona,
  // Avo usa su versión clara para no quedar como una mancha negra sobre el fondo crema.
  const franjasClaras = [...document.querySelectorAll('.tema-claro')];
  const encimaDeClaro = new Set();
  let observerFondo = null;

  const sync = () => root.classList.toggle('is-ducked', covering.size > 0 && panel.hidden);
  const watch = () => {
    const zona = { rootMargin: `-${Math.max(0, window.innerHeight - ZONE)}px 0px 0px 0px` };
    observer?.disconnect();
    covering.clear();
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const overlapsRight = entry.boundingClientRect.right > window.innerWidth - ZONE;
        if (entry.isIntersecting && overlapsRight) covering.add(entry.target);
        else covering.delete(entry.target);
      });
      sync();
    }, zona);
    pageCtas.forEach((b) => observer.observe(b));

    observerFondo?.disconnect();
    encimaDeClaro.clear();
    observerFondo = new IntersectionObserver((entries) => {
      entries.forEach((entry) => (entry.isIntersecting ? encimaDeClaro.add(entry.target) : encimaDeClaro.delete(entry.target)));
      root.classList.toggle('avo--sobre-claro', encimaDeClaro.size > 0);
    }, zona);
    franjasClaras.forEach((f) => observerFondo.observe(f));
  };
  watch();
  let resizeTimer = 0;
  window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(watch, 150); });
  launcher.addEventListener('focus', () => root.classList.remove('is-ducked'));
})();
