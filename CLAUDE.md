# CLAUDE.md

Este archivo le da contexto a Claude Code (claude.ai/code) para trabajar en este repositorio.

## Qué es este proyecto

Landing page (página de una sola sección de venta) de mi agencia de marketing digital **AVORA Solutions**, en Panamá.

- **Objetivo:** que el visitante nos escriba por WhatsApp al **+507 6632-8271** (`50766328271`). Todo en la página debe empujar hacia ese paso. El botón de contacto dice siempre **"Contáctanos"** (header, portada, cierre y chat de Avo); ya no se habla de "agendar una demo".
- **Lema:** "Atrae. Convierte. Automatiza." (footer, `slogan` del JSON-LD y nombres de los tres servicios).
- **Título de la portada:** "Creamos sistemas que atienden por ti." Subtítulo: "Páginas web, automatizaciones y redes sociales para que más clientes te escriban por WhatsApp. Negocios en Panamá." Botón: "Contáctanos".
- **Qué vendemos hoy:** landing pages, sitios web, automatizaciones y redes sociales (contenido orgánico y campañas de anuncios), más SEO local, mantenimiento, WhatsApp Business configurado e integraciones. **Avo no es un producto:** es solo el chat de asistente de la esquina. En los textos de venta no se usan las palabras "chatbot" ni "asistente con IA" (se dice "automatizaciones", "respuestas automáticas", "WhatsApp automatizado"), para que nadie piense que vendemos a Avo.
- **La landing sí muestra precios**, en el panel **Planes** (`#planes`), en USD. Hay dos planes: **Web + Automatización** ($650 de instalación + $90/mes; solo la página, desde $350) y **A tu medida** (según evaluación). Los precios viven en **cuatro** lugares que deben coincidir: el panel Planes de `index.html` (español), el objeto `EN` de `js/idioma.js` (inglés) y las respuestas `precio` de Avo en `js/avo.js` (`RESPUESTAS` y `RESPUESTAS_EN`). Si un precio cambia, se actualizan los cuatro juntos.
- `AVORA-Planes-y-Precios-2026.pdf` está **desactualizado** (muestra los 4 planes anteriores) y la página ya no lo enlaza. Queda pendiente rehacerlo; no lo enlaces hasta entonces.

## Identidad (v2, monocroma y editorial, con dos temas)

Dos temas que solo cambian variables. El oscuro vive en `:root` de `css/styles.css`; el claro, en `.tema-claro`:

| Uso | Variable | Tema oscuro | Tema claro |
|---|---|---|---|
| Fondo de la página / franja | `--fondo` | `#0B0B0C` | `#ECEBE7` |
| Paneles | `--panel` | `#111113` | `#ECEBE7` |
| Tarjetas dentro de un panel | `--superficie` | `#141416` | `#F7F6F3` |
| Texto | `--texto` | `#F2F2F0` | `#0B0B0C` |
| Texto secundario | `--texto-2` | `#8E8E93` (5.8:1) | `#55555B` (6.2:1) |
| Líneas y bordes de tarjetas | `--linea` | `rgba(242,242,240,.12)` | `rgba(11,11,12,.12)` |
| Borde de los paneles | `--borde-panel` | `rgba(242,242,240,.20)` | `rgba(11,11,12,.18)` |
| Lo que va encima de `--texto` (botones, píldoras) | `--sobre-texto` | `#0B0B0C` | `#F2F2F0` |
| Borde de la flecha con hover | `--linea-activa` | blanco 45 % | negro 45 % |
| Título de servicio con hover | `--texto-hover` | `#FFFFFF` | `#2A2A2F` |
| Contorno de la palabra CRECER (portada) | `--palabra-fondo` | `rgba(242,242,240,.14)` | — |

- **El azul `#4D5BFF` (`--azul`)** es igual en los dos temas y solo se usa en la estela del logo y la barrita de cada panel.
- **Botones y píldoras se invierten solos:** usan `--texto` de fondo y `--sobre-texto` encima, nunca colores fijos ni `--fondo`. En oscuro son claros con texto negro; en claro, negros con texto claro.
- **Tarjeta negra de Planes (`.plan--oscuro`):** dentro de la franja clara, vuelve a tokens oscuros: fondo `#0B0B0C`, secundario `#A3A3A8` (7.8:1) y líneas `rgba(242,242,240,.14)`.

