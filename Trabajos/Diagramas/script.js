function showPopup(popupId) {
    document.getElementById(popupId).style.display = 'block';
}

function closePopup(popupId) {
    document.getElementById(popupId).style.display = 'none';
}

function submitTemaFoda() {
    const tema = document.getElementById('tema-foda').value;

    if (!tema) {
        alert('Por favor, ingresa un tema o problemática.');
        return;
    }

    fetch('http://127.0.0.1:5000/generar-preguntas-foda', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tema: tema })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error('Error al generar preguntas:', data.error);
            return;
        }

        // Actualiza los labels con las preguntas
        document.getElementById('label-fortalezas').textContent = data.fortalezas;
        document.getElementById('label-oportunidades').textContent = data.oportunidades;
        document.getElementById('label-debilidades').textContent = data.debilidades;
        document.getElementById('label-amenazas').textContent = data.amenazas;

        // Muestra el contenedor de preguntas y activa el botón de generar diagrama
        document.getElementById('tema-container').style.display = 'none';
        document.getElementById('preguntas-container').style.display = 'block';
        document.getElementById('generate-diagram-button').disabled = false;
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function generateFoda() {
    const fortalezas = document.getElementById('fortalezas').value;
    const debilidades = document.getElementById('debilidades').value;
    const oportunidades = document.getElementById('oportunidades').value;
    const amenazas = document.getElementById('amenazas').value;

    fetch('http://127.0.0.1:5000/procesar-respuestas-foda', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            fortalezas: fortalezas,
            debilidades: debilidades,
            oportunidades: oportunidades,
            amenazas: amenazas
        })
    })
    .then(response => response.json())
    .then(data => {
        // Mostrar los puntos clave en el diagrama FODA
        actualizarDiagrama('fortalezas-list', data.fortalezas_clave);
        actualizarDiagrama('oportunidades-list', data.oportunidades_clave);
        actualizarDiagrama('debilidades-list', data.debilidades_clave);
        actualizarDiagrama('amenazas-list', data.amenazas_clave);

        // Mostrar el popup del diagrama FODA
        document.getElementById('tema-container').style.display = 'none';
        document.getElementById('preguntas-container').style.display = 'none';
        document.getElementById('diagrama-container').style.display = 'block';
        document.getElementById('titulo').style.display = 'none';
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function submitTemaCatwda() {
    const tema = document.getElementById('tema-catwda').value;

    if (!tema) {
        alert('Por favor, ingresa un tema o problemática.');
        return;
    }

    fetch('http://127.0.0.1:5000/generar-preguntas-catwda', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tema: tema })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        if (data.error) {
            console.error('Error al generar preguntas:', data.error);
            return;
        }

        // Actualiza los labels con las preguntas
        document.getElementById('label-clientes').textContent = data.clientes;
        document.getElementById('label-actores').textContent = data.actores;
        document.getElementById('label-transformaciones').textContent = data.transformaciones;
        document.getElementById('label-weltanschaung').textContent = data.weltanschaung;
        document.getElementById('label-dueño').textContent = data.dueño;
        document.getElementById('label-ambiente').textContent = data.ambiente;

        // Muestra el contenedor de preguntas y activa el botón de generar diagrama
        document.getElementById('tema-container-catwda').style.display = 'none';
        document.getElementById('preguntas-container-catwda').style.display = 'block';
        document.getElementById('generate-diagram-button-catwda').disabled = false;
    })
    .catch(error => {
        console.error('Error:', error);
    });

    console.log('Enviando tema:', tema);
}

