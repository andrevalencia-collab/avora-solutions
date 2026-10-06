# CLAUDE.md

Este archivo le da contexto a Claude Code (claude.ai/code) para trabajar en este repositorio.

## Qué es este proyecto

Landing page (página de una sola sección de venta) de mi agencia de marketing digital **AVORA Solutions**, en Panamá.

- **Objetivo:** que el visitante agende una demo por WhatsApp al **+507 6328-8742** (`50763288742`). Todo en la página debe empujar hacia ese paso.
- **Lema:** "Atrae. Convierte. Automatiza."
- **La landing sí muestra precios**, en el panel **Planes** (`#planes`), en USD. Hay dos planes: **Web + Automatización** ($650 de instalación + $90/mes; solo la página, desde $350) y **A tu medida** (según evaluación). Los precios viven en dos lugares que deben coincidir: el panel Planes de `index.html` y la respuesta `precio` de Avo en `js/avo.js`. Si un precio cambia, se actualizan los dos juntos.
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
| Palabra AVORA de fondo (portada) | `--palabra-fondo` | `rgba(242,242,240,.04)` | — |

- **El azul `#4D5BFF` (`--azul`)** es igual en los dos temas y solo se usa en la estela del logo y la barrita de cada panel.
- **Botones y píldoras se invierten solos:** usan `--texto` de fondo y `--sobre-texto` encima, nunca colores fijos ni `--fondo`. En oscuro son claros con texto negro; en claro, negros con texto claro.
- **Tarjeta negra de Planes (`.plan--oscuro`):** dentro de la franja clara, vuelve a tokens oscuros: fondo `#0B0B0C`, secundario `#A3A3A8` (7.8:1) y líneas `rgba(242,242,240,.14)`.

- **Tipografía:** una sola, **Hanken Grotesk** (Google Fonts, `wght@300..800`, `display=swap`). Títulos grandes en peso 600 con interletrado negativo: H1 −0.055em, títulos de sección −0.045em, cierre −0.05em.
- **El azul no se usa en nada más:** ni texto, ni botones, ni bordes.
- **Prohibido:** diagonales decorativas, cortes inclinados (`clip-path` en ángulo), números entre paréntesis, fondos animados, colores fuera de esta tabla.
- Contraste mínimo AA en todo el texto y en los dos temas; el más justo es `--texto-2` oscuro sobre `--superficie` (5.6:1).

## Reglas de contenido

- **No inventar cifras ni testimonios.** Nada de "+200 clientes", "300 % más ventas", "más elegido", reseñas o nombres de clientes que yo no haya dado. Si hace falta un dato, deja un marcador visible (por ejemplo `[CIFRA PENDIENTE]`) y avísame.
- **Testimonios:** si se acorta una cita real, el recorte se marca con `(…)`. No se cambian palabras.
- **Precios y qué incluye cada plan:** solo los que yo haya dado (los del panel Planes). No agregar beneficios, descuentos ni condiciones nuevas por tu cuenta.
- Todo el texto visible, los comentarios del código y los nombres cercanos a las clases van en español (`lang="es-PA"`).

## Stack

Sitio estático simple: `index.html` + `css/styles.css` + `js/main.js`, más el asistente Avo en archivos aparte (`css/avo.css` + `js/avo.js`). Sin framework, sin bundler (herramienta que empaqueta código), sin `package.json`, sin tests ni linter (revisor automático de estilo). La única librería externa es **Lenis** (scroll con inercia), que `main.js` descarga desde jsDelivr solo en computadora con mouse (ver Movimiento).

## Cómo verlo

No hay paso de compilación. Sirve la carpeta con un servidor estático (por ejemplo `python -m http.server`) para que las rutas, las fuentes y Lenis se comporten como en producción. Revisa siempre el diseño en ancho de celular (~390px) y con `prefers-reduced-motion: reduce` (ajuste del sistema para reducir animaciones): ambos son prioridad. La referencia del diseño es `_referencias/referencia-rediseno-avora.html` ("variante 3", con franjas claras; fuera de Git) y se puede abrir con el mismo servidor para comparar. La versión anterior, toda oscura, quedó en `_referencias/referencia-rediseno-avora-v1-oscura.html`.

## Arquitectura

**Estructura (en este orden).** Header (no fijo) → panel 01 Portada (`#inicio`) → Cinta (sin panel) → panel 02 Servicios → panel 03 Proyectos → panel 04 Planes → panel 05 Contacto → Footer.