- **Tipografía:** dos fuentes de Google Fonts, con `display=swap` y solo los pesos que se usan. **Space Grotesk** (500, 600, 700) en títulos, precios, la palabra CRECER y el nombre de la marca: variable `--fuente-titulos`, aplicada a `h1, h2, h3`. **Inter** (400, 500, 600) en todo lo demás: variable `--fuente-textos`. Space Grotesk no tiene peso 800. Si se usa un peso nuevo, hay que agregarlo al `<link>` de `index.html`. Títulos grandes en peso 600 con interletrado negativo: H1 −0.055em, títulos de sección −0.045em, cierre −0.05em.
- **El azul no se usa en nada más:** ni texto, ni botones, ni bordes.
- **Prohibido:** diagonales decorativas, cortes inclinados (`clip-path` en ángulo), números entre paréntesis, fondos animados, colores fuera de esta tabla.
- Contraste mínimo AA en todo el texto y en los dos temas; el más justo es `--texto-2` oscuro sobre `--superficie` (5.6:1).

## Reglas de contenido

- **No inventar cifras ni testimonios.** Nada de "+200 clientes", "300 % más ventas", "más elegido", reseñas o nombres de clientes que yo no haya dado. Si hace falta un dato, deja un marcador visible (por ejemplo `[CIFRA PENDIENTE]`) y avísame.
- **Testimonios:** si se acorta una cita real, el recorte se marca con `(…)`. No se cambian palabras.
- **Precios y qué incluye cada plan:** solo los que yo haya dado (los del panel Planes). No agregar beneficios, descuentos ni condiciones nuevas por tu cuenta.
- Los comentarios del código y los nombres cercanos a las clases van en español. El texto visible está en español (`lang="es-PA"`, idioma por defecto) y tiene traducción al inglés (ver "Idioma").

## Idioma (ES | EN)

Botón "ES | EN" en el header (`.idioma`): un solo botón que alterna. El español es el idioma por defecto y **vive en `index.html`**; el inglés vive en `js/idioma.js` (objeto `EN`). Sin librerías.

- **Marcas en el HTML:** `data-i18n="clave"` (texto plano), `data-i18n-html="clave"` (las 3 frases con una parte resaltada en `<span class="claro">`), `data-i18n-aria="clave"` (`aria-label`) y `data-wa="tema"` (enlaces de WhatsApp).
- **Regla:** todo texto nuevo de la página lleva su marca y su traducción en `EN`. Si falta la traducción, se muestra el español (nunca queda un hueco).
- **Qué cambia el botón:** los textos, los `aria-label`, `<html lang>` (`es-PA` ↔ `en`), `document.title`, el mensaje prellenado de cada enlace `wa.me` (objeto `WHATSAPP_EN`; el número se toma del enlace que ya existe, no se repite) y la palabra de fondo (CRECER ↔ GROW). Al terminar dispara el evento `avora:idioma`, que `js/avo.js` escucha para traducir el chat.
- **Qué no cambia:** `meta description`, Open Graph y JSON-LD se quedan en español, porque los leen Google y las redes, que no pulsan el botón. Para aparecer en Google en inglés haría falta una página aparte.
- **Recordar el idioma:** `localStorage` (clave `avora-idioma`), siempre dentro de `try/catch`. El script del `<head>` pone el `lang` guardado antes de dibujar, y `idioma.js` se carga antes que `main.js`, así el texto cambia antes de las animaciones de entrada (sin parpadeo).
- **Títulos cortados a mano:** el inglés usa las mismas máscaras: "We build / systems / that answer / for you." y "Let's talk / business." Si cambia un título, hay que medirlo en los dos idiomas.
- **Testimonios:** en inglés van traducidos fielmente y el autor lleva "· Translated from Spanish".
- **Sin JavaScript** la página queda completa en español y el botón no se muestra.

**Cortina al cambiar de idioma.** Al pulsar el botón, un panel claro (`.cortina`: fondo `--texto`, logo en `--sobre-texto`, `aria-hidden="true"`, por encima de todo, también de Avo) cruza la pantalla de izquierda a derecha en **800 ms**: entra (0–340 ms), cubre con el logo y "AVORA" en fundido, y sale (460–800 ms). A la mitad, con la pantalla cubierta, se llama a `aplicarIdioma()`. El panel lo crea `js/idioma.js` (sin JS no existe); el movimiento vive en `css/styles.css` (sección 8) y solo anima `transform` (panel) y `opacity` (marca), con la curva `--ease-cortina` = `cubic-bezier(.76, 0, .24, 1)` aplicada a cada tramo.
- **Tiempos:** `DURACION_CORTINA` en `idioma.js` es la única fuente; el script se la pasa al CSS en `--t-cortina`. Los pasos van con `setTimeout`, no con eventos de la animación, para que el botón nunca quede bloqueado si el navegador la pausa.
- **Doble clic:** mientras dura, el botón lleva `aria-disabled="true"` (no `disabled`, para no quitarle el foco) y los clics se ignoran.
- **Scroll:** `conservarLugar()` anota a qué altura está el bloque más cercano al centro de la pantalla y corrige el scroll después del cambio (el inglés y el español no miden lo mismo). Con Lenis usa `lenis.scrollTo(y, { immediate: true })`.
- **Portada:** si está en pantalla, repite su entrada al salir el panel: `prepararPortada()` le quita `.is-visible` a lo de dentro del hero sin transición (clase `.sin-transicion`) y se lo devuelve. El panel del hero y su borde no se redibujan, y **nada fuera del hero pierde su `.is-visible`**.
- **Al cargar** con inglés guardado no hay cortina.
- **Movimiento reducido:** sin cortina ni logo. El mismo elemento hace un fundido de 150 ms al color del fondo (`--fondo`) y vuelve, y la portada no repite su entrada.

