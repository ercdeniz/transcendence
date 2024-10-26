function startGame() {
    const canvas = document.getElementById('gameCanvas');
    const scoreBoard = document.getElementById('scoreBoard');
    const startButton = document.getElementById('startButton');
    
    let playerScore = 0;
    let opponentScore = 0;

    let playerPaddleColor = 0xffffff;
    let opponentPaddleColor = 0xffffff;
    let paddleWidth = 0.3;
    let paddleHeight = 0.2;
    let paddleDepth = 2;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas });
    
    const tableWidth = 15;
    const tableHeight = 0.3;
    const tableDepth = 10;
    const ballSize = 0.2;

    function resizeCanvas() {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    }

    function applySettings() {
        playerPaddleColor = new THREE.Color(document.getElementById('playerColor').value);
        opponentPaddleColor = new THREE.Color(document.getElementById('opponentColor').value);
        paddleWidth = parseFloat(document.getElementById('paddleWidth').value);
        paddleHeight = parseFloat(document.getElementById('paddleHeight').value);
        paddleDepth = parseFloat(document.getElementById('paddleDepth').value);
    
        updatePaddleSizes();
        renderer.render(scene, camera);
    }
    
    function resetToDefaultSettings() {
        document.getElementById('playerColor').value = '#ffffff';
        document.getElementById('opponentColor').value = '#ffffff';
        document.getElementById('paddleWidth').value = '0.3';
        document.getElementById('paddleHeight').value = '0.2';
        document.getElementById('paddleDepth').value = '2';
    
        applySettings();
    }

    document.getElementById('applySettingsButton').addEventListener('click', applySettings);
    document.getElementById('defaultSettingsButton').addEventListener('click', resetToDefaultSettings);


    const playerPaddleGeometry = new THREE.BoxGeometry(paddleWidth, paddleHeight, paddleDepth);
    const playerPaddleMaterial = new THREE.MeshBasicMaterial({ color: playerPaddleColor });
    const playerPaddle = new THREE.Mesh(playerPaddleGeometry, playerPaddleMaterial);
    playerPaddle.position.set(-tableWidth / 2 + paddleWidth / 2, paddleHeight / 2, 0);
    scene.add(playerPaddle);

    const opponentPaddleGeometry = new THREE.BoxGeometry(paddleWidth, paddleHeight, paddleDepth);
    const opponentPaddleMaterial = new THREE.MeshBasicMaterial({ color: opponentPaddleColor });
    const opponentPaddle = new THREE.Mesh(opponentPaddleGeometry, opponentPaddleMaterial);
    opponentPaddle.position.set(tableWidth / 2 - paddleWidth / 2, paddleHeight / 2, 0);
    scene.add(opponentPaddle);
    
    function updatePaddleSizes() {
        playerPaddle.geometry = new THREE.BoxGeometry(paddleWidth, paddleHeight, paddleDepth);
        opponentPaddle.geometry = new THREE.BoxGeometry(paddleWidth, paddleHeight, paddleDepth);
        playerPaddle.material.color.set(playerPaddleColor);
        opponentPaddle.material.color.set(opponentPaddleColor);
    }
    
    document.getElementById('paddleWidth').addEventListener('input', function() {
        document.getElementById('paddleWidthValue').textContent = this.value;
    });
    document.getElementById('paddleHeight').addEventListener('input', function() {
        document.getElementById('paddleHeightValue').textContent = this.value;
    });
    document.getElementById('paddleDepth').addEventListener('input', function() {
        document.getElementById('paddleDepthValue').textContent = this.value;
    });    

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

    let ballSpeedX = 0;
    let ballSpeedZ = 0;

    let playerPaddleSpeed = 0;
    const paddleMoveSpeed = 0.2;

    window.addEventListener('keydown', (event) => {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
            event.preventDefault();
        }

        if (event.key === 'ArrowUp') {
            playerPaddleSpeed = -paddleMoveSpeed;
        } else if (event.key === 'ArrowDown') {
            playerPaddleSpeed = paddleMoveSpeed;
        }
    });

    window.addEventListener('keyup', (event) => {
        if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
            playerPaddleSpeed = 0;
        }
    });

    function moveOpponentPaddle() {
        const paddleHalfDepth = paddleDepth / 2;
        const tableHalfDepth = tableDepth / 2;

        let newPaddlePositionZ = opponentPaddle.position.z;

        if (ball.position.z > opponentPaddle.position.z) {
            newPaddlePositionZ += paddleMoveSpeed / 2;
        } else if (ball.position.z < opponentPaddle.position.z) {
            newPaddlePositionZ -= paddleMoveSpeed / 2;
        }

        if (newPaddlePositionZ > tableHalfDepth - paddleHalfDepth) {
            newPaddlePositionZ = tableHalfDepth - paddleHalfDepth;
        } else if (newPaddlePositionZ < -tableHalfDepth + paddleHalfDepth) {
            newPaddlePositionZ = -tableHalfDepth + paddleHalfDepth;
        }

        opponentPaddle.position.z = newPaddlePositionZ;
    }

    function updateScore() {
        scoreBoard.textContent = `Player: ${playerScore} | Opponent: ${opponentScore}`;
    }

    const winningScore = 3;
    let gameOver = false;

    startButton.addEventListener('click', () => {
        ballSpeedX = 0.13;
        ballSpeedZ = 0.13;
        startButton.style.display = 'none';
        isGameActive = true;
        animate();
    });

    const settingsButton = document.getElementById('settingsButton');
    const settingsMenu = document.getElementById('settingsMenu');

    settingsButton.addEventListener('click', function() {
        if (settingsMenu.style.display === 'none' || settingsMenu.style.display === '') {
            settingsMenu.style.display = 'block';
        } else {
            settingsMenu.style.display = 'none';
        }
    });

    document.getElementById('paddleWidth').addEventListener('input', function() {
        document.getElementById('paddleWidthValue').textContent = this.value;
    });

    document.getElementById('paddleHeight').addEventListener('input', function() {
        document.getElementById('paddleHeightValue').textContent = this.value;
    });

    document.getElementById('paddleDepth').addEventListener('input', function() {
        document.getElementById('paddleDepthValue').textContent = this.value;
    });

    

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

        if (ball.position.x <= -tableWidth / 2) {
            opponentScore++;
            updateScore();
            if (opponentScore >= winningScore) {
                gameOver = true;
                alert('Opponent wins!');
                return;
            }
            resetBall();
        } else if (ball.position.x >= tableWidth / 2) {
            playerScore++;
            updateScore();
            if (playerScore >= winningScore) {
                gameOver = true;
                alert('Player wins!');
                return;
            }
            resetBall();
        }

        if (ball.position.z - ballSize <= -tableDepth / 2 || ball.position.z + ballSize >= tableDepth / 2) {
            ballSpeedZ = -ballSpeedZ;
        }
        playerPaddle.position.z += playerPaddleSpeed;

        const paddleHalfDepth = paddleDepth / 2;
        const tableHalfDepth = tableDepth / 2;
        if (playerPaddle.position.z > tableHalfDepth - paddleHalfDepth) {
            playerPaddle.position.z = tableHalfDepth - paddleHalfDepth;
        } else if (playerPaddle.position.z < -tableHalfDepth + paddleHalfDepth) {
            playerPaddle.position.z = -tableHalfDepth + paddleHalfDepth;
        }
        moveOpponentPaddle();
        renderer.render(scene, camera);
    }

    function resetBall() {
        ball.position.set(0, 0.5, 0);
        ballSpeedX = 0.13;
        ballSpeedZ = 0.13;
    }
    renderer.render(scene, camera);
}
