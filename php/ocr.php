<?php
// Comprobar que el autoload existe
$autoloadPath = __DIR__ . '/../vendor/autoload.php';
if (!file_exists($autoloadPath)) {
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Autoload no encontrado. Ejecuta composer install en la raíz del proyecto.']);
    exit;
}

require_once $autoloadPath;
use thiagoalessio\TesseractOCR\TesseractOCR;
header('Content-Type: application/json; charset=utf-8');

function resolveTesseractExecutable(): string
{
    $configuredPath = getenv('TESSERACT_PATH');
    if ($configuredPath && is_file($configuredPath)) {
        return $configuredPath;
    }

    if (PHP_OS_FAMILY === 'Windows') {
        $windowsPath = 'C:\\Program Files\\Tesseract-OCR\\tesseract.exe';
        if (is_file($windowsPath)) {
            return $windowsPath;
        }
    }

    return 'tesseract';
}

if (!isset($_FILES['image'])) {
    echo json_encode(['error' => 'No image uploaded']);
    exit;
}

$uploadDir = __DIR__ . '/resources/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

$imagePath = $uploadDir . uniqid() . '.png';
if (!move_uploaded_file($_FILES['image']['tmp_name'], $imagePath)) {
    echo json_encode(['error' => 'No se pudo mover el archivo subido. Revisar permisos de carpeta.']);
    exit;
}

try {
    $ocr = (new TesseractOCR($imagePath))
              ->executable(resolveTesseractExecutable())
              ->lang('spa', 'eng');

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