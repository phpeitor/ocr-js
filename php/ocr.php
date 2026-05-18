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
header('Content-Type: application/json');

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
              ->lang('spa', 'eng');

    $response = [
        'version' => $ocr->version(),
        'ocr_output' => $ocr->run()
    ];

    //unlink($imagePath);
    echo json_encode($response);
} catch (Exception $e) {
    echo json_encode(['error' => 'Error procesando OCR', 'message' => $e->getMessage()]);
}