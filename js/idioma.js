/* AVORA Solutions · idioma de la página (español por defecto; inglés con el botón ES | EN).
   El español vive en index.html: al cargar se guarda el texto de cada marca para poder volver.
   El inglés vive aquí, en EN. Marcas en el HTML:
     data-i18n="clave"        texto plano
     data-i18n-html="clave"   frases con una parte resaltada (<span class="claro">)
     data-i18n-aria="clave"   aria-label
     data-wa="tema"           enlace de WhatsApp: cambia solo el mensaje prellenado
   Todo texto nuevo de la página necesita su marca y su traducción aquí.
   Sin librerías. js/avo.js escucha el evento "avora:idioma" para traducir el chat. */
(() => {
  const CLAVE = 'avora-idioma';
  const TITULO_EN = 'AVORA Solutions | We build systems that answer for you';

  // Los precios se repiten en index.html y en js/avo.js: si cambian, se cambian en todos
  const EN = {
    'saltar': 'Skip to content',
    'marca.aria': 'AVORA Solutions, go to the top',
    'nav.aria': 'Main',
    'nav.servicios': 'Services',
    'nav.proyectos': 'Projects',
    'nav.planes': 'Plans',
    'cta': 'Contact us',

    'indice.inicio': 'Home',
    'indice.servicios': 'Services',
    'indice.proyectos': 'Projects',
    'indice.planes': 'Plans',
    'indice.contacto': 'Contact',

    'hero.meta1': 'Digital agency · Panama',
    'hero.meta2': 'Social, web and automation.',
    'hero.palabra': 'GROW',
    'hero.t1': 'We build',
    'hero.t2': 'systems',
    'hero.t3': 'that answer',
    'hero.t4': 'for you.',
    'hero.lead': 'Websites, automations and social media so <span class="claro">more customers message you on WhatsApp.</span> For businesses in Panama.',
    'hero.planes': 'See plans',

    'cinta.aria': 'What we do',
    'cinta.1': 'Landing pages',
    'cinta.2': 'Websites',
    'cinta.3': 'Automations',
    'cinta.4': 'Social media',
    'cinta.5': 'Ad campaigns',

    'serv.etiqueta': 'What we do',
    'serv.titulo': 'Services.',
    'serv.incluye': 'Includes',
    'atrae.nombre': 'Attract',
    'atrae.texto': 'Social media and ads that put your business in front of the right people at the right time.',
    'atrae.p1': 'Social media management',
    'atrae.p2': 'Organic content',
    'atrae.p3': 'Ad campaigns',
    'atrae.aria': 'Ask about Attract on WhatsApp',
    'convierte.nombre': 'Convert',
    'convierte.texto': 'Custom landing pages built for one thing: getting visitors to message you.',
    'convierte.p1': 'Landing pages',
    'convierte.p2': 'Websites',
    'convierte.p3': 'Local SEO',
    'convierte.aria': 'Ask about Convert on WhatsApp',
    'automatiza.nombre': 'Automate',
    'automatiza.texto': 'Automations that reply for you, day and night, and hand you customers who are ready.',
    'automatiza.p1': 'Automatic replies',
    'automatiza.p2': 'Automated WhatsApp',
    'automatiza.p3': 'Integrations',
    'automatiza.aria': 'Ask about Automate on WhatsApp',

    'proy.etiqueta': 'Live',
    'proy.titulo': 'Projects.',
    'proy.vivo': 'View live site',
    'proy.quiero': 'I want something like this',
    'canal.tipo': 'Conversion landing page',
    'canal.resultado': 'A landing page connected to WhatsApp that let them compete on equal footing and bring in new customers.',
    // Citas reales traducidas del español: el aviso va junto al autor
    'canal.cita': '“Working with AVORA was an amazing experience. (…) Great customer service. Simple and fast.”',
    'canal.autor': 'Alberto Bañón, CEO of Canal Silver · Translated from Spanish',
    'distrito.tipo': 'Brand lookbook',
    'distrito.escolar': 'School project',
    'distrito.resultado': 'A digital lookbook with a story behind every design. It surprised everyone and even sold a sweater.',
    'distrito.cita': '“The site was really interesting and dynamic. Everyone loved it.”',
    'distrito.autor': 'Isaac V. and Camila C., students, along with parents · Translated from Spanish',

    'planes.etiqueta': 'Investment',
    'planes.titulo': 'Plans.',
    'plan1.pildora': 'Recommended',
    'plan1.nombre': 'Web + Automation',
    'plan1.desc': 'Your custom page plus an automation that replies for you. For businesses losing customers because they can\'t reply in time.',
    'plan1.terminos': 'setup + $90/mo',
    'plan1.l1': 'Custom landing page with copy that sells',
    'plan1.l2': 'Automatic replies on your page',
    'plan1.l3': 'WhatsApp Business set up',
    'plan1.l4': 'Local SEO and maintenance included',
    'plan1.nota': 'Just need the page? <span class="claro">From $350.</span>',
    'plan1.boton': 'I want this plan',
    'plan2.pildora': 'Assessment first',
    'plan2.nombre': 'Tailored',
    'plan2.desc': 'The complete system to grow: ads, website and automated WhatsApp working together, designed around your business.',
    'plan2.monto': 'Based on assessment',
    'plan2.l1': 'Everything in the Web + Automation plan',
    'plan2.l2': 'Meta ad campaign management',
    'plan2.l3': 'Integrations with your tools',
    'plan2.l4': 'Monthly results report',
    'plan2.nota': 'We talk, assess your business and send you a clear proposal.',
    'plan2.boton': 'Book your assessment',
    'planes.fundadores': '<span class="claro">Founding Clients:</span> 30% off setup for our first 5 clients. Prices in USD, ITBMS not included.',

    'contacto.t1': 'Let\'s talk',
    'contacto.t2': 'business.',
    'paso1.nombre': 'We talk',
    'paso1.texto': 'Tell us what you sell and what\'s holding you back.',
    'paso2.nombre': 'Clear proposal',
    'paso2.texto': 'Scope, timeline and price, in writing.',
    'paso3.nombre': 'We build with you',
    'paso3.texto': 'In stages, with your feedback.',
    'contacto.lead': 'Message us and we\'ll show you how to get more customers with less manual work.',

    'footer.lema': 'Attract. Convert. Automate.',
    'footer.pais': 'Panama',
  };

  // Mensajes prellenados de WhatsApp en inglés, por tema (data-wa). Los de español están en el HTML.
  const WHATSAPP_EN = {
    general: 'Hi, I saw your website and I\'d like information about your services.',
    atrae: 'Hi AVORA, I\'d like more customers to find my business on social media. Could you send me more information?',
    convierte: 'Hi AVORA, I\'m interested in a landing page for my business. Could you send me more information?',
    automatiza: 'Hi AVORA, I\'d like to automate my customer service. Could you send me more information?',
    canal: 'Hi AVORA, I saw the Canal Silver project and I\'d like something like that for my business.',
    distrito: 'Hi AVORA, I saw the Distrito 507 project and I\'d like a site like that for my brand.',
    plan1: 'Hi AVORA, I\'m interested in the Web + Automation plan. Could you send me more information?',
    plan2: 'Hi AVORA, I\'d like to book an assessment for the Tailored plan.',
  };

  const ARIA_BOTON = { es: 'Cambiar idioma a inglés', en: 'Switch language to Spanish' };

  // El navegador puede bloquear localStorage (modo privado, ajustes): la página sigue igual,
  // solo que no recuerda el idioma
  const storage = {
    get: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* sin almacenamiento: no pasa nada */ } },
  };

  // Se guarda el español de cada marca tal como está en el HTML, para poder volver a él
  const marcas = (atributo, leer) => [...document.querySelectorAll(`[${atributo}]`)]
    .map((el) => ({ el, clave: el.getAttribute(atributo), es: leer(el) }));
  const textos = marcas('data-i18n', (el) => el.textContent);
  const frases = marcas('data-i18n-html', (el) => el.innerHTML);
  const arias = marcas('data-i18n-aria', (el) => el.getAttribute('aria-label'));
  const enlaces = marcas('data-wa', (el) => el.getAttribute('href'));
  const tituloEs = document.title;

  const raiz = document.documentElement;
  const boton = document.querySelector('.idioma');

  // Si a una clave le falta la traducción, se queda el español en vez de un hueco
  const aplicarIdioma = (idioma) => {
    const en = idioma === 'en';
    raiz.lang = en ? 'en' : 'es-PA';
    document.title = en ? TITULO_EN : tituloEs;
    textos.forEach(({ el, clave, es }) => { el.textContent = (en && EN[clave]) || es; });
    frases.forEach(({ el, clave, es }) => { el.innerHTML = (en && EN[clave]) || es; });
    arias.forEach(({ el, clave, es }) => { el.setAttribute('aria-label', (en && EN[clave]) || es); });
    // Del enlace se conserva todo hasta "?text=" (ahí está el número) y solo cambia el mensaje
    enlaces.forEach(({ el, clave, es }) => {
      const mensaje = en && WHATSAPP_EN[clave];
      el.href = mensaje ? `${es.split('?text=')[0]}?text=${encodeURIComponent(mensaje)}` : es;
    });
    boton?.setAttribute('aria-label', ARIA_BOTON[en ? 'en' : 'es']);
    document.dispatchEvent(new CustomEvent('avora:idioma', { detail: en ? 'en' : 'es' }));
  };

  // Al cargar con inglés guardado no hay cortina: el texto cambia antes de que se dibuje la página
  if (storage.get(CLAVE) === 'en') aplicarIdioma('en');

  /* ---------- Cortina: cambiar de idioma se siente como pasar de página ----------
     Un panel cruza la pantalla (el movimiento vive en css/styles.css, sección 8). Con la
     pantalla cubierta cambian los textos; al salir el panel, la portada repite su entrada.
     Los pasos van con temporizadores y no con eventos de la animación: aunque el navegador
     la pause (pestaña en segundo plano), el botón nunca queda bloqueado ni el panel puesto. */
  const DURACION_CORTINA = 800;    // total, en ms. El CSS la reparte: entra, cubre y sale
  const DURACION_FUNDIDO = 150;    // con movimiento reducido: sin cortina, solo un fundido
  const SALIDA = 0.575;            // momento del recorrido en que el panel empieza a irse

  const cortina = document.createElement('div');
  cortina.className = 'cortina';
  cortina.setAttribute('aria-hidden', 'true');
  cortina.innerHTML = '<span class="cortina__marca"><svg viewBox="14 24 180 154"><use href="#i-logo"/></svg><span>AVORA</span></span>';
  document.body.appendChild(cortina);

  // El inglés ocupa otro alto que el español. Para que el visitante siga viendo lo mismo, se
  // anota a qué altura está el bloque más cercano al centro de la pantalla y, después del
  // cambio, se corrige el scroll para dejarlo en el mismo sitio.
  const conservarLugar = (cambiar) => {
    const centro = window.innerHeight / 2;
    const ancla = [...document.querySelectorAll('[data-reveal], [data-paso]')]
      .filter((el) => !el.closest('.hero__palabra, .avo') && el.getBoundingClientRect().top <= centro)
      .pop();
    const antes = ancla?.getBoundingClientRect().top;
    cambiar();
    if (!ancla) return;
    const y = window.scrollY + ancla.getBoundingClientRect().top - antes;
    if (Math.abs(y - window.scrollY) < 1) return;
    if (window.lenis) window.lenis.scrollTo(y, { immediate: true });
    else window.scrollTo({ top: y, behavior: 'instant' });
  };

  // Devuelve la portada a su estado oculto de golpe (está bajo la cortina) y entrega la
  // función que lanza su entrada. Solo toca lo de dentro de la portada, y solo si se ve:
  // lo que ya apareció con el scroll en el resto de la página no se esconde nunca.
  const portada = document.querySelector('.hero');
  const prepararPortada = () => {
    if (!portada) return null;
    const caja = portada.getBoundingClientRect();
    if (caja.bottom <= 0 || caja.top >= window.innerHeight) return null;
    const piezas = [...portada.querySelectorAll('[data-reveal].is-visible')];
    portada.classList.add('sin-transicion');
    piezas.forEach((el) => el.classList.remove('is-visible'));
    void portada.offsetWidth;      // obliga al navegador a aplicar ya el estado oculto, sin animarlo
    portada.classList.remove('sin-transicion');
    return () => piezas.forEach((el) => el.classList.add('is-visible'));
  };

  let cambiando = false;
  const cambiarConCortina = () => {
    if (cambiando) return;         // un segundo toque rápido no hace nada
    cambiando = true;
    // aria-disabled y no disabled: el botón conserva el foco de quien navega con teclado
    boton.setAttribute('aria-disabled', 'true');

    const nuevo = raiz.lang === 'en' ? 'es' : 'en';
    const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duracion = reducido ? DURACION_FUNDIDO : DURACION_CORTINA;
    let lanzarPortada = null;

    cortina.style.setProperty('--t-cortina', `${duracion}ms`);
    cortina.classList.add('cortina--activa');

    // A la mitad la pantalla está cubierta: ahí cambia todo
    setTimeout(() => {
      conservarLugar(() => aplicarIdioma(nuevo));
      storage.set(CLAVE, nuevo);
      if (!reducido) lanzarPortada = prepararPortada();
    }, duracion / 2);
    // El panel empieza a irse: arranca la entrada de la portada
    setTimeout(() => lanzarPortada?.(), duracion * SALIDA);
    setTimeout(() => {
      cortina.classList.remove('cortina--activa');
      boton.removeAttribute('aria-disabled');
      cambiando = false;
    }, duracion);
  };

  boton?.addEventListener('click', cambiarConCortina);
})();
