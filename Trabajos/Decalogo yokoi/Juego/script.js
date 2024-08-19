const words = [
    "EMPATIA", "DISCIPLINA", "TRABAJO EN EQUIPO", "AUTENTICIDAD", "INNOVACION",
    "PRODUCTIVIDAD", "INTEGRIDAD", "RESILIENCIA", "PROPOSITO DE VIDA", "RESPONSABILIDAD"
];

let currentWord = "";
let guessedLetters = [];
let wrongAttempts = 0;
let maxAttempts = 6;
let currentLevel = 1;

const wordContainer = document.getElementById('word-container');
const lettersContainer = document.getElementById('letters');
const hangmanCanvas = document.getElementById('hangman-canvas');
const statusContainer = document.getElementById('status-container');
const levelElement = document.getElementById('level');
const restartBtn = document.getElementById('restart-btn');

const hangmanCtx = hangmanCanvas.getContext('2d');

// Dibujar el ahorcado
function drawHangman(attempts) {
    hangmanCtx.clearRect(0, 0, hangmanCanvas.width, hangmanCanvas.height);
    hangmanCtx.lineWidth = 4;
    hangmanCtx.strokeStyle = '#d4e2e4';
    
    // Dibujar el poste
    hangmanCtx.beginPath();
    hangmanCtx.moveTo(10, 190);
    hangmanCtx.lineTo(190, 190);
    hangmanCtx.moveTo(50, 190);
    hangmanCtx.lineTo(50, 20);
    hangmanCtx.lineTo(130, 20);
    hangmanCtx.lineTo(130, 40);
    hangmanCtx.stroke();

    // Dibujar partes según el número de intentos incorrectos
    if (attempts > 0) {
        hangmanCtx.beginPath();
        hangmanCtx.arc(130, 60, 20, 0, Math.PI * 2); // Cabeza
        hangmanCtx.stroke();
    }
    if (attempts > 1) {
        hangmanCtx.moveTo(130, 80);
        hangmanCtx.lineTo(130, 130); // Cuerpo
        hangmanCtx.stroke();
    }
    if (attempts > 2) {
        hangmanCtx.moveTo(130, 90);
        hangmanCtx.lineTo(100, 110); // Brazo izquierdo
        hangmanCtx.stroke();
    }
    if (attempts > 3) {
        hangmanCtx.moveTo(130, 90);
        hangmanCtx.lineTo(160, 110); // Brazo derecho
        hangmanCtx.stroke();
    }
    if (attempts > 4) {
        hangmanCtx.moveTo(130, 130);
        hangmanCtx.lineTo(110, 170); // Pierna izquierda
        hangmanCtx.stroke();
    }
    if (attempts > 5) {
        hangmanCtx.moveTo(130, 130);
        hangmanCtx.lineTo(150, 170); // Pierna derecha
        hangmanCtx.stroke();
    }
}

// Inicializar el juego
function initGame() {
    currentWord = words[currentLevel - 1];
    guessedLetters = [];
    wrongAttempts = 0;
    levelElement.textContent = currentLevel;
    wordContainer.innerHTML = currentWord.split('').map(letter => letter === ' ' ? ' ' : '_').join(' ');
    lettersContainer.innerHTML = '';
    statusContainer.textContent = '';

    // Crear botones de letras
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(letter => {
        const button = document.createElement('button');
        button.textContent = letter;
        button.addEventListener('click', () => handleGuess(letter, button));
        lettersContainer.appendChild(button);
    });

    drawHangman(0);
}

// Manejar la selección de letras
function handleGuess(letter, button) {
    button.disabled = true;
    if (currentWord.includes(letter)) {
        guessedLetters.push(letter);
        updateWordDisplay();
        checkWin();
    } else {
        wrongAttempts++;
        drawHangman(wrongAttempts);
        if (wrongAttempts >= maxAttempts) {
            statusContainer.textContent = `Perdiste! La frase era: ${currentWord}`;
            disableAllButtons();
        }
    }
}

// Actualizar la palabra en pantalla
function updateWordDisplay() {
    wordContainer.innerHTML = currentWord.split('').map(letter => 
        guessedLetters.includes(letter) || letter === ' ' ? letter : '_').join(' ');
}

// Comprobar si se ganó el juego
function checkWin() {
    if (currentWord.split('').every(letter => letter === ' ' || guessedLetters.includes(letter))) {
        statusContainer.textContent = '¡Ganaste!';
        disableAllButtons();
        if (currentLevel < words.length) {
            currentLevel++;
            setTimeout(initGame, 2000);
        } else {
            statusContainer.textContent = '¡Completaste todos los niveles!';
        }
    }
}

// Deshabilitar todos los botones
function disableAllButtons() {
    document.querySelectorAll('.letters button').forEach(button => button.disabled = true);
}

// Reiniciar el juego
restartBtn.addEventListener('click', () => {
    currentLevel = 1;
    initGame();
});

initGame();
