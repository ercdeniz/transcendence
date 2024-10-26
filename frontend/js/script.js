
let currentPlayer1;
let currentPlayer2;
let playerScore = 0;
let opponentScore = 0;
let player1Name;
let player2Name;
let player3Name;
let round = 1;
let ballSpeedX = 0;
let ballSpeedZ = 0;
let playerPaddleSpeed = 0;
let opponentPaddleSpeed = 0;
const paddleMoveSpeed = 0.2;
const winningScore = 3;
const countdownTime = 3;
let countdown = countdownTime;
let countdownInterval;




let ball, paddleWidth, paddleHeight, paddleDepth, tableWidth, tableHeight, tableDepth, ballSize;
function loadScript(url, callback) {
    const script = document.createElement('script');
    script.src = url;
    script.onload = callback;
    script.onerror = function() {
        console.error(`Failed to load script: ${url}`);
    };
    document.head.appendChild(script);
}

let isGameActive = true;
let playerPaddleColor = new THREE.Color('#ffffff'); // Default color
let opponentPaddleColor = new THREE.Color('#ffffff'); // Default color

function applySettings() {
    playerPaddleColor = new THREE.Color(document.getElementById('playerColor').value);
    opponentPaddleColor = new THREE.Color(document.getElementById('opponentColor').value);
    paddleWidth = parseFloat(document.getElementById('paddleWidth').value);
    paddleHeight = parseFloat(document.getElementById('paddleHeight').value);
    paddleDepth = parseFloat(document.getElementById('paddleDepth').value);

    updatePaddleSizes();
}

function resetToDefaultSettings() {
    document.getElementById('playerColor').value = '#ffffff';
    document.getElementById('opponentColor').value = '#ffffff';
    document.getElementById('paddleWidth').value = '0.3';
    document.getElementById('paddleHeight').value = '0.2';
    document.getElementById('paddleDepth').value = '2';

    applySettings();
}

function updatePaddleSizes() {
    playerPaddle.geometry.dispose(); // Mevcut geometriyi yok et
    playerPaddle.geometry = new THREE.BoxGeometry(paddleWidth, paddleHeight, paddleDepth);
    opponentPaddle.geometry.dispose(); // Mevcut geometriyi yok et
    opponentPaddle.geometry = new THREE.BoxGeometry(paddleWidth, paddleHeight, paddleDepth);
    playerPaddle.material.color.set(playerPaddleColor);
    opponentPaddle.material.color.set(opponentPaddleColor);
}


