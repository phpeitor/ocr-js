<?php
require __DIR__ . '/vendor/autoload.php';
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
move_uploaded_file($_FILES['image']['tmp_name'], $imagePath);

$ocr = (new TesseractOCR($imagePath))
          ->lang('spa', 'eng');

$response = [
    'version' => $ocr->version(),
    'ocr_output' => $ocr->run()
];

unlink($imagePath); 
echo json_encode($response);