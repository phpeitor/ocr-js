# Roles de trabajo asistido — Proyecto OCR

Antes de cambiar el repositorio, seguir `.ia-context/REGLAS_DESARROLLO.md` y
confirmar el comportamiento existente en `README.md`, `index.html`, `js/` y
`php/`. Este repositorio es una demo OCR pequeña; no asumir una arquitectura
REST, framework PHP, base de datos o sistema de autenticación que no exista.

## Análisis

- Identificar si el cambio afecta al OCR del navegador, al endpoint PHP o solo a
  la interfaz.
- Mantener separados los activos: HTML en `index.html`, CSS en `css/`,
  JavaScript en `js/` y backend en `php/`.
- Verificar que las rutas relativas funcionen tanto desde Apache como desde el
  servidor integrado de PHP.

## Frontend y OCR en cliente

- Mantener la interfaz de prueba en `index.html`.
- Centralizar en `js/ocr.js` la carga de imágenes, el recorte, el
  preprocesamiento y la ejecución de Tesseract.js.
- Mantener la animación visual en `js/script.js` y evitar mezclarla con la
  lógica OCR.
- Usar `Croppie` para el recorte existente y no introducir dependencias nuevas
  sin documentarlas.

## Backend PHP

- Mantener el endpoint de OCR en `php/ocr.php`, usando PHP nativo y la
  dependencia disponible mediante Composer.
- Validar método HTTP, archivo recibido, MIME, extensión y tamaño antes de
  mover o procesar una carga.
- Usar nombres aleatorios para temporales, permisos restrictivos y eliminar el
  archivo al terminar el procesamiento.
- Responder JSON consistente y no exponer trazas, rutas internas ni mensajes
  sensibles.

## QA y entrega

- Ejecutar `php -l php/ocr.php` cuando se modifique PHP.
- Probar manualmente ambos modos de OCR con imágenes válidas, inválidas y de
  tamaño excesivo cuando se cambie el flujo de carga.
- Revisar consola del navegador y permisos del directorio temporal del sistema
  en pruebas del modo servidor.
- Actualizar `README.md` si cambian instalación, requisitos, rutas o uso.
