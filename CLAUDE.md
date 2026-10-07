# CLAUDE.md

Este archivo le da contexto a Claude Code (claude.ai/code) para trabajar en este repositorio.

## Qué es este proyecto

Landing page (página de una sola sección de venta) de mi agencia digital **AVORA Solutions**, en Panamá. Versión **v3**, la definitiva.

- **Objetivo:** que el visitante agende una **llamada** (de 15 minutos, sin compromiso) por WhatsApp al **+507 6328-8742** (`50763288742`), o que nos escriba por WhatsApp si todavía no quiere llamar. Todo en la página debe empujar hacia ese paso.
- **Lema:** **"Avo atiende. Tú vendes."** El lema anterior ("Atrae. Convierte. Automatiza.") ya no se usa en ninguna parte.
- **Pilares de la marca:** **Software · IA · Crecimiento · Avo.** Los tres primeros son los servicios; Avo es la mascota y el asistente guiado de la página.
- **Llamado a la acción:** se ofrece **una llamada** y, como segunda opción, **escribir por WhatsApp**. No usar la palabra "demo". El botón principal "Agenda una llamada" (igual en header, portada y cierre) usa el mensaje `llamada`; el enlace "o escríbenos por WhatsApp" y el footer, el mensaje `escribir`.
- **La landing sí muestra precios**, en el panel **Planes** (`#planes`), en USD. Hay dos planes: **Web + Automatización** ($650 de instalación + $90/mes; solo la página, desde $350) y **A tu medida** (según evaluación). Los precios viven en dos lugares que deben coincidir: el panel Planes de `index.html` y el objeto `PLANES` de Avo en `js/avo.js`. Si un precio cambia, se actualizan los dos juntos.
- **No hay PDF de planes.** El PDF anterior estaba desactualizado y se borró; no se enlaza ningún PDF.

## Identidad (v3, monocroma y editorial, con dos temas)

Dos temas que solo cambian variables. El oscuro vive en `:root` de `css/styles.css`; el claro, en `.tema-claro`:

| Uso | Variable | Tema oscuro | Tema claro |
|---|---|---|---|
| Fondo de la página / franja | `--fondo` | `#0B0B0C` | `#ECEBE7` |
| Paneles | `--panel` | `#0F0F11` | `#ECEBE7` |
| Tarjetas dentro de un panel | `--superficie` | `#141416` | `#F7F6F3` |
| Texto | `--texto` | `#F2F2F0` | `#0B0B0C` |
| Texto secundario | `--texto-2` | `#A3A3A8` (7.6:1) | `#55555B` (6.2:1) |
| Marcas pequeñas (índices, firma, etiquetas en mayúsculas) | `--marca-chica` | `#8E8E93` (5.9:1) | `#55555B` |
| Líneas y bordes de tarjetas | `--linea` | `rgba(242,242,240,.12)` | `rgba(11,11,12,.12)` |
| Borde de los paneles | `--borde-panel` | `rgba(242,242,240,.20)` | `rgba(11,11,12,.18)` |
| Lo que va encima de `--texto` (botones, píldoras) | `--sobre-texto` | `#0B0B0C` | `#F2F2F0` |
| Borde de la flecha con hover | `--linea-activa` | blanco 45 % | negro 45 % |
| Título de servicio con hover | `--texto-hover` | `#FFFFFF` | `#2A2A2F` |

- **El azul `#4D5BFF` (`--azul`)** es igual en los dos temas y solo aparece en la estela del logo, la barrita diagonal de cada panel y la luz de Avo (que ya viene dentro de sus SVG). Nada más: ni texto, ni botones, ni bordes.
- **Botones y píldoras se invierten solos:** usan `--texto` de fondo y `--sobre-texto` encima, nunca colores fijos ni `--fondo`.
- **Tarjeta negra de Planes (`.plan--oscuro`):** dentro de la franja clara, vuelve a tokens oscuros: fondo `#0B0B0C`, secundario `#A3A3A8` (7.8:1) y líneas `rgba(242,242,240,.14)`.
- **Tipografía:** una sola, **Hanken Grotesk** (Google Fonts, `wght@300..800`, `display=swap`). Títulos grandes en peso 600 con interletrado negativo: H1 −0.055em (−0.05em en celular), títulos de sección −0.045em, cierre −0.05em.
- **Prohibido:** diagonales decorativas, cortes inclinados (`clip-path` en ángulo), números entre paréntesis, fondos animados, colores fuera de esta tabla.
- **Contraste:** mínimo AA en todo el texto y en los dos temas. El más justo es `--marca-chica` oscuro sobre `--panel` (5.9:1).

