const canvas = document.getElementById("gameCanvas");
        const ctx = canvas.getContext("2d");
        const startButton = document.getElementById("startButton");
        const restartButton = document.getElementById("restartButton");
        const rewardImage = document.getElementById("rewardImage");
        const hiddenWord = document.getElementById("hiddenWord");
        
        const box = 20;
        let snake;
        let direction;
        let food;
        let score;
        let gameInterval;

        function initializeGame() {
            snake = [{ x: 10 * box, y: 10 * box }];
            direction = "RIGHT";
            food = { x: Math.floor(Math.random() * 20) * box, y: Math.floor(Math.random() * 20) * box };
            score = 0;
            document.getElementById("score").textContent = score;
            rewardImage.style.display = "none";
            hiddenWord.style.display = "none";
            clearInterval(gameInterval);
        }

        startButton.addEventListener("click", () => {
            startButton.style.display = "none";
            restartButton.style.display = "inline-block";
            canvas.style.display = "block";
            document.addEventListener("keydown", changeDirection);
            document.addEventListener("keydown", revealHiddenWord);
            initializeGame();
            gameInterval = setInterval(draw, 100);
        });

        restartButton.addEventListener("click", () => {
            initializeGame();
            gameInterval = setInterval(draw, 100);
        });

        function changeDirection(event) {
            if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
            else if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
            else if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
            else if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
        }

        function revealHiddenWord(event) {
            if (event.key === "T" || event.key === "t") {
                fetch("fetch_reward.php")
                    .then(response => response.text())
                    .then(word => {
                        hiddenWord.textContent = word;
                        hiddenWord.style.display = "block";
                    })
                    .catch(error => console.error("Error fetching reward:", error));
            }
        }

        function draw() {
            ctx.fillStyle = "lightgreen";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = "red";
            ctx.fillRect(food.x, food.y, box, box);

            ctx.fillStyle = "blue";
            snake.forEach(segment => {
                ctx.fillRect(segment.x, segment.y, box, box);
            });

            let head = { x: snake[0].x, y: snake[0].y };
            if (direction === "UP") head.y -= box;
            if (direction === "DOWN") head.y += box;
            if (direction === "LEFT") head.x -= box;
            if (direction === "RIGHT") head.x += box;

            if (head.x === food.x && head.y === food.y) {
                score++;
                document.getElementById("score").textContent = score;
                food = { x: Math.floor(Math.random() * 20) * box, y: Math.floor(Math.random() * 20) * box };
            } else {
                snake.pop();
            }

            if (score >= 20) {
                rewardImage.style.display = "block";
            }

            if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height || snake.some(segment => segment.x === head.x && segment.y === head.y)) {
                alert("Game Over! Your score: " + score);
                restartButton.style.display = "inline-block";
                clearInterval(gameInterval);
            }

            snake.unshift(head);
        }