## Páginas legales

`privacidad.html` (Política de Privacidad) y `terminos.html` (Términos y Condiciones), en la raíz. Mismo diseño que la landing: `css/styles.css` (sección 7b, `.legal__*`), el mismo header y footer, y el texto dentro de un solo panel.

- **Solo en español.** No cargan `idioma.js` ni `avo.js` (sin botón ES | EN y sin chat); sí cargan `main.js`. Si el visitante tenía guardado el inglés, el script del `<head>` agrega `.viene-de-ingles` y aparece el aviso `.legal__aviso` ("This page is available in Spanish only for now.").
- **Enlaces:** "Privacidad · Términos" en el footer de las tres páginas (`.site-footer__legal`). En `index.html` llevan `data-i18n` ("Privacy", "Terms"). En las legales, el menú del header apunta a `./#servicios`, `./#proyectos` y `./#planes`.
- **No hay plantillas:** el header, el footer, los íconos y el número de WhatsApp están **copiados en las tres páginas**. Si cambia uno, se cambia en las tres.
- **El texto dice lo que la página hace de verdad.** Hay que actualizar `privacidad.html` (y su fecha) si se agrega analítica, cookies o formularios, si se carga otro servicio externo, o si el chat de Avo se conecta a una IA: ahí lo que escribe el visitante sí saldría de su navegador. Hoy nombra Cloudflare (aloja la página), WhatsApp (Meta), Google Fonts y jsDelivr, y dice que no hay cookies ni analítica.
- **Derechos:** los cuatro que yo indiqué (acceso, corrección, eliminación y oposición, Ley 81 de 2019). La ley también incluye portabilidad y la vigila la ANTAI; decidí no nombrarlas. No se agregan plazos, tiempos de conservación ni medidas de seguridad que yo no haya dado.
- El texto no lo revisó un abogado.

## Stack

Sitio estático simple: `index.html` (más `privacidad.html` y `terminos.html`) + `css/styles.css` + `js/main.js`, más el idioma (`js/idioma.js`) y el asistente Avo en archivos aparte (`css/avo.css` + `js/avo.js`). Los scripts se cargan en este orden: `idioma.js`, `main.js`, `avo.js`. Sin framework, sin bundler (herramienta que empaqueta código), sin `package.json`, sin tests ni linter (revisor automático de estilo). La única librería externa es **Lenis** (scroll con inercia), que `main.js` descarga desde jsDelivr solo en computadora con mouse (ver Movimiento).

## Cómo verlo

No hay paso de compilación. Sirve la carpeta con un servidor estático (por ejemplo `python -m http.server`) para que las rutas, las fuentes y Lenis se comporten como en producción. Revisa siempre el diseño en ancho de celular (~390px) y con `prefers-reduced-motion: reduce` (ajuste del sistema para reducir animaciones): ambos son prioridad. La referencia del diseño es `_referencias/referencia-rediseno-avora.html` ("variante 3", con franjas claras; fuera de Git) y se puede abrir con el mismo servidor para comparar. La versión anterior, toda oscura, quedó en `_referencias/referencia-rediseno-avora-v1-oscura.html`.

## Arquitectura

**Estructura (en este orden).** Header (no fijo) → panel 01 Portada (`#inicio`) → Cinta (sin panel) → panel 02 Servicios → panel 03 Proyectos → panel 04 Planes → panel 05 Contacto → Footer.

**Fondos alternados.** Portada oscura, **Servicios clara**, Proyectos oscura, **Planes clara**, cierre oscuro. Servicios y Planes van dentro de `<div class="franja tema-claro">`: la franja pinta el fondo claro de lado a lado de la pantalla (no solo el panel), con `--panel-gap` de relleno arriba; el panel de adentro conserva su margen inferior. El cambio de fondo ocurre solo con el scroll: la franja no se anima. `styles.css` está dividido en secciones numeradas que siguen ese orden. Mobile-first, un solo breakpoint en `min-width: 900px` (en celular el header muestra el logo, el selector de idioma y "Contáctanos" sin el círculo de la flecha, para que quepan). Única excepción: por debajo de 350px se oculta el nombre "AVORA" y queda solo el logo.

**Paneles (`.panel`).** Cada sección vive en un panel: esquinas de 28px, borde de 1px `--borde-panel` (con JS, el borde se "dibuja": ver Movimiento), fondo `--panel`, separado `--panel-gap` del borde de la pantalla y de los otros paneles (16px en computadora, 8px en celular). Arriba a la izquierda, `.panel__marca` (la barrita azul del logo, 16×2px girada −26.6°); arriba a la derecha, `.panel__indice` ("01 / 05 · Inicio", en `--texto-2`, `aria-hidden`). El contenido va en `.container` (máximo 1280px, padding `clamp(20px, 5vw, 80px)`).

**Componentes.**
- **Encabezado de sección (`.section-head`):** etiqueta con punto en una columna de 200px (`.section-head__etiqueta`) y título gigante (`.section-title`, `clamp(56px, 8vw, 120px)`).
- **Botón principal (`.btn.btn--primary`):** píldora `--texto` con texto oscuro y la flecha dentro de un círculo oscuro (`.btn__circulo`). `.btn--lg` para la portada y el cierre. Al menos 44px de alto. En el panel claro se invierte. Se mantiene la clase `.btn--primary`, porque Avo la vigila. Con hover, un relleno sutil lo recorre y la flecha se corre 3px (ver Movimiento).
- **Flecha en círculo (`.flecha`):** 48px, borde `--linea`; las usan las filas de Servicios.
- **Píldoras (`.pildora`):** rellenas (`--texto`) o de contorno (`.pildora--contorno`).
- **Enlace de texto (`.enlace`):** subrayado con 6px de separación; `.enlace--flecha` agrega la flecha. Tiene 44px de área de toque.
- **Íconos:** `<symbol>` al final de `index.html` (`#i-logo` con la estela azul, `#i-flecha`), usados con `<use href="#i-flecha"/>`.

**Los CTA son enlaces de WhatsApp** (`https://wa.me/50766328271?text=…`) con un mensaje precargado según el contexto. El **general** (header, portada, cierre, footer) es "Hola, vi su página web y quiero información sobre sus servicios." Los demás conservan el suyo: uno por servicio (Atrae, Convierte, Automatiza), uno por proyecto ("Quiero algo así") y uno por plan; los que antes pedían una demo ahora terminan en "¿Me dan más información?". Al agregar un CTA, escribe un mensaje que encaje con su contexto y codifícalo para URL (tildes incluidas, ej. `%C3%A1`). El número vive en `index.html` (12 enlaces, el footer y el JSON-LD) y en `WA_BASE` de `js/avo.js`: si cambia, se cambian todos juntos.

**Proyectos (sin imágenes).** Canal Silver y Distrito 507 en dos columnas amplias (una en celular), cada uno con: línea divisoria arriba, etiquetas en píldora (tipo y año / "Proyecto escolar"), el **nombre grande** como `h3` (`clamp(44px, 5vw, 72px)`), resultado, testimonio con su autor, "Ver sitio en vivo" y "Quiero algo así".

**Título de la portada.** `.hero__title`: `clamp(40px, 14vw, 96px)` en celular y `clamp(88px, 10.2vw, 136px)` desde 900px (medidos con Space Grotesk: "que atienden" ocupa 5.72em y "Creamos sistemas", 7.85em). Son 4 máscaras: "Creamos" / "sistemas" / "que atienden" / "por ti.". En celular son 4 líneas; en computadora las dos primeras (`.linea--pareja`, `inline-block`) comparten fila. Si el texto cambia, hay que volver a medir que ninguna línea se salga (la más larga es "que atienden" en celular y "Creamos sistemas" en computadora).

**Palabra CRECER de fondo (portada).** `.hero__palabra`: Space Grotesk 700 a `clamp(88px, 25vw, 360px)`, **solo en contorno** y centrada detrás del título (vive dentro de `.hero__titular`, el envoltorio del `h1`, con `z-index: -1`). Lleva `aria-hidden="true"` y no se puede seleccionar. El contorno es un trazo de 2px en `--palabra-fondo` con `paint-order: stroke fill` y el relleno en `--panel`: el relleno tapa la mitad interior del trazo (se ve 1px) y los cruces que la fuente variable dibuja dentro de las letras. Se centra con flexbox, **no con `transform`**, porque el `transform` lo usa `main.js` para la profundidad. Son dos elementos: el exterior se mueve con el scroll y el interior (`.hero__palabra-texto`) hace la aparición. Si no cabe, la recorta el `overflow: hidden` del panel (nunca hay scroll horizontal).

## Movimiento (calmado, editorial)

Tokens en `:root`: curva `--ease` = `cubic-bezier(.22, 1, .36, 1)`, `--t-hover` 200 ms, `--t-press` 150 ms, `--t-aparecer` 800 ms, `--t-linea` 900 ms, `--escalon` 120 ms. Solo se animan `transform` y `opacity`; nunca `transition: all`.

**Apariciones (`data-reveal`).** El script del `<head>` agrega `.js` al `<html>`; los estados ocultos iniciales están todos bajo `.js [data-reveal…]`, así la página se ve completa sin JavaScript. `main.js` agrega `.is-visible` con un solo `IntersectionObserver` (`threshold: .15`, una sola vez por elemento). Todo aparece animado, nada de golpe. Variantes:
- `data-reveal` (sin valor): fundido + 12px → 0.
- `data-reveal="panel"`: fundido + escala `.98 → 1` en 900 ms, al mismo tiempo que se dibuja su borde (todos los paneles, también la portada).
- `data-reveal="fundido"`: solo opacidad (header, cinta y footer).
- `data-reveal="grupo"`: se observa el contenedor y sus hijos `[data-paso]` aparecen en cascada (`--i` × 120 ms + `--d`). `data-paso="linea"` es una `.divisoria` que se dibuja de izquierda a derecha (`scaleX`); `data-paso="enfasis"` llega con `scale(.94) → 1` (el precio de cada plan, que aparece al final). `data-sube` hace que el contenedor también suba (proyectos y tarjetas de planes). Ojo: un elemento con `data-paso` usa `transition` para aparecer, así que su hover va en un hijo (`.servicio__nombre > span`) o en un envoltorio (`.servicio__accion`, `.plan__accion`), si no, el retraso de la cascada también frenaría el hover.
- `data-reveal="lineas"`: títulos línea por línea. Cada línea es `<span class="linea"><span style="--n:N">…</span></span>`: la máscara tiene `overflow: hidden` y el texto sube con `translateY(105%) → 0`, 90 ms entre líneas. Las líneas se cortan a mano en el HTML (como la referencia), no con JS.

Retrasos: `--d` es el retraso base y `--i` la posición en el escalonado de 120 ms. Las máscaras de `lineas` esconden el texto con `translateY(150%)`: con menos, las letras altas se asoman por el margen inferior de la máscara.

**Coreografías (mismo lenguaje en todas).** Portada (al cargar): panel y borde → palabra CRECER (`--d:100ms`) → título línea por línea y la línea de arriba (`--d:250ms`) → línea divisoria, texto y botones (`--d:550ms`). Servicios: cada fila es un grupo, 150 ms entre filas; dentro, la línea se dibuja y siguen el título, el texto, "Incluye" y cada píldora. Proyectos: cada uno sube (el segundo, 150 ms después): etiquetas → nombre → resultado → testimonio → enlaces. Planes: las tarjetas suben con 150 ms de diferencia y el precio llega al final con su énfasis. Cierre: título línea por línea → los 3 pasos en cascada, con su línea → texto y botón.

**Bordes que se dibujan.** Con JS, el borde de CSS del panel queda transparente y `main.js` agrega `.panel__borde`: 4 tramos rectos que crecen con `scaleX`/`scaleY` y 4 esquinas de 27px que aparecen con `opacity`, en el orden del recorrido (empieza en la esquina de la barrita azul y sigue en el sentido del reloj). La curva `--ease` se aplica al contorno **completo**: `main.js` busca en qué momento de la curva la línea llega a cada pieza (búsqueda binaria sobre la bezier) y guarda `--ret` y `--dur` en cada una; se recalcula con `ResizeObserver`. Como la curva frena mucho al final, la línea recorre tres lados rápido y cierra despacio subiendo hacia la barrita. Para velocidad pareja, cambiar `tiempoDeAvance` por la identidad; para otra duración, `DURACION_BORDE`.

**Hover de los botones principales (igual en los 5).** Sin efecto magnético (se quitó: hacía temblar los botones). Solo con mouse real (`hover: hover` y `pointer: fine`), en `--t-hover` (200 ms): el relleno `.btn__relleno` (capa que `main.js` agrega dentro de cada `.btn--primary`) recorre el botón con `scaleX` de izquierda a derecha y sale hacia la derecha, y la flecha del círculo se corre 3px. El botón en sí no se mueve. Al presionar o tocar: `scale(.97)`. Con movimiento reducido: el relleno no recorre, solo aparece su color con un fundido (`opacity`), y la flecha no se mueve. El color del relleno mezcla `--texto` y `--sobre-texto` (14:1 de contraste con el texto en los dos temas). El botón del chat de Avo (`.avo-cta`) no lleva relleno.

**Profundidad de la palabra CRECER.** Solo cuando existe Lenis (computadora con mouse, sin movimiento reducido): `lenis.on('scroll')` mueve `.hero__palabra` con `translate3d(0, scroll × 0.25, 0)` mientras la portada está en pantalla. No se agrega ningún listener de scroll del navegador. En celular queda fija.

**Cinta.** Solo los servicios: "Landing pages · Sitios web · Automatizaciones · Redes sociales · Campañas de ads" (el "·" lo pone el CSS). Lineal y continua, con los bordes desvanecidos. La lista está 6 veces en el HTML (solo la primera la leen los lectores de pantalla): el recorrido avanza media pista, así que las copias van siempre en número par, y media pista (unos 2630px) tiene que llenar una pantalla ancha. Dura 75 s para ir a unos 35 px por segundo; si cambia el texto, se ajusta la duración para conservar esa velocidad. **Nunca se pausa**, ni con el mouse (decisión mía), salvo con movimiento reducido. Se mantiene la clase `.ribbon__band`, porque Avo la usa.

**Hover** (solo con `@media (hover: hover) and (pointer: fine)`, 200 ms): las flechas se desplazan 3px; en las filas de Servicios el borde de la flecha se ilumina y el título pasa a blanco; los enlaces bajan a `--texto-2`. El desplazamiento, además, solo con `prefers-reduced-motion: no-preference`. Al presionar (también al tocar en celular): `scale(.97)`, sin el rectángulo gris de toque.

**Scroll con inercia (Lenis 1.3.26, con huella SRI).** `main.js` lo descarga **solo** si hay mouse (`hover: hover` y `pointer: fine`), no hay pantalla táctil (`any-pointer: coarse`) y no hay movimiento reducido. En celular ni se descarga. Los enlaces internos los maneja `main.js` (con o sin Lenis): cancela el salto nativo, calcula el destino con `offsetTop` (para que el desplazamiento de animación de una sección que aún no apareció no corra el destino), actualiza la dirección y pasa el foco a la sección. El chat de Avo lleva `data-lenis-prevent` para desplazarse normal.

**Movimiento reducido.** Todo aparece de inmediato (también las cascadas y el borde, que queda completo), la cinta queda quieta y no hay profundidad. En los botones solo cambia el color del relleno, sin movimiento. La única transición que queda es la del panel de Avo: abre y cierra con un fundido de opacidad de 180 ms, sin desplazarse.

## Avo, el asistente (v1 sin IA)

Mascota en pixel art que reemplaza al antiguo botón flotante de WhatsApp. Todo vive en `css/avo.css` y `js/avo.js`; el HTML lo crea `avo.js` al cargar, así `index.html` solo tiene el `<link>` y el `<script>`. Usa los tokens de `styles.css`.

- **Estilo v2:** botón de fondo `--fondo` con borde fino `--linea` (sin anillo de color, para no competir con la píldora del CTA); al pasar el mouse el borde se ilumina como las flechas (`--linea-activa`). La burbuja "¿Te ayudo?" es una píldora en `--texto`. El panel del chat es redondeado como los paneles de la página (en celular sube desde abajo con las esquinas de arriba redondeadas).
- **Sobre fondos claros:** `avo.js` vigila con un `IntersectionObserver` si una `.tema-claro` pasa por la franja inferior derecha donde vive Avo; mientras pasa, agrega `.avo--sobre-claro` y el botón y la burbuja toman los tokens claros (botón `#F7F6F3`, burbuja oscura), con una transición de color de 200 ms. El chat abierto siempre es oscuro.
- **Imágenes:** `img/avo/avo-{normal,parpadeo,saludo,pensando,feliz}.svg` (48×48, con `image-rendering: pixelated`; son el Avo nuevo, de capucha oscura). En el botón flotante se muestran a 48px, su tamaño real, para que cada pixel del dibujo caiga en pixeles enteros. También existe `avo-hablando.svg`, que todavía **no se usa**: ningún estado de `ESTADOS` lo pide. Las caras anteriores (`avo-capucha-*.svg`, 34×34) ya no están en la carpeta; sus originales siguen en `_referencias/avo-originales/`. La carpeta va en minúsculas (`avo`), porque en un servidor real `Avo` ≠ `avo`.
- **Respuestas:** todo pasa por `getReply(mensaje)`, que devuelve `{ texto, tema }`. Hoy detecta palabras clave (sin tildes, con `\b` de inicio de palabra) y, si hay varios temas, gana el primero de `PRIORIDAD`: precio > caso > proceso > automatiza > convierte > atrae > general > saludo. Los textos salen solo de lo que ya dice la landing (regla de no inventar cifras).
- **Idioma:** el chat habla el idioma de la página. Cada bloque de textos tiene su gemelo en inglés al lado (`WHATSAPP_EN`, `RESPUESTAS_EN`, `PALABRAS_CLAVE_EN`, `RAPIDAS_EN`, `BIENVENIDA_EN`, `INTERFAZ_EN`) y `segunIdioma(es, en)` elige según `<html lang>`. Al cambiar de idioma (evento `avora:idioma`) se traducen los textos fijos y, si la conversación ya empezó, se reinicia con el saludo en el idioma nuevo.
- **Para conectar la API de Claude:** reemplazar solo el interior de `getReply` por un `fetch` a un servidor propio que guarde la clave. La clave **nunca** va en `avo.js`, porque el navegador la expone.
- **WhatsApp:** cada tema usa el mismo mensaje prellenado que el botón equivalente de la landing (objeto `WHATSAPP`). El enlace "Hablar por WhatsApp" de la fila de opciones cambia al tema de la última respuesta. Ya no hay botón "Contáctanos" al fondo del chat ni enlace de WhatsApp dentro de cada respuesta.
- **Orden del chat, de arriba a abajo:** encabezado → mensajes (`.avo-log`, lo único que se desplaza) → "Avo está escribiendo…" → fila de opciones (`.avo-rapidas`) → campo de texto.
- **Fila de opciones (`.avo-rapidas`):** una sola fila con desplazamiento horizontal, fija sobre el campo de texto y **fuera** de la lista de mensajes, así nunca los empuja. `mostrarOpciones(claves, tema)` la reemplaza entera cada vez (las opciones no se acumulan). Empieza siempre con "Hablar por WhatsApp" (`.avo-chip--wa`, relleno como los botones), para que se vea entero sin desplazar. Los textos viven en `OPCIONES` / `OPCIONES_EN`, por tema; el texto que se ve es también la pregunta que se envía, así que tiene que caer en su tema con las palabras clave.
- **Qué opciones salen:** al abrir, el menú completo (`OPCIONES_INICIO`); después de cada respuesta, 2 o 3 relacionadas con ese tema (tabla `SIGUIENTES`, que guarda temas y sirve para los dos idiomas). Nunca se ofrece la que se acaba de responder.
- **Desplazamiento:** al responder, `mostrarRespuesta()` deja a la vista el **inicio** de la respuesta, no el final del chat. Si la pregunta y la respuesta caben juntas se ven las dos; si no, la respuesta queda arriba desde su primera línea. Es suave salvo con movimiento reducido (`desplazarA`).
- **Proyectos:** la respuesta `caso` resume los dos proyectos y lleva el enlace "Ver los proyectos" a `#proyectos`. Su mensaje de WhatsApp es genérico ("vi sus proyectos…").
- **Precios:** la respuesta `precio` describe los dos planes, el "desde $350" y Clientes Fundadores, y lleva el enlace "Ver los planes" a `#planes` (objeto `ENLACES`, por tema).
- **No tapar botones:** un `IntersectionObserver` vigila la franja inferior derecha (104px); si un `.btn--primary` o una `.flecha` de la página pasa por ahí, Avo se aparta (`.is-ducked`).
- **No tapar la cinta:** mientras `.hero__sentinel` está visible (página arriba del todo), `avo.js` mide si la cinta (`.ribbon__band`) choca con el botón y, si choca, lo sube lo justo (`.is-elevado` + `--avo-elevar`, midiendo con `offsetTop` sin el transform).
- **Estados (personaje de videojuego):** una tabla `ESTADOS` en `avo.js` define cara, animación, duración y prioridad de cada estado (espera, durmiendo, atento, saludando, contento, aplastar, celebrando, bailando, pensando). Todo cambio pasa por `cambiarEstado(nombre, forzar)`, que consulta `puedeCambiar(actual, nuevo)`. El JS solo escribe `data-estado`, `data-anim` y `data-fx` en `.avo`; el movimiento vive en `avo.css`, siempre con `steps(1, end)` y en múltiplos de `--avo-px` (el paso de movimiento, 1.5px). Solo se usan las 5 caras existentes: no se dibujan nuevas.
- **Efectos:** la capa `.avo-fx` (dentro del botón y del círculo del avatar) tiene los tres puntitos y las Z en SVG pixel art, en `--texto`, con `pointer-events: none`.
- **Dormir:** tras 30 s sin actividad. Los listeners de actividad (`mousemove`, `scroll`, `touchstart`…) son `passive` y solo guardan la hora; un chequeo cada segundo decide si dormir.
- **Accesibilidad:** `role="dialog"`, el foco no se escapa del chat abierto, Escape cierra y devuelve el foco a Avo, `role="log"` anuncia los mensajes y lo que escribe el usuario se inserta siempre con `textContent`. Con movimiento reducido solo cambian las caras (el parpadeo sí sigue); los puntitos y las Z se ven quietos, y el panel abre y cierra con un fundido de 180 ms (`avo.js` espera esos mismos 180 ms antes de ocultarlo).
- **Probarlo:** los `IntersectionObserver` no avisan si el navegador no dibuja (panel oculto, o Edge headless con `--virtual-time-budget`). Hay que probar con una ventana visible o manejando Edge por el protocolo de depuración.

## Imágenes y carpetas que no son del sitio

- Las capturas de los proyectos (`img/canal-silver-*.jpg`, `img/distrito507-*.jpg`) quedaron sin uso: desde las animaciones v2, Proyectos no lleva imágenes.
- **Favicon:** fondo negro `#0A0A0A` con la "A" en blanco. Son tres archivos, enlazados en el `<head>` de las cuatro páginas: `favicon.ico` (32×32, en la raíz, que es donde los navegadores lo buscan solos), `img/favicon.svg` y `img/apple-touch-icon.png` (180×180, cuadrado completo y sin transparencia, porque el iPhone le pone su propio recorte). Para regenerarlos: capturar el SVG a 512px con Edge headless (`--default-background-color=00000000` para las esquinas transparentes), reducirlo a 32 y 180, y envolver el PNG de 32 en un `.ico`. Ninguno está en `.assetsignore`: los tres se publican.
- `_herramientas/og-image.html` es la plantilla de 1200×630 para `img/og-image.jpg` (la imagen que se ve al compartir el link). Ya tiene la identidad v2 y el título de la portada. Para regenerar el JPG: servir la carpeta, capturar la plantilla con Edge headless (`--headless=new --window-size=1200,630 --screenshot=…`) y convertir el PNG a JPG. Si cambia el título de la portada, se actualizan la plantilla y el JPG.
- `_referencias/` guarda capturas y la referencia del rediseño. Ambas carpetas con `_` están excluidas en `robots.txt` y no forman parte del sitio (`_referencias/` además está en `.gitignore`).

## Cloudflare (dónde se publica)

El sitio se publica en Cloudflare como un **Worker con archivos estáticos** llamado `avora-solutions`, conectado a este repositorio desde el panel de Cloudflare: cada cambio en `main` se publica solo. No hay paso de compilación.

- **`wrangler.jsonc`** (raíz): la configuración del Worker. `"directory": "."` significa que Cloudflare publica **la carpeta entera del proyecto**. `"name"` tiene que ser el nombre del Worker; si se cambia, se publica en otro. `"not_found_handling": "404-page"` hace que una dirección que no existe muestre `404.html`.
- **`.assetsignore`** (raíz, mismo formato que `.gitignore`): lo que está en esa lista **no se publica**. Hoy deja fuera `.git`, `.github`, la configuración (`wrangler.jsonc`, `package.json`, `.gitignore`…), `_herramientas/`, `_referencias/`, `.claude/`, `.impeccable/`, `CLAUDE.md`, cualquier `*.md` y el PDF de precios. **Regla: todo archivo nuevo en la raíz queda público salvo que se agregue ahí.**
- **Qué queda público:** `index.html`, `privacidad.html`, `terminos.html`, `404.html`, `favicon.ico`, `robots.txt`, `sitemap.xml`, `css/`, `js/` e `img/` (incluidas las imágenes que ya no se usan).
- **Direcciones sin `.html`:** Cloudflare redirige `/privacidad.html` a `/privacidad`. Los enlaces internos siguen escritos con `.html` para que también funcionen en local.
- **`404.html`:** mismo diseño, con el botón "Volver al inicio". Sus rutas empiezan con `/` (`/css/styles.css`), porque Cloudflare la muestra en cualquier dirección, también dentro de carpetas que no existen. Si el visitante venía en inglés, el texto sale en inglés (`.solo-es` / `.solo-en`, con la misma clase `.viene-de-ingles` de las páginas legales). En local se ve abriendo `/404.html`; el servidor de Python no la usa para direcciones inventadas.
- **Comprobar después de publicar:** `/.git/config`, `/CLAUDE.md`, `/wrangler.jsonc` y `/_herramientas/og-image.html` deben dar 404; una dirección inventada debe mostrar la página 404.

## SEO

**Dirección actual del sitio: https://avora-solutions.andre-valencia204.workers.dev (Cloudflare). Nunca usar avorasolutions.com, que pertenece a otra empresa, ni avora.solutions mientras no esté comprado.**

El dominio propio todavía **no está comprado** (la idea es `avora.solutions`). La dirección actual se repite en 12 lugares: `canonical`, `og:url`, `og:image` y las 3 direcciones del JSON-LD en `index.html`; el `canonical` de `privacidad.html` y de `terminos.html`; las 3 de `sitemap.xml`; y la línea del sitemap en `robots.txt`. Cuando exista el dominio real, se actualizan todos juntos. Las páginas legales van **sin `.html`** en `canonical` y en el sitemap (`…/privacidad`, `…/terminos`), porque en Cloudflare esa es la dirección final. El sitio anterior en Netlify (`avosolutions.netlify.app`) ya no es la dirección oficial. Los datos de contacto (teléfono, email) también aparecen en el JSON-LD, el footer y los CTA. `theme-color` es `#0B0B0C`.