function generateCatwda() {
    var respuestas = {
        clientes: document.getElementById('clientes').value,
        actores: document.getElementById('actores').value,
        transformaciones: document.getElementById('transformaciones').value,
        weltanschaung: document.getElementById('weltanschaung').value,
        dueño: document.getElementById('dueño').value,
        ambiente: document.getElementById('ambiente').value
    };

    fetch('http://127.0.0.1:5000/procesar-respuestas-catwda', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(respuestas)
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('clientes-text').innerText = data.clientes_clave.join('\n');
        document.getElementById('actores-text').innerText = data.actores_clave.join('\n');
        document.getElementById('transformaciones-text').innerText = data.transformaciones_clave.join('\n');
        document.getElementById('weltanschaung-text').innerText = data.weltanschaung_clave.join('\n');
        document.getElementById('dueño-text').innerText = data.dueño_clave.join('\n');
        document.getElementById('ambiente-text').innerText = data.ambiente_clave.join('\n');

        document.getElementById('tema-container-catwda').style.display = 'none';
        document.getElementById('preguntas-container-catwda').style.display = 'none';
        document.getElementById('diagrama-container-catwda').style.display = 'block';
        document.getElementById('titulo-catwda').style.display = 'none';
    })
    .catch(error => console.error('Error:', error));
}

let preguntasCausas = [];
let causas = [];
let subcausas = [];
let currentCausaIndex = 0;

function submitTemaIshikawa() {
    const tema = document.getElementById('tema-ishikawa').value;

    fetch('http://127.0.0.1:5000/generar-preguntas-ishikawa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tema })
    })
    .then(response => response.json())
    .then(data => {
        preguntasCausas = data.preguntasCausas;
        mostrarSiguientePreguntaCausa();
    })
    .catch(error => console.error('Error al generar preguntas:', error));
}

function mostrarSiguientePreguntaCausa() {
    if (currentCausaIndex < preguntasCausas.length) {
        document.getElementById('pregunta-causa').textContent = preguntasCausas[currentCausaIndex];

        // Ocultar el contenedor del tema y mostrar los contenedores de preguntas
        const temaContainer = document.getElementById('tema-container-ishikawa');
        const preguntasContainer = document.getElementById('preguntas-container-ishikawa');
        const preguntaCausaContainer = document.getElementById('pregunta-causa-container');
        const preguntaSubcausasContainer = document.getElementById('pregunta-subcausas-container');

        if (temaContainer) temaContainer.style.display = 'none';
        if (preguntasContainer) preguntasContainer.style.display = 'block';
        if (preguntaCausaContainer) preguntaCausaContainer.style.display = 'block';
        if (preguntaSubcausasContainer) preguntaSubcausasContainer.style.display = 'none';

        // Limpiar los campos de texto
        document.getElementById('causa').value = ''; 
        document.getElementById('subcausa').value = ''; 
    } else {
        // Si se han generado todas las preguntas, mostrar el botón de generar diagrama
        const generarDiagramaBtn = document.getElementById('boton-generar-diagrama');
        const preguntaCausaContainer = document.getElementById('pregunta-causa-container');
        const preguntaSubcausasContainer = document.getElementById('pregunta-subcausas-container');

        if (generarDiagramaBtn) generarDiagramaBtn.style.display = 'block';
        if (preguntaCausaContainer) preguntaCausaContainer.style.display = 'none';
        if (preguntaSubcausasContainer) preguntaSubcausasContainer.style.display = 'none';
    }
}

function submitCausa() {
    const causa = document.getElementById('causa').value;

    fetch('http://127.0.0.1:5000/generar-subcausa-pregunta-ishikawa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ causa })
    })
    .then(response => response.json())
    .then(data => {
        causas.push(causa);
        document.getElementById('pregunta-subcausas').textContent = data.preguntaSubcausa;
        document.getElementById('pregunta-causa-container').style.display = 'none';
        document.getElementById('pregunta-subcausas-container').style.display = 'block';
    })
    .catch(error => console.error('Error al generar subcausa:', error));
}

function submitSubcausas() {
    const subcausa = document.getElementById('subcausa').value;

    // Asegúrate de que se haya ingresado una subcausa antes de continuar
    if (subcausa.trim() === '') {
        alert('Por favor, ingresa una subcausa.');
        return;
    }

    subcausas.push(subcausa.split(/\n/));

    currentCausaIndex++;
    mostrarSiguientePreguntaCausa();
}

