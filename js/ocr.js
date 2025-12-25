let croppie;
let originalImageURL;

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
        data[i] = avg;
        data[i + 1] = avg;
        data[i + 2] = avg;
    }
    ctx.putImageData(imageData, 0, 0);

    const outputImg = document.createElement('img');
    outputImg.src = canvas.toDataURL();
    return outputImg;
}

function verificarPalabrasClave(texto) {
    const palabrasClave = ['DNI', 'DOCUMENTO', 'IDENTIDAD', 'NACIONAL'];
    for (let i = 0; i < palabrasClave.length; i++) {
        if (texto.includes(palabrasClave[i])) {
            return true;
        }
    }
    return false;
}

document.getElementById('fileInput').addEventListener('change', function (e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        if (croppie) {
            croppie.destroy();
        }

        const croppieContainer = document.getElementById('croppieContainer');
        const outputImgContainer = document.getElementById('outputImgContainer');

        originalImageURL = e.target.result;

        croppie = new Croppie(croppieContainer, {
            viewport: { width: 200, height: 200, type: 'square' },
            boundary: { width: 300, height: 300 }
        });

        const image = new Image();
        image.onload = function () {
            croppie.bind({ url: originalImageURL });
            document.getElementById('cropButton').style.display = 'block';
        };
        image.src = originalImageURL;
    };

    reader.readAsDataURL(file);
});

document.getElementById('cropButton').addEventListener('click', function () {
    croppie.result({ type: 'blob', size: 'viewport' }).then(function (result) {
        const image = new Image();
        image.onload = function () {

            const blackAndWhiteImage = convertToBlackAndWhite(image);

            const outputImgContainer = document.getElementById('outputImgContainer');
            outputImgContainer.innerHTML = '';
            outputImgContainer.appendChild(blackAndWhiteImage);


            Tesseract.recognize(
                blackAndWhiteImage,
                'eng',
                { logger: m => console.log(m) }
            ).then(({ data: { text } }) => {
                document.getElementById('output').textContent = text;
                const contienePalabrasClave = verificarPalabrasClave(text);

                const mensajeElement = document.createElement('div');
                mensajeElement.textContent = contienePalabrasClave ? "El texto contiene palabras clave" : "El texto no contiene palabras clave";
                mensajeElement.style.color = contienePalabrasClave ? 'blue' : 'red';
                document.getElementById('output').appendChild(mensajeElement);

            });
        };
        image.src = URL.createObjectURL(result);
    });
});