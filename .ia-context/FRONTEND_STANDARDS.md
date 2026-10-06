# Estándares Frontend — Demo OCR

Estos estándares aplican a `index.html`, `css/` y `js/`, y complementan
`.ia-context/REGLAS_DESARROLLO.md`. La interfaz es una demo que permite elegir
entre OCR local con Tesseract.js y OCR remoto mediante `php/ocr.php`.

## Estructura y dependencias

- Mantener HTML, CSS y JavaScript separados; no agregar estilos ni scripts
  inline.
- `index.html` contiene la vista y carga, en este orden funcional, GSAP,
  Croppie, la animación, Tesseract.js y `ocr.js`.
- `js/ocr.js` contiene la lógica de selección de archivo, recorte con Croppie,
  conversión a escala de grises, ejecución OCR y render de resultados.
- `js/script.js` contiene únicamente la animación SVG de fondo.
- Reutilizar las dependencias locales existentes (`js/tesseract.js`,
  `js/croppie.min.js`, `js/gsap-latest-beta.min.js`) y los estilos de `css/`.

## Interacción y seguridad

- Aceptar imágenes desde el selector del navegador, pero recordar que la
  validación real de cargas corresponde al backend.
- Mostrar estados de espera, resultado y error de forma clara.
- Insertar el texto OCR con `textContent`, nunca como HTML no confiable.
- No guardar tokens, credenciales ni datos de la imagen en logs o destinos
  externos.
- Mantener el endpoint relativo `./php/ocr.php` para que funcione bajo Apache
  y con `php -S`.

## Verificación

- Probar los modos `js` y `php` con imágenes nítidas y distintos formatos.
- Revisar la consola del navegador, errores de red y la visualización de la
  respuesta JSON.
- Confirmar que la interfaz siga siendo usable en escritorio y móvil.