function generateIshikawa() {
    document.getElementById('preguntas-container-ishikawa').style.display = 'none';
    document.getElementById('diagrama-container').style.display = 'block';

    // Aquí se actualiza la UI con las causas y subcausas almacenadas
    for (let i = 0; i < causas.length; i++) {
        const categoriaElem = document.getElementById(`categoria${i + 1}`);
        if (categoriaElem) {
            categoriaElem.textContent = resumenCausas[i];  // Usa el resumen en lugar de la causa completa
        } else {
            console.error(`Elemento con ID categoria${i + 1} no encontrado.`);
        }

        const subcat = subcausas[i];
        for (let j = 0; j < subcat.length; j++) {
            const subcategoriaElem = document.getElementById(`subcategoria${i + 1}-${j + 1}`);
            if (subcategoriaElem) {
                subcategoriaElem.textContent = subcat[j];
            } else {
                console.error(`Elemento con ID subcategoria${i + 1}-${j + 1} no encontrado.`);
            }
        }
    }
}

let preguntasSombreros = {};
let respuestasSombreros = {};
let sombreros = ['blanco', 'rojo', 'negro', 'amarillo', 'verde', 'azul'];

function submitTemaSeissombrero() {
    const tema = document.getElementById('tema-seissombrero').value;

    fetch('http://127.0.0.1:5000/generar-preguntas-seissombrero', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tema })
    })
    .then(response => response.json())
    .then(data => {
        preguntasSombreros = data;
        mostrarPreguntasSombrero();
    })
    .catch(error => console.error('Error al generar preguntas:', error));
}

function mostrarPreguntasSombrero() {
    const preguntasContainer = document.getElementById('preguntas-seissombrero');
    preguntasContainer.innerHTML = ''; // Limpiar contenido previo

    sombreros.forEach(sombrero => {
        // Crear elementos para cada pregunta y textarea
        const div = document.createElement('div');
        div.innerHTML = `
            <label for="${sombrero}">${preguntasSombreros[sombrero]}</label>
            <textarea id="textarea-${sombrero}" name="${sombrero}" rows="2"></textarea>
        `;
        preguntasContainer.appendChild(div);
    });

    document.getElementById('tema-container-seissombrero').style.display = 'none';
    document.getElementById('preguntas-container-seissombrero').style.display = 'block';
    document.getElementById('generate-diagram-button-seissombrero').disabled = false;
}

function generateSeissombrero() {
    const respuestas = {};
    sombreros.forEach(sombrero => {
        respuestas[sombrero] = document.getElementById(`textarea-${sombrero}`).value;
    });

    fetch('http://127.0.0.1:5000/procesar-respuestas-seissombrero', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(respuestas)
    })
    .then(response => response.json())
    .then(data => {
        // Actualiza el diagrama con los puntos clave
        sombreros.forEach(sombrero => {
            const puntos = data[`${sombrero}_clave`];
            document.getElementById(`${sombrero}-text`).innerHTML = puntos.map(punto => `<li>${punto}</li>`).join('');
        });
        document.getElementById('preguntas-container-seissombrero').style.display = 'none';
        document.getElementById('diagrama-container-seissombrero').style.display = 'block';
    })
    .catch(error => console.error('Error al procesar respuestas:', error));
}

let causasPareto = [];
let resumenesPareto = [];  // Para almacenar los títulos clave
let preguntasCausasPareto = [];
let frecuenciasPareto = [];
let currentCausaIndexPareto = 0;

function mostrarSiguientePreguntaCausaPareto() {
    if (currentCausaIndexPareto < preguntasCausasPareto.length) {
        document.getElementById('pregunta-causa-pareto').textContent = preguntasCausasPareto[currentCausaIndexPareto];
        document.getElementById('tema-container-pareto').style.display = 'none';
        document.getElementById('preguntas-container-pareto').style.display = 'block';
        document.getElementById('pregunta-causa-container-pareto').style.display = 'block';
        document.getElementById('pregunta-frecuencia-container-pareto').style.display = 'none';
    } else {
        document.getElementById('generate-diagram-button-pareto').style.display = 'block';
    }
}

function submitTemaPareto() {
    const tema = document.getElementById('tema-pareto').value;

    fetch('http://127.0.0.1:5000/generar-preguntas-pareto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tema })
    })
    .then(response => response.json())
    .then(data => {
        preguntasCausasPareto = data.preguntasCausas;
        mostrarSiguientePreguntaCausaPareto();
    })
    .catch(error => console.error('Error al generar preguntas:', error));
}

