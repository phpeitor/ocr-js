# OCR Tesseract 🔠

[![forthebadge](https://forthebadge.com/badges/made-with-javascript.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/badges/built-with-love.svg)](https://www.linkedin.com/in/drphp/)

[![Video](https://img.youtube.com/vi/MvApx7EaTu0/0.jpg)](https://www.youtube.com/watch?v=MvApx7EaTu0)

[![Video Demo](https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube)](https://www.youtube.com/watch?v=MvApx7EaTu0)

Aplicación de ejemplo para extraer texto desde imágenes con dos estrategias de OCR:

- OCR en el navegador con Tesseract.js.
- OCR en servidor con PHP y `thiagoalessio/tesseract_ocr`.

Incluye recorte con Croppie, preprocesamiento en escala de grises, búsqueda de
palabras clave configurables y una interfaz responsive con estilo Pixel Hack.

## Índice

- [Arquitectura](#arquitectura)
- [Requisitos](#requisitos)
- [Instalación rápida](#instalación-rápida)
- [Instalar Tesseract en Windows](#instalar-tesseract-en-windows)
- [Instalar Tesseract en Linux](#instalar-tesseract-en-linux)
- [Configurar el entorno](#configurar-el-entorno)
- [Ejecutar la aplicación](#ejecutar-la-aplicación)
- [Uso](#uso)
- [Verificación y pruebas](#verificación-y-pruebas)
- [Solución de problemas](#solución-de-problemas)

## Arquitectura

El flujo de OCR puede ejecutarse de dos formas:

1. El usuario selecciona una imagen y ajusta el recorte con Croppie.
2. El usuario escribe las palabras clave que quiere buscar, separadas por
   comas.
3. La imagen recortada se convierte a escala de grises.
4. El modo **JS LOCAL** ejecuta Tesseract.js en el navegador y no requiere
   PHP ni Tesseract instalado en el servidor.
5. El modo **PHP SERVER** envía la imagen a `php/ocr.php`, que ejecuta el
   binario Tesseract del sistema.
6. La imagen enviada se almacena solo temporalmente y se elimina al terminar.

Componentes:

| Archivo o directorio | Responsabilidad |
| --- | --- |
| `index.html` | Interfaz de usuario y selección del motor OCR |
| `css/` | Estilos de la interfaz |
| `js/ocr.js` | Carga, recorte, OCR y palabras clave |
| `js/script.js` | Animación visual de fondo |
| `js/tesseract.js` | Tesseract.js local |
| `php/ocr.php` | Endpoint PHP para OCR servidor |
| `.env` | Configuración local, no versionar |
| `vendor/` | Dependencias Composer, no versionar |

## Requisitos

Para ambos modos:

- Git.
- Navegador moderno: Chrome, Edge o Firefox.
- Composer 2.
- PHP 7.4 o superior. Se recomienda PHP 8.1+.

Solo para **PHP SERVER**:

- Tesseract OCR instalado.
- Datos de idioma `spa` y `eng`.
- Permiso de PHP/Apache para usar el directorio temporal del sistema.

## Instalación rápida

Clona el proyecto e instala las dependencias PHP:

```bash
git clone https://github.com/phpeitor/ocr-js.git
cd ocr-js
composer install
```

Crea la configuración local desde la plantilla:

```bash
copy .env.example .env
```

En Linux o macOS usa:

```bash
cp .env.example .env
```

Edita `.env` y confirma que `TESSERACT_PATH` apunta al ejecutable instalado.
El archivo `.env` está ignorado por Git; nunca subas credenciales ni rutas
privadas de producción.

## Instalar Tesseract en Windows

El paquete Composer no instala Tesseract. `thiagoalessio/tesseract_ocr` es
solo un wrapper PHP y necesita el ejecutable del sistema.

1. Descarga el instalador de Windows mantenido por UB Mannheim:
   <https://github.com/UB-Mannheim/tesseract/wiki>
2. Instálalo, preferentemente en:

   ```text
   C:\Program Files\Tesseract-OCR
   ```

3. Durante la instalación incluye los datos de idioma **Spanish** y
   **English**.
4. Abre una nueva PowerShell y verifica:

   ```powershell
   tesseract --version
   tesseract --list-langs
   ```

5. Debes ver `spa` y `eng` en la lista de idiomas.
6. Configura `.env` con una ruta compatible con dotenv:

   ```env
   TESSERACT_PATH="C:/Program Files/Tesseract-OCR/tesseract.exe"
   OCR_LANGUAGES=spa,eng
   ```

Si Apache no hereda el `PATH` de tu usuario, `TESSERACT_PATH` evita ese
problema. Reinicia Apache después de modificar `.env`.

## Instalar Tesseract en Linux

Sí, el proyecto funciona en Linux. PHP, Composer y Tesseract son multiplataforma;
solo cambia la instalación del binario y la ruta de configuración.

### Debian, Ubuntu y derivados

```bash
sudo apt update
sudo apt install -y tesseract-ocr tesseract-ocr-spa tesseract-ocr-eng
```

### Fedora, RHEL y derivados

```bash
sudo dnf install -y tesseract tesseract-langpack-spa tesseract-langpack-eng
```

### Arch Linux

```bash
sudo pacman -S tesseract tesseract-data-spa tesseract-data-eng
```

Verifica la instalación:

```bash
tesseract --version
tesseract --list-langs
```

En Linux normalmente basta con:

```env
TESSERACT_PATH=/usr/bin/tesseract
OCR_LANGUAGES=spa,eng
```

Si `tesseract` ya está en el `PATH` del proceso web, también puedes dejar
`TESSERACT_PATH` vacío y usar la resolución por defecto del endpoint.

## Configurar el entorno

La plantilla [`.env.example`](.env.example) contiene:

```env
APP_ENV=local
APP_DEBUG=false
TESSERACT_PATH="C:/Program Files/Tesseract-OCR/tesseract.exe"
OCR_LANGUAGES=spa,eng
OCR_MAX_FILE_SIZE=5242880
```

`APP_ENV` y `APP_DEBUG` quedan preparados para configuración futura. Los
idiomas usados por el endpoint se controlan con `OCR_LANGUAGES`. El límite
documentado por defecto es 5 MB; las validaciones de carga deben mantenerse
en el backend y no confiar únicamente en el navegador.

## Ejecutar la aplicación

### Servidor PHP integrado

Desde la raíz del proyecto:

```bash
php -S localhost:8000
```

Abre <http://localhost:8000/index.html>.

### Apache en Windows

Coloca el proyecto dentro del directorio público de Apache, por ejemplo:

```text
C:\Apache24\htdocs\ocr-js
```

Abre <http://localhost/ocr-js/>.

Después de instalar Tesseract o modificar `.env`, reinicia Apache para que el
proceso web tome la configuración actual.

## Uso

1. Pulsa **Seleccionar imagen**.
2. Ajusta el área de recorte con la imagen y la barra **ZOOM**.
3. Escribe términos separados por comas, por ejemplo:
   `DNI, nombre, fecha de nacimiento`.
4. Selecciona **JS LOCAL** o **PHP SERVER**.
5. Pulsa **RECORTAR Y ANALIZAR**.
6. Revisa el texto y las palabras clave encontradas.

La comparación de palabras clave ignora mayúsculas, minúsculas y acentos.

## Verificación y pruebas

Comprueba la sintaxis PHP:

```bash
php -l php/ocr.php
```

Comprueba la configuración Composer:

```bash
composer validate --no-check-publish
```

Para probar el endpoint PHP desde una terminal con el servidor activo:

```bash
curl -F "image=@resources/documento.jpg" \
  http://localhost:8000/php/ocr.php
```

En Windows PowerShell:

```powershell
curl.exe -F "image=@resources/documento.jpg" http://localhost:8000/php/ocr.php
```

Una respuesta correcta incluye `version` y `ocr_output`. El modo JS puede
probarse directamente desde la interfaz y no necesita endpoint PHP.

## Solución de problemas

### `composer.json` no encontrado

Ejecuta Composer desde la raíz del proyecto, donde existe `composer.json`:

```bash
cd C:\Apache24\htdocs\ocr-js
composer install
```

### `The command "tesseract" was not found`

Comprueba `tesseract --version`. Si funciona en la terminal pero falla desde
Apache, configura la ruta absoluta en `.env` y reinicia Apache:

```env
TESSERACT_PATH="C:/Program Files/Tesseract-OCR/tesseract.exe"
```

### Falta el idioma `spa`

Instala el paquete de idioma correspondiente a tu sistema operativo y confirma
su presencia con `tesseract --list-langs`.

### Error de autoload

Ejecuta:

```bash
composer install
```

No versiones `vendor/`; debe regenerarse desde `composer.lock`.

### No se detecta texto

Usa una imagen nítida, con buena iluminación y texto grande. Ajusta el recorte,
prueba escala de grises y compara los modos JS y PHP.

## Desarrollo y contribución

- Mantén CSS en `css/` y JavaScript en `js/`.
- No agregues lógica inline en `index.html`.
- Mantén la validación de archivos en el backend.
- Documenta cambios de instalación, endpoint o configuración en este README.
- Versiona `composer.json` y `composer.lock`, pero no `vendor/` ni `.env`.
- Ejecuta `php -l` en cada archivo PHP modificado.

## Seguridad y privacidad

Las imágenes enviadas al modo PHP se guardan temporalmente durante el OCR y se
eliminan al finalizar. No incluyas imágenes sensibles, secretos o credenciales
en el repositorio. En producción usa HTTPS, limita el tamaño de subida y
configura permisos adecuados para el servidor web.