## Reglas de contenido

- **No inventar cifras ni testimonios.** Nada de "+200 clientes", "300 % más ventas", "más elegido", reseñas o nombres de clientes que yo no haya dado. Si hace falta un dato, deja un marcador visible (por ejemplo `[CIFRA PENDIENTE]`) y avísame.
- **Testimonios:** si se acorta una cita real, el recorte se marca con `(…)`. No se cambian palabras.
- **Precios y qué incluye cada plan:** solo los que yo haya dado (los del panel Planes). No agregar beneficios, descuentos ni condiciones nuevas por tu cuenta.
- Todo el texto visible, los comentarios del código y los nombres cercanos a las clases van en español (`lang="es-PA"`).

## Stack

Sitio estático simple: `index.html` + `css/styles.css` + `js/main.js` + `js/mensajes.js` (mensajes de WhatsApp; se carga antes que `main.js` y `avo.js`), más el asistente Avo en archivos aparte (`css/avo.css` + `js/avo.js`). Sin framework, sin bundler (herramienta que empaqueta código), sin `package.json`, sin tests ni linter (revisor automático de estilo). La única librería externa es **Lenis** (scroll con inercia), que `main.js` descarga desde jsDelivr solo en computadora con mouse (ver Movimiento).

## Cómo verlo

No hay paso de compilación. Sirve la carpeta con un servidor estático (por ejemplo `python -m http.server`) para que las rutas, las fuentes y Lenis se comporten como en producción. Revisa siempre el diseño en ancho de celular (~390px), a 1440px y con `prefers-reduced-motion: reduce` (ajuste del sistema para reducir animaciones): los tres son prioridad.

**Referencias de diseño (en `docs/`, excluidas en `robots.txt`):** `referencia-portada-computadora.html` (1440 × 940) y `referencia-portada-celular.html` (390 × 844) definen la portada con medidas exactas; `referencia-rediseno-avora.html` solo define el estilo general del resto (paneles, píldoras, tarjetas de planes, franjas claras). Si una referencia contradice este archivo (nombres de servicios, lema, imágenes en proyectos), manda este archivo.

## Arquitectura

**Estructura (en este orden).** Header (no fijo) → panel 01 Portada (`#inicio`) → Cinta (sin panel) → panel 02 Servicios → panel 03 Proyectos → panel 04 Planes → panel 05 Contacto → Footer.

**Fondos alternados.** Portada oscura, **Servicios clara**, Proyectos oscura, **Planes clara**, cierre oscuro. Servicios y Planes van dentro de `<div class="franja tema-claro">`: la franja pinta el fondo claro de lado a lado de la pantalla (no solo el panel), con `--panel-gap` de relleno arriba; el panel de adentro conserva su margen inferior. El cambio de fondo ocurre solo con el scroll: la franja no se anima. `styles.css` está dividido en secciones numeradas que siguen ese orden. Mobile-first, un solo breakpoint en `min-width: 900px`.

**Header.** A lo ancho de la pantalla (no en `.container`): `--header-h` 64px en celular y 76px en computadora, con 20/44px a los lados. En computadora: logo, Servicios, Proyectos, Planes y el botón "Agenda una llamada" (`.btn--sm`, con su círculo). En celular: solo el logo y el botón "Llamada", sin círculo (`.solo-celular` / `.solo-computadora`).

**Paneles (`.panel`).** Cada sección vive en un panel: esquinas `--radio-panel` (24px en celular, 28px en computadora), borde de 1px `--borde-panel` (con JS, el borde se "dibuja": ver Movimiento), fondo `--panel`, separado `--panel-gap` del borde de la pantalla y de los otros paneles (8px en celular, 16px en computadora). El contenido va en `.container` (máximo 1280px, padding `clamp(20px, 5vw, 80px)`).

