let currentLanguage = localStorage.getItem('selectedLanguage') || 'en'; 

const translations = {
    en: {
        home: "Home",
        singlePlayer: "Single Player",
        multiPlayer: "Multi Player",
        language: "Languages",
        english: "English",
        spanish: "Spanish",
        turkish: "Turkish",
        contactUs: "Contact Us",
        address: "Muallimköy Mahallesi, Deniz Cd. No:143-5, 41400 Gebze/Kocaeli",
        addresslabel:"Address",
        email: "Email",
        phone: "Phone",
        map: "Map",
        teamtitle: "OUR TEAM",
		player:"player",
		opponent: "opponent",
		player1: "Player1",
        player2: "Player2",
        player3: "Player3",
        playbutton: "LOGİN",
		formTitle1:"Player1",
		formTitle2:"Player2",
		formTitle3:"Player3",
		startButton: "Play with AI",
		playerColor: "Player Paddle Color:",
        opponentColor: "Opponent Paddle Color:",
        paddleWidth: "Paddle Width:",
        paddleHeight: "Paddle Height:",
        paddleDepth: "Paddle Depth:",
        applySettings: "Apply Settings",
        settings: "Settings",
        defaultSettings: "Default Settings",
        logout : "Logout"
    },
    es: {
        home: "Inicio",
        singlePlayer: "Jugador Único",
        multiPlayer: "Multijugador",
        language: "Idioma",
        english: "Inglés",
        spanish: "Español",
        turkish: "Turco",
        contactUs: "Contáctanos",
        address: "Muallimköy Mahallesi, Deniz Cd. No:143-5, 41400 Gebze/Kocaeli",
        addresslabel: "Dirección",
        email: "Correo",
        phone: "Teléfono",
        map: "Mapa",
        teamtitle: "NUESTRO EQUIPO",
		player:"player",
		opponent: "Oponente",
		player1: "Jugador 1",
        player2: "Jugador 2",
        player3: "Jugador 3",
        playbutton: "INICIAR SESIÓN",
		formTitle1:"Jugador 1",
		formTitle2: "Jugador 2",
		formTitle3:"Jugador 3",
		startButton: "Jugar con IA",
		playerColor: "Color de la Paleta del Jugador:",
        opponentColor: "Color de la Paleta del Oponente:",
        paddleWidth: "Ancho de la Paleta:",
        paddleHeight: "Altura de la Paleta:",
        paddleDepth: "Profundidad de la Paleta:",
        settings: "Configuraciones",
        applySettings: "Aplicar Configuraciones",
        defaultSettings: "Configuraciones Predeterminadas",
        logout : "Cerrar Sesión"
    },
    tr: {
        home: "Ana Sayfa",
        singlePlayer: "Tek Oyuncu",
        multiPlayer: "Çok Oyunculu",
        language: "Dil",
        english: "İngilizce",
        spanish: "İspanyolca",
        turkish: "Türkçe",
        contactUs: "Bize Ulaşın",
        address: "AdMuallimköy Mahallesi, Deniz Cd. No:143-5, 41400 Gebze/Kocaelires",
        addresslabel: "Adres",
        email: "E-posta",
        phone: "Telefon",
        map: "Harita",
        teamtitle: "EKİBİMİZ",
		player:"player",
		opponent: "Rakip",
		player1: "Oyuncu1",
        player2: "Oyuncu2",
        player3: "Oyuncu3",
        playbutton: "GIRIS",
		formTitle1:"Oyuncu1",
		formTitle2:"Oyuncu2",
		formTitle3:"Oyuncu3",
		startButton: "Yapay Zeka ile Oyna",
		playerColor: "Oyuncu Paleti Rengi:",
        opponentColor: "Rakip Paleti Rengi:",
        paddleWidth: "Palet Genişliği:",
        paddleHeight: "Palet Yüksekliği:",
        paddleDepth: "Palet Derinliği:",
        settings: "Ayarlar",
        applySettings: "Ayarları Uygula",
        defaultSettings: "Varsayılan Ayarlar",
        logout: "Çıkış"
    }
};
function setLanguage(lang) {
    currentLanguage = lang; // Seçilen dili güncelle

    // Sayfadaki tüm data-translate attribute'una sahip öğeleri bul ve güncelle
    document.querySelectorAll("[data-translate]").forEach(function(element) {
        const key = element.getAttribute("data-translate");
        if (translations[currentLanguage][key]) {
            element.textContent = translations[currentLanguage][key];
        }
    });

    // Skorboard'daki Player ve Opponent etiketlerini güncelle
    const playerLabel = document.getElementById('playerLabel');
    const opponentLabel = document.getElementById('opponentLabel');
    if (playerLabel) {
        playerLabel.textContent = translations[currentLanguage].player;
    }
    if (opponentLabel) {
        opponentLabel.textContent = translations[currentLanguage].opponent;
    }

	const startButton = document.getElementById('startButton');
    if (startButton) {
        startButton.textContent = translations[currentLanguage].startButton;
    }

    // Play Button içeriğini güncelle
    const playButton = document.getElementById('playButton');
    if (playButton) {
        playButton.textContent = translations[currentLanguage].playbutton;
    }

    // Formdaki girdilerin çevirisini güncelle
    const player1Input = document.getElementById('player1NameInput');
    const player2Input = document.getElementById('player2NameInput');
    const player3Input = document.getElementById('player3NameInput');
	const formTitle1 = document.getElementById('formTitle1');
    const formTitle2 = document.getElementById('formTitle2');
    const formTitle3 = document.getElementById('formTitle3');
	const submitButton = document.querySelector('#formButton'); 

    if (player1Input && player2Input && player3Input && formTitle1 && formTitle2 && formTitle3)  {
        player1Input.placeholder = translations[currentLanguage].player1;
        player2Input.placeholder = translations[currentLanguage].player2;
        player3Input.placeholder = translations[currentLanguage].player3;
		submitButton.textContent = translations[currentLanguage].playbutton; // Buton yazısı
		formTitle1.textContent = translations[currentLanguage].formTitle1; // Form başlıkları
        formTitle2.textContent = translations[currentLanguage].formTitle2;
        formTitle3.textContent = translations[currentLanguage].formTitle3;
    }

	/*singleplayer settings menü */

	const playerColorLabel = document.getElementById('settingsMenuText1');
    const opponentColorLabel = document.getElementById('settingsMenuText2');
    const paddleWidthLabel = document.getElementById('settingsMenuText3');
    const paddleHeightLabel = document.getElementById('settingsMenuText4');
    const paddleDepthLabel = document.getElementById('settingsMenuText5');
    const applySettingsButton = document.getElementById('applySettingsButton');
    const applySettingsButton2 = document.getElementById('applySettingsButton2');

    const defaultSettingsButton = document.getElementById('defaultSettingsButton');
	const settingsButton = document.getElementById('settingsButton'); // Settings butonunu al

    if (playerColorLabel) {
        playerColorLabel.textContent = translations[currentLanguage].playerColor;
    }
    if (opponentColorLabel) {
        opponentColorLabel.textContent = translations[currentLanguage].opponentColor;
    }
    if (paddleWidthLabel) {
        paddleWidthLabel.textContent = translations[currentLanguage].paddleWidth;
    }
    if (paddleHeightLabel) {
        paddleHeightLabel.textContent = translations[currentLanguage].paddleHeight;
    }
    if (paddleDepthLabel) {
        paddleDepthLabel.textContent = translations[currentLanguage].paddleDepth;
    }
    if (applySettingsButton) {
        applySettingsButton.textContent = translations[currentLanguage].applySettings;
    }
	if (applySettingsButton2) {
        applySettingsButton2.textContent = translations[currentLanguage].applySettings;
    }
    if (defaultSettingsButton) {
        defaultSettingsButton.textContent = translations[currentLanguage].defaultSettings;
    }

	// Settings butonunu çevir
    if (settingsButton) {
        settingsButton.textContent = translations[currentLanguage].settings;
    }
}



// Dil değişikliği örneği
document.querySelectorAll('.dropdown-item').forEach(item => {
	item.addEventListener('click', function(event) {
		event.preventDefault(); // Linkin varsayılan davranışını engelle
		const lang = this.getAttribute('onclick').match(/'([^']+)'/)[1]; // Dil kodunu çek
		setLanguage(lang);
	});
});

// Sayfa yüklendiğinde varsayılan dili ayarla
window.onload = function() {
    setLanguage(currentLanguage);
};

document.addEventListener("DOMContentLoaded", function() {
    setLanguage(currentLanguage); // Sayfa yüklendiğinde varsayılan dil ayarını yap
});
