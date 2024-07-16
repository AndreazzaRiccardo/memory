const gameBoard = document.getElementById('board');
const counter = document.getElementById('attempts');
const msg = document.getElementById('msg');
const errorsCount = document.getElementById('errorCount');
const record = document.getElementById('record');
const scoreBoard = document.getElementById('scoreboard');
const restart = document.querySelector('button');

// Icone carte e relativo id
const icons = [
    { icon: 'images/alien.png', id: 1 },
    { icon: 'images/bug.png', id: 2 },
    { icon: 'images/duck.png', id: 3 },
    { icon: 'images/rocket.png', id: 4 },
    { icon: 'images/spaceship.png', id: 5 },
    { icon: 'images/tiktac.png', id: 6 },
];

// Inserisco due paia di carte per ogni icona all'interno del gioco
let cards = [...icons, ...icons];

// Array per gestire il confronto di ogni paio di carte selezionate
let flippedCards = [];

// Variabile che verifica la fine del gioco
let matchedPairs = 0;

// Conteggio errori nella partita
let errorsCounter = 0;

// Prendo il record salvato nel localStorage
let bestScore = localStorage.getItem('bestScore');
record.innerHTML = bestScore != null ? `Best Game: ${bestScore} Attemps` : 'No record';

// Inizializzo il contatore degli errori
counter.innerText = `Current Attemps: ${errorsCounter}`;

// Mischio le carte ad ogni avvio
cards = cards.sort(() => 0.5 - Math.random());


// Per ogni carta creo un elemento div con relativa icona e lo inserisco nel DOM
cards.forEach(item => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.id = item.id;

    const frontFace = document.createElement('div');
    frontFace.classList.add('front');
    const img = document.createElement('img');
    img.src = item.icon;
    frontFace.appendChild(img);

    const backFace = document.createElement('div');
    backFace.classList.add('back');
    const backImg = document.createElement('img');
    backImg.src = 'images/back.png';
    backFace.appendChild(backImg);

    card.appendChild(frontFace);
    card.appendChild(backFace);
    card.addEventListener('click', flipCard);
    gameBoard.appendChild(card);
});


// Gestisco il flip delle carte verificando se il giocatore ha selezionato due carte e che nessuna delle due non siano carte già flippate
function flipCard() {
    if (flippedCards.length < 2 && !this.classList.contains('flipped')) {
        this.classList.add('flipped');
        flippedCards.push(this);

        if (flippedCards.length === 2) {
            setTimeout(checkForMatch, 500);
        }
    }
}

// Controllo se le carte selezionato siano uguali
function checkForMatch() {
    const card1 = flippedCards[0];
    const card2 = flippedCards[1];

    if (card1.dataset.id === card2.dataset.id) {
        card1.removeEventListener('click', flipCard);
        card2.removeEventListener('click', flipCard);
        matchedPairs++;

        if (matchedPairs === icons.length) {
            if(bestScore == null || errorsCounter < bestScore){
                localStorage.setItem('bestScore', errorsCounter);
            }
            setTimeout(showMessage, 500);
        }
    } else {
        setTimeout(() => {
            errorsCounter++;
            counter.innerText = `Current Attemps: ${errorsCounter}`;
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
        }, 400);
    }

    flippedCards = [];
}

// Gestisco il messaggio finale del gioco
function showMessage() {
    gameBoard.style.display = 'none';
    scoreBoard.style.display = 'none';
    errorsCount.innerText = errorsCounter;
    msg.style.display = 'flex';
    restart.addEventListener('click', () => {location.reload()});
}