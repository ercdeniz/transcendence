function updateScore() {
    const scoreBoard = document.getElementById('scoreBoard');
    scoreBoard.textContent = `${currentPlayer1}: ${playerScore} | ${currentPlayer2}: ${opponentScore}`;
}

function startMultiGame() {
    const canvas = document.getElementById('gameCanvas');
    const scoreBoard = document.getElementById('scoreBoard');
    const countdownDisplay = document.getElementById('countdown');
    const playButton = document.getElementById('playButton');
    const settingsButton = document.getElementById('settingsButton2');
    const settingsMenu = document.getElementById('settingsMenu');
    const applySettingsButton = document.getElementById('applySettingsButton2');

    if (!canvas) {
        console.error("Canvas not found");
        return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas });

    let playerScore = 0;
    let opponentScore = 0;
    
    let paddleWidth = 0.3;
    let paddleHeight = 0.2;
    let paddleDepth = 2;
    
    let tableWidth = 15;
    let tableHeight = 0.3;
    let tableDepth = 10;

    let ballSize = 0.2;

    function resizeCanvas() {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    camera.position.set(0, 10, 10);
    camera.lookAt(0, 0, 0);

    const tableGeometry = new THREE.BoxGeometry(tableWidth, tableHeight, tableDepth);
    const tableMaterial = new THREE.MeshBasicMaterial({ color: 0xFF0000, wireframe: true });
    const table = new THREE.Mesh(tableGeometry, tableMaterial);
    scene.add(table);

    const ballGeometry = new THREE.SphereGeometry(ballSize, 32, 32);
    const ballMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const ball = new THREE.Mesh(ballGeometry, ballMaterial);
    ball.position.set(0, 0.5, 0);
    scene.add(ball);

    let playerPaddleGeometry = new THREE.BoxGeometry(paddleWidth, paddleHeight, paddleDepth);
    let playerPaddleMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    let playerPaddle = new THREE.Mesh(playerPaddleGeometry, playerPaddleMaterial);
    playerPaddle.position.set(-tableWidth / 2 + paddleWidth / 2, paddleHeight / 2, 0);
    scene.add(playerPaddle);

    let opponentPaddleGeometry = new THREE.BoxGeometry(paddleWidth, paddleHeight, paddleDepth);
    let opponentPaddleMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    let opponentPaddle = new THREE.Mesh(opponentPaddleGeometry, opponentPaddleMaterial);
    opponentPaddle.position.set(tableWidth / 2 - paddleWidth / 2, paddleHeight / 2, 0);
    scene.add(opponentPaddle);

    applySettingsButton.addEventListener('click', () => {
        const playerColor = document.getElementById('playerColor').value;
        const opponentColor = document.getElementById('opponentColor').value;
        const newPaddleWidth = parseFloat(document.getElementById('paddleWidth').value);
        const newPaddleHeight = parseFloat(document.getElementById('paddleHeight').value);
        const newPaddleDepth = parseFloat(document.getElementById('paddleDepth').value);
    
        playerPaddleMaterial.color.set(playerColor);
        opponentPaddleMaterial.color.set(opponentColor);
    
        paddleWidth = newPaddleWidth;
        paddleHeight = newPaddleHeight;
        paddleDepth = newPaddleDepth;
    
        playerPaddle.geometry.dispose();
        opponentPaddle.geometry.dispose();
    
        playerPaddleGeometry = new THREE.BoxGeometry(paddleWidth, paddleHeight, paddleDepth);
        opponentPaddleGeometry = new THREE.BoxGeometry(paddleWidth, paddleHeight, paddleDepth);
    
        playerPaddle.geometry = playerPaddleGeometry;
        opponentPaddle.geometry = opponentPaddleGeometry;
    
        settingsMenu.style.display = 'none';

        document.getElementById('paddleDepth').addEventListener('input', function() {
            document.getElementById('paddleDepthValue').textContent = this.value;
        });

        renderer.render(scene, camera);
        
    });    
    
    const defaultSettingsButton = document.getElementById('defaultSettingsButton');

    defaultSettingsButton.addEventListener('click', () => {
        document.getElementById('playerColor').value = '#ffffff';
        document.getElementById('opponentColor').value = '#ffffff';
        document.getElementById('paddleWidth').value = '0.3';
        document.getElementById('paddleWidthValue').textContent = '0.3';
        document.getElementById('paddleHeight').value = '0.2';
        document.getElementById('paddleHeightValue').textContent = '0.2';
        document.getElementById('paddleDepth').value = '2';
        document.getElementById('paddleDepthValue').textContent = '2';
    
        playerPaddleMaterial.color.set('#ffffff');
        opponentPaddleMaterial.color.set('#ffffff');
        
        paddleWidth = 0.3;
        paddleHeight = 0.2;
        paddleDepth = 2;
    
        playerPaddle.geometry.dispose();
        opponentPaddle.geometry.dispose();
    
        playerPaddleGeometry = new THREE.BoxGeometry(paddleWidth, paddleHeight, paddleDepth);
        opponentPaddleGeometry = new THREE.BoxGeometry(paddleWidth, paddleHeight, paddleDepth);
    
        playerPaddle.geometry = playerPaddleGeometry;
        opponentPaddle.geometry = opponentPaddleGeometry;
    });
    

    settingsButton.addEventListener('click', () => {
        settingsMenu.style.display = settingsMenu.style.display === 'none' ? 'block' : 'none';
    });

    function startCountdown() {
        countdown = countdownTime;
        countdownDisplay.textContent = countdown;
        ballSpeedX = 0;
        ballSpeedZ = 0;
        
        countdownInterval = setInterval(() => {
            countdown--;
            countdownDisplay.textContent = countdown > 0 ? countdown : "GO!";
            if (countdown <= 0) {
                clearInterval(countdownInterval);
    
                ballSpeedX = Math.random() > 0.12 ? 0.12 : -0.12;
                ballSpeedZ = Math.random() > 0.12 ? 0.12 : -0.12;

                countdownDisplay.textContent = '';
            }
        }, 1000);
    }

    function startGame() {
        playButton.style.display = 'none';
        startCountdown();
        isGameActive = true;
        animate();
    }

    playButton.addEventListener('click', startGame);

    window.addEventListener('keydown', (event) => {
        if (['W', 'S', 'O', 'L'].includes(event.key)) {
            event.preventDefault();
        }

        if (event.key === 'W') {
            playerPaddleSpeed = -paddleMoveSpeed;
        } else if (event.key === 'S') {
            playerPaddleSpeed = paddleMoveSpeed;
        }

        if (event.key === 'O') {
            opponentPaddleSpeed = -paddleMoveSpeed;
        } else if (event.key === 'L') {
            opponentPaddleSpeed = paddleMoveSpeed;
        }
    });

    window.addEventListener('keyup', (event) => {
        if (event.key === 'W' || event.key === 'S') {
            playerPaddleSpeed = 0;
        }

        if (event.key === 'O' || event.key === 'L') {
            opponentPaddleSpeed = 0;
        }
    });


    function updateScore() {
        scoreBoard.textContent = `${currentPlayer1}: ${playerScore} | ${currentPlayer2}: ${opponentScore}`;
    }

    let firstRoundWinner = null;
    let gameOver = false;
    let finalgame = false;

    function checkWinner() {
        if (playerScore === winningScore)
        {
            if (!firstRoundWinner)
            {
                alert(`${currentPlayer1} wins! will play with ${player3Name}`);
                firstRoundWinner = currentPlayer1;
                currentPlayer2 = player3Name;
            }
            else if (firstRoundWinner === currentPlayer1)
            {
                alert(`${currentPlayer1} wins! Champion of the tournament!`);
                gameOver = true;
            }
            else
            {
                alert(`${currentPlayer1} wins! will play the final with ${firstRoundWinner}`);
                currentPlayer2 = firstRoundWinner;
            }
            resetGame();
        }
        else if (opponentScore === winningScore) {
            if (!firstRoundWinner)
            {
                alert(`${currentPlayer2} wins! will play with ${player3Name}`);
                firstRoundWinner = currentPlayer2;
                currentPlayer1 = currentPlayer2;
                currentPlayer2 = player3Name;
            }
            else if (finalgame === true)
            {
                alert(`${currentPlayer2} wins! Champion of the tournament!`);
                gameOver = true;
            }
            else
            {
                alert(`${currentPlayer2} wins! will play the final with ${firstRoundWinner}`);
                finalgame = true;
            }
            resetGame();
        }
    }
    window.onload = function () {
        resetGame();
        const playButton = document.getElementById('playButton');
    };

    function resetGame() {
        playerScore = 0;
        opponentScore = 0;
    
        ballSpeedX = 0;
        ballSpeedZ = 0;
    
        ball.position.set(0, 0.5, 0);
    
        startCountdown();
        updateScore();
    }
    function resetBall() {
        ball.position.set(0, 0.5, 0);
        ballSpeedX = Math.random() > 0.12 ? 0.12 : -0.12;
        ballSpeedZ = Math.random() > 0.12 ? 0.12 : -0.12;
        updateScore();
    }

    function animate() {

        if (!isGameActive || gameOver) return;
        requestAnimationFrame(animate);

        ball.position.x += ballSpeedX;
        ball.position.z += ballSpeedZ;

        if (ball.position.x - ballSize <= playerPaddle.position.x + paddleWidth / 2 &&
            ball.position.x + ballSize >= playerPaddle.position.x - paddleWidth / 2 &&
            ball.position.z - ballSize <= playerPaddle.position.z + paddleDepth / 2 &&
            ball.position.z + ballSize >= playerPaddle.position.z - paddleDepth / 2) {

            if (ball.position.x < playerPaddle.position.x) {
                ball.position.x = playerPaddle.position.x - paddleWidth / 2 - ballSize;
            } else {
                ball.position.x = playerPaddle.position.x + paddleWidth / 2 + ballSize;
            }

            ballSpeedX = -ballSpeedX;
        }

        if (ball.position.x - ballSize <= opponentPaddle.position.x + paddleWidth / 2 &&
            ball.position.x + ballSize >= opponentPaddle.position.x - paddleWidth / 2 &&
            ball.position.z - ballSize <= opponentPaddle.position.z + paddleDepth / 2 &&
            ball.position.z + ballSize >= opponentPaddle.position.z - paddleDepth / 2) {

            if (ball.position.x < opponentPaddle.position.x) {
                ball.position.x = opponentPaddle.position.x - paddleWidth / 2 - ballSize;
            } else {
                ball.position.x = opponentPaddle.position.x + paddleWidth / 2 + ballSize;
            }

            ballSpeedX = -ballSpeedX;
        }

        if (playerPaddle.position.z + playerPaddleSpeed <= tableDepth / 2 - paddleDepth / 2 &&
            playerPaddle.position.z + playerPaddleSpeed >= -tableDepth / 2 + paddleDepth / 2) {
            playerPaddle.position.z += playerPaddleSpeed;
        }

        if (opponentPaddle.position.z + opponentPaddleSpeed <= tableDepth / 2 - paddleDepth / 2 &&
            opponentPaddle.position.z + opponentPaddleSpeed >= -tableDepth / 2 + paddleDepth / 2) {
            opponentPaddle.position.z += opponentPaddleSpeed;
        }

        if (ball.position.x > tableWidth / 2 - ballSize) {
            playerScore++;
            resetBall();
            checkWinner();
        } else if (ball.position.x < -tableWidth / 2 + ballSize) {
            opponentScore++;
            resetBall();
            checkWinner();
        }

        if (ball.position.z > tableDepth / 2 - ballSize || ball.position.z < -tableDepth / 2 + ballSize) {
            ballSpeedZ = -ballSpeedZ;
        }
        renderer.render(scene, camera);
    }
    updateScore();
    renderer.render(scene, camera);
}


