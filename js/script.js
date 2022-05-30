//Pulsante Play e contatore partite
const play = document.getElementById("play");
play.addEventListener("click", start);
let playCounter = 0;
//Variabile griglia, dimensione griglia e array bombe
const grid = document.getElementById("grid");
let gridDim = 0;
let bombsArray = [];
//Punti 
let points;
let minPointsToWin;
//Start
function start() {
    //Variabili griglia e difficulty selector
    const difficultySelector = document.getElementById("difficulty-selector");
    const difficulty = difficultySelector.value;
    if (playCounter == 0) {
        grid.classList.add("started");
    }
    //Rimuove messaggio in basso di fine partita se presente
    const gameEndElement = document.getElementById("game-end");
    gameEndElement.classList.remove("show");
    gameEndElement.classList.add("hidden");
    //Azzera i punti
    points = 0;
    //Funzioni da eseguire
    animationManager();
    difficultyManager(difficulty);
    //Toglie il blocco alla griglia, se presente
    grid.classList.remove("inactive");
    playCounter++;
}
//Gestore delle animazioni
function animationManager() {
    grid.animate([
        { transform: 'rotate(0deg)' },
        { transform: 'rotate(360deg)' }
    ], {
        duration: 500
    });
}
//Gestore delle difficoltà
function difficultyManager(difficulty) {
    if (difficulty == 1) { //Easy
        gridDim = 100;
        minPointsToWin = 84;
        gridGenerator("easy");
    } else if (difficulty == 2) { //Medium
        gridDim = 81;
        minPointsToWin = 65;
        gridGenerator("medium");
    } else { //Hard
        gridDim = 49;
        minPointsToWin = 33;
        gridGenerator("hard");
    }
}
//Genera la griglia con ciascun elemento
function gridGenerator(difficultyName) {
    //Svuota la griglia
    grid.innerHTML = "";
    //Genera array di bombe
    bombsArray = bombGenerator();
    console.log(bombsArray);
    for (let i = 1; i <= gridDim; i++) {
        //Genera gridSquare
        let gridSquare = gridSquareGenerator(difficultyName, i);
        //Aggiunge eventListener al click in basa a se è una bomba o no
        if (isBomb(i)) {
            gridSquare.addEventListener("click", addBombClass);
        } else {
            gridSquare.addEventListener("click", addActiveClass);
        }
        //Aggiunge gridSquare alla griglia
        grid.append(gridSquare);
    }
}
//Generatore di array di bombe
function bombGenerator() {
    let bombs = [];
    do {
        let newBomb = randomNumberGen(1, gridDim);
        if (!isBomb(newBomb)) {
            bombs.push(newBomb);
        }
    } while (bombs.length < 16)
    return bombs;
}
//Generatore di numeri random
function randomNumberGen(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
//Controlla se un elemento è una bomba o no
function isBomb(value) {
    for (let i = 0; i < bombsArray.length; i++) {
        if (bombsArray[i] == value) {
            return true;
        }
    }
    return false;
}
//Generatore di gridSquare
function gridSquareGenerator(difficultyName, i) {
    //Crea gridSquare
    let gridSquare = document.createElement("div");
    gridSquare.classList.add("grid-square-" + i);
    gridSquare.classList.add(difficultyName);
    //Inserisce numero dentro gridSquare
    let gridSquareNumber = document.createElement("div");
    gridSquareNumber.classList.add("grid-number");
    gridSquareNumber.innerHTML = i;
    gridSquare.append(gridSquareNumber);
    return gridSquare;
}
//Aggiunge la classe "active" ad un elemento
function addActiveClass() {
    this.classList.add("active");
    points++;
    if (points == minPointsToWin) {
        endGame("win");
    }
    console.log(points);
    //Rimuove l'EventListener per impedire punti infiniti
    this.removeEventListener("click", addActiveClass);
}
//Per ggiumgere la classe "bomb" ad un elemento
function addBombClass() {
    this.classList.add("bomb");
    endGame("lose");
    //Rimuove l'EventListener
    this.removeEventListener("click", addBombClass);
}
function endGame(outcome) {
    //Impedisce di cliccare altro sulla griglia
    grid.classList.add("inactive");
    //Variabili varie
    const gameEndElement = document.getElementById("game-end");
    gameEndElement.classList.remove("hidden");
    gameEndElement.classList.add("show");
    document.getElementById("n-match").innerHTML = "Partita " + playCounter + ": ";
    let outcomeContainer = document.getElementById("game-outcome");
    //Gestisce l'outcome
    if (outcome == "win") {
        outcomeContainer.innerHTML = "Complimenti, ha vinto :-)";
    } else {
        outcomeContainer.innerHTML = "Peccato, hai perso :-(";
    }
    document.getElementById("game-total-points").innerHTML = "Hai fatto: " + points + " punti.";
    //Rivela le bombe
    bombsReveal()
}
//Rivelatore di bombe
function bombsReveal() {
    for (let i = 1; i <= gridDim; i++) {
        let tempGridSquare = document.querySelector(".grid-square-" + i);

        if (isBomb(i)) {
            tempGridSquare.classList.add("bomb");
            if (tempGridSquare.classList.contains("bomb")) {
                continue;
            }

            tempGridSquare.classList.add("unexploded");
        }
    }
} 