function submitCausaPareto() {
    const causa = document.getElementById('causa-pareto').value.trim();

    if (!causa) {
        console.error('La causa está vacía, no se puede enviar.');
        return;
    }

    fetch('http://127.0.0.1:5000/generar-pregunta-frecuencia-pareto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ causa })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error en la respuesta del servidor: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        causasPareto.push(causa);  
        resumenesPareto.push(data.resumenCausa);  

        document.getElementById('pregunta-frecuencia-pareto').textContent = data.preguntaFrecuencia;
        document.getElementById('pregunta-causa-container-pareto').style.display = 'none';
        document.getElementById('pregunta-frecuencia-container-pareto').style.display = 'block';
        document.getElementById('causa-pareto').value = '';
    })
    .catch(error => console.error('Error al generar la pregunta de frecuencia:', error));
}

function submitFrecuenciaPareto() {
    const frecuencia = document.getElementById('frecuencia-pareto').value.trim();

    if (!frecuencia) {  
        console.error('La frecuencia está vacía, no se puede enviar.');
        return;
    }

    frecuenciasPareto.push(parseInt(frecuencia));  

    document.getElementById('pregunta-frecuencia-container-pareto').style.display = 'none';
    document.getElementById('frecuencia-pareto').value = '';  

    currentCausaIndexPareto++;  

    if (currentCausaIndexPareto < preguntasCausasPareto.length) {
        mostrarSiguientePreguntaCausaPareto();  
    } else {
        document.getElementById('generate-diagram-button-pareto').style.display = 'block';
    }
}

function generatePareto() {
    document.getElementById('preguntas-container-pareto').style.display = 'none';
    document.getElementById('diagrama-container-pareto').style.display = 'block';

    const ctx = document.getElementById('paretoChart').getContext('2d');
    
    const sortedData = resumenesPareto.map((resumen, index) => ({ resumen, frecuencia: frecuenciasPareto[index] }))
                                      .sort((a, b) => b.frecuencia - a.frecuencia);

    const labels = sortedData.map(data => data.resumen);
    const data = sortedData.map(data => data.frecuencia);
    
    const cumulativeData = data.reduce((acc, value) => {
        if (acc.length > 0) {
            acc.push(acc[acc.length - 1] + value);
        } else {
            acc.push(value);
        }
        return acc;
    }, []).map(value => (value / data.reduce((a, b) => a + b)) * 100);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Frecuencia',
                data: data,
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                yAxisID: 'y',
            }, {
                label: 'Acumulativo (%)',
                data: cumulativeData,
                type: 'line',
                fill: false,
                borderColor: 'rgba(255, 99, 132, 1)',
                yAxisID: 'y1'
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Frecuencia'
                    }
                },
                y1: {
                    position: 'right',
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Acumulativo (%)'
                    },
                    grid: {
                        drawOnChartArea: false, // Para evitar que la cuadrícula se superponga
                    }
                }
            }
        }
    });
    document.getElementById('titulo-pareto').style.display = 'none';
    document.getElementById('generate-diagram-button-pareto').style.display = 'none';
}

function closePopupPareto(popupId) {
    // Oculta el pop-up
    document.getElementById(popupId).style.display = 'none';

    // Resetea el canvas o oculta el contenedor del diagrama
    if (popupId === 'popup-form-pareto') {
        const diagramContainer = document.getElementById('diagrama-container-pareto');
        diagramContainer.style.display = 'none';  // Oculta el contenedor

        // Opcional: si deseas resetear el canvas para borrar el gráfico
        const ctx = document.getElementById('paretoChart').getContext('2d');
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);  // Borra el contenido del canvas
    }
}

function actualizarDiagrama(elementId, puntosClave) {
    const lista = document.getElementById(elementId);
    lista.innerHTML = '';  // Limpia cualquier contenido previo

    puntosClave.forEach(punto => {
        const li = document.createElement('li');
        li.textContent = punto;
        lista.appendChild(li);
    });
}