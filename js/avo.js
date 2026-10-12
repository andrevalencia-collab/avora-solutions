/* Avo · asistente de AVORA (v1: respuestas preparadas, sin IA ni API).
   Todo el chat habla con UNA sola función: getReply(mensaje).
   Para conectar Claude más adelante, solo se reemplaza el interior de getReply
   por una llamada a un servidor propio (ver el comentario sobre getReply).
   Sin librerías. Lo que escribe el usuario siempre se muestra como texto plano. */
(() => {
  const WA_BASE = 'https://wa.me/50766328271?text=';
  const MAX_CHARS = 300;
  const THINK_MS = 1000;
  const BUBBLE_DELAY_MS = 5000;
  const BUBBLE_KEY = 'avo-burbuja-vista';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isDesktop = () => window.matchMedia('(min-width: 900px)').matches;

  // El chat habla el idioma de la página, que cambia js/idioma.js con el botón ES | EN.
  // Cada texto tiene su versión en inglés al lado (…_EN); esta función elige cuál usar.
  const segunIdioma = (es, en) => (document.documentElement.lang === 'en' ? en : es);

  /* ---------- Contenido ---------- */

  // Los mismos mensajes prellenados que ya usa la landing en cada botón
  const WHATSAPP = {
    general: 'Hola, vi su página web y quiero información sobre sus servicios.',
    atrae: 'Hola AVORA, quiero que más clientes conozcan mi negocio en redes sociales. ¿Me dan más información?',
    convierte: 'Hola AVORA, me interesa una landing page para mi negocio. ¿Me dan más información?',
    automatiza: 'Hola AVORA, quiero automatizar la atención de mi negocio. ¿Me dan más información?',
    caso: 'Hola AVORA, vi sus proyectos y quiero algo así para mi negocio.',
    precio: 'Hola AVORA, vi los planes y quiero saber cuál le conviene a mi negocio. ¿Me dan más información?',
  };
  const WHATSAPP_EN = {
    general: 'Hi, I saw your website and I\'d like information about your services.',
    atrae: 'Hi AVORA, I\'d like more customers to find my business on social media. Could you send me more information?',
    convierte: 'Hi AVORA, I\'m interested in a landing page for my business. Could you send me more information?',
    automatiza: 'Hi AVORA, I\'d like to automate my customer service. Could you send me more information?',
    caso: 'Hi AVORA, I saw your projects and I\'d like something like that for my business.',
    precio: 'Hi AVORA, I saw the plans and I\'d like to know which one fits my business. Could you send me more information?',
  };
  const waLink = (tema) => {
    const mensajes = segunIdioma(WHATSAPP, WHATSAPP_EN);
    return WA_BASE + encodeURIComponent(mensajes[tema] || mensajes.general);
  };

  // Enlaces a secciones de la página según el tema. Salen del tema y no del texto,
  // así getReply sigue devolviendo solo { texto, tema } aunque luego responda la IA.
  const ENLACES = {
    precio: { href: '#planes', texto: 'Ver los planes', textoEn: 'See the plans' },
    caso: { href: '#proyectos', texto: 'Ver los proyectos', textoEn: 'See the projects' },
  };

  // Textos basados solo en lo que ya dice la landing: sin cifras ni clientes inventados.
  // Los precios salen solo de la sección Planes (si cambian allí, se cambian aquí).
  const RESPUESTAS = {
    saludo: '¡Hola! Cuéntame qué necesitas para tu negocio, o elige una de las opciones de abajo.',
    general: [
      'Somos un solo equipo para todo lo digital de tu negocio, en tres pilares:',
      '• Atrae: manejamos tus redes sociales con contenido orgánico y campañas de ads.',
      '• Convierte: landing pages y sitios web pensados para que quien te visita te escriba.',
      '• Automatiza: automatizaciones que responden por ti.',
      '¿Cuál te interesa más?',
    ].join('\n'),
    atrae: 'Para que te conozcan, manejamos tus redes sociales: contenido orgánico y campañas de ads, para que las personas correctas sepan que existes.',
    convierte: 'Hacemos landing pages y sitios web pensados para una sola cosa: que quien te visita te escriba. Puedes empezar con tu página y, cuando estés listo, sumamos lo demás.',
    automatiza: 'Creamos automatizaciones que responden por ti, e integraciones que conectan tus herramientas para que trabajes menos. Así nadie se queda sin respuesta.',
    precio: [
      'Tenemos dos planes:',
      '• Web + Automatización: $650 de instalación + $90/mes. Tu página a medida y una automatización que responde por ti. Si solo necesitas la página, desde $350.',
      '• A tu medida: anuncios, página y WhatsApp automatizado trabajando juntos. El precio sale de una evaluación de tu negocio.',
      'Clientes Fundadores: 30% de descuento en la instalación para los primeros 5 clientes.',
    ].join('\n'),
    proceso: [
      'Trabajamos en tres pasos, sin complicaciones:',
      '1. Conversamos sobre tu negocio: qué vendes, a quién y qué te está frenando.',
      '2. Te enviamos una propuesta clara, con alcance y precio definidos.',
      '3. Construimos contigo, por entregas, ajustando según tu feedback.',
    ].join('\n'),
    caso: [
      'Te cuento dos proyectos que ya están en línea:',
      '• Canal Silver (compra de oro, plata y joyería): no tenían presencia digital propia y su competencia sí. Les hicimos una landing enfocada en conversión, conectada a WhatsApp. Hoy compiten en igualdad de condiciones y han llegado nuevos clientes por la página.',
      '• Distrito 507 (marca de ropa inspirada en Panamá, proyecto escolar): un lookbook digital con una historia por cada diseño. Sorprendió al grupo y a los padres de familia, y hasta generó la venta de un suéter.',
    ].join('\n'),
    'no-entiende': 'Esa pregunta la vemos mejor juntos. Escríbenos por WhatsApp y te respondemos directo.',
  };
  // Las mismas respuestas en inglés, con los mismos precios
  const RESPUESTAS_EN = {
    saludo: 'Hi! Tell me what your business needs, or pick one of the options below.',
    general: [
      'We\'re one team for everything digital in your business, built on three pillars:',
      '• Attract: we manage your social media with organic content and ad campaigns.',
      '• Convert: landing pages and websites built so visitors message you.',
      '• Automate: automations that reply for you.',
      'Which one interests you most?',
    ].join('\n'),
    atrae: 'To get you noticed, we manage your social media: organic content and ad campaigns, so the right people know you exist.',
    convierte: 'We build landing pages and websites designed for one thing: getting visitors to message you. You can start with your page and add the rest when you\'re ready.',
    automatiza: 'We build automations that reply for you, and integrations that connect your tools so you work less. That way, no one is left without an answer.',
    precio: [
      'We have two plans:',
      '• Web + Automation: $650 setup + $90/mo. Your custom page plus an automation that replies for you. If you only need the page, from $350.',
      '• Tailored: ads, website and automated WhatsApp working together. The price comes from an assessment of your business.',
      'Founding Clients: 30% off setup for the first 5 clients.',
    ].join('\n'),
    proceso: [
      'We work in three simple steps:',
      '1. We talk about your business: what you sell, who you sell to and what\'s holding you back.',
      '2. We send you a clear proposal, with a defined scope and price.',
      '3. We build with you, in stages, adjusting based on your feedback.',
    ].join('\n'),
    caso: [
      'Here are two projects that are already live:',
      '• Canal Silver (buyers of gold, silver and jewelry): they had no digital presence of their own, and their competitors did. We built them a conversion-focused landing page connected to WhatsApp. Today they compete on equal footing, and new customers have come in through the page.',
      '• Distrito 507 (a clothing brand inspired by Panama, school project): a digital lookbook with a story behind each design. It surprised the group and the parents, and even led to the sale of a sweater.',
    ].join('\n'),
    'no-entiende': 'That\'s a question we\'d better look at together. Message us on WhatsApp and we\'ll reply directly.',
  };

  // Palabras clave por tema, ya sin tildes y en minúsculas.
  // "\\b" = inicio de palabra: así "ia" no coincide dentro de "envía" o "media".
  const PALABRAS_CLAVE = {
    precio: /\b(precio|costo|cuesta|cuanto|cobran|tarifa|presupuesto|valor|plan(es)?\b|paquete|mensualidad)/,
    caso: /\b(caso|ejemplo|portafolio|proyectos?\b|trabajos? anteriores|canal silver|distrito 507|lookbook)/,
    proceso: /\b(proceso|pasos|como trabajan|como funciona)/,
    automatiza: /\b(chatbot|bot\b|automatiz|responder|respuesta|atencion|asistente|ia\b|integraci)/,
    convierte: /\b(pagina|web|landing|sitio)/,
    atrae: /\b(redes|anuncio|ads\b|publicidad|cliente|instagram|facebook|tiktok|seguidores|contenido)/,
    general: /\b(que hacen|servicio|que ofrecen|a que se dedican)/,
    saludo: /^[¡!¿?\s]*(hola|buenas|buenos dias|buen dia|hey)\b/,
  };
  // Lo mismo para preguntas en inglés (mismos temas, misma prioridad)
  const PALABRAS_CLAVE_EN = {
    precio: /\b(pric|cost|how much|rates?\b|budget|quote|plans?\b|package|monthly|fees?\b)/,
    caso: /\b(case|example|portfolio|projects?\b|previous work|canal silver|distrito 507|lookbook)/,
    proceso: /\b(process|steps|how do you work|how does it work)/,
    automatiza: /\b(chatbot|bot\b|automat|repl(y|ies)\b|respond|answer|customer service|assistant|ai\b|integrat)/,
    convierte: /\b(page|web|landing|site)/,
    atrae: /\b(social|ads?\b|advertis|customer|client|instagram|facebook|tiktok|followers|content)/,
    general: /\b(what do you do|services?\b|what do you offer)/,
    saludo: /^[!?\s]*(hi|hello|hey|good morning|good afternoon)\b/,
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
    const palabras = segunIdioma(PALABRAS_CLAVE, PALABRAS_CLAVE_EN);
    const tema = PRIORIDAD.find((t) => palabras[t].test(texto)) || 'no-entiende';
    return { texto: segunIdioma(RESPUESTAS, RESPUESTAS_EN)[tema], tema };
  }

  // Opciones rápidas, por tema. El texto que se ve es también la pregunta que se envía,
  // así que cada uno tiene que caer en su tema con las palabras clave de arriba.
  const OPCIONES = {
    general: '¿Qué hacen?',
    precio: '¿Cuánto cuesta?',
    atrae: 'Quiero más clientes',
    convierte: 'Necesito una página web',
    automatiza: 'Quiero automatizar mi atención',
    caso: 'Ver proyectos',
    proceso: '¿Cómo trabajan?',
  };
  const OPCIONES_EN = {
    general: 'What do you do?',
    precio: 'How much does it cost?',
    atrae: 'I want more customers',
    convierte: 'I need a website',
    automatiza: 'I want to automate my replies',
    caso: 'See projects',
    proceso: 'How do you work?',
  };
  // Qué ofrecer en cada momento: al abrir, el menú completo; después de cada respuesta,
  // 2 o 3 opciones relacionadas con ese tema (nunca la que se acaba de responder).
  // "Hablar por WhatsApp" va siempre al principio de la fila y no se anota aquí.
  const OPCIONES_INICIO = ['general', 'precio', 'atrae', 'convierte', 'automatiza', 'caso'];
  const SIGUIENTES = {
    precio: ['proceso', 'caso'],
    general: ['atrae', 'convierte', 'automatiza'],
    atrae: ['convierte', 'precio'],
    convierte: ['precio', 'caso'],
    automatiza: ['precio', 'proceso'],
    caso: ['precio', 'proceso'],
    proceso: ['precio', 'caso'],
    saludo: ['general', 'precio'],
    'no-entiende': ['general', 'precio'],
  };
  const BIENVENIDA = '¡Hola! Soy Avo, el asistente de AVORA. ¿En qué te ayudo con tu negocio?';
  const BIENVENIDA_EN = 'Hi! I\'m Avo, AVORA\'s assistant. How can I help with your business?';

  // Textos fijos de la interfaz del chat (botones, etiquetas para lectores de pantalla)
  const INTERFAZ = {
    burbuja: '¿Te ayudo?',
    abrir: 'Chatea con Avo, el asistente de AVORA',
    sub: 'Asistente de AVORA',
    cerrar: 'Cerrar chat',
    conversacion: 'Conversación con Avo',
    pregunta: 'Escribe tu pregunta',
    enviar: 'Enviar',
    caracteres: 'caracteres',
    escribiendo: 'Avo está escribiendo…',
    whatsapp: 'Hablar por WhatsApp',
    rapidas: 'Respuestas rápidas',
  };
  const INTERFAZ_EN = {
    burbuja: 'Need help?',
    abrir: 'Chat with Avo, AVORA\'s assistant',
    sub: 'AVORA\'s assistant',
    cerrar: 'Close chat',
    conversacion: 'Conversation with Avo',
    pregunta: 'Type your question',
    enviar: 'Send',
    caracteres: 'characters',
    escribiendo: 'Avo is typing…',
    whatsapp: 'Chat on WhatsApp',
    rapidas: 'Quick replies',
  };
  const ui = () => segunIdioma(INTERFAZ, INTERFAZ_EN);

  /* ---------- Interfaz ---------- */

  const img = (estado) => `img/avo/avo-${estado}.svg`;
  ['normal', 'parpadeo', 'saludo', 'pensando', 'feliz'].forEach((e) => { new Image().src = img(e); });

  const root = document.createElement('div');
  root.className = 'avo theme-dark';
  const t = ui();   // textos en el idioma con el que carga la página
  root.innerHTML = `
    <button class="avo-bubble" type="button" hidden>${t.burbuja}</button>
    <button class="avo-launcher" type="button" aria-expanded="false" aria-controls="avo-panel"
            aria-label="${t.abrir}">
      <img class="avo-face avo-launcher__img" src="${img('normal')}" alt="" width="48" height="48">
      <span class="avo-fx" aria-hidden="true"></span>
    </button>
    <section class="avo-panel" id="avo-panel" role="dialog" aria-modal="true" aria-labelledby="avo-title" data-lenis-prevent hidden>
      <header class="avo-panel__head">
        <span class="avo-panel__avatar">
          <img class="avo-face" src="${img('normal')}" alt="" width="48" height="48">
          <span class="avo-fx" aria-hidden="true"></span>
        </span>
        <div class="avo-panel__who">
          <h2 class="avo-panel__title" id="avo-title" tabindex="-1">Avo</h2>
          <p class="avo-panel__sub">${t.sub}</p>
        </div>
        <button class="avo-panel__close" type="button" aria-label="${t.cerrar}">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>
        </button>
      </header>
      <div class="avo-log" role="log" aria-live="polite" aria-label="${t.conversacion}" tabindex="-1"></div>
      <p class="avo-typing" role="status"></p>
      <div class="avo-rapidas" role="group" aria-label="${t.rapidas}"></div>
      <form class="avo-form" novalidate>
        <label class="avo-sr-only" for="avo-input">${t.pregunta}</label>
        <input class="avo-input" id="avo-input" type="text" maxlength="${MAX_CHARS}" autocomplete="off"
               placeholder="${t.pregunta}…" aria-describedby="avo-count">
        <button class="avo-send" type="submit" aria-label="${t.enviar}">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <span class="avo-count" id="avo-count">0/${MAX_CHARS} ${t.caracteres}</span>
      </form>
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
  const rapidas = $('.avo-rapidas');
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
  // Desplaza la conversación hasta dejar esa altura arriba. Suave, salvo con movimiento reducido.
  const desplazarA = (top) => log.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
  const scrollToEnd = () => desplazarA(log.scrollHeight);
  // Altura de un mensaje dentro de la conversación, sin importar cuánto se haya desplazado
  const alturaEnLog = (el) => el.getBoundingClientRect().top - log.getBoundingClientRect().top + log.scrollTop;

  // Deja a la vista el INICIO de la respuesta de Avo, no el final del chat. Si la pregunta
  // y la respuesta caben juntas se ven las dos; si no, la respuesta queda arriba del todo.
  const mostrarRespuesta = (pregunta, respuesta) => {
    const margen = parseFloat(getComputedStyle(log).paddingTop) || 0;
    const fin = alturaEnLog(respuesta) + respuesta.offsetHeight;
    const cabenLasDos = fin - alturaEnLog(pregunta) <= log.clientHeight - 2 * margen;
    desplazarA(alturaEnLog(cabenLasDos ? pregunta : respuesta) - margen);
  };

  const addMessage = (quien, texto) => {
    const msg = document.createElement('div');
    msg.className = `avo-msg avo-msg--${quien}`;
    texto.split('\n').forEach((linea) => {
      const p = document.createElement('p');
      p.textContent = linea;           // siempre texto plano, nunca HTML
      msg.appendChild(p);
    });
    log.appendChild(msg);
    return msg;
  };

  // Enlace a una sección de la landing (ej. #planes). El navegador hace el salto
  // solo, porque es un <a href="#...">; aquí decidimos qué pasa con el chat.
  const addLink = (msg, enlace) => {
    const a = document.createElement('a');
    a.className = 'avo-link';
    a.href = enlace.href;
    a.innerHTML = '<span></span><span aria-hidden="true">↓</span>';
    a.firstChild.textContent = segunIdioma(enlace.texto, enlace.textoEn);
    // En celular el panel tapa toda la página: se cierra para que se vea la sección.
    // En computadora el panel es pequeño y el chat puede seguir abierto al lado.
    a.addEventListener('click', () => {
      if (!isDesktop()) close();
    });
    msg.appendChild(a);
  };

  // Fila de opciones rápidas, fija sobre el campo de texto (fuera de la conversación: no
  // empuja los mensajes). Se reemplaza entera cada vez, así las opciones nunca se acumulan.
  // Empieza siempre con el enlace de WhatsApp del tema: es la acción principal del chat y
  // al principio de la fila se ve entero, sin tener que desplazarla.
  const mostrarOpciones = (claves, tema) => {
    const textos = segunIdioma(OPCIONES, OPCIONES_EN);
    rapidas.replaceChildren();
    const a = document.createElement('a');
    a.className = 'avo-chip avo-chip--wa';
    a.href = waLink(tema);
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = ui().whatsapp;
    rapidas.appendChild(a);
    claves.forEach((clave) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'avo-chip';
      b.textContent = textos[clave];
      b.addEventListener('click', () => {
        log.focus({ preventScroll: true });   // la fila se reemplaza: el foco no debe perderse
        send(textos[clave]);
      });
      rapidas.appendChild(b);
    });
    rapidas.scrollLeft = 0;
  };

  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  let busy = false;

  async function send(texto) {
    const mensaje = texto.trim().slice(0, MAX_CHARS);
    if (!mensaje || busy) return;
    busy = true;
    sendBtn.disabled = true;
    hideBubble();

    const pregunta = addMessage('user', mensaje);
    scrollToEnd();
    cambiarEstado('pensando', true);
    typing.textContent = ui().escribiendo;
    root.classList.add('is-thinking');

    let respuesta;
    try {
      // Siempre al menos 1 segundo "pensando", aunque la respuesta llegue antes
      [respuesta] = await Promise.all([getReply(mensaje), wait(THINK_MS)]);
    } catch {
      respuesta = { texto: segunIdioma(RESPUESTAS, RESPUESTAS_EN)['no-entiende'], tema: 'general' };
    }

    typing.textContent = '';
    root.classList.remove('is-thinking');
    const msg = addMessage('avo', respuesta.texto);
    if (ENLACES[respuesta.tema]) addLink(msg, ENLACES[respuesta.tema]);
    mostrarRespuesta(pregunta, msg);
    cambiarEstado(respuesta.tema === 'saludo' ? 'saludando' : 'contento', true);
    // El enlace de WhatsApp de la fila sigue el tema de la conversación
    mostrarOpciones(SIGUIENTES[respuesta.tema] || SIGUIENTES['no-entiende'], respuesta.tema);

    busy = false;
    sendBtn.disabled = false;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const texto = input.value;
    input.value = '';
    count.textContent = `0/${MAX_CHARS} ${ui().caracteres}`;
    send(texto);
  });
  input.addEventListener('input', () => {
    count.textContent = `${input.value.length}/${MAX_CHARS} ${ui().caracteres}`;
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
      addMessage('avo', segunIdioma(BIENVENIDA, BIENVENIDA_EN));
      mostrarOpciones(OPCIONES_INICIO, 'general');
    }
    // En computadora se puede escribir de inmediato; en celular no abrimos el teclado solo.
    (isDesktop() ? input : title).focus({ preventScroll: true });
  };

  const close = () => {
    root.classList.remove('is-open');
    document.documentElement.classList.remove('avo-open');
    launcher.setAttribute('aria-expanded', 'false');
    // Espera a que termine la transición de cierre (con movimiento reducido es solo el fundido)
    closeTimer = setTimeout(() => { panel.hidden = true; }, reduceMotion ? 180 : 220);
    launcher.focus({ preventScroll: true });
  };

  launcher.addEventListener('click', () => (panel.hidden ? open() : close()));
  bubble.addEventListener('click', open);
  closeBtn.addEventListener('click', close);

  /* Cambio de idioma: el botón ES | EN (js/idioma.js) avisa con el evento "avora:idioma".
     Se traducen los textos fijos y, si la conversación ya empezó, vuelve a empezar con el
     saludo en el idioma nuevo (así no quedan los dos idiomas mezclados). */
  document.addEventListener('avora:idioma', () => {
    const t = ui();
    bubble.textContent = t.burbuja;
    launcher.setAttribute('aria-label', t.abrir);
    $('.avo-panel__sub').textContent = t.sub;
    closeBtn.setAttribute('aria-label', t.cerrar);
    log.setAttribute('aria-label', t.conversacion);
    $('.avo-form label').textContent = t.pregunta;
    input.placeholder = `${t.pregunta}…`;
    sendBtn.setAttribute('aria-label', t.enviar);
    count.textContent = `${input.value.length}/${MAX_CHARS} ${t.caracteres}`;
    rapidas.setAttribute('aria-label', t.rapidas);
    if (!started) return;
    log.replaceChildren();
    addMessage('avo', segunIdioma(BIENVENIDA, BIENVENIDA_EN));
    mostrarOpciones(OPCIONES_INICIO, 'general');
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
    const pageCtas = [...document.querySelectorAll('.btn--primary, .flecha')]
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
  }

  /* No tapar la cinta de rubros al cargar. Si la portada mide justo lo que la
     pantalla, la cinta queda abajo, donde vive Avo: mientras la página está arriba
     del todo, Avo sube lo justo para quedar encima de ella. Al bajar, vuelve. */
  const cinta = document.querySelector('.ribbon__band');
  const centinela = document.querySelector('.hero__sentinel');
  if (cinta && centinela && 'IntersectionObserver' in window) {
    let arriba = true;
    const elevar = () => {
      // offsetTop ignora el transform: es la posición base, sin subida ni transición a medias
      const avoArriba = launcher.offsetTop;
      const avoAbajo = avoArriba + launcher.offsetHeight;
      const franja = cinta.getBoundingClientRect(); // caja de la cinta girada: su lado derecho es el más alto
      const choca = arriba && franja.top < avoAbajo && franja.bottom > avoArriba;
      const alto = choca ? Math.min(Math.ceil(avoAbajo - franja.top + 12), 160) : 0;
      root.style.setProperty('--avo-elevar', `${alto}px`);
      root.classList.toggle('is-elevado', alto > 0);
    };
    new IntersectionObserver(([entrada]) => {
      arriba = entrada.isIntersecting;
      elevar();
    }).observe(centinela);
    window.addEventListener('resize', elevar);
    document.fonts?.ready.then(elevar);
  }
})();