**Marca en los bordes de cada panel.** Arriba a la izquierda, `.panel__marca` (la barrita azul del logo, girada −26.6°) y `.panel__firma`, con la firma de la marca. Arriba a la derecha, `.panel__indice` ("0X / 05 · Nombre"; en la portada en celular solo "01 / 05"). Los tres son `aria-hidden`, en mayúsculas pequeñas y espaciadas (10px / .2em en celular, 12px / .22em en computadora), color `--marca-chica`. **La firma vive en una sola variable:** `--marca-texto: "AVORA/2026"` en `:root`, y se pinta con `content: var(--marca-texto)`. Para cambiarla en toda la página se toca solo esa línea. En la portada, la firma también va en vertical sobre los bordes izquierdo y derecho (`.hero__firma-vertical`, solo en computadora).

**Portada (`.hero`).** Sigue las referencias de `docs/`:
- **Avo gigante** (`img/avo/avo-normal.svg`, `image-rendering: pixelated`) al fondo, cortado por el borde inferior del panel. Su tamaño es `--avo-tam`: `min(420px, 108vw)` en celular (50px fuera por la derecha, 64px bajo el borde) y `min(800px, 56vw)` en computadora (a 32px de la derecha, 140px bajo el borde). Todo lo que depende de Avo (posición y burbuja) se calcula con `--avo-tam`.
- **Velo** (`.hero__velo`): degradado fijo del color del panel para que el texto se lea; vertical en celular, horizontal en computadora.
- **Texto:** etiqueta "Agencia digital · Panamá" (solo computadora), titular "Avo atiende." / "Tú vendes." (`clamp(46px, 7.2vw, 104px)`), subtítulo, botón "Agenda una llamada", enlace "o escríbenos por WhatsApp" y la nota "Llamada de 15 minutos, sin compromiso.".
- **Burbuja** (`.hero__burbuja`): "Hola, soy Avo. Pregúntame." sobre la cabeza de Avo. Es un `<button data-abrir-avo>` que abre el asistente. Se ancla por la derecha con un mínimo de 40px, para que no se salga del panel en pantallas medianas. Se esconde mientras el chat está abierto (`html.avo-open`).
- **Franja de pilares** (`.hero__pilares`): abajo del panel, Software · IA · Crecimiento · Avo (en computadora con la etiqueta "Lo que hacemos"). Va por debajo del borde dibujado (`z-index` 1 contra 3).
- Altura mínima: la pantalla menos el header (con mínimo de 680px en celular y 760px en computadora).

**Servicios (los 3 primeros pilares).** Filas con nombre, texto, "Incluye" con píldoras y una flecha en círculo a WhatsApp:
- **Software:** páginas web y sistemas a la medida (Landing pages, Sitios web, SEO local).
- **IA:** asistentes y automatizaciones (Chatbots, Asistentes con IA, Integraciones).
- **Crecimiento:** anuncios y redes (Campañas de ads, Manejo de redes, Contenido).

**Proyectos (sin imágenes).** Canal Silver y Distrito 507 en dos columnas amplias (una en celular), cada uno con: línea divisoria arriba, etiquetas en píldora, el **nombre grande** como `h3` (`clamp(44px, 5vw, 72px)`), resultado, testimonio con su autor, "Ver sitio en vivo" y "Quiero algo así" (WhatsApp).

**Planes, cierre y footer.** Planes: 2 tarjetas ("Web + Automatización" clara con "¿Solo necesitas la página? Desde $350." y "Quiero este plan"; "A tu medida" negra con "Agenda tu evaluación") y la línea de Clientes Fundadores. Cierre: "Hablemos de tu negocio.", los 3 pasos (Conversamos, Propuesta clara, Construimos contigo) y el `.cta`. Footer: logo, "Avo atiende. Tú vendes.", "Software · IA · Crecimiento", WhatsApp y Panamá; al final, a lo ancho, la línea legal `.site-footer__legal` (13px, `--texto-2`): "© 2026 AVORA Solutions. Todos los derechos reservados." con los enlaces "Privacidad" y "Términos".

