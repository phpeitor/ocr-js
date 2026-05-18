# Reglas de Desarrollo — Proyecto OCR (Tesseract.js + PHP)

Objetivo

Mantener claridad, seguridad y consistencia en el desarrollo del proyecto OCR.

Reglas generales

1. Separar activos: todo CSS en `css/` y todo JavaScript en `js/`. No insertar CSS/JS inline en `index.html` o en vistas PHP.
2. Mantener `index.html` como demo y ejemplos de uso; la lógica de producción debe estar en `js/` y `php/`.
3. Usar Composer para dependencias PHP. Si `vendor/` no existe, ejecutar `composer install`.
4. Seguir PSR-12 para código PHP y buenas prácticas modernas (clases, nombres, excepciones).
5. Documentar nuevos endpoints o cambios relevantes en `README.md`.

Reglas de seguridad y manejo de archivos

1. Validar y sanitizar todas las imágenes subidas: comprobar `mimetype`, extensión permitida (`jpg`, `jpeg`, `png`, `webp`), y tamaño máximo (ej. 5 MB por defecto).
2. Renombrar archivos subidos con identificadores únicos (UUID/timestamp) y almacenar en carpeta temporal con permisos restringidos.
3. Escapar y validar cualquier entrada que llegue a `php/ocr.php` antes de procesarla con Tesseract.
4. No procesar archivos directamente desde rutas proporcionadas por el usuario sin validación previa.

Reglas para OCR y dependencias

1. Si se usa Tesseract nativo en el servidor, documentar la versión requerida y probar que `tesseract` está en `PATH`.
2. Manejar errores de OCR y devolver mensajes claros al frontend; no filtrar información sensible en mensajes de error.
3. Para grandes volúmenes o imágenes pesadas, implementar limits y colas en el backend; evitar bloquear el servidor con procesamiento síncrono.

Pruebas y calidad

1. Probar la demo manualmente con distintos tipos de imagen y tamaños.
2. Añadir scripts de validación estática cuando sea posible (linter para JS, php-cs-fixer o analizador PHP).
3. Antes de mergear PRs, revisar que no se añadan dependencias binarios sin documentar instalación (por ejemplo Tesseract system package).

Operativa local y despliegue

1. Para desarrollo local con Apache, colocar el proyecto en la carpeta pública y acceder vía `http://localhost/ocr-js/index.html`.
2. Para pruebas rápidas con PHP integrado:
```bash
php -S localhost:8000
```
3. Documentar cualquier requisito extra (por ejemplo paquetes apt/yum para instalar `tesseract` en servidores Linux).

Notas finales

Estas reglas son específicas para este repositorio OCR. Mantenga las reglas simples y específicas: cada PR que cambie el flujo de subida/procesamiento de imágenes debe incluir instrucciones de prueba y cambios en la documentación.
