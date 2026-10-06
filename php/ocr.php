<?php
// Comprobar que el autoload existe
$autoloadPath = __DIR__ . '/../vendor/autoload.php';
if (!file_exists($autoloadPath)) {
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Autoload no encontrado. Ejecuta composer install en la raíz del proyecto.']);
    exit;
}

require_once $autoloadPath;

use Dotenv\Dotenv;
use thiagoalessio\TesseractOCR\TesseractOCR;

$projectRoot = dirname(__DIR__);
$envFile = $projectRoot . '/.env';
if (is_file($envFile)) {
    Dotenv::createImmutable($projectRoot)->safeLoad();
}

header('Content-Type: application/json; charset=utf-8');

function resolveTesseractExecutable(): string
{
    $configuredPath = $_ENV['TESSERACT_PATH'] ?? getenv('TESSERACT_PATH');
    if ($configuredPath && is_file($configuredPath)) {
        return $configuredPath;
    }

    return 'tesseract';
}

function configuredOcrLanguages(): array
{
    $value = $_ENV['OCR_LANGUAGES'] ?? getenv('OCR_LANGUAGES') ?: 'spa,eng';
    $languages = array_filter(array_map('trim', explode(',', $value)));

    return $languages ?: ['spa', 'eng'];
}

if (!isset($_FILES['image'])) {
    echo json_encode(['error' => 'No image uploaded']);
    exit;
}

$imagePath = tempnam(sys_get_temp_dir(), 'ocr_');
if ($imagePath === false) {
    http_response_code(500);
    echo json_encode(['error' => 'No se pudo crear un archivo temporal para OCR']);
    exit;
}

if (!move_uploaded_file($_FILES['image']['tmp_name'], $imagePath)) {
    unlink($imagePath);
    http_response_code(500);
    echo json_encode(['error' => 'No se pudo mover el archivo subido. Revisar permisos de carpeta.']);
    exit;
}

try {
    $ocr = (new TesseractOCR($imagePath))
              ->executable(resolveTesseractExecutable())
              ->lang(...configuredOcrLanguages());

    $response = [
        'version' => $ocr->version(),
        'ocr_output' => $ocr->run()
    ];

    echo json_encode($response);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'No se pudo procesar la imagen con OCR']);
} finally {
    if (is_file($imagePath)) {
        unlink($imagePath);
    }
}