**Componentes.**
- **Encabezado de sección (`.section-head`):** etiqueta con punto en una columna de 200px (`.section-head__etiqueta`) y título gigante (`.section-title`, `clamp(56px, 8vw, 120px)`).
- **Botón principal (`.btn.btn--primary`):** píldora `--texto` con texto oscuro y la flecha dentro de un círculo oscuro (`.btn__circulo`). `.btn--lg` para la portada y el cierre. Al menos 44px de alto. En el panel claro se invierte. Se mantiene la clase `.btn--primary`, porque Avo la vigila.
- **Llamado a la acción (`.cta`):** botón principal, el enlace de texto `.cta__whatsapp` ("o escríbenos por WhatsApp": sin forma de botón, el subrayado aparece solo con hover o foco, 44px de área de toque) y la nota `.cta__nota`. En la portada, el botón y el enlace van en fila en computadora y en columna en celular (`.hero__acciones`). El header lleva solo el botón.
- **Flecha en círculo (`.flecha`):** 48px, borde `--linea`; las usan las filas de Servicios.
- **Píldoras (`.pildora`):** rellenas (`--texto`) o de contorno (`.pildora--contorno`).
- **Enlace de texto (`.enlace`):** subrayado con 6px de separación; `.enlace--flecha` agrega la flecha. Tiene 44px de área de toque.
- **Íconos:** `<symbol>` al final de `index.html` (`#i-logo` con la estela azul, `#i-flecha`), usados con `<use href="#i-flecha"/>`.

## Mensajes de WhatsApp

- **Todos los mensajes viven en un solo lugar:** `js/mensajes.js` (objeto `MENSAJES`). Nunca se escribe un mensaje a mano en el HTML ni en otro archivo. Cada enlace del HTML lleva `href="https://wa.me/50763288742"` (sin texto, por si el JS no carga) y `data-wa="clave"`; `mensajes.js` le agrega el mensaje con `encodeURIComponent` (así llegan bien las tildes, los emojis y los saltos de línea). Avo lee del mismo archivo (`window.AVORA_WHATSAPP`). Para agregar un CTA: se crea una clave nueva en `MENSAJES` y se usa en `data-wa`.
- **Formato (lo arma `mensaje()`):** "¡Hola AVORA! 👋", una línea con lo que quiere la persona, una línea en blanco y 3 o 4 campos para llenar, cada uno con su emoji y terminado en dos puntos. Máximo 6 líneas con texto. Solo estos emojis: 👋 📌 🏢 💬 🕐 📲.
- **Claves:** `llamada`, `escribir`, `servicio-software`, `servicio-ia`, `servicio-crecimiento`, `proyecto-canal-silver`, `proyecto-distrito-507`, `plan-web`, `plan-medida`. Cada tipo de botón tiene su mensaje distinto, así se sabe de dónde vino. Los 3 botones de llamada comparten `llamada`, y el enlace de escribir y el footer comparten `escribir`.
- **Resultado de Avo:** `resultadoAvo({ plan, negocio, mejorar, pagina })` arma el mensaje con las respuestas ya escritas ("Avo me recomendó: … Quiero agendar una llamada." + 📌 Mi nombre, 🏢 Mi negocio, 💬 Quiero mejorar, 📲 ¿Ya tengo página?). Así se sabe que vino del asistente.

## Avo, el asistente guiado

Mascota en pixel art (un panda con sudadera negra y luz azul). Todo vive en `css/avo.css` y `js/avo.js`; el HTML lo crea `avo.js` al cargar. Usa los tokens de `styles.css`.

