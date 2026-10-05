# CLAUDE.md

Este archivo le da contexto a Claude Code (claude.ai/code) para trabajar en este repositorio.

## Qué es este proyecto

Landing page (página de una sola sección de venta) de mi agencia de marketing digital **AVORA Solutions**, en Panamá.

- **Objetivo:** que el visitante agende una demo por WhatsApp al **+507 6328-8742** (`50763288742`). Todo en la página debe empujar hacia ese paso.
- **Lema:** "Atrae. Convierte. Automatiza."
- **La landing sí muestra precios**, en la sección **Planes** (`#planes`), en USD. Los precios viven en tres lugares que deben coincidir: la sección Planes de `index.html`, la respuesta `precio` de Avo en `js/avo.js` y el PDF `AVORA-Planes-y-Precios-2026.pdf`. Si un precio cambia, se actualizan los tres juntos.

## Marca

**Paleta "Deep Twilight"** (variables en `:root` de `css/styles.css`):

| Uso | Color | Variable |
|---|---|---|
| Fondo oscuro principal (también favicon y logos) | `#00034A` | `--navy` (variantes `--navy-deep` `#000236`, `--navy-raised` `#030756`) |
| Fondo claro / texto sobre oscuro | `#F2F3F7` | `--bone` |
| Botones principales: fondo, texto blanco | `#000096` | `--royal` |
| Borde fino de botones, palabras destacadas en títulos, decoración, estela del logo | `#4D5BFF` | `--indigo` |
| Texto pequeño de acento sobre oscuro ("REDES · PÁGINAS WEB") | `#8A93FF` | `--lavender` |
| Texto secundario sobre oscuro | `#808080` | `--gray-dark` |
| Subtítulo de la portada, sobre el efecto de fibras (7.5:1 sobre navy) | `#A3A3A3` | `--gray-soft` |
| Texto secundario sobre claro | `#595959` | `--gray-light` |

Reglas de contraste (AA): `#4D5BFF` da 3.83:1 sobre el navy, así que **solo sirve para texto grande** (24px o más, o 18.66px en negrita) y decoración, nunca para texto pequeño. `--navy-raised` no puede ser más claro, porque el gris `#808080` bajaría de 4.5:1.
- **Tipografía:** Archivo (Google Fonts), para todo el sitio.

## Reglas de contenido

- **No inventar cifras ni testimonios.** Nada de "+200 clientes", "300 % más ventas", reseñas o nombres de clientes que yo no haya dado. Si hace falta un dato, deja un marcador visible (por ejemplo `[CIFRA PENDIENTE]`) y avísame.
- **Precios y qué incluye cada plan:** solo los que yo haya dado (los de la sección Planes). No agregar beneficios, descuentos ni condiciones nuevas por tu cuenta.
- Todo el texto visible, los comentarios del código y los nombres cercanos a las clases van en español (`lang="es-PA"`).

## Stack

Sitio estático simple: `index.html` + `css/styles.css` + `js/main.js`, más el fondo animado de la portada (`js/fondo-fibras.js`) y el asistente Avo en archivos aparte (`css/avo.css` + `js/avo.js`). Sin framework, sin bundler (herramienta que empaqueta código), sin `package.json`, sin tests ni linter (revisor automático de estilo).

## Cómo verlo

No hay paso de compilación. Abre `index.html` directo, o sirve la carpeta con un servidor estático (por ejemplo `python -m http.server`) para que las rutas y fuentes se comporten como en producción. Revisa siempre el diseño en ancho de celular (~390px) y con `prefers-reduced-motion: reduce` (ajuste del sistema para reducir animaciones): ambos son prioridad.

## Arquitectura

**Temas por variables.** `.theme-dark` y `.theme-light` solo redefinen variables CSS (`--bg`, `--fg`, `--muted`, `--line`, `--accent`, `--eyebrow`); los componentes leen esas variables y nunca escriben colores fijos. `--accent` es índigo en ambos temas (decoración y texto grande); `--eyebrow` es el color del texto pequeño de acento: lavanda en oscuro y royal en claro. Los botones primarios (`.btn--primary`) son iguales en ambos temas: el fondo del elemento es el borde índigo y un `::before` 1px adentro, con el mismo `clip-path`, es el relleno royal. Así el borde sigue también la esquina recortada. Una sección cambia de aspecto solo con agregarle la clase del tema (los pilares de Servicios alternan temas uno por uno).

**El motivo del "corte" diagonal.** Todo lo visual sale de la barra diagonal del logo: pendiente 0.5 (`--slope: 26.57deg`). Aparece en las fibras del fondo del hero (`rotation: -63.43`, es decir 90° − 26.57°), los separadores `.cut-top`, las esquinas recortadas de los botones y las tarjetas, el separador de la cinta de rubros, la animación `wipe` del titular (clip-path), la línea del proceso y la imagen OG. Los nuevos elementos decorativos deben reutilizar este ángulo en vez de inventar otros.

