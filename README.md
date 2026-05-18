# OCR Tesseract JS | PHP

[![forthebadge](https://forthebadge.com/badges/made-with-javascript.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/badges/built-with-love.svg)](https://www.linkedin.com/in/drphp/)

Aplicación de ejemplo para extraer texto desde imágenes con dos estrategias de OCR:

- OCR en el navegador con Tesseract.js.
- OCR en servidor con PHP y la librería thiagoalessio/tesseract_ocr.

El proyecto está pensado como una base práctica: interfaz simple, flujo de recorte con Croppie, preprocesamiento visual de la imagen y salida clara del texto detectado.

[![Video](https://img.youtube.com/vi/MvApx7EaTu0/0.jpg)](https://www.youtube.com/watch?v=MvApx7EaTu0)

[![Video Demo](https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube)](https://www.youtube.com/watch?v=MvApx7EaTu0)

## Resumen Ejecutivo

La aplicación permite cargar una imagen, recortarla, procesarla y extraer texto con retroalimentación visual durante la ejecución. El usuario puede elegir entre procesamiento local o procesamiento en servidor:

- Modo JS: útil para pruebas rápidas y ejecución sin backend.
- Modo PHP: útil cuando se quiere delegar la extracción al servidor o centralizar el procesamiento.

## Arquitectura

Flujo general:

1. El usuario selecciona una imagen.
2. La interfaz carga el recorte interactivo con Croppie.
3. El usuario ajusta el área de interés y lanza el análisis.
4. La imagen se preprocesa para mejorar el contraste visual.
5. Se ejecuta OCR en el navegador o en PHP.
6. Se muestra el texto detectado y el estado del procesamiento.

Componentes principales:

- `index.html`: vista principal y contenedor de la experiencia.
- `js/ocr.js`: lógica de carga, recorte, preprocesamiento, OCR y render de resultados.
- `js/script.js`: lógica visual auxiliar de la interfaz.
- `php/ocr.php`: endpoint para OCR en servidor.
- `css/style.css`: estilos personalizados y animaciones de la interfaz.

## Requisitos

- Navegador moderno: Chrome, Firefox o Edge.
- PHP 7.4 o superior para el modo servidor.
- Composer para dependencias PHP.
- Tesseract instalado en el sistema si se usa OCR en servidor.

## Instalación

Clonar el repositorio:

```bash
git clone https://github.com/phpeitor/ocr-js.git
cd ocr-js
```

Instalar dependencias PHP cuando sea necesario:

```bash
composer install
```

Si el proyecto se va a ejecutar en Apache local, colóquelo dentro del directorio público correspondiente y acceda desde el navegador.

## Ejecución local

### Opción 1: servidor PHP integrado

```bash
php -S localhost:8000
```

Abrir luego:

```text
http://localhost:8000/index.html
```

### Opción 2: Apache local

Si usa Laragon o Apache nativo, copie el proyecto en la carpeta pública y acceda a:

```text
http://localhost/ocr-js/
```

## Uso funcional

1. Seleccione una imagen.
2. Ajuste el recorte según el área de texto de interés.
3. Elija el modo de OCR:
	- OCR en JS para ejecutar en el navegador.
	- OCR en PHP para delegar el procesamiento al servidor.
4. Pulse Recortar y analizar.
5. Revise el texto detectado y el indicador de palabras clave.

## Estructura del proyecto

```text
index.html
css/
js/
php/
resources/
vendor/
```

Directorios clave:

- `css/`: estilos y animaciones visuales.
- `js/`: scripts de interfaz y OCR.
- `php/`: lógica del endpoint backend.
- `php/resources/`: archivos temporales subidos por el backend.
- `resources/files/`: archivos generados o persistidos por flujos del cliente.
- `vendor/`: dependencias administradas con Composer.

## Configuración y operación

- El endpoint PHP espera una imagen en el campo `image`.
- El backend guarda temporalmente el archivo antes de invocar Tesseract.
- El repositorio incluye un `.gitignore` para evitar versionar dependencias y archivos generados.
- Si el OCR falla en servidor, verifique permisos de escritura en `php/resources/` y que el binario `tesseract` esté disponible en `PATH`.

## Consideraciones técnicas

- La calidad del OCR depende de la imagen de entrada, el recorte y el contraste.
- Para mejores resultados, use imágenes nítidas, bien iluminadas y con texto suficientemente grande.
- El preprocesamiento visual del cliente ayuda a la inspección, pero no sustituye una imagen de buena calidad.
- Si va a procesar material sensible, agregue validaciones adicionales de negocio y privacidad.

## Troubleshooting

- Error de autoload en PHP: ejecute `composer install` en la raíz del proyecto.
- Error al mover archivos: revise permisos de escritura en `php/resources/`.
- Sin texto detectado: pruebe con un recorte más preciso o una imagen de mayor resolución.
- Resultado inconsistente: compare ambos modos, JS y PHP, para identificar si el problema está en el navegador, en el backend o en la calidad de la imagen.

## Contribución

Si va a extender el proyecto:

- Mantenga JavaScript en `js/` y CSS en `css/`.
- Documente nuevos flujos o endpoints en este README.
- Evite introducir lógica de negocio directamente en la vista.
- Añada validaciones para cargas de archivos y errores de OCR.

## Licencia y contacto

Consulte el repositorio o contacte al mantenedor para detalles de licencia y soporte.