- **Es un asistente GUIADO, sin IA ni API.** Se presenta como "el asistente guiado de AVORA". Ningún texto de Avo puede decir que usa IA ni que conversa libremente. No hay campo de texto libre: solo botones.
- **Imágenes:** `img/avo/avo-{normal,parpadeo,saludo,pensando,feliz,hablando}.svg` (48×48, `image-rendering: pixelated`, `shape-rendering: crispEdges`). Están optimizadas (un `<path>` por color, ~8 KB cada una, idénticas píxel a píxel a los originales, que están en `_referencias/avo-originales/`). Solo se usan estas 6 caras: no se dibujan nuevas.
- **Flujo (3 preguntas con botones, con "Volver"):** 1) ¿Qué negocio tienes? (Restaurante, Clínica o salud, Gimnasio, Inmobiliaria, Tienda, Otro) · 2) ¿Qué quieres mejorar? (Que más gente me conozca, Que me escriban más, Responder más rápido) · 3) ¿Ya tienes página web? (Sí, No). Antes de cada respuesta de Avo, 1 s "pensando".
- **Recomendación (`recomendar()`, honesta y solo con lo que dice Planes):** "Que más gente me conozca" → **A tu medida** (es el único plan con campañas en Meta); "Responder más rápido" → **Web + Automatización** (página + asistente + WhatsApp Business); "Que me escriban más" → **Solo la página (desde $350)**. Si ya tiene página, el texto lo menciona. El resultado trae el botón "Agenda una llamada" (mensaje `resultadoAvo`), el enlace "Ver los planes" (`#planes`) y "Empezar de nuevo".
- **No se guarda nada en servidores.** Las respuestas solo viven en la pestaña y viajan en el mensaje de WhatsApp que la persona decide enviar.
- **Botón flotante:** fondo `--fondo`, borde fino `--linea`, Avo dentro de una ventana redonda (`.avo-ventana`). **No aparece en la portada** (allí ya está Avo gigante): entra con un fundido y sube 12px cuando el final de la portada pasa por encima del 40 % de la pantalla, y saluda (`.is-oculto`). Se aparta cuando un botón de la página pasa por su esquina (`.is-ducked`) y toma los tokens claros sobre las franjas claras (`.avo--sobre-claro`).
- **Reacciones al scroll** (cuando el centro de la pantalla entra en cada sección): Servicios → pensando, Proyectos → feliz, Planes → la burbuja ofrece "¿Te ayudo a elegir plan?" (abre el asistente), Contacto → saluda. La burbuja aparece, se va y cambia de texto con un fundido de 200 ms (`setBurbuja`).
- **Estados (personaje de videojuego):** la tabla `ESTADOS` en `avo.js` define cara, animación, duración y prioridad (espera, durmiendo, atento, saludando, contento, pensativo, aplastar, celebrando, hablando, bailando, pensando). Todo cambio pasa por `cambiarEstado(nombre, forzar, dura)`; `puedeCambiar` deja interrumpir solo a estados de igual o menor prioridad. `hablando` alterna las caras "hablando" y "normal" cada 180 ms (corto en las preguntas, 2.4 s en el resultado). El JS solo escribe `data-estado`, `data-anim` y `data-fx` en `.avo`; el movimiento vive en `avo.css`, siempre con `steps(1, end)` y en múltiplos de `--avo-px` (1 pixel del dibujo = 1px).
- **Otros detalles:** parpadea cada 3–6 s, se inclina a mirar, se duerme tras 30 s sin actividad (listeners `passive`), celebra cuando se toca cualquier enlace de WhatsApp y baila con 5 clics seguidos.
- **Accesibilidad:** `role="dialog"`, el foco no se escapa del chat abierto, Escape cierra y devuelve el foco a quien lo abrió (el botón flotante o la burbuja de la portada), `role="log"` anuncia los mensajes, el foco pasa a la primera opción de cada pregunta y todo el texto se inserta con `textContent`.
- **Probarlo:** los `IntersectionObserver` no avisan si el navegador no dibuja (panel oculto, o Edge headless con `--virtual-time-budget`). Hay que probar con una ventana visible o con Playwright normal.

## Movimiento (calmado, editorial)

Tokens en `:root`: una sola curva `--ease` = `cubic-bezier(.22, 1, .36, 1)`, `--t-hover` 200 ms, `--t-press` 150 ms, `--t-aparecer` 800 ms, `--t-linea` 900 ms, `--escalon` 120 ms. Solo se animan `transform` y `opacity`; nunca `transition: all`.