**Fondos alternados.** Portada oscura, **Servicios clara**, Proyectos oscura, **Planes clara**, cierre oscuro. Servicios y Planes van dentro de `<div class="franja tema-claro">`: la franja pinta el fondo claro de lado a lado de la pantalla (no solo el panel), con `--panel-gap` de relleno arriba; el panel de adentro conserva su margen inferior. El cambio de fondo ocurre solo con el scroll: la franja no se anima. `styles.css` está dividido en secciones numeradas que siguen ese orden. Mobile-first, un solo breakpoint en `min-width: 900px` (en celular el header muestra solo el logo y "Agenda tu demo").

**Paneles (`.panel`).** Cada sección vive en un panel: esquinas de 28px, borde de 1px `--borde-panel` (con JS, el borde se "dibuja": ver Movimiento), fondo `--panel`, separado `--panel-gap` del borde de la pantalla y de los otros paneles (16px en computadora, 8px en celular). Arriba a la izquierda, `.panel__marca` (la barrita azul del logo, 16×2px girada −26.6°); arriba a la derecha, `.panel__indice` ("01 / 05 · Inicio", en `--texto-2`, `aria-hidden`). El contenido va en `.container` (máximo 1280px, padding `clamp(20px, 5vw, 80px)`).

**Componentes.**
- **Encabezado de sección (`.section-head`):** etiqueta con punto en una columna de 200px (`.section-head__etiqueta`) y título gigante (`.section-title`, `clamp(56px, 8vw, 120px)`).
- **Botón principal (`.btn.btn--primary`):** píldora `--texto` con texto oscuro y la flecha dentro de un círculo oscuro (`.btn__circulo`). `.btn--lg` para la portada y el cierre. Al menos 44px de alto. En el panel claro se invierte. Se mantiene la clase `.btn--primary`, porque Avo la vigila. Los 5 de la página llevan `.btn--magnetico` y un `.btn__cuerpo` interno: son **magnéticos** y tienen un relleno que los recorre con hover (ver Movimiento); las `.flecha` no.
- **Flecha en círculo (`.flecha`):** 48px, borde `--linea`; las usan las filas de Servicios.
- **Píldoras (`.pildora`):** rellenas (`--texto`) o de contorno (`.pildora--contorno`).
- **Enlace de texto (`.enlace`):** subrayado con 6px de separación; `.enlace--flecha` agrega la flecha. Tiene 44px de área de toque.
- **Íconos:** `<symbol>` al final de `index.html` (`#i-logo` con la estela azul, `#i-flecha`), usados con `<use href="#i-flecha"/>`.

**Los CTA son enlaces de WhatsApp** (`https://wa.me/50763288742?text=…`) con un mensaje precargado distinto según el contexto: general (header, portada, cierre, footer), uno por servicio (Atrae, Convierte, Automatiza), uno por proyecto ("Quiero algo así") y uno por plan. Al agregar un CTA, escribe un mensaje que encaje con su contexto y codifícalo para URL (tildes incluidas, ej. `%C3%A1`).

**Proyectos (sin imágenes).** Canal Silver y Distrito 507 en dos columnas amplias (una en celular), cada uno con: línea divisoria arriba, etiquetas en píldora (tipo y año / "Proyecto escolar"), el **nombre grande** como `h3` (`clamp(44px, 5vw, 72px)`), resultado, testimonio con su autor, "Ver sitio en vivo" y "Quiero algo así".

**Palabra AVORA de fondo (portada).** `.hero__palabra`: Hanken Grotesk 800 a `28vw`, rellena en `--palabra-fondo`, detrás del contenido y con casi la mitad cortada por el borde inferior del panel (`bottom: -.38em`), sin tocar el título. Son dos elementos: el exterior se mueve con el scroll y el interior (`.hero__palabra-texto`) hace la aparición.

## Movimiento (calmado, editorial)

Tokens en `:root`: curva `--ease` = `cubic-bezier(.22, 1, .36, 1)`, `--t-hover` 200 ms, `--t-press` 150 ms, `--t-aparecer` 800 ms, `--t-linea` 900 ms, `--escalon` 120 ms. Solo se animan `transform` y `opacity`; nunca `transition: all`.

