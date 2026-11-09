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
  const TITULO_EN = 'AVORA Solutions | No customer left without an answer';

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
    'indice.viaje': 'How it works',
    'indice.servicios': 'Services',
    'indice.proyectos': 'Projects',
    'indice.planes': 'Plans',
    'indice.contacto': 'Contact',

    'hero.meta1': 'Automotive businesses · Panama',
    'hero.meta2': 'Garages, detailing and body shops.',
    'hero.palabra': 'SYSTEM',
    'hero.t1': 'No customer',
    'hero.t2': 'left',
    'hero.t3': 'without',
    'hero.t4': 'an answer.',
    'hero.lead': 'Websites, automated WhatsApp and social media for <span class="claro">garages, detailers, body shops and oil change shops</span> in Panama.',
    'hero.planes': 'See plans',

    'cinta.aria': 'Who we work with',
    'cinta.1': 'Auto repair shops',
    'cinta.2': 'Detailing',
    'cinta.3': 'Body and paint',
    'cinta.4': 'Car wash',
    'cinta.5': 'Oil change',
    'cinta.6': 'Window tint',
    'cinta.7': 'Tire shops',
    'cinta.8': 'Auto A/C',

    'viaje.etiqueta': 'How it works',
    'viaje.t1': 'Your customer\'s',
    'viaje.t2': 'journey.',
    'viaje.intro': 'This is how a customer finds their way to your business. <span class="claro">We build the whole road</span> so they don\'t get lost on the way.',
    'parada1.nombre': 'Finds you',
    'parada1.texto': 'Sees your work on Instagram or Google.',
    'parada2.nombre': 'Checks your services',
    'parada2.texto': 'Visits your page: services, work and reviews.',
    'parada3.nombre': 'Messages you',
    'parada3.texto': 'One tap and they\'re on your WhatsApp.',
    'parada3.salida': 'No answer in time, they go elsewhere.',
    'parada4.nombre': 'Reply and booking',
    'parada4.texto': 'Instant prices and a booked appointment, even while you work.',
    'parada5.nombre': 'Comes back',
    'parada5.texto': 'Gets a reminder when the next service is due.',

    'serv.etiqueta': 'What we do',
    'serv.titulo': 'Services.',
    'serv.incluye': 'Includes',
    'atrae.nombre': 'Attract',
    'atrae.texto': 'Social media and ads so car owners in your area get to know your business.',
    'atrae.p1': 'Social media management',
    'atrae.p2': 'Organic content',
    'atrae.p3': 'Ad campaigns',
    'atrae.aria': 'Ask about Attract on WhatsApp',
    'convierte.nombre': 'Convert',
    'convierte.texto': 'A page with your work, services and reviews, built for one thing: getting visitors to message you.',
    'convierte.p1': 'Landing pages',
    'convierte.p2': 'Websites',
    'convierte.p3': 'Local SEO',
    'convierte.aria': 'Ask about Convert on WhatsApp',
    'automatiza.nombre': 'Automate',
    'automatiza.texto': 'Your WhatsApp quotes prices, books the appointment and reminds customers when it\'s time to come back.',
    'automatiza.p1': 'Automatic replies',
    'automatiza.p2': 'Appointment booking',
    'automatiza.p3': 'Reminders',
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

    'planes.etiqueta': 'Pricing',
    'planes.titulo': 'Plans.',
    'plan1.pildora': 'To get started',
    'plan1.nombre': 'Web + WhatsApp',
    'plan1.desc': 'Your page and your WhatsApp working together. For businesses losing customers because they can\'t reply in time.',
    'plan1.terminos': 'setup + $120/mo',
    'plan1.l1': 'A page with your work, services and reviews',
    'plan1.l2': 'WhatsApp that answers prices and hours',
    'plan1.l3': 'A button to book the appointment',
    'plan1.l4': 'Google Maps (local SEO) and maintenance',
    'plan1.nota': 'Includes hosting, maintenance and <span class="claro">2 changes a month</span> to your page.',
    'plan1.boton': 'I want this plan',
    'plan2.pildora': 'To grow',
    'plan2.nombre': 'Complete system',
    'plan2.desc': 'Everything working to grow: ads, website and automated WhatsApp, with customers who come back on their own.',
    'plan2.terminos': 'setup + $397/mo',
    'plan2.l1': 'Everything in the Web + WhatsApp plan',
    'plan2.l2': 'Booking and maintenance reminders',
    'plan2.l3': 'Meta campaigns and 8 content pieces a month',
    'plan2.l4': 'Monthly results report',
    'plan2.nota': 'You pay the Meta ad spend directly to Meta (we recommend from $150/mo).',
    'plan2.boton': 'I want this plan',
    'piloto.pildora': 'Still thinking it over?',
    'piloto.nombre': '30-day pilot for $150',
    'piloto.desc': 'Your WhatsApp replies instantly, at any hour, and your customers book their own appointments. <span class="claro">If it doesn\'t work that way within 30 days, we refund the $150.</span> If you continue, it comes off the setup fee.',
    'piloto.boton': 'I want the pilot',
    'planes.fundadores': '<span class="claro">Founding Clients:</span> 30% off setup for our first 5 clients. Prices in USD; the monthly fee has a 3-month minimum.',

    'contacto.t1': 'Let\'s talk',
    'contacto.t2': 'business.',
    'paso1.nombre': 'We talk',
    'paso1.texto': 'Tell us what services you offer and how you handle customers today.',
    'paso2.nombre': 'Clear proposal',
    'paso2.texto': 'Scope, timeline and price, in writing.',
    'paso3.nombre': 'We build with you',
    'paso3.texto': 'In stages, with your feedback.',
    'contacto.lead': 'Message us and we\'ll show you what your business looks like with the whole road built.',

    'footer.lema': 'Attract. Convert. Automate.',
    'footer.pais': 'Panama',
    'footer.privacidad': 'Privacy',
    'footer.terminos': 'Terms',
  };

  // Mensajes prellenados de WhatsApp en inglés, por tema (data-wa). Los de español están en el HTML.
  const WHATSAPP_EN = {
    general: 'Hi, I saw your website and I\'d like information about your services.',
    atrae: 'Hi AVORA, I\'d like more customers to find my business on social media. Could you send me more information?',
    convierte: 'Hi AVORA, I\'m interested in a landing page for my business. Could you send me more information?',
    automatiza: 'Hi AVORA, I\'d like to automate my customer service. Could you send me more information?',
    canal: 'Hi AVORA, I saw the Canal Silver project and I\'d like something like that for my business.',
    distrito: 'Hi AVORA, I saw the Distrito 507 project and I\'d like a site like that for my brand.',
    plan1: 'Hi AVORA, I\'m interested in the Web + WhatsApp plan. Could you send me more information?',
    plan2: 'Hi AVORA, I\'m interested in the Complete system. Could you send me more information?',
    piloto: 'Hi AVORA, I\'m interested in the 30-day pilot. Could you send me more information?',
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
