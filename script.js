const colorBox = document.getElementById('colorBox');
const colorOptions = document.querySelectorAll('[data-testid="colorOption"]');
const gameStatus = document.querySelector('[data-testid="gameStatus"]');
const scoreDisplay = document.getElementById('score');
const newGameButton = document.getElementById('newGameButton');

let targetColor;
let score = 0;
let gameOver = false;

function generateRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
}

function adjustShade(color, factor) {
    const rgbValues = color.match(/\d+/g);
    let r = parseInt(rgbValues[0]);
    let g = parseInt(rgbValues[1]);
    let b = parseInt(rgbValues[2]);

    r = Math.round(r * factor);
    g = Math.round(g * factor);
    b = Math.round(b * factor);

    r = Math.max(0, Math.min(255, r));
    g = Math.max(0, Math.min(255, g));
    b = Math.max(0, Math.min(255, b));

    return `rgb(${r}, ${g}, ${b})`;
}

function rgbStringToValues(colorString) {
    const rgbValues = colorString.match(/\d+/g);
    return {
        r: parseInt(rgbValues[0]),
        g: parseInt(rgbValues[1]),
        b: parseInt(rgbValues[2]),
    };
}

function startGame() {
    targetColor = generateRandomColor();
    colorBox.style.backgroundColor = targetColor;

    const shades = [];
    const numShades = colorOptions.length;

    // Generate shades with a wider range and ensure target is distinct
    const shadeFactors = new Set(); // Use a Set to prevent duplicates

    while (shadeFactors.size < numShades - 1) { // Generate enough unique factors
      shadeFactors.add(parseFloat((0.25 + (Math.random() * 0.75)).toFixed(2))); // Wider range, 2 decimal places
    }

    const shadeFactorsArray = Array.from(shadeFactors).sort(() => Math.random() - 0.5); // Convert to array and shuffle

    for (let i = 0; i < numShades - 1; i++) {
        shades.push(adjustShade(targetColor, shadeFactorsArray[i]));
    }

    const targetIndex = Math.floor(Math.random() * numShades);
    shades.splice(targetIndex, 0, targetColor);

    colorOptions.forEach((button, index) => {
        button.style.backgroundColor = shades[index];
        button.removeEventListener('click', checkGuess);
        button.addEventListener('click', checkGuess);
    });

    gameStatus.textContent = "";
    gameOver = false;
}

function checkGuess(event) {
    if (gameOver) return;

    const guessedColor = event.target.style.backgroundColor;
    const targetRGB = rgbStringToValues(targetColor);
    const guessedRGB = rgbStringToValues(guessedColor);

    if (guessedRGB.r === targetRGB.r && guessedRGB.g === targetRGB.g && guessedRGB.b === targetRGB.b) {
        gameStatus.textContent = "Correct! 👍";
        gameStatus.style.color = "green";
        score+=5;
        scoreDisplay.textContent = score;
        setTimeout(startGame, 500);
    } else {
        gameOver = true;

        // Create the modal
        const modal = document.createElement('div');
        modal.classList.add('modal');
        modal.innerHTML = `
            <div class="modal-content">
                <h2>Game Over!</h2>
                <p>Your score is: ${score}</p>
                <button id="newGameButtonModal">New Game</button>
            </div>
        `;
        document.body.appendChild(modal);

        // Add event listener to the modal's new game button
        const newGameButtonModal = document.getElementById('newGameButtonModal');
        newGameButtonModal.addEventListener('click', function() {
            score = 0;
            scoreDisplay.textContent = score;
            startGame();
            modal.remove(); // Remove the modal
        });

        // Remove click listeners from color options
        colorOptions.forEach(button => {
            button.removeEventListener('click', checkGuess);
        });

        gameStatus.textContent = "Incorrect. Game Over! 👎";
        gameStatus.style.color = "red";
    }
}
newGameButton.addEventListener('click', function() {
    score = 0;
    scoreDisplay.textContent = score;
    startGame();
});

startGame();