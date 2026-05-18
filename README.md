## OCR Tesseract JS/PHP

[![forthebadge](https://forthebadge.com/badges/made-with-javascript.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/badges/built-with-love.svg)](https://www.linkedin.com/in/drphp/)

Proyecto de ejemplo para extraer texto de imágenes usando Tesseract.js en el navegador y un backend PHP opcional.

[![Video](https://img.youtube.com/vi/MvApx7EaTu0/0.jpg)](https://www.youtube.com/watch?v=MvApx7EaTu0)

[![Video Demo](https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube)](https://www.youtube.com/watch?v=MvApx7EaTu0)


## Características principales:
- Demo cliente con `index.html` que usa `tesseract.js` para OCR en el navegador.
- Endpoints PHP en `php/` para procesamiento o subida de imágenes (`php/ocr.php`).
- Ejemplos de CSS en `css/` y JavaScript en `js/`.

## Requisitos
- Navegador moderno (Chrome, Firefox, Edge).
- Para el procesamiento server-side: PHP 7.4+ y, si se usa la librería nativa, Tesseract instalado en el sistema (`tesseract` en PATH).
- Composer si necesita instalar dependencias PHP (ya existe `vendor/` en el repo).

## Instalación rápida
1. Clonar el repositorio:
```bash
git clone https://github.com/phpeitor/ocr-js.git
cd ocr-js
```
2. Instalar dependencias PHP si es necesario:
```bash
composer install
```

## Uso
- Abrir `index.html` directamente en el navegador para probar la demo (recomendado arrancar desde un servidor local para evitar restricciones de CORS/archivos).
- Si usa Apache (por ejemplo XAMPP/Apache local), colocar el proyecto en la carpeta pública y acceder vía `http://localhost/ocr-js/index.html`.
- Para probar el backend PHP con el servidor interno de PHP:
```bash
php -S localhost:8000
# luego abrir http://localhost:8000/index.html en el navegador
```

## Estructura relevante
- `index.html` — demo e interfaz.
- `css/` — estilos (no incluir CSS inline en vistas).
- `js/` — scripts cliente (incluye `tesseract.js`, `ocr.js`, `script.js`).
- `php/ocr.php` — ejemplo de endpoint PHP para recibir imágenes y devolver resultado.
- `vendor/` — dependencias PHP (Composer).

## Notas importantes
- Si el servidor PHP llama a Tesseract nativo, asegúrese de que el binario `tesseract` esté instalado y accesible.
- Validar y sanitizar imágenes subidas antes de procesar (mimetype, tamaño máximo, extensiones permitidas).
- No confíe en OCR para datos sensibles sin validación adicional.

## Licencia y contacto
- Ver archivos de licencia en el repo o contactar al mantenedor.