**Apariciones (`data-reveal`).** El script del `<head>` agrega `.js` al `<html>`; los estados ocultos iniciales están todos bajo `.js [data-reveal…]`, así la página se ve completa sin JavaScript. `main.js` agrega `.is-visible` con un solo `IntersectionObserver` (`threshold: .15`, una sola vez por elemento). Todo aparece animado, nada de golpe. Variantes:
- `data-reveal` (sin valor): fundido + 12px → 0.
- `data-reveal="panel"`: fundido + escala `.98 → 1` en 900 ms, al mismo tiempo que se dibuja su borde (todos los paneles, también la portada).
- `data-reveal="fundido"`: solo opacidad (header, cinta y footer).
- `data-reveal="grupo"`: se observa el contenedor y sus hijos `[data-paso]` aparecen en cascada (`--i` × 120 ms + `--d`). `data-paso="linea"` es una `.divisoria` que se dibuja de izquierda a derecha (`scaleX`); `data-paso="enfasis"` llega con `scale(.94) → 1` (el precio de cada plan, que aparece al final). `data-sube` hace que el contenedor también suba (proyectos y tarjetas de planes). Ojo: un elemento con `data-paso` usa `transition` para aparecer, así que su hover va en un hijo (`.servicio__nombre > span`) o en un envoltorio (`.servicio__accion`, `.plan__accion`), si no, el retraso de la cascada también frenaría el hover.
- `data-reveal="lineas"`: títulos línea por línea. Cada línea es `<span class="linea"><span style="--n:N">…</span></span>`: la máscara tiene `overflow: hidden` y el texto sube con `translateY(105%) → 0`, 90 ms entre líneas. Las líneas se cortan a mano en el HTML (como la referencia), no con JS.

Retrasos: `--d` es el retraso base y `--i` la posición en el escalonado de 120 ms. Las máscaras de `lineas` esconden el texto con `translateY(150%)`: con menos, las letras altas se asoman por el margen inferior de la máscara.

**Coreografías (mismo lenguaje en todas).** Portada (al cargar): panel y borde → palabra AVORA (`--d:100ms`) → título línea por línea y la línea de arriba (`--d:250ms`) → línea divisoria, texto y botones (`--d:550ms`). Servicios: cada fila es un grupo, 150 ms entre filas; dentro, la línea se dibuja y siguen el título, el texto, "Incluye" y cada píldora. Proyectos: cada uno sube (el segundo, 150 ms después): etiquetas → nombre → resultado → testimonio → enlaces. Planes: las tarjetas suben con 150 ms de diferencia y el precio llega al final con su énfasis. Cierre: título línea por línea → los 3 pasos en cascada, con su línea → texto y botón.

**Bordes que se dibujan.** Con JS, el borde de CSS del panel queda transparente y `main.js` agrega `.panel__borde`: 4 tramos rectos que crecen con `scaleX`/`scaleY` y 4 esquinas de 27px que aparecen con `opacity`, en el orden del recorrido (empieza en la esquina de la barrita azul y sigue en el sentido del reloj). La curva `--ease` se aplica al contorno **completo**: `main.js` busca en qué momento de la curva la línea llega a cada pieza (búsqueda binaria sobre la bezier) y guarda `--ret` y `--dur` en cada una; se recalcula con `ResizeObserver`. Como la curva frena mucho al final, la línea recorre tres lados rápido y cierra despacio subiendo hacia la barrita. Para velocidad pareja, cambiar `tiempoDeAvance` por la identidad; para otra duración, `DURACION_BORDE`.

**Botones magnéticos (`.btn--magnetico`, no `.flecha`).** Estructura: `<a class="btn btn--primary btn--magnetico"><span class="btn__cuerpo">Texto<span class="btn__circulo">…</span></span></a>`. El `<a>` **no se mueve**: es el área que detecta el mouse, con 12px extra alrededor (`::before`), y se mide en cada movimiento, así la medida siempre es la real (también después de un scroll). Lo que se desplaza es el `.btn__cuerpo` (que lleva el fondo, el relleno y el padding `--btn-pad`). Si el área se moviera con el botón, en los bordes el cursor entraría y saldría en bucle (el botón "temblaba").
- Solo con mouse real (`pointerType === 'mouse'`, `hover: hover`, `pointer: fine`) y sin movimiento reducido.
- El cuerpo se acerca al cursor hasta 8px (también en diagonal); el círculo se corre 3px más **solo en horizontal** (queda alineado con el texto) y la flecha gira hasta ±12°.
- Cada efecto tiene su propiedad: imán = `translate` del cuerpo; presionar = `scale(.97)` del cuerpo; la aparición va en el envoltorio de afuera (`.hero__acciones`, `.plan__accion`…). No se pisan.
- Mientras sigue al mouse, cada destino se anima en `--t-sigue` (150 ms) y la transición se redirige desde donde va (efecto resorte); al soltar vuelve en `--t-vuelta` (400 ms).
- **Se suelta** al salir el mouse (`pointerleave`/`pointercancel`), al perder el foco, al hacer scroll (un listener `passive` y de un solo uso, que existe solo mientras el imán está activo) y al cambiar de pestaña o de ventana. Nunca queda movido.
- El relleno `.btn__relleno` (capa que `main.js` agrega dentro del cuerpo) entra con `scaleX` desde la izquierda y sale hacia la derecha; su color mezcla `--texto` y `--sobre-texto` (14:1 de contraste con el texto en los dos temas). En celular solo queda el `scale(.97)` al tocar.
- El botón del chat de Avo (`.avo-cta`) usa `.btn--primary` sin cuerpo ni imán.

