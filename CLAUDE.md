# CLAUDE.md

Este archivo le da contexto a Claude Code (claude.ai/code) para trabajar en este repositorio.

## Qué es este proyecto

Landing page (página de una sola sección de venta) de mi agencia de marketing digital **AVORA Solutions**, en Panamá.

- **Objetivo:** que el visitante agende una demo por WhatsApp al **+507 6328-8742** (`50763288742`). Todo en la página debe empujar hacia ese paso.
- **Lema:** "Atrae. Convierte. Automatiza."

## Marca

- **Colores base:** navy `#081444` (fondo oscuro) y hueso `#F2F3F7` (fondo claro / texto sobre oscuro).
- **Acento actual:** celeste `#3FC8F0` (`--sky`) en el tema oscuro y azul eléctrico `#2F6BFF` (`--electric`) en el tema claro. Están definidos como variables en `css/styles.css`.
- **Tipografía:** Archivo (Google Fonts), para todo el sitio.

## Reglas de contenido

- **No inventar cifras ni testimonios.** Nada de "+200 clientes", "300 % más ventas", reseñas o nombres de clientes que yo no haya dado. Si hace falta un dato, deja un marcador visible (por ejemplo `[CIFRA PENDIENTE]`) y avísame.
- Todo el texto visible, los comentarios del código y los nombres cercanos a las clases van en español (`lang="es-PA"`).

## Stack

Sitio estático simple: `index.html` + `css/styles.css` + `js/main.js`. Sin framework, sin bundler (herramienta que empaqueta código), sin `package.json`, sin tests ni linter (revisor automático de estilo).

## Cómo verlo

No hay paso de compilación. Abre `index.html` directo, o sirve la carpeta con un servidor estático (por ejemplo `python -m http.server`) para que las rutas y fuentes se comporten como en producción. Revisa siempre el diseño en ancho de celular (~390px) y con `prefers-reduced-motion: reduce` (ajuste del sistema para reducir animaciones): ambos son prioridad.

## Arquitectura

**Temas por variables.** `.theme-dark` y `.theme-light` solo redefinen variables CSS (`--bg`, `--fg`, `--muted`, `--line`, `--accent`, `--on-accent`, `--eyebrow`); los componentes leen esas variables y nunca escriben colores fijos. El tema oscuro usa `--sky` como acento y el claro usa `--electric`. En el claro, `--eyebrow` es navy porque el azul eléctrico no cumple contraste AA en texto pequeño. Una sección cambia de aspecto solo con agregarle la clase del tema (los pilares de Servicios alternan temas uno por uno).

**El motivo del "corte" diagonal.** Todo lo visual sale de la barra diagonal del logo: pendiente 0.5 (`--slope: 26.57deg`). Aparece en la línea SVG del hero, los separadores `.cut-top`, las esquinas recortadas de los botones, la animación `wipe` (clip-path), la línea del proceso y la imagen OG. Los nuevos elementos decorativos deben reutilizar este ángulo en vez de inventar otros.

**Animaciones de aparición (`data-reveal`).** Un script en el `<head>` agrega `.js` al `<html>`; los estados ocultos iniciales en CSS están todos bajo `.js [data-reveal…]`, así la página se ve completa sin JavaScript. `main.js` agrega `.is-visible` usando un solo `IntersectionObserver` (API del navegador que avisa cuando un elemento entra en pantalla). Variantes: `""` (aparecer/subir), `wipe`, `from-left`, `from-right`, `line`. El escalonado viene de un `style="--i:N"` en línea. Ojo: los elementos `wipe` empiezan con un clip-path de área cero y nunca "entran" en pantalla, por eso `main.js` observa a su **padre**; mantén los `wipe` dentro de un padre que ocupe espacio. Con movimiento reducido o sin IntersectionObserver, todo se muestra de inmediato.

**Sin listeners de scroll.** `main.js` usa a propósito solo IntersectionObserver y `resize`:
- `.hero__sentinel` activa `.site-header.is-solid` (header con fondo sólido).
- `.wa-float` (botón flotante de WhatsApp, solo en móvil) aparece solo cuando ni `.hero` ni `.final-cta` están en pantalla.
- Los pilares de Servicios usan `position: sticky` apilados; `main.js` calcula `--sticky-top` por pilar para que uno más alto que la pantalla se fije por su borde inferior (top negativo) y se lea completo antes de que el siguiente lo tape. Se recalcula al cambiar el tamaño y después de `document.fonts.ready`.

**Layout CSS.** Mobile-first (primero celular), un solo breakpoint (punto de cambio de diseño) en `min-width: 900px`, más unos pocos ajustes `max-width`. `styles.css` está dividido en secciones numeradas que coinciden con los comentarios `<!-- N · … -->` de `index.html` (1 Hero … 9 Footer).

**Los CTA son enlaces de WhatsApp** (`https://wa.me/50763288742?text=…`) con un mensaje precargado distinto según el contexto de cada botón. Al agregar un CTA (botón de llamada a la acción), escribe un mensaje que encaje con su contexto y codifícalo para URL (tildes incluidas, ej. `%C3%A1`). Los íconos son `<symbol>` SVG al final de `index.html`, usados con `<use href="#i-chat"/>`.

## Imágenes y carpetas que no son del sitio

- Los mockups del caso de estudio usan `img/canal-silver-desktop.jpg` y `img/canal-silver-movil.png`; cada `<img>` tiene un `onerror` que oculta todo su `.device` si falta el archivo (el PNG móvil todavía no está en `img/`).
- `_herramientas/og-image.html` es la plantilla de 1200×630 para `img/og-image.jpg` (la imagen que se ve al compartir el link), capturada con un navegador sin interfaz. Regenera el JPG si cambia la marca o el lema.
- `_referencias/` guarda capturas de referencia de diseño. Ambas carpetas con `_` están excluidas en `robots.txt` y no forman parte del sitio.

## SEO

El dominio todavía **no está comprado**; por ahora no hay que tocar nada de eso. El dominio provisional `https://avorasolutions.com/` se repite en `canonical`, `og:url`, `og:image`, el bloque JSON-LD, `robots.txt` y `sitemap.xml`: cuando se defina el dominio real, se actualizan todos juntos. Los datos de contacto (teléfono, email) también aparecen en el JSON-LD, el footer y los CTA.
