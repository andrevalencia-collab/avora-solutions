/* Avo · asistente de AVORA (v1: respuestas preparadas, sin IA ni API).
   Todo el chat habla con UNA sola función: getReply(mensaje).
   Para conectar Claude más adelante, solo se reemplaza el interior de getReply
   por una llamada a un servidor propio (ver el comentario sobre getReply).
   Sin librerías. Lo que escribe el usuario siempre se muestra como texto plano. */
(() => {
  const WA_BASE = 'https://wa.me/50763288742?text=';
  const MAX_CHARS = 300;
  const THINK_MS = 1000;
  const BUBBLE_DELAY_MS = 5000;
  const BUBBLE_KEY = 'avo-burbuja-vista';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isDesktop = () => window.matchMedia('(min-width: 900px)').matches;

  /* ---------- Contenido ---------- */

  // Los mismos mensajes prellenados que ya usa la landing en cada botón
  const WHATSAPP = {
    general: 'Hola AVORA, quiero agendar una demo para mi negocio.',
    atrae: 'Hola AVORA, quiero que más clientes conozcan mi negocio en redes sociales. ¿Podemos agendar una demo?',
    convierte: 'Hola AVORA, me interesa una landing page para mi negocio. ¿Podemos agendar una demo?',
    automatiza: 'Hola AVORA, quiero automatizar la atención de mi negocio. ¿Podemos agendar una demo?',
    caso: 'Hola AVORA, vi el caso de Canal Silver y quiero algo así para mi negocio.',
    precio: 'Hola AVORA, vi los planes y quiero saber cuál le conviene a mi negocio. ¿Podemos agendar una demo?',
  };
  const waLink = (tema) => WA_BASE + encodeURIComponent(WHATSAPP[tema] || WHATSAPP.general);

  // Enlaces a secciones de la página según el tema. Salen del tema y no del texto,
  // así getReply sigue devolviendo solo { texto, tema } aunque luego responda la IA.
  const ENLACES = {
    precio: { href: '#planes', texto: 'Ver los planes' },
  };

  // Textos basados solo en lo que ya dice la landing: sin cifras ni clientes inventados.
  // Los precios salen solo de la sección Planes (si cambian allí, se cambian aquí).
  const RESPUESTAS = {
    saludo: '¡Hola! Cuéntame qué necesitas para tu negocio, o elige una de las opciones de abajo.',
    general: [
      'Somos un solo equipo para todo lo digital de tu negocio, en tres pilares:',
      '• Atrae: manejamos tus redes sociales con contenido orgánico y campañas de ads.',
      '• Convierte: landing pages y sitios web pensados para que quien te visita te escriba.',
      '• Automatiza: chatbots y asistentes con IA que responden por ti.',
      '¿Cuál te interesa más?',
    ].join('\n'),
    atrae: 'Para que te conozcan, manejamos tus redes sociales: contenido orgánico y campañas de ads, para que las personas correctas sepan que existes.',
    convierte: 'Hacemos landing pages y sitios web pensados para una sola cosa: que quien te visita te escriba. Puedes empezar con tu página y, cuando estés listo, sumamos lo demás.',
    automatiza: 'Creamos chatbots y asistentes con IA que responden por ti, e integraciones que conectan tus herramientas para que trabajes menos. Así nadie se queda sin respuesta.',
    precio: [
      'Tenemos planes desde $350 (pago único), con tu página lista para que te escriban por WhatsApp.',
      'Si también quieres anuncios, el Sistema AVORA une anuncio, landing y WhatsApp automatizado trabajando juntos.',
      'Mira todos los planes en la página o escríbenos y te ayudamos a elegir.',
    ].join('\n'),
    proceso: [
      'Trabajamos en tres pasos, sin complicaciones:',
      '1. Conversamos sobre tu negocio: qué vendes, a quién y qué te está frenando.',
      '2. Te enviamos una propuesta clara, con alcance y precio definidos.',
      '3. Construimos contigo, por entregas, ajustando según tu feedback.',
    ].join('\n'),
    caso: [
      'Te cuento el caso de Canal Silver (compra de oro, plata y joyería):',
      'No tenían presencia digital propia y su competencia sí. Les hicimos una landing responsive enfocada en conversión, conectada a WhatsApp.',
      'Hoy compiten en igualdad de condiciones y han llegado nuevos clientes por la página.',
    ].join('\n'),
    'no-entiende': 'Esa pregunta la vemos mejor juntos. Escríbenos por WhatsApp y te respondemos directo.',
  };

  // Palabras clave por tema, ya sin tildes y en minúsculas.
  // "\\b" = inicio de palabra: así "ia" no coincide dentro de "envía" o "media".
  const PALABRAS_CLAVE = {
    precio: /\b(precio|costo|cuesta|cuanto|cobran|tarifa|presupuesto|valor|plan(es)?\b|paquete|mensualidad)/,
    caso: /\b(caso|ejemplo|portafolio|trabajos? anteriores|canal silver)/,
    proceso: /\b(proceso|pasos|como trabajan|como funciona)/,
    automatiza: /\b(chatbot|bot\b|automatiz|responder|respuesta|atencion|asistente|ia\b|integraci)/,
    convierte: /\b(pagina|web|landing|sitio)/,
    atrae: /\b(redes|anuncio|ads\b|publicidad|cliente|instagram|facebook|tiktok|seguidores|contenido)/,
    general: /\b(que hacen|servicio|que ofrecen|a que se dedican)/,
    saludo: /^[¡!¿?\s]*(hola|buenas|buenos dias|buen dia|hey)\b/,
  };

  // Si un mensaje toca varios temas, gana el primero de esta lista.
  // Precio y caso primero porque son la pregunta concreta ("¿cuánto cuesta una página?"
  // pregunta el precio, no qué es una página). Luego los pilares del más específico
  // al más amplio: "clientes" aparece en casi cualquier frase, así que Atrae va al final.
  const PRIORIDAD = ['precio', 'caso', 'proceso', 'automatiza', 'convierte', 'atrae', 'general', 'saludo'];

  const normalizar = (texto) => texto.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();

  /**
   * Única puerta de entrada a las respuestas. Devuelve { texto, tema }.
   *
   * Para conectar la API de Claude después: la clave NUNCA va en este archivo
   * (cualquiera podría verla en el navegador). Se crea un servidor pequeño
   * (por ejemplo, una función en Cloudflare Workers o Vercel) que guarda la clave,
   * y aquí solo se hace:
   *   const res = await fetch('/api/avo', { method: 'POST', body: JSON.stringify({ mensaje }) });
   *   return await res.json();   // mismo formato: { texto, tema }
   */
  async function getReply(mensaje) {
    const texto = normalizar(mensaje);
    const tema = PRIORIDAD.find((t) => PALABRAS_CLAVE[t].test(texto)) || 'no-entiende';
    return { texto: RESPUESTAS[tema], tema };
  }

  const RAPIDAS = ['¿Qué hacen?', '¿Cuánto cuesta?', 'Quiero más clientes', 'Necesito una página web', 'Quiero automatizar mi atención', 'Ver un caso real'];
  const BIENVENIDA = '¡Hola! Soy Avo, el asistente de AVORA. ¿En qué te ayudo con tu negocio?';

  /* ---------- Interfaz ---------- */

  const img = (estado) => `img/avo/avo-capucha-${estado}.svg`;
  ['normal', 'parpadeo', 'saludo', 'pensando', 'feliz'].forEach((e) => { new Image().src = img(e); });

  const ICON_CHAT = '<svg class="icon" aria-hidden="true"><use href="#i-chat"/></svg>';
  const root = document.createElement('div');
  root.className = 'avo theme-dark';
  root.innerHTML = `
    <button class="avo-bubble" type="button" hidden>¿Te ayudo?</button>
    <button class="avo-launcher" type="button" aria-expanded="false" aria-controls="avo-panel"
            aria-label="Chatea con Avo, el asistente de AVORA">
      <img class="avo-face avo-launcher__img" src="${img('normal')}" alt="" width="34" height="34">
      <span class="avo-fx" aria-hidden="true"></span>
    </button>
    <section class="avo-panel" id="avo-panel" role="dialog" aria-modal="true" aria-labelledby="avo-title" hidden>
      <header class="avo-panel__head">
        <span class="avo-panel__avatar">
          <img class="avo-face" src="${img('normal')}" alt="" width="34" height="34">
          <span class="avo-fx" aria-hidden="true"></span>
        </span>
        <div class="avo-panel__who">
          <h2 class="avo-panel__title" id="avo-title" tabindex="-1">Avo</h2>
          <p class="avo-panel__sub">Asistente de AVORA</p>
        </div>
        <button class="avo-panel__close" type="button" aria-label="Cerrar chat">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>
        </button>
      </header>
      <div class="avo-log" role="log" aria-live="polite" aria-label="Conversación con Avo" tabindex="-1"></div>
      <p class="avo-typing" role="status"></p>
      <form class="avo-form" novalidate>
        <label class="avo-sr-only" for="avo-input">Escribe tu pregunta</label>
        <input class="avo-input" id="avo-input" type="text" maxlength="${MAX_CHARS}" autocomplete="off"
               placeholder="Escribe tu pregunta…" aria-describedby="avo-count">
        <button class="avo-send" type="submit" aria-label="Enviar">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <span class="avo-count" id="avo-count">0/${MAX_CHARS} caracteres</span>
      </form>
      <a class="btn btn--primary avo-cta" href="${waLink('general')}" target="_blank" rel="noopener">
        ${ICON_CHAT}<span>Agendar demo por WhatsApp</span>
      </a>
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
  const form = $('.avo-form');
  const input = $('.avo-input');
  const sendBtn = $('.avo-send');
  const count = $('.avo-count');
  const cta = $('.avo-cta');
  const avatar = $('.avo-panel__avatar');
  const faces = root.querySelectorAll('.avo-face');

  /* ---------- Estados de Avo ----------
     Una sola tabla decide qué cara pone, qué animación hace y cuánto dura.
     El movimiento vive en css/avo.css: aquí solo se escriben atributos data-*
     en .avo (data-estado, data-anim, data-fx) y el CSS reacciona a ellos.
     Así, con movimiento reducido, el CSS apaga los saltos y las caras siguen cambiando. */
  const ESTADOS = {
    espera:     { cara: 'normal',   prioridad: 0 },               // respira, parpadea y mira
    durmiendo:  { cara: 'parpadeo', prioridad: 0, fx: 'zzz' },
    atento:     { cara: 'feliz',    prioridad: 1, anim: 'saltito', dura: 900 },
    saludando:  { cara: 'saludo',   prioridad: 2, dura: 2000 },
    contento:   { cara: 'feliz',    prioridad: 2, dura: 2500 },   // después de cada respuesta
    aplastar:   { cara: 'normal',   prioridad: 3, anim: 'aplastar', dura: 600, luego: 'saludando' },
    celebrando: { cara: 'feliz',    prioridad: 3, anim: 'celebrar', dura: 1200 },
    bailando:   { cara: 'feliz',    prioridad: 4, anim: 'bailar', dura: 3000 },
    pensando:   { cara: 'pensando', prioridad: 5, fx: 'puntos' },
  };

  let estado = 'espera';
  let estadoTimer = 0;
  const showFace = (cara) => faces.forEach((f) => { f.src = img(cara); });

  // Quitar y volver a poner data-anim reinicia la animación CSS, así el mismo
  // saltito puede repetirse. "void offsetWidth" obliga al navegador a notar el hueco.
  const reiniciarAnim = (anim) => {
    delete root.dataset.anim;
    if (!anim) return;
    void root.offsetWidth;
    root.dataset.anim = anim;
  };

  /**
   * Decide si el estado "nuevo" puede interrumpir al "actual".
   * Ambos son nombres de ESTADOS; cada uno tiene su .prioridad (0 a 5).
   */
  function puedeCambiar(actual, nuevo) {
    // TODO(human)
  }

  // forzar = true se salta la regla: lo usan los temporizadores y el fin de "pensando"
  const cambiarEstado = (nombre, forzar = false) => {
    if (!forzar && !puedeCambiar(estado, nombre)) return false;
    const e = ESTADOS[nombre];
    clearTimeout(estadoTimer);
    estado = nombre;
    showFace(e.cara);
    root.dataset.estado = nombre;
    if (e.fx) root.dataset.fx = e.fx; else delete root.dataset.fx;
    reiniciarAnim(e.anim);
    if (e.dura) estadoTimer = setTimeout(() => cambiarEstado(e.luego || 'espera', true), e.dura);
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

  /* Burbuja "¿Te ayudo?": una sola vez por visita */
  const storage = {
    get: (k) => { try { return sessionStorage.getItem(k); } catch { return null; } },
    set: (k, v) => { try { sessionStorage.setItem(k, v); } catch { /* sin almacenamiento: no pasa nada */ } },
  };
  let bubbleTimer = 0;
  const hideBubble = () => { bubble.hidden = true; clearTimeout(bubbleTimer); };
  if (!storage.get(BUBBLE_KEY)) {
    setTimeout(() => {
      if (!panel.hidden) return;
      storage.set(BUBBLE_KEY, '1');
      bubble.hidden = false;
      bubbleTimer = setTimeout(hideBubble, 10000);
    }, BUBBLE_DELAY_MS);
  }

  /* Mensajes */
  const scrollToEnd = () => { log.scrollTop = log.scrollHeight; };

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

  const addWhatsApp = (msg, tema) => {
    const a = document.createElement('a');
    a.className = 'avo-wa';
    a.href = waLink(tema);
    a.target = '_blank';
    a.rel = 'noopener';
    a.innerHTML = `${ICON_CHAT}<span>Hablar por WhatsApp</span>`;
    msg.appendChild(a);
  };

  // Enlace a una sección de la landing (ej. #planes). El navegador hace el salto
  // solo, porque es un <a href="#...">; aquí decidimos qué pasa con el chat.
  const addLink = (msg, enlace) => {
    const a = document.createElement('a');
    a.className = 'avo-link';
    a.href = enlace.href;
    a.innerHTML = '<span></span><span aria-hidden="true">↓</span>';
    a.firstChild.textContent = enlace.texto;
    // En celular el panel tapa toda la página: se cierra para que se vea la sección.
    // En computadora el panel es pequeño y el chat puede seguir abierto al lado.
    a.addEventListener('click', () => {
      if (!isDesktop()) close();
    });
    msg.appendChild(a);
  };

  // Solo queda un grupo de respuestas rápidas, siempre al final de la conversación
  const addQuickReplies = () => {
    log.querySelectorAll('.avo-chips').forEach((g) => g.remove());
    const group = document.createElement('div');
    group.className = 'avo-chips';
    group.setAttribute('role', 'group');
    group.setAttribute('aria-label', 'Respuestas rápidas');
    RAPIDAS.forEach((texto) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'avo-chip';
      b.textContent = texto;
      b.addEventListener('click', () => {
        log.focus({ preventScroll: true });   // el grupo se reemplaza: el foco no debe perderse
        send(texto);
      });
      group.appendChild(b);
    });
    log.appendChild(group);
    scrollToEnd();
  };

  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  let busy = false;

  async function send(texto) {
    const mensaje = texto.trim().slice(0, MAX_CHARS);
    if (!mensaje || busy) return;
    busy = true;
    sendBtn.disabled = true;
    hideBubble();

    // Las respuestas rápidas anteriores se van; vuelven al final después de la respuesta
    log.querySelectorAll('.avo-chips').forEach((g) => g.remove());
    addMessage('user', mensaje);
    cambiarEstado('pensando', true);
    typing.textContent = 'Avo está escribiendo…';
    root.classList.add('is-thinking');

    let respuesta;
    try {
      // Siempre al menos 1 segundo "pensando", aunque la respuesta llegue antes
      [respuesta] = await Promise.all([getReply(mensaje), wait(THINK_MS)]);
    } catch {
      respuesta = { texto: RESPUESTAS['no-entiende'], tema: 'general' };
    }

    typing.textContent = '';
    root.classList.remove('is-thinking');
    const msg = addMessage('avo', respuesta.texto);
    if (respuesta.tema !== 'saludo') addWhatsApp(msg, respuesta.tema);
    if (ENLACES[respuesta.tema]) addLink(msg, ENLACES[respuesta.tema]);
    cta.href = waLink(respuesta.tema);   // el botón fijo sigue el tema de la conversación
    cambiarEstado(respuesta.tema === 'saludo' ? 'saludando' : 'contento', true);
    addQuickReplies();

    busy = false;
    sendBtn.disabled = false;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const texto = input.value;
    input.value = '';
    count.textContent = `0/${MAX_CHARS} caracteres`;
    send(texto);
  });
  input.addEventListener('input', () => {
    count.textContent = `${input.value.length}/${MAX_CHARS} caracteres`;
  });

  /* Abrir y cerrar */
  let started = false;
  let closeTimer = 0;

  const open = () => {
    clearTimeout(closeTimer);
    hideBubble();
    panel.hidden = false;
    document.documentElement.classList.add('avo-open');
    launcher.setAttribute('aria-expanded', 'true');
    requestAnimationFrame(() => root.classList.add('is-open'));
    // El salto se ve en la cara del panel (el botón flotante se oculta al abrir).
    // El panel abre igual de inmediato: la animación nunca hace esperar al chat.
    cambiarEstado('aplastar');

    if (!started) {
      started = true;
      addMessage('avo', BIENVENIDA);
      addQuickReplies();
    }
    // En computadora se puede escribir de inmediato; en celular no abrimos el teclado solo.
    (isDesktop() ? input : title).focus({ preventScroll: true });
  };

  const close = () => {
    root.classList.remove('is-open');
    document.documentElement.classList.remove('avo-open');
    launcher.setAttribute('aria-expanded', 'false');
    closeTimer = setTimeout(() => { panel.hidden = true; }, reduceMotion ? 0 : 220);
    launcher.focus({ preventScroll: true });
  };

  launcher.addEventListener('click', () => (panel.hidden ? open() : close()));
  bubble.addEventListener('click', open);
  closeBtn.addEventListener('click', close);

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
    const focusables = [...panel.querySelectorAll('button:not([disabled]), a[href], input')]
      .filter((el) => el.offsetParent !== null);
    const i = focusables.indexOf(document.activeElement);
    if (e.shiftKey && (i === 0 || document.activeElement === title)) {
      e.preventDefault(); focusables[focusables.length - 1].focus();
    } else if (!e.shiftKey && i === focusables.length - 1) {
      e.preventDefault(); focusables[0].focus();
    }
  });

  /* No tapar los botones de WhatsApp de la página.
     Se vigila solo la franja de abajo donde vive Avo: si un botón principal
     pasa por esa franja y por el lado derecho, Avo se aparta mientras tanto. */
  if ('IntersectionObserver' in window) {
    const ZONE = 104;   // alto de la franja que ocupa Avo (64px + márgenes)
    const pageCtas = [...document.querySelectorAll('.btn--primary')]
      .filter((b) => !b.closest('.site-header') && !root.contains(b));
    const covering = new Set();
    let observer = null;

    const sync = () => root.classList.toggle('is-ducked', covering.size > 0 && panel.hidden);
    const watch = () => {
      observer?.disconnect();
      covering.clear();
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const overlapsRight = entry.boundingClientRect.right > window.innerWidth - ZONE;
          if (entry.isIntersecting && overlapsRight) covering.add(entry.target);
          else covering.delete(entry.target);
        });
        sync();
      }, { rootMargin: `-${Math.max(0, window.innerHeight - ZONE)}px 0px 0px 0px` });
      pageCtas.forEach((b) => observer.observe(b));
    };
    watch();
    let resizeTimer = 0;
    window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(watch, 150); });
    launcher.addEventListener('focus', () => root.classList.remove('is-ducked'));
  }
})();
