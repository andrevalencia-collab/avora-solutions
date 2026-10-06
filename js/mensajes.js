/* AVORA Solutions · mensajes prellenados de WhatsApp.
   Todos los mensajes viven SOLO aquí. Los enlaces del HTML llevan data-wa="clave"
   y un href sin texto (https://wa.me/50763288742) por si este archivo no carga:
   al cargar, este archivo les agrega el mensaje. Avo (js/avo.js) usa los mismos.

   Formato de cada mensaje (lo arma la función mensaje()):
     ¡Hola AVORA! 👋
     Una línea con lo que quiere la persona.
     (línea en blanco)
     3 o 4 campos para llenar, cada uno con su emoji y terminado en dos puntos.
   Emojis permitidos: 👋 📌 🏢 💬 🕐 📲. Máximo 6 líneas con texto. */
(() => {
  const NUMERO = '50763288742';

  const NOMBRE = '📌 Mi nombre:';
  const NEGOCIO = '🏢 Mi negocio:';
  const PAGINA = '📲 ¿Ya tengo página? Escribe el link:';

  const mensaje = (quiero, campos) => ['¡Hola AVORA! 👋', quiero, '', ...campos].join('\n');

  // Cada botón o enlace usa una clave distinta, así se sabe de dónde vino el mensaje
  const MENSAJES = {
    // Botón principal "Agenda una llamada" (header, portada y cierre)
    llamada: mensaje('Quiero agendar una llamada para hablar de mi negocio.', [
      NOMBRE,
      NEGOCIO,
      '💬 Lo que busco (más clientes, página web o automatizar mi atención):',
      '🕐 Mejores días y horas para la llamada:',
    ]),
    // Enlace "o escríbenos por WhatsApp" (portada y cierre) y footer
    escribir: mensaje('Quiero conocer más sobre sus servicios.', [
      NOMBRE,
      NEGOCIO,
      '💬 Lo que me gustaría mejorar:',
    ]),

    // Servicios
    atrae: mensaje('Quiero que más personas conozcan mi negocio en redes sociales.', [
      NOMBRE,
      NEGOCIO,
      '📲 Mi Instagram o página actual:',
    ]),
    convierte: mensaje('Me interesa una página web para mi negocio.', [
      NOMBRE,
      NEGOCIO,
      PAGINA,
    ]),
    automatiza: mensaje('Quiero automatizar la atención de mi negocio.', [
      NOMBRE,
      NEGOCIO,
      '💬 ¿Por dónde me escriben hoy mis clientes?:',
    ]),

    // Proyectos ("Quiero algo así")
    'proyecto-canal-silver': mensaje('Vi el caso de Canal Silver y quiero algo así para mi negocio.', [
      NOMBRE,
      NEGOCIO,
      PAGINA,
    ]),
    'proyecto-distrito-507': mensaje('Vi el proyecto de Distrito 507 y quiero una página así para mi marca.', [
      NOMBRE,
      '🏢 Mi marca:',
      PAGINA,
    ]),

    // Planes
    'plan-web': mensaje('Me interesa el plan Web + Automatización.', [
      NOMBRE,
      NEGOCIO,
      PAGINA,
    ]),
    'plan-medida': mensaje('Quiero agendar una evaluación para el plan A tu medida.', [
      NOMBRE,
      NEGOCIO,
      '🕐 Mejores días y horas para la evaluación:',
    ]),
  };

  // encodeURIComponent convierte tildes, emojis y saltos de línea (%0A) para la URL
  const enlace = (clave) => `https://wa.me/${NUMERO}?text=${encodeURIComponent(MENSAJES[clave])}`;

  document.querySelectorAll('a[data-wa]').forEach((a) => {
    if (MENSAJES[a.dataset.wa]) a.href = enlace(a.dataset.wa);
    else console.error(`Falta el mensaje de WhatsApp "${a.dataset.wa}" en js/mensajes.js`);
  });

  window.AVORA_WHATSAPP = { MENSAJES, enlace };
})();
