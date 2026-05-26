// 1. Registro del Service Worker (El motor de la PWA)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('Service Worker registrado con éxito.', reg))
            .catch(err => console.error('Error al registrar el Service Worker.', err));
    });
}

// 2. Lógica del formulario
const form = document.getElementById('astrology-form');
const resultsSection = document.getElementById('results-section');
const chartData = document.getElementById('chart-data');
const exportBtn = document.getElementById('export-btn');

form.addEventListener('submit', (e) => {
    // Evitamos que la página se recargue al mandar el formulario
    e.preventDefault();

    // Agarramos los datos ingresados
    const name = document.getElementById('name').value;
    
    // Mockeamos una respuesta para testear la interfaz. 
    // Imaginemos que le sacamos la carta a Gauss o Chef para ver si anda:
    const mockData = `
        <p><strong>Sol:</strong> Leo en Casa 5</p>
        <p><strong>Luna:</strong> Piscis en Casa 12</p>
        <p><strong>Ascendente:</strong> Escorpio</p>
        <p><em>(Datos de prueba simulando la carta de ${name})</em></p>
    `;

    // Inyectamos la info y mostramos la sección
    chartData.innerHTML = mockData;
    resultsSection.style.display = 'block';
});

// 3. Lógica para exportar a la IA
exportBtn.addEventListener('click', () => {
    // Extraemos solo el texto limpio sin las etiquetas de HTML
    const cleanText = chartData.innerText;
    const textToCopy = 'Hola, esta es mi info astrológica: ' + cleanText + ' Me hacés una devolución de los aspectos más importantes?';
    
    navigator.clipboard.writeText(textToCopy)
        .then(() => alert('Datos copiados. Listos para pegar en tu IA de confianza.'))
        .catch(err => console.error('Error al copiar: ', err));
});