**Apariciones (`data-reveal`).** El script del `<head>` agrega `.js` al `<html>`; los estados ocultos iniciales están todos bajo `.js [data-reveal…]`, así la página se ve completa sin JavaScript. `main.js` agrega `.is-visible` con un solo `IntersectionObserver` (`threshold: .15`, una sola vez por elemento). Variantes:
- `data-reveal` (sin valor): fundido + 12px → 0.
- `data-reveal="avo"`: fundido + 16px → 0 en 900 ms (Avo de la portada).
- `data-reveal="panel"`: fundido + escala `.98 → 1` en 900 ms, al mismo tiempo que se dibuja su borde (todos los paneles, también la portada).
- `data-reveal="fundido"`: solo opacidad (header, cinta y footer).
- `data-reveal="grupo"`: se observa el contenedor y sus hijos `[data-paso]` aparecen en cascada (`--i` × 120 ms + `--d`). `data-paso="linea"` es una `.divisoria` que se dibuja de izquierda a derecha (`scaleX`); `data-paso="enfasis"` llega con `scale(.94) → 1` (el precio de cada plan). `data-sube` hace que el contenedor también suba (proyectos y tarjetas de planes). Ojo: un elemento con `data-paso` usa `transition` para aparecer, así que su hover va en un hijo (`.servicio__nombre > span`) o en un envoltorio (`.servicio__accion`, `.plan__accion`).
- `data-reveal="lineas"`: títulos línea por línea. Cada línea es `<span class="linea"><span style="--n:N">…</span></span>`: la máscara tiene `overflow: hidden` y el texto sube con `translateY(150%) → 0`, 90 ms entre líneas. Las líneas se cortan a mano en el HTML.

**Coreografías.** Portada (al cargar): panel y borde → Avo sube (`--d:100ms`) → titular línea por línea (`--d:250ms`) → subtítulo y botones (`--d:550ms`) → burbuja (`--d:1500ms`). Servicios: cada fila es un grupo, 150 ms entre filas (línea, título, texto, "Incluye" y cada píldora). Proyectos: cada uno sube (el segundo, 150 ms después). Planes: las tarjetas suben con 150 ms de diferencia y el precio llega al final. Cierre: título línea por línea → los 3 pasos en cascada → texto y botón.

**Avo de la portada.** Respira (sube 1px y vuelve, en pasos, cada 3 s) y parpadea cada 3–6 s (`main.js` cambia la imagen a `avo-parpadeo` 160 ms; el parpadeo sigue con movimiento reducido porque no es movimiento). **Profundidad:** solo con Lenis (computadora con mouse), `lenis.on('scroll')` mueve los `[data-profundidad]` (Avo y su burbuja) con `translate3d(0, scroll × 0.15, 0)` mientras la portada está en pantalla. En celular quedan fijos.

**Bordes que se dibujan.** Con JS, el borde de CSS del panel queda transparente y `main.js` agrega `.panel__borde`: 4 tramos rectos que crecen con `scaleX`/`scaleY` y 4 esquinas que aparecen con `opacity`, empezando en la esquina de la barrita azul y en el sentido del reloj. El radio se lee del CSS de cada panel (24 o 28px menos 1px), así que funciona en celular y computadora. La curva `--ease` se aplica al contorno **completo** (búsqueda binaria sobre la bezier, `--ret` y `--dur` en cada pieza, recalculado con `ResizeObserver`). Para otra duración, `DURACION_BORDE`.

**Hover de los botones principales.** Sin efecto magnético. Solo con mouse real (`hover: hover` y `pointer: fine`), en 200 ms: el relleno `.btn__relleno` (capa que `main.js` agrega dentro de cada `.btn--primary`) recorre el botón con `scaleX` de izquierda a derecha y sale hacia la derecha, y la flecha del círculo se corre 3px. Al presionar o tocar: `scale(.97)`. Con movimiento reducido: el relleno solo aparece con un fundido y la flecha no se mueve.

**Cinta.** Lineal y continua (40 s por vuelta), con los bordes desvanecidos. **Nunca se pausa**, ni con el mouse, salvo con movimiento reducido.

**Scroll con inercia (Lenis 1.3.26, con huella SRI).** `main.js` lo descarga **solo** si hay mouse, no hay pantalla táctil (`any-pointer: coarse`) y no hay movimiento reducido. Los enlaces internos los maneja `main.js` (con o sin Lenis): calcula el destino con `offsetTop`, actualiza la dirección y pasa el foco a la sección. El chat de Avo lleva `data-lenis-prevent`.