**Profundidad de la palabra AVORA.** Solo cuando existe Lenis (computadora con mouse, sin movimiento reducido): `lenis.on('scroll')` mueve `.hero__palabra` con `translate3d(0, scroll × 0.25, 0)` mientras la portada está en pantalla. No se agrega ningún listener de scroll del navegador. En celular queda fija.

**Cinta.** Lineal y continua (40 s por vuelta), con los bordes desvanecidos. **Nunca se pausa**, ni con el mouse (decisión mía), salvo con movimiento reducido. Se mantiene la clase `.ribbon__band`, porque Avo la usa.

**Hover** (solo con `@media (hover: hover) and (pointer: fine)`, 200 ms): las flechas se desplazan 3px; en las filas de Servicios el borde de la flecha se ilumina y el título pasa a blanco; los enlaces bajan a `--texto-2`. El desplazamiento, además, solo con `prefers-reduced-motion: no-preference`. Al presionar (también al tocar en celular): `scale(.97)`, sin el rectángulo gris de toque.

**Scroll con inercia (Lenis 1.3.26, con huella SRI).** `main.js` lo descarga **solo** si hay mouse (`hover: hover` y `pointer: fine`), no hay pantalla táctil (`any-pointer: coarse`) y no hay movimiento reducido. En celular ni se descarga. Los enlaces internos los maneja `main.js` (con o sin Lenis): cancela el salto nativo, calcula el destino con `offsetTop` (para que el desplazamiento de animación de una sección que aún no apareció no corra el destino), actualiza la dirección y pasa el foco a la sección. El chat de Avo lleva `data-lenis-prevent` para desplazarse normal.

**Movimiento reducido.** Todo aparece de inmediato (también las cascadas y el borde, que queda completo), la cinta queda quieta, sin efecto magnético, sin relleno y sin profundidad. La única transición que queda es la del panel de Avo: abre y cierra con un fundido de opacidad de 180 ms, sin desplazarse.

## Avo, el asistente (v1 sin IA)

Mascota en pixel art que reemplaza al antiguo botón flotante de WhatsApp. Todo vive en `css/avo.css` y `js/avo.js`; el HTML lo crea `avo.js` al cargar, así `index.html` solo tiene el `<link>` y el `<script>`. Usa los tokens de `styles.css`.

- **Estilo v2:** botón de fondo `--fondo` con borde fino `--linea` (sin anillo de color, para no competir con la píldora del CTA); al pasar el mouse el borde se ilumina como las flechas (`--linea-activa`). La burbuja "¿Te ayudo?" es una píldora en `--texto`. El panel del chat es redondeado como los paneles de la página (en celular sube desde abajo con las esquinas de arriba redondeadas).
- **Sobre fondos claros:** `avo.js` vigila con un `IntersectionObserver` si una `.tema-claro` pasa por la franja inferior derecha donde vive Avo; mientras pasa, agrega `.avo--sobre-claro` y el botón y la burbuja toman los tokens claros (botón `#F7F6F3`, burbuja oscura), con una transición de color de 200 ms. El chat abierto siempre es oscuro.
- **Imágenes:** `img/avo/avo-capucha-{normal,parpadeo,saludo,pensando,feliz}.svg` (34×34, con `image-rendering: pixelated`). Están optimizadas: sin metadatos C2PA y con un `<path>` por color. Los originales están en `_referencias/avo-originales/`. La carpeta va en minúsculas (`avo`), porque en un servidor real `Avo` ≠ `avo`.
- **Respuestas:** todo pasa por `getReply(mensaje)`, que devuelve `{ texto, tema }`. Hoy detecta palabras clave (sin tildes, con `\b` de inicio de palabra) y, si hay varios temas, gana el primero de `PRIORIDAD`: precio > caso > proceso > automatiza > convierte > atrae > general > saludo. Los textos salen solo de lo que ya dice la landing (regla de no inventar cifras).
- **Para conectar la API de Claude:** reemplazar solo el interior de `getReply` por un `fetch` a un servidor propio que guarde la clave. La clave **nunca** va en `avo.js`, porque el navegador la expone.
- **WhatsApp:** cada tema usa el mismo mensaje prellenado que el botón equivalente de la landing (objeto `WHATSAPP`). El botón fijo del chat cambia al tema de la última respuesta.
- **Proyectos:** la respuesta `caso` resume los dos proyectos y lleva el enlace "Ver los proyectos" a `#proyectos`. Su mensaje de WhatsApp es genérico ("vi sus proyectos…").
- **Precios:** la respuesta `precio` describe los dos planes, el "desde $350" y Clientes Fundadores, y lleva el enlace "Ver los planes" a `#planes` (objeto `ENLACES`, por tema).
- **No tapar botones:** un `IntersectionObserver` vigila la franja inferior derecha (104px); si un `.btn--primary` o una `.flecha` de la página pasa por ahí, Avo se aparta (`.is-ducked`).
- **No tapar la cinta:** mientras `.hero__sentinel` está visible (página arriba del todo), `avo.js` mide si la cinta (`.ribbon__band`) choca con el botón y, si choca, lo sube lo justo (`.is-elevado` + `--avo-elevar`, midiendo con `offsetTop` sin el transform).
- **Estados (personaje de videojuego):** una tabla `ESTADOS` en `avo.js` define cara, animación, duración y prioridad de cada estado (espera, durmiendo, atento, saludando, contento, aplastar, celebrando, bailando, pensando). Todo cambio pasa por `cambiarEstado(nombre, forzar)`, que consulta `puedeCambiar(actual, nuevo)`. El JS solo escribe `data-estado`, `data-anim` y `data-fx` en `.avo`; el movimiento vive en `avo.css`, siempre con `steps(1, end)` y en múltiplos de `--avo-px` (1 pixel del dibujo = 1.5px). Solo se usan las 5 caras existentes: no se dibujan nuevas.
- **Efectos:** la capa `.avo-fx` (dentro del botón y del círculo del avatar) tiene los tres puntitos y las Z en SVG pixel art, en `--texto`, con `pointer-events: none`.
- **Dormir:** tras 30 s sin actividad. Los listeners de actividad (`mousemove`, `scroll`, `touchstart`…) son `passive` y solo guardan la hora; un chequeo cada segundo decide si dormir.
- **Accesibilidad:** `role="dialog"`, el foco no se escapa del chat abierto, Escape cierra y devuelve el foco a Avo, `role="log"` anuncia los mensajes y lo que escribe el usuario se inserta siempre con `textContent`. Con movimiento reducido solo cambian las caras (el parpadeo sí sigue); los puntitos y las Z se ven quietos, y el panel abre y cierra con un fundido de 180 ms (`avo.js` espera esos mismos 180 ms antes de ocultarlo).
- **Probarlo:** los `IntersectionObserver` no avisan si el navegador no dibuja (panel oculto, o Edge headless con `--virtual-time-budget`). Hay que probar con una ventana visible o manejando Edge por el protocolo de depuración.

## Imágenes y carpetas que no son del sitio

- Las capturas de los proyectos (`img/canal-silver-*.jpg`, `img/distrito507-*.jpg`) quedaron sin uso: desde las animaciones v2, Proyectos no lleva imágenes.
- `_herramientas/og-image.html` es la plantilla de 1200×630 para `img/og-image.jpg` (la imagen que se ve al compartir el link). **Pendiente:** todavía tiene la marca navy anterior; hay que rehacerla con la identidad v2 y regenerar el JPG.
- `_referencias/` guarda capturas y la referencia del rediseño. Ambas carpetas con `_` están excluidas en `robots.txt` y no forman parte del sitio (`_referencias/` además está en `.gitignore`).

## SEO

**Dirección actual del sitio: https://avosolutions.netlify.app. Nunca usar avorasolutions.com, que pertenece a otra empresa.**

El dominio propio todavía **no está comprado**. La dirección actual se repite en `canonical`, `og:url`, `og:image`, el bloque JSON-LD, `robots.txt` y `sitemap.xml`: cuando se defina el dominio real, se actualizan todos juntos. Los datos de contacto (teléfono, email) también aparecen en el JSON-LD, el footer y los CTA. `theme-color` es `#0B0B0C`.
