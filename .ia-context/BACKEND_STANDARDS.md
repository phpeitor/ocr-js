# Estándares Backend — Endpoint PHP de OCR

Estos estándares aplican a `php/ocr.php` y complementan
`.ia-context/REGLAS_DESARROLLO.md`. El backend es PHP nativo: actualmente no
hay API REST genérica, base de datos, autenticación ni framework.

## Flujo existente

- El frontend envía una solicitud `POST` multipart al campo `image`.
- El endpoint guarda temporalmente la imagen en `php/resources/`, crea una
  instancia de `thiagoalessio/tesseract_ocr\TesseractOCR`, ejecuta los idiomas
  `spa` y `eng`, y devuelve JSON.
- `vendor/autoload.php` se obtiene desde la raíz. Si no existe, la instalación
  requerida es `composer install`.
- El binario `tesseract` debe estar instalado y disponible en `PATH` para el
  modo PHP.

## Validación y archivos

- Rechazar métodos distintos de `POST` con un código HTTP adecuado.
- Validar `$_FILES['image']`, el código de error de subida, el tamaño máximo
  (5 MB por defecto), el MIME detectado por el servidor y las extensiones
  permitidas: `jpg`, `jpeg`, `png` y `webp`.
- No confiar en el nombre, extensión o MIME enviado por el cliente.
- Generar el nombre temporal con un identificador impredecible y usar una
  ruta construida por el servidor; nunca procesar una ruta proporcionada por
  el usuario.
- Crear el directorio temporal con permisos restringidos y eliminar el archivo
  mediante `finally`, incluso si Tesseract falla.

## Respuestas y errores

- Enviar siempre `Content-Type: application/json; charset=utf-8`.
- Usar códigos HTTP coherentes: `400` para entrada inválida, `405` para método
  no permitido y `500` para fallos internos o de OCR.
- Mantener los errores útiles para el frontend sin revelar trazas, rutas,
  configuración ni detalles internos.
- No devolver el mensaje completo de excepciones de Tesseract en producción.
- Escapar correctamente cualquier texto que se incorpore a una respuesta JSON.

## Verificación

- Seguir PSR-12 y ejecutar `php -l php/ocr.php` tras cambios.
- Comprobar tanto respuestas exitosas como ausencia de archivo, archivo
  inválido, archivo demasiado grande y fallo del binario `tesseract`.