**Movimiento reducido.** Todo aparece de inmediato (también las cascadas, Avo y el borde, que queda completo), la cinta queda quieta, Avo no respira ni tiene profundidad y el botón flotante aparece sin desplazarse. Solo quedan fundidos de opacidad cortos: la burbuja de Avo (200 ms) y el panel del chat (180 ms).

## SEO, íconos e imágenes

**Dirección actual del sitio: https://avosolutions.netlify.app. Nunca usar avorasolutions.com, que pertenece a otra empresa.**

- El dominio propio todavía **no está comprado**. La dirección actual se repite en `canonical`, `og:url`, `og:image`, el bloque JSON-LD, `robots.txt` y `sitemap.xml`: cuando se defina el dominio real, se actualizan todos juntos. `theme-color` es `#0B0B0C`.
- **Favicon:** la cabeza de Avo. `img/favicon.svg` es `avo-normal.svg` con el `viewBox` recortado a la cabeza; `img/favicon-32.png` y `img/apple-touch-icon.png` (180px, fondo `#0B0B0C`) salen de ahí.
- **Logo de la empresa** (JSON-LD `logo`): `img/logo-avora.svg`, la A con su estela azul. El logo de la empresa no es Avo.
- **Imagen para compartir:** `img/og-avora-v3.png` (1200×630, la hice yo aparte). Se usa con la URL completa (`https://avosolutions.netlify.app/img/og-avora-v3.png`) en `og:image`, `twitter:image` y el `image` del JSON-LD, con `og:image:width` 1200, `og:image:height` 630 y `og:image:alt` "AVORA: Avo atiende. Tú vendes.". Textos para compartir: `og:title` "AVORA · Avo atiende. Tú vendes." y `og:description` "Páginas web, asistentes con IA y campañas que traen clientes. Agencia digital en Panamá."; `twitter:card` es `summary_large_image`. Si la imagen cambia, se reemplaza el archivo y se actualizan esas URLs juntas.
- **Regenerar los íconos:** con un servidor estático en el puerto 8765, `node _herramientas/generar-imagenes.mjs` crea `favicon-32.png` y `apple-touch-icon.png` desde `favicon.svg` (necesita Playwright).
- La única imagen de contenido es Avo de la portada (carga inmediata con `fetchpriority="high"`). Las caras del chat se precargan para que cambien sin parpadeo.

## Páginas legales

- **`privacidad/index.html`** (Política de privacidad, Ley 81 de 2019 de Panamá) y **`terminos/index.html`** (Términos de uso). Se ven en `/privacidad/` y `/terminos/`, están en `sitemap.xml` y cada una tiene su `title`, `meta description` y `canonical`.
- **Estilo:** cargan `css/styles.css` y `css/legal.css` (columna de lectura de 720px). Usan el mismo header (logo y botón "Volver al inicio", `.btn--volver`), un panel oscuro con firma e índice y el mismo footer. **Sin Avo, sin `main.js` y sin animaciones.** Solo cargan `js/mensajes.js` para el enlace de WhatsApp.
- **Contenido:** español claro y corto, con "Última actualización" arriba y la nota "Este documento es informativo y puede actualizarse." al final. Retención de datos: mientras dure la conversación o el servicio; si no se trabaja juntos, hasta 12 meses desde el último contacto.
- **La política de privacidad debe decir la verdad sobre el código.** Hoy el sitio no usa cookies ni `localStorage`/`sessionStorage`/IndexedDB, y no tiene analítica ni publicidad. Los terceros que reciben la IP son Netlify (hosting), Google Fonts y jsDelivr (Lenis, solo en computadora con mouse). **Si se agrega cualquier cosa que guarde datos en el navegador, una cookie, analítica, un formulario o un servicio de terceros, hay que actualizar la política y su fecha en el mismo cambio.**

## Carpetas que no son del sitio

- `docs/` guarda las referencias de diseño; `_herramientas/` el script de los íconos; `_referencias/` los originales y capturas (fuera de Git, en `.gitignore`). Las tres están excluidas en `robots.txt`.