function changeContent(page, event) {
    isGameActive = false;
    const contentDiv = document.getElementById('content');

	if (page === 'SinglePlayer' || page === 'MultiPlayer') {
		contentDiv.style.visibility = 'visible';
        isPageChange = true;
    }
	switch (page) {
		case 'Home':
			contentDiv.innerHTML = `
			
		`;
		break;
        case 'SinglePlayer':
            contentDiv.innerHTML = `
			<div id="canvasWrapper">
            	<canvas id="gameCanvas"></canvas>
            	<div id="scoreBoard">Player: 0 | Opponent: 0</div>
			</div>
            	<div id="buttonsWrapper">
					<div>
            			<div id="settingsMenu" style="display:none;">
            			    <label id ="settingsMenuText1" for="playerColor">Player Paddle Color:</label>
            			    <input type="color" id="playerColor" value="#ffffff">
            			    <br>
            			    <label id ="settingsMenuText2" for="opponentColor">Opponent Paddle Color:</label>
            			    <input type="color" id="opponentColor" value="#ffffff">
							<div class = "settingtext3">
            			    	<br>
            			    	<label id ="settingsMenuText3" for="paddleWidth">Paddle Width:</label>
            			    	<div class="range-container">
            			             <input type="range" id="paddleWidth" min="0.1" max="1.0" step="0.1" value="0.3"  class="slider">
            			             <span id="paddleWidthValue">0.3</span>
            			        </div>
							</div>
							<div class = "settingtext4">
            			    	<br>
            			    	<label id ="settingsMenuText4" for="paddleHeight">Paddle Height:</label>
            			        <div class="range-container">
            			    	    <input type="range" id="paddleHeight" min="0.1" max="0.5" step="0.1" value="0.2"  class="slider">
            			    	    <span id="paddleHeightValue">0.2</span>
            			        </div>
							</div>
							<div class = "settingtext5">
            			    	<br>
            			    	<label id ="settingsMenuText5" for="paddleDepth">Paddle Depth:</label>
            			        <div class="range-container">
            			    	    <input type="range" id="paddleDepth" min="1" max="3" step="0.1" value="2"  class="slider">
            			    	    <span id="paddleDepthValue">2</span>
							    </div>
							</div>
            			    <br>
            			    <button id="applySettingsButton">Apply</button>
            			    <button id="defaultSettingsButton" class="singleDefult" >Default</button>
            			</div>
						</div>
						<div class="singleplayerbutton">
							<button class="singleSettings" id="settingsButton">SETTINGS</button>
            				<button id="startButton">Play with AI</button>
						</div>
				</div>	
            `;

            startGame();  
            break;

            case 'MultiPlayer':
            contentDiv.innerHTML = `
               <div id="nameInput">
                        <form id="playerNamesForm">
                            <label for="player1Name" id ="formTitle1" data-translate="formTitle1" >${translations[currentLanguage].player1}:</label>
                            <input type="text" id="player1NameInput" placeholder="${translations[currentLanguage].player1}" required>
                            <br><br>
                            <label for="player2Name" id ="formTitle2" data-translate="formTitle2">${translations[currentLanguage].player2}:</label>
                            <input type="text" id="player2NameInput" placeholder="${translations[currentLanguage].player2}" required>
                            <br><br>
                            <label for="player3Name" id ="formTitle3" data-translate="formTitle3">${translations[currentLanguage].player3}:</label>
                            <input type="text" id="player3NameInput" placeholder="${translations[currentLanguage].player3}" required>
                            <br><br>
                            <button type="submit" id="formButton">LOGİN</button> <!-- Dinamik buton -->
                        </form>
                    </div>

                <div id="settingsMenu" style="display:none;">
					<div class="Multisettings"

                	   <label id ="MsettingsText1" for="playerColor">Player Paddle Color:</label>
                	    <input type="color" id="playerColor" value="#ffffff">
                	    <br>
                	    <label id ="MsettingsMenuText2" for="opponentColor">Opponent Paddle Color:</label>
                	    <input type="color" id="opponentColor" value="#ffffff">
                	    <div class = "Multisettingtext3">
                	    	<br>
                	    	<label id ="MsettingsMenuText3" for="paddleWidth">Paddle Width:</label>
                	    	<input type="range" id="paddleWidth" min="0.1" max="1.0" step="0.1" value="0.3">
                	    	<span id="paddleWidthValue">0.3</span>
						</div>
                	    <div class = "Multisettingtext4">
                	    	<br>
                	    	<label id ="MsettingsMenuText4" for="paddleHeight">Paddle Height:</label>
                	    	<input type="range" id="paddleHeight" min="0.1" max="0.5" step="0.1" value="0.2">
                	    	<span id="paddleHeightValue">0.2</span>
						</div>
                	  <div class = "Multisettingtext5">
                	    	<br>
                	    	<label id ="MsettingsMenuText5" for="paddleDepth">Paddle Depth:</label>
                	    	<input type="range" id="paddleDepth" min="1" max="3" step="0.1" value="2">
                	    	<span id="paddleDepthValue">2</span>
						</div>
                	    <br>
                	    <button id="applySettingsButton2" class="settingButton">Apply Settings</button>
                	    <button id="defaultSettingsButton" class="settingButton">Default Settings</button>
					</div>
                </div>

                  <div id="gameContainer" style="display:none;">
					    <div id="scoreBoard"  style="text-align:left; margin-left:-210px; margin-top:-420px;">${translations[currentLanguage].player}: 0 | ${translations[currentLanguage].opponent}: 0</div>
                        <canvas id="gameCanvas" style="width: 100%; height: 500px; margin-left: 1px; margin-top: 15px; "></canvas>
        
                        <div id="countdown"></div>
                        <button id="playButton" class="startButton">START GAME</button>
						<button id="settingsButton2" class="settingButton2" btn btn-primary" ><i class="bi bi-gear"></i></button>
                    </div>
            `;
                loadScript('js/multi.js', function() {
                    updateScore();
                });
                document.getElementById('playerNamesForm').addEventListener('submit', function(event) {
                    event.preventDefault();
            
                    player1Name = document.getElementById('player1NameInput').value;
                    player2Name = document.getElementById('player2NameInput').value;
                    player3Name = document.getElementById('player3NameInput').value;
            
                    currentPlayer1 = player1Name;
                    currentPlayer2 = player2Name;
            
                    document.getElementById('nameInput').style.display = 'none';
                    document.getElementById('gameContainer').style.display = 'block';
            
                    startMultiGame();
                });
                break;
			}
}
