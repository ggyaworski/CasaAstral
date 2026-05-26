// 1. Registro del Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('Service Worker registrado con éxito.'))
            .catch(err => console.error('Error al registrar el Service Worker.', err));
    });
}

// 2. Lógica del formulario y la API
const form = document.getElementById('astrology-form');
const resultsSection = document.getElementById('results-section');
const chartData = document.getElementById('chart-data');
const exportBtn = document.getElementById('export-btn');
const generateBtn = document.getElementById('generate-btn');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const birthdate = document.getElementById('birthdate').value; 
    const birthtime = document.getElementById('birthtime').value; 
    
    // Desarmamos el texto para sacar números limpios
    const [year, month, day] = birthdate.split('-');
    const [hour, min] = birthtime.split(':');

    // Estructuramos el payload. Coordenadas fijas en Buenos Aires por ahora.
    const data = {
        day: parseInt(day),
        month: parseInt(month),
        year: parseInt(year),
        hour: parseInt(hour),
        min: parseInt(min),
        lat: -34.6037,
        lon: -58.3816,
        tzone: -3,
        house_type: "placidus",
        is_asteroids: "false"
    };

    // Tus credenciales y la ruta a la que le vamos a golpear la puerta
    const apiKey = 'ak-81826aee333e5370ec742c2ea20b0590322b9c0c';
    const apiUrl = 'https://api.astrologyapi.com/v1/western_horoscope';

    // Efecto visual para que parezca que está pensando
    const originalBtnText = generateBtn.innerText;
    generateBtn.innerText = 'Calculando posiciones planetarias...';
    generateBtn.disabled = true;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'x-astrologyapi-key': apiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`Error de conexión: ${response.status}`);
        }

        const result = await response.json();
        
        let htmlOutput = `<h3>Carta Natal de ${name}</h3><ul>`;
        
        // Iteramos sobre los planetas que nos devuelve el servidor
        if (result.planets) {
            result.planets.forEach(planet => {
                htmlOutput += `<li><strong>${planet.name}:</strong> en ${planet.sign} (Casa ${planet.house})</li>`;
            });
        } else {
            htmlOutput += `<li>No se encontraron datos de planetas.</li>`;
        }
        
        htmlOutput += `</ul><p><em>Nota: Se calculó usando las coordenadas de Buenos Aires.</em></p>`;

        chartData.innerHTML = htmlOutput;
        resultsSection.style.display = 'block';

    } catch (error) {
        console.error('Error en la API:', error);
        chartData.innerHTML = `<p style="color: #ff6b6b;">Hubo un problema comunicándose con el servidor astrológico. Fijate la consola por si es un tema de permisos.</p>`;
        resultsSection.style.display = 'block';
    } finally {
        generateBtn.innerText = originalBtnText;
        generateBtn.disabled = false;
    }
});

// 3. Lógica para exportar el texto limpio
exportBtn.addEventListener('click', () => {
    const cleanText = chartData.innerText;
    const textToCopy = `Hola, esta es mi info astrológica:\n${cleanText}\n\nMe hacés una devolución de los aspectos más importantes de mi carta?`;
    
    navigator.clipboard.writeText(textToCopy)
        .then(() => alert('Datos copiados con éxito, listos para pegar en la IA.'))
        .catch(err => console.error('Error al copiar: ', err));
});