**Animaciones de aparición (`data-reveal`).** Un script en el `<head>` agrega `.js` al `<html>`; los estados ocultos iniciales en CSS están todos bajo `.js [data-reveal…]`, así la página se ve completa sin JavaScript. `main.js` agrega `.is-visible` usando un solo `IntersectionObserver` (API del navegador que avisa cuando un elemento entra en pantalla). Hay **un solo estilo** para todo lo que aparece al hacer scroll: `data-reveal` sin valor (aparecer y subir 10px, `--t-reveal` 300 ms, escalonado de 50 ms con `style="--i:N"` en línea). La única excepción es `wipe`, el barrido diagonal del titular de la portada (firma de marca, al cargar). No agregar variantes nuevas. Ojo: los elementos `wipe` empiezan con un clip-path de área cero y nunca "entran" en pantalla, por eso `main.js` observa a su **padre**; mantén los `wipe` dentro de un padre que ocupe espacio. Con movimiento reducido o sin IntersectionObserver, todo se muestra de inmediato.

**Fondo de la portada (GhostFibers).** Efecto de React Bits recreado en `js/fondo-fibras.js` con WebGL2 directo (sin React ni ogl): un triángulo a pantalla completa y el shader original, con cuatro cambios: `uBackdrop` (fondo), `uCentro` (centro movible), `uTope` (ningún píxel pasa de `--lavender`) y sin modo claro. Los colores se leen de `:root`: `--navy` fondo, `--royal` brillo ancho, `--indigo` fibras, `--lavender` tope; no se escriben en el JS. El centro va a la derecha en computadora y abajo en celular, lejos del texto. Encima, `.hero__fondo::after` es el degradado que oscurece detrás del texto (elipse en computadora, vertical en celular) y se funde con `--navy` al final. Contraste medido con los píxeles reales: el más justo es el párrafo gris (~4.6–4.7:1; el máximo posible sobre navy es 4.83), así que cualquier cambio de brillo, centro o degradado debe volver a medirse. Rendimiento: celular (`max-width: 899px` o `pointer: coarse`) 30 cuadros por segundo y densidad 0.75; computadora 60 y 1. Se pausa fuera de pantalla y con la pestaña oculta; con movimiento reducido dibuja un solo cuadro fijo. Sin WebGL2 (o sin JS) queda el degradado fijo del CSS de `.hero__fondo`.

**Sin listeners de scroll.** `main.js` usa a propósito solo IntersectionObserver y `resize`:
- `.hero__sentinel` activa `.site-header.is-solid` (header con fondo sólido).
- Los pilares de Servicios usan `position: sticky` apilados; `main.js` calcula `--sticky-top` por pilar para que uno más alto que la pantalla se fije por su borde inferior (top negativo) y se lea completo antes de que el siguiente lo tape. Se recalcula al cambiar el tamaño y después de `document.fonts.ready`.

**Layout CSS.** Mobile-first (primero celular), un solo breakpoint (punto de cambio de diseño) en `min-width: 900px`, más unos pocos ajustes `max-width`. `styles.css` está dividido en secciones numeradas que coinciden con los comentarios `<!-- N · … -->` de `index.html` (1 Hero … 5 Proyectos, 6 Proceso, 7 Planes, 8 CTA final, 9 Footer).

**Sección Proyectos (`#proyectos`).** Dos casos que a propósito no se ven iguales: Canal Silver va abierto sobre el fondo claro de la sección, y Distrito 507 es una franja oscura (`.project-band`, `theme-dark`) a todo el ancho que cierra la sección, en espejo (capturas a la izquierda en computadora) y con su "Resultado" destacado. Cada caso define `--proyecto` (color de su marca, solo decoración: barra junto al nombre, comillas, borde del testimonio) y `--proyecto-fondo` (escenario detrás de las capturas). Distrito 507 usa el rojo de su logo (`#bf3a33`) y el carbón de su página (`#1c1c1c`) como escenario. En celular el orden es nombre → capturas → historia (`.project__copy` usa `display: contents` y áreas de grid); en computadora el texto va en su columna y las capturas quedan `sticky`. Cada caso lleva su testimonio dentro (ya no hay sección aparte de testimonio). Si faltan las dos capturas de un caso, el escenario se oculta y el texto ocupa una sola columna.

