/* Captura el sitio de Distrito 507 para la sección Proyectos.
   Uso (necesita Node y Playwright):  node _herramientas/capturar-distrito507.mjs
   Genera, ya optimizadas en JPG:
   - img/distrito507-desktop.jpg  → computadora, 1440×900 (proporción 16:10 de la laptop)
   - img/distrito507-movil.jpg    → celular de 390px a 1.5x: 585×1266 (proporción 390:844 del marco) */
import { chromium } from 'playwright';

const URL = 'https://distrito507.netlify.app';
const CAPTURAS = [
  { archivo: 'img/distrito507-desktop.jpg', width: 1440, height: 900, scale: 1, isMobile: false },
  { archivo: 'img/distrito507-movil.jpg', width: 390, height: 844, scale: 1.5, isMobile: true },
];

const browser = await chromium.launch();
for (const c of CAPTURAS) {
  const page = await browser.newPage({
    viewport: { width: c.width, height: c.height },
    deviceScaleFactor: c.scale,
    isMobile: c.isMobile,
    hasTouch: c.isMobile,
  });
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);   // deja terminar las animaciones de entrada
  await page.screenshot({ path: c.archivo, type: 'jpeg', quality: 78 });
  console.log('Listo:', c.archivo);
  await page.close();
}
await browser.close();
