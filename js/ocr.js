let croppie;
let originalImageURL;

/* =========================
   UTILIDADES
========================= */

function convertToBlackAndWhite(image) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = data[i + 1] = data[i + 2] = avg;
    }

    ctx.putImageData(imageData, 0, 0);

    const img = document.createElement('img');
    img.src = canvas.toDataURL('image/png');
    img.className = 'max-w-full mx-auto';

    return img;
}

function verificarPalabrasClave(texto) {
    const palabrasClave = ['DNI', 'DOCUMENTO', 'IDENTIDAD', 'NACIONAL'];
    return palabrasClave.some(p => texto.toUpperCase().includes(p));
}

function getOcrMode() {
    return document.querySelector('input[name="ocrMode"]:checked').value;
}

async function runOcrPhp(blob) {
    const formData = new FormData();
    formData.append('image', blob, 'image.png');

    const response = await fetch('ocr.php', {
        method: 'POST',
        body: formData
    });

    return await response.json();
}

/* =========================
   CARGA DE IMAGEN
========================= */

document.getElementById('fileInput').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
        if (croppie) croppie.destroy();

        originalImageURL = reader.result;

        const croppieContainer = document.getElementById('croppieContainer');
        croppieContainer.innerHTML = '';

        croppie = new Croppie(croppieContainer, {
            viewport: { width: 200, height: 200, type: 'square' },
            boundary: { width: 300, height: 300 },
            showZoomer: true,
            enableZoom: true,
            mouseWheelZoom: 'ctrl'
        });

        // 🔑 esperar a que la imagen cargue
        const image = new Image();
        image.onload = () => {
            croppie.bind({ url: originalImageURL });
            document.getElementById('cropButton').classList.remove('hidden');
        };
        image.src = originalImageURL;
    };

    reader.readAsDataURL(file);
});

/* =========================
   RECORTAR Y ANALIZAR
========================= */

document.getElementById('cropButton').addEventListener('click', async () => {
    const output = document.getElementById('output');
    output.textContent = 'Procesando OCR...';

    const blob = await croppie.result({
        type: 'blob',
        size: 'viewport',
        format: 'png'
    });

    const image = new Image();
    image.onload = async () => {

        const bwImage = convertToBlackAndWhite(image);

        const outputImgContainer = document.getElementById('outputImgContainer');
        outputImgContainer.innerHTML = '';
        outputImgContainer.appendChild(bwImage);

        const mode = getOcrMode();
        let text = '';

        if (mode === 'js') {
            const result = await Tesseract.recognize(
                bwImage.src,
                'eng',
                { logger: m => console.log(m) }
            );
            text = result.data.text;
             document.getElementById('ocrVersion').textContent = 'OCR ejecutado localmente Tesseract.js';
        }

        if (mode === 'php') {
            const response = await runOcrPhp(blob);
            text = response.ocr_output || 'Error OCR PHP';
            if (response.version) {
                document.getElementById('ocrVersion').textContent = `OCR ejecutado en servidor (${response.version})`;
            }
        }

        output.textContent = text;

        const ok = verificarPalabrasClave(text);
        const badge = document.createElement('div');
        badge.textContent = ok
            ? '✔ Palabras clave detectadas'
            : '✖ No se detectaron palabras clave';

        badge.className = ok
            ? 'mt-3 bg-emerald-500 px-3 py-1 rounded-full text-xs'
            : 'mt-3 bg-red-500 px-3 py-1 rounded-full text-xs';

        output.appendChild(badge);
    };

    image.src = URL.createObjectURL(blob);
});
