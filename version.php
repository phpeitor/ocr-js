<?php
	require __DIR__ . '/vendor/autoload.php';
	use thiagoalessio\TesseractOCR\TesseractOCR;
	
	$version = (new TesseractOCR())->version();
    
    $ocr_output = (new TesseractOCR('resources/text.png'))->run();
    
    $response = array(
        'version' => $version,
        'ocr_output' => $ocr_output
    );
    
    $json_response = json_encode($response);
    
    echo $json_response;
?>