/* Genera los íconos derivados de la cabeza de Avo (img/favicon.svg):
   - img/favicon-32.png      → favicon de 32px
   - img/apple-touch-icon.png → ícono de 180px para iPhone, con fondo #0B0B0C

   Uso, desde la raíz del proyecto, con un servidor estático corriendo en el puerto 8765
   (python -m http.server 8765) y Playwright instalado:
     node _herramientas/generar-imagenes.mjs
   La imagen para compartir (img/og-avora-v3.png) no sale de aquí: la hizo André aparte. */
import { chromium } from 'playwright';

const BASE = 'http://localhost:8765';
const navegador = await chromium.launch();

// Íconos: la cabeza de Avo en pixel art, sin suavizado
const icono = async (archivo, lado, dibujo, fondo) => {
  const p = await navegador.newPage({ viewport: { width: lado, height: lado } });
  await p.setContent(`<body style="margin:0;background:${fondo};display:grid;place-items:center;height:${lado}px">
    <img src="${BASE}/img/favicon.svg" width="${dibujo}" height="${dibujo}" style="image-rendering:pixelated;display:block"></body>`);
  await p.waitForLoadState('networkidle');
  await p.screenshot({ path: archivo, omitBackground: fondo === 'transparent' });
};
await icono('img/favicon-32.png', 32, 32, 'transparent');
await icono('img/apple-touch-icon.png', 180, 160, '#0B0B0C');   // 160 = 4 px por pixel del dibujo

await navegador.close();
console.log('Listo: img/favicon-32.png, img/apple-touch-icon.png');
