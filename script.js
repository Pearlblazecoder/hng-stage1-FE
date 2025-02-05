const colors = ["red", "blue", "green", "yellow", "purple", "orange"];
        let targetColor = "";
        let score = 0;

        function startNewGame() {
            targetColor = colors[Math.floor(Math.random() * colors.length)];
            document.getElementById("colorBox").style.backgroundColor = targetColor;
            document.getElementById("gameStatus").innerText = "";
            generateColorOptions();
        }

        function generateColorOptions() {
            const colorOptionsContainer = document.getElementById("colorOptions");
            colorOptionsContainer.innerHTML = "";
            
            colors.forEach((color, index) => {
                const button = document.createElement("button");
                button.classList.add("color-option");
                button.style.backgroundColor = color;
                button.setAttribute("data-testid", "colorOption");
                button.onclick = () => checkGuess(color);
                colorOptionsContainer.appendChild(button);
                
                setTimeout(() => {
                    button.classList.add("show");
                }, index * 300);
            });
        }

        function checkGuess(selectedColor) {
            let message = "";
            if (selectedColor === targetColor) {
                score++;
                message = "Correct!";
            } else {
                message = "Wrong! Try again.";
            }
            document.getElementById("score").innerText = score;
            showModal(message);
        }

        function showModal(message) {
            document.getElementById("modalMessage").innerText = message;
            document.getElementById("modalOverlay").style.display = "block";
            document.getElementById("resultModal").style.display = "block";
        }

        function closeModal() {
            document.getElementById("modalOverlay").style.display = "none";
            document.getElementById("resultModal").style.display = "none";
        }

        startNewGame();