**Movimiento e interacción (un solo sistema).** Tokens en `:root`: una curva `--ease` (salida fuerte, `cubic-bezier(.23,1,.32,1)`) y tres duraciones: `--t-press` 150 ms, `--t-hover` 200 ms, `--t-reveal` 300 ms. No usar otros valores ni `transition: all`. El hover vive dentro de `@media (hover: hover) and (pointer: fine)` (en celular no se queda "pegado"); el movimiento (elevar, desplazar, presionar) además dentro de `prefers-reduced-motion: no-preference`. Para tocar se usa `:active`, y para teclado `:focus-visible` y `:focus-within`.
- **Enlaces de texto:** clase `.subrayado` (línea de acento de 2px que crece de izquierda a derecha); `.subrayado--base` agrega una línea tenue fija para que se note que es un enlace sin mouse.
- **Botones:** hover = sube 1px, el relleno se aclara (`--btn-fill-hover`) y el ícono se mueve 2px; `:active` = `scale(.97)`.
- **Tarjetas** (`.pillar`, `.project__visual`, `.plan`): borde de 1px con el truco de `.btn--primary` (el fondo del elemento es `--borde` y `::before` 1px adentro es el relleno `--bg`, con el mismo `clip-path`). Con hover o `:focus-within` pasa a `--borde-activo`. Nada de sombras ni saltos.
- **Encabezados de sección:** `<header class="section-head">` con `.eyebrow`, título y `.section-lead`; la distancia al contenido es `--head-gap`.

**Cinta de rubros.** Franja recta y delgada (`theme-dark`, dentro del flujo, entre la portada y "Por qué AVORA"), con líneas de 1px, texto pequeño en lavanda y el corte del logo (barra de 2px girada con `--slope`) en índigo como separador. Se mueve lineal a 60 s por vuelta, se pausa con el mouse encima y se detiene con movimiento reducido.

**Sección Planes.** Sección oscura con fondo `--navy-deep` y tarjetas `--navy-raised`. El Sistema AVORA es la tarjeta destacada: clara (`theme-light`), con etiqueta "Recomendado" (mismo estilo que `.pillar__tag`), borde índigo de 2px con el mismo sistema de borde de las tarjetas (`--borde: var(--indigo)`, `::before` 2px adentro) y brillo en su `<li>`. En computadora: fila de 3 con AVORA más ancha y más alta (margen negativo) y el Plan Atrae abajo, a lo ancho y en horizontal. En celular: una columna, con el precio siempre arriba. Ojo: `data-reveal` va en el `<li>` y el `clip-path` del corte en el `<article>` de adentro, porque con movimiento reducido el CSS quita el `clip-path` a todo `[data-reveal]` (lo mismo con la franja de Clientes Fundadores).

**Los CTA son enlaces de WhatsApp** (`https://wa.me/50763288742?text=…`) con un mensaje precargado distinto según el contexto de cada botón. Al agregar un CTA (botón de llamada a la acción), escribe un mensaje que encaje con su contexto y codifícalo para URL (tildes incluidas, ej. `%C3%A1`). Los íconos son `<symbol>` SVG al final de `index.html`, usados con `<use href="#i-chat"/>`.

**Jerarquía de CTA.** El botón de WhatsApp debe ser siempre lo más visible:
- Los CTA grandes (hero y CTA final) van dentro de `.cta-glow`, un envoltorio con `filter: drop-shadow` índigo. El brillo va en el envoltorio porque el `clip-path` del `.btn` recortaría cualquier sombra del propio botón.
- Las acciones secundarias usan `.link-arrow` (texto subrayado con flecha), no un segundo botón.
- En celular, el CTA del header muestra solo "Demo" (`.site-header__cta-short`), con 44px de alto; el nombre completo va en `aria-label`.

## Avo, el asistente (v1 sin IA)

Mascota en pixel art que reemplaza al antiguo botón flotante de WhatsApp. Todo vive en `css/avo.css` y `js/avo.js`; el HTML lo crea `avo.js` al cargar, así `index.html` solo tiene el `<link>` y el `<script>`.

