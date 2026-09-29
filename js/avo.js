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
  };
  const waLink = (tema) => WA_BASE + encodeURIComponent(WHATSAPP[tema] || WHATSAPP.general);

  // Textos basados solo en lo que ya dice la landing: sin precios, cifras ni clientes inventados.
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
    precio: 'El precio depende de lo que necesite tu negocio. En la demo conversamos sobre tu caso y después te enviamos una propuesta clara, con alcance y precio definidos, para que sepas exactamente qué recibes.',
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
    precio: /\b(precio|costo|cuesta|cuanto|cobran|tarifa|presupuesto|valor)/,
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

  const RAPIDAS = ['¿Qué hacen?', 'Quiero más clientes', 'Necesito una página web', 'Quiero automatizar mi atención', 'Ver un caso real'];
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
    </button>
    <section class="avo-panel" id="avo-panel" role="dialog" aria-modal="true" aria-labelledby="avo-title" hidden>
      <header class="avo-panel__head">
        <img class="avo-face avo-panel__avatar" src="${img('normal')}" alt="" width="34" height="34">
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
  const faces = root.querySelectorAll('.avo-face');

  /* Estados de ánimo: normal, parpadeo, saludo, pensando, feliz */
  let mood = 'normal';
  let moodTimer = 0;
  const showFace = (estado) => faces.forEach((f) => { f.src = img(estado); });
  const setMood = (estado, volverEnMs) => {
    clearTimeout(moodTimer);
    mood = estado;
    showFace(estado);
    if (volverEnMs) moodTimer = setTimeout(() => setMood('normal'), volverEnMs);
  };

  // Parpadeo cada 3 a 6 segundos, solo cuando está en reposo
  if (!reduceMotion) {
    const blink = () => {
      if (mood === 'normal') {
        showFace('parpadeo');
        setTimeout(() => { if (mood === 'normal') showFace('normal'); }, 160);
      }
      setTimeout(blink, 3000 + Math.random() * 3000);
    };
    setTimeout(blink, 3000);
  }

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
    setMood('pensando');
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
    cta.href = waLink(respuesta.tema);   // el botón fijo sigue el tema de la conversación
    setMood(respuesta.tema === 'saludo' ? 'saludo' : 'feliz', 2500);
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
    setMood('saludo', 2000);

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
