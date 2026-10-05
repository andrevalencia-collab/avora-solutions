/* AVORA Solutions · fondo animado de la portada ("GhostFibers" de React Bits).
   Recreado en JavaScript puro con WebGL2 directo, sin la librería ogl: el efecto
   solo dibuja un triángulo que cubre toda la pantalla y el shader hace el resto.
   Los colores se leen de las variables CSS de :root (paleta Deep Twilight).
   Si el navegador no tiene WebGL2, no se crea el canvas y queda el degradado
   estático de .hero__fondo (en css/styles.css). */
(() => {
  const contenedor = document.querySelector('.hero__fondo');
  if (!contenedor) return;

  // Ajustes del efecto. Los colores NO van aquí: salen de las variables CSS.
  const AJUSTES = {
    speed: 0.12,             // lento: acompaña al titular sin robarle atención
    scale: 2,
    rotation: -63.43,        // fibras inclinadas con la pendiente 0.5 del logo (90° − 26.57°)
    rotationSpeed: 0,        // sin giro continuo, para no perder el ángulo de marca
    layers: 4,
    waveAmplitude: 0.015,
    waveFrequency: 3,
    waveSpeed: 0.15,
    layerSpeed: 0.08,
    twist: 0.1,
    twistFrequency: 5,
    twistSpeed: 0.8,
    lineFrequency: 5,
    lineSpacing: 2,
    lineSharpness: 16,
    glowFalloff: 10,
    glowIntensity: 0.75,     // brillo ancho moderado
    brightness: 0.5,         // la zona más clara queda muy por debajo de --lavender
    blueBoost: 1,            // neutral: no altera los tonos de la marca
    vignette: 0.8,
    grain: 0.03
  };

  // Celular: 30 cuadros por segundo y densidad 0.75. Computadora: 60 y densidad 1.
  const modoCelular = window.matchMedia('(max-width: 899px), (pointer: coarse)');
  const rendimiento = () => (modoCelular.matches ? { fps: 30, dpr: 0.75 } : { fps: 60, dpr: 1 });

  // Centro del efecto, en unidades del shader (alto de pantalla = 2).
  // En computadora se corre a la derecha y en celular hacia abajo, lejos del texto.
  const centro = () => (modoCelular.matches ? [0, -0.8] : [1, 0.1]);

  const vertex = `#version 300 es
in vec2 position;

void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

  // Shader original de GhostFibers con cuatro cambios: el fondo fijo (backdrop)
  // llega como color (uBackdrop), el centro se puede mover (uCentro), ningún
  // píxel pasa del tono más claro de la paleta (uTope) y se quitó el modo claro.
  const fragment = `#version 300 es
precision highp float;

uniform vec2 uResolution;
uniform vec2 uCentro;
uniform float uTime;
uniform float uSpeed;
uniform float uScale;
uniform float uRotation;
uniform float uLayers;
uniform float uWaveAmplitude;
uniform float uWaveFrequency;
uniform float uWaveSpeed;
uniform float uLayerSpeed;
uniform float uTwist;
uniform float uTwistFrequency;
uniform float uTwistSpeed;
uniform float uLineFrequency;
uniform float uLineSpacing;
uniform float uLineSharpness;
uniform float uGlowFalloff;
uniform float uGlowIntensity;
uniform float uBrightness;
uniform float uBlueBoost;
uniform float uVignette;
uniform float uGrain;
uniform float uRotationSpeed;
uniform vec3 uLineColor;
uniform vec3 uGlowColor;
uniform vec3 uBackdrop;
uniform vec3 uTope;

out vec4 fragColor;

#define MAX_LAYERS 10

mat2 rotate2d(float angle) {
  float sine = sin(angle);
  float cosine = cos(angle);
  return mat2(cosine, -sine, sine, cosine);
}

float grainHash(vec2 point) {
  point = floor(point);
  float hash = 52.9829189 * fract(dot(point, vec2(0.065, 0.005)));
  return fract(hash);
}

float layeredGrain(vec2 fragmentPixel) {
  vec2 point = mod(fragmentPixel + vec2(uTime * 30.0, -uTime * 21.0), 1024.0);
  vec2 rotated = mat2(0.8, -0.5, 0.5, 0.8) * point;
  float grain = 0.0;
  grain += 0.40 * grainHash(rotated);
  grain += 0.25 * grainHash(rotated * 2.0 + 17.0);
  grain += 0.20 * grainHash(rotated * 4.0 + 47.0);
  grain += 0.10 * grainHash(rotated * 8.0 + 113.0);
  grain += 0.05 * grainHash(rotated * 16.0 + 191.0);
  return grain;
}

void main() {
  vec2 resolution = max(uResolution, vec2(1.0));
  vec2 uv = (2.0 * gl_FragCoord.xy - resolution) / resolution.y - uCentro;
  float time = uTime * uSpeed;
  vec3 centerTone = max(uLineColor * 0.85567 - uGlowColor * 0.06186, vec3(0.0));
  vec3 cloudTone = uLineColor * 0.19588 + uGlowColor * 0.2268;
  vec2 p = uv;
  p /= max(uScale, 0.05);
  p = rotate2d(radians(uRotation) + time * uRotationSpeed) * p;
  vec3 color = vec3(0.0);

  for (int index = 0; index < MAX_LAYERS; index++) {
    float fi = float(index) + 1.0;
    if (fi > uLayers) break;

    p += uWaveAmplitude * sin(p.yx * fi * uWaveFrequency + time * (uWaveSpeed + fi * uLayerSpeed));

    float radius = length(p);
    float polarAngle = atan(p.y, p.x);
    polarAngle += sin(radius * uTwistFrequency - time * uTwistSpeed + fi) * uTwist;
    p = vec2(cos(polarAngle), sin(polarAngle)) * radius;

    float lines = abs(sin(p.x * (uLineFrequency + fi * uLineSpacing) + sin(p.y * 3.0 + time)));
    lines = pow(max(0.0, 1.0 - lines), uLineSharpness);
    color += uLineColor * lines / fi;

    float glow = exp(-uGlowFalloff * abs(sin(p.x * 3.0 + time + fi)));
    color += uGlowColor * glow * uGlowIntensity / (fi * 2.0);
  }

  float center = exp(-2.2 * dot(uv, uv));
  color += centerTone * center;

  float cloud = exp(-1.5 * length(uv + vec2(sin(time * 0.3) * 0.25, cos(time * 0.25) * 0.18)));
  color += cloudTone * cloud;

  float vignette = 1.0 - smoothstep(0.35, 1.45, length(uv));
  color *= mix(1.0 - uVignette, 1.0, vignette);
  color = 1.0 - exp(-color * uBrightness);
  color.b *= uBlueBoost;

  vec3 outputColor = uBackdrop + color;

  float noise = (layeredGrain(gl_FragCoord.xy) - 0.5) * uGrain;
  outputColor = clamp(outputColor + noise, 0.0, 1.0);
  outputColor = min(outputColor, uTope);
  fragColor = vec4(outputColor, 1.0);
}
`;

  // "#00034a" → [0, 0.012, 0.29]. Si la variable falta o no es hex, devuelve null.
  const hexARgb = (hex) => {
    const valor = hex.trim().replace(/^#/, '');
    const completo = valor.length === 3 ? valor.replace(/./g, (c) => c + c) : valor;
    const m = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(completo);
    return m ? [1, 2, 3].map((i) => parseInt(m[i], 16) / 255) : null;
  };

  const raiz = getComputedStyle(document.documentElement);
  const colores = {
    uBackdrop: hexARgb(raiz.getPropertyValue('--navy')),
    uGlowColor: hexARgb(raiz.getPropertyValue('--royal')),
    uLineColor: hexARgb(raiz.getPropertyValue('--indigo')),
    uTope: hexARgb(raiz.getPropertyValue('--lavender'))
  };
  if (Object.values(colores).some((c) => !c)) return; // sin colores de marca, queda el degradado

  const canvas = document.createElement('canvas');
  canvas.className = 'hero__fibras';
  const gl = canvas.getContext('webgl2', {
    alpha: false,
    antialias: false,
    depth: false,
    powerPreference: 'low-power'
  });
  if (!gl) return; // sin WebGL2: queda el degradado estático

  const compilar = (tipo, fuente) => {
    const shader = gl.createShader(tipo);
    gl.shaderSource(shader, fuente);
    gl.compileShader(shader);
    return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
  };
  const vs = compilar(gl.VERTEX_SHADER, vertex);
  const fs = compilar(gl.FRAGMENT_SHADER, fragment);
  if (!vs || !fs) return;
  const programa = gl.createProgram();
  gl.attachShader(programa, vs);
  gl.attachShader(programa, fs);
  gl.bindAttribLocation(programa, 0, 'position');
  gl.linkProgram(programa);
  if (!gl.getProgramParameter(programa, gl.LINK_STATUS)) return;
  gl.useProgram(programa);

  // Un solo triángulo más grande que la pantalla: la cubre entera sin costura diagonal.
  gl.bindVertexArray(gl.createVertexArray());
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  const ubicacion = (nombre) => gl.getUniformLocation(programa, nombre);
  const uniforme = (nombre) => 'u' + nombre[0].toUpperCase() + nombre.slice(1);
  Object.entries(AJUSTES).forEach(([nombre, valor]) => gl.uniform1f(ubicacion(uniforme(nombre)), valor));
  Object.entries(colores).forEach(([nombre, rgb]) => gl.uniform3fv(ubicacion(nombre), rgb));
  const uTime = ubicacion('uTime');
  const uResolution = ubicacion('uResolution');
  const uCentro = ubicacion('uCentro');

  contenedor.prepend(canvas);

  let { fps, dpr } = rendimiento();
  let frameId = 0;
  let transcurrido = 0;
  let tiempoAnterior = 0;
  let ultimoCuadro = 0;
  let visible = true;
  let paginaVisible = !document.hidden;
  let contextoPerdido = false;
  const movimientoReducido = window.matchMedia('(prefers-reduced-motion: reduce)');

  const dibujar = () => {
    gl.uniform1f(uTime, transcurrido);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };
  // "animaciones-pausadas" la pone el botón de pausa de la cinta (js/main.js)
  const pausadoPorBoton = () => document.documentElement.classList.contains('animaciones-pausadas');
  const puedeAnimar = () =>
    visible && paginaVisible && !contextoPerdido && !movimientoReducido.matches && !pausadoPorBoton();
  const detener = () => {
    if (frameId) cancelAnimationFrame(frameId);
    frameId = 0;
  };

  const bucle = (ahora) => {
    frameId = 0;
    if (!puedeAnimar()) return;
    transcurrido += Math.min((ahora - tiempoAnterior) / 1000, 0.1);
    tiempoAnterior = ahora;
    // Limita los cuadros por segundo: dibuja solo si ya pasó el tiempo de un cuadro
    if (ahora - ultimoCuadro >= 1000 / fps - 0.5) {
      dibujar();
      ultimoCuadro = ahora;
    }
    frameId = requestAnimationFrame(bucle);
  };
  const iniciar = () => {
    if (!puedeAnimar() || frameId) return;
    tiempoAnterior = performance.now();
    frameId = requestAnimationFrame(bucle);
  };
  const actualizar = () => (puedeAnimar() ? iniciar() : detener());

  const ajustarTamano = () => {
    const { width, height } = contenedor.getBoundingClientRect();
    canvas.width = Math.max(1, Math.floor(width * dpr));
    canvas.height = Math.max(1, Math.floor(height * dpr));
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(uResolution, canvas.width, canvas.height);
    gl.uniform2fv(uCentro, centro());
    dibujar(); // con movimiento reducido, este es el cuadro fijo
  };

  new ResizeObserver(ajustarTamano).observe(contenedor);
  // Pausa automática: fuera de pantalla o con la pestaña oculta no se dibuja nada
  new IntersectionObserver(([entrada]) => {
    visible = entrada.isIntersecting;
    actualizar();
  }).observe(contenedor);
  document.addEventListener('visibilitychange', () => {
    paginaVisible = !document.hidden;
    actualizar();
  });
  movimientoReducido.addEventListener('change', () => {
    actualizar();
    dibujar();
  });
  // Pausa o reanuda con el botón; al pausar, el último cuadro queda quieto en pantalla
  document.addEventListener('animaciones:cambio', actualizar);
  modoCelular.addEventListener('change', () => {
    ({ fps, dpr } = rendimiento());
    ajustarTamano();
  });

  // Si el navegador libera la tarjeta gráfica, se quita el canvas y vuelve el degradado
  canvas.addEventListener('webglcontextlost', () => {
    contextoPerdido = true;
    detener();
    canvas.remove();
  });

  ajustarTamano();
  // El canvas aparece suave sobre el degradado cuando ya tiene su primer cuadro
  requestAnimationFrame(() => canvas.classList.add('is-ready'));
  iniciar();
})();