- **Imágenes:** `img/avo/avo-capucha-{normal,parpadeo,saludo,pensando,feliz}.svg` (34×34, con `image-rendering: pixelated`). Están optimizadas: sin metadatos C2PA y con un `<path>` por color. Los originales están en `_referencias/avo-originales/`. La carpeta va en minúsculas (`avo`), porque en un servidor real `Avo` ≠ `avo`.
- **Respuestas:** todo pasa por `getReply(mensaje)`, que devuelve `{ texto, tema }`. Hoy detecta palabras clave (sin tildes, con `` de inicio de palabra) y, si hay varios temas, gana el primero de `PRIORIDAD`: precio > caso > proceso > automatiza > convierte > atrae > general > saludo. Los textos salen solo de lo que ya dice la landing (regla de no inventar cifras).
- **Para conectar la API de Claude:** reemplazar solo el interior de `getReply` por un `fetch` a un servidor propio que guarde la clave. La clave **nunca** va en `avo.js`, porque el navegador la expone.
- **WhatsApp:** cada tema usa el mismo mensaje prellenado que el botón equivalente de la landing (objeto `WHATSAPP`). El botón fijo del chat cambia al tema de la última respuesta.
- **Proyectos:** la respuesta `caso` resume los dos proyectos (Canal Silver y Distrito 507) y lleva el enlace "Ver los proyectos" a `#proyectos`. Como habla de los dos, su mensaje de WhatsApp es genérico ("vi sus proyectos…") y no el de un caso puntual.
- **Precios:** la respuesta `precio` menciona los planes y dice "desde $350". Además del botón de WhatsApp, lleva un enlace "Ver los planes" a `#planes` (objeto `ENLACES`, por tema). El enlace sale del tema y no del texto, así `getReply` sigue devolviendo solo `{ texto, tema }`.
- **No tapar botones:** un `IntersectionObserver` vigila la franja inferior derecha (104px); si un `.btn--primary` de la página pasa por ahí, Avo se aparta (`.is-ducked`).
- **No tapar la cinta de rubros:** si la portada mide justo lo que la pantalla, la cinta queda abajo, donde vive Avo. Mientras `.hero__sentinel` está visible (página arriba del todo), `avo.js` mide si la cinta choca con el botón y, si choca, lo sube lo justo (`.is-elevado` + `--avo-elevar`, usando `offsetTop` para medir sin el transform). Al bajar, vuelve a su lugar.
- **Estados (personaje de videojuego):** una tabla `ESTADOS` en `avo.js` define cara, animación, duración y prioridad de cada estado (espera, durmiendo, atento, saludando, contento, aplastar, celebrando, bailando, pensando). Todo cambio pasa por `cambiarEstado(nombre, forzar)`, que consulta `puedeCambiar(actual, nuevo)`. El JS solo escribe `data-estado`, `data-anim` y `data-fx` en `.avo`; el movimiento vive en `avo.css`, siempre con `steps(1, end)` y en múltiplos de `--avo-px` (1 pixel del dibujo = 1.5px). Solo se usan las 5 caras existentes: no se dibujan nuevas.
- **Efectos:** la capa `.avo-fx` (dentro del botón y del círculo del avatar) tiene los tres puntitos y las Z en SVG pixel art, con `pointer-events: none`, así nunca tapan ni bloquean nada.
- **Dormir:** tras 30 s sin actividad. Los listeners de actividad (`mousemove`, `scroll`, `touchstart`…) son `passive` y solo guardan la hora; un chequeo cada segundo decide si dormir.
- **Accesibilidad:** `role="dialog"`, el foco no se escapa del chat abierto, Escape cierra y devuelve el foco a Avo, `role="log"` anuncia los mensajes y lo que escribe el usuario se inserta siempre con `textContent`. Con movimiento reducido: los movimientos están dentro de `@media (prefers-reduced-motion: no-preference)`, así que solo cambian las caras (el parpadeo sí sigue); los puntitos y las Z se ven quietos.
- **Probarlo:** los `IntersectionObserver` no avisan si el navegador no dibuja (panel oculto, o Edge headless con `--virtual-time-budget`). Hay que probar con una ventana visible o manejando Edge por el protocolo de depuración.

## Imágenes y carpetas que no son del sitio

- Los mockups de Proyectos usan `img/canal-silver-desktop.jpg`, `img/canal-silver-movil.jpg`, `img/distrito507-desktop.jpg` (1440×900, recortada al centro a 16:10) y `img/distrito507-movil.jpg` (585×1266, rellenada abajo con su fondo `#1c1c1c` hasta 390:844). Las de Canal Silver: `img/canal-silver-movil.jpg` (590×1277, recortada de la captura original del iPhone, que está en `_referencias/`, sin barras del sistema y rellenada abajo hasta la proporción 390:844 de la maqueta). Cada `<img>` tiene un `onerror` que oculta todo su `.device` si falta el archivo.
- `_herramientas/og-image.html` es la plantilla de 1200×630 para `img/og-image.jpg` (la imagen que se ve al compartir el link), capturada con un navegador sin interfaz. Regenera el JPG si cambia la marca o el lema.
- `_referencias/` guarda capturas de referencia de diseño. Ambas carpetas con `_` están excluidas en `robots.txt` y no forman parte del sitio.

## SEO

**Dirección actual del sitio: https://avosolutions.netlify.app. Nunca usar avorasolutions.com, que pertenece a otra empresa.**

El dominio propio todavía **no está comprado**. La dirección actual se repite en `canonical`, `og:url`, `og:image`, el bloque JSON-LD, `robots.txt` y `sitemap.xml`: cuando se defina el dominio real, se actualizan todos juntos. Los datos de contacto (teléfono, email) también aparecen en el JSON-LD, el footer y los CTA.
