
let boardArr = ['','','','','','','','',''];
let xPositions = []; // The Positions X is placed
let oPositions = []; // The Positions O is placed
let winPos = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]]; // If someone marked one of this cominations he is the winner
let currentTurn = ''; // Used for knowing who is playing. possible values: 'O' or 'X'
let winner = ''; // possible values: 'O' or 'X'
let turnNumber = 0;
let currentPos = -1; // The position which the user wants to mark
let gameMode = 0; // '0' - Main Menu :: '1' - PVP :: '2' - AI
let valid = true; // Turns to false if the player didn't submited the players names
let errMsg = ''; // The error message that will appear if valid is false
let player1Name = '';
let player2Name = '';
let aiMark = '';
let huMark = '';
let aiMode = '';

const contentDiv = document.querySelector('.content');
const aiBtn = document.querySelector('#ai');
const pvpBtn = document.querySelector('#pvp');
aiBtn.addEventListener('click', changeGameMode);
pvpBtn.addEventListener('click', changeGameMode);
const turnSpan = document.querySelector('.x-turn');
const turnDiv = document.querySelector('.current-turn');
const restartDiv = document.querySelector('.restart');
const winnerDiv = document.querySelector('.round-winner');
restartDiv.addEventListener('click', restartGame);
const startDiv = document.querySelector('.start-game');
const startBtn = document.querySelector('#start-game');
startBtn.addEventListener('click', startGame);
const pvpInputsDiv = document.querySelector('.players-names');
const aiInputDiv = document.querySelector('.player-name');
const firstNameInput = document.querySelector('#player1-name');
const secondNameInput = document.querySelector('#player2-name');
const aiNameInput = document.querySelector('#playerVSai-name');
const errDiv = document.querySelector('.error-message');
const aiMarkSelectionDiv = document.querySelector('.mid');
const playersDiv = document.querySelector('.players');
const aiMarkSelectInput = document.querySelector('.mark-select');

const gameBoard = (() => {
    const drawX = (pos) => boardArr[pos] = 'X';
    const drawO = (pos) => boardArr[pos] = 'O';
    const gameOver = () => {
        if (turnNumber<6){
            winner = '';
        }
        else {
            winPos.forEach(comb => {
                let xStrikes = 0;
                let oStrikes = 0;
                for(let i=0; i<3; i++){
                    if (oPositions.includes(comb[i])){
                        oStrikes++;
                    }
                    else if(xPositions.includes(comb[i])){
                        xStrikes++;
                    }
                }
                if(xStrikes == 3){
                    winner = 'X';
                    document.querySelector(`#item${comb[0]}`).classList.add('winner-box');
                    document.querySelector(`#item${comb[1]}`).classList.add('winner-box');
                    document.querySelector(`#item${comb[2]}`).classList.add('winner-box');
                }
                else if (oStrikes == 3){
                    winner = 'O';
                    document.querySelector(`#item${comb[0]}`).classList.add('winner-box');
                    document.querySelector(`#item${comb[1]}`).classList.add('winner-box');
                    document.querySelector(`#item${comb[2]}`).classList.add('winner-box');
                }
            });
            
        }
    }
    const isEmpty = (pos) => {
        if(boardArr[pos] == '') {
            return true;
        }
        else {
            return false;
        }
    }
    return {
              drawX,
              drawO,
              isEmpty,
              gameOver,
            };
    
})();

const player = (type, name) => {
    
    const prototype = gameBoard;
    return Object.assign({}, prototype, type);
};

const player1 = player('X');
const player2 = player('O');
const players = [player1, player2];

function changeGameMode(e){
    if(e.target.id == 'ai'){
        gameMode = 2;
        aiInputDiv.style.visibility = 'visible';
        pvpInputsDiv.style.visibility = 'hidden';
        startDiv.style.visibility = 'visible';
        aiMarkSelectionDiv.style.visibility = 'visible';
    }
    else if(e.target.id == 'pvp'){
        gameMode = 1;
        aiInputDiv.style.visibility = 'hidden';
        pvpInputsDiv.style.visibility = 'visible';
        startDiv.style.visibility = 'visible';
        aiMarkSelectionDiv.style.visibility = 'hidden';
    }
}

function startGame(){
    checkForNameInputs();
    errDiv.innerHTML = errMsg;
    if(valid){
        renderBoard(currentPos);
        aiBtn.style.visibility = 'hidden';
        pvpBtn.style.visibility = 'hidden';
        turnDiv.style.visibility = 'visible';
        aiInputDiv.style.visibility = 'hidden';
        pvpInputsDiv.style.visibility = 'hidden';
        startDiv.style.visibility = 'hidden';
        aiMarkSelectionDiv.style.visibility = 'hidden';
        playersDiv.style.visibility = 'visible';
        playersDiv.innerHTML = `${player1Name} VS ${player2Name}`;
        // if (gameMode == 2){
        //     if(aiMark == 'X'){
        //         makeAiMove();
        //     }
        // }
    }
    
}

function checkForNameInputs(){
    switch(gameMode){
        case 1:
            if((firstNameInput.value == '') || (!firstNameInput.value)){
                valid = false;
                errMsg = 'Please Enter Players Names';
            }
            else if((secondNameInput.value == '') || (!secondNameInput.value)){
                valid = false;
                errMsg = 'Please Enter Players Names';
            }
            else {
                valid = true;
                errMsg = '';
                player1Name = firstNameInput.value;
                player2Name = secondNameInput.value;
            }
            break;
        case 2:
            if((aiNameInput.value == '') || (!aiNameInput)){
                valid = false;
                errMsg = 'Please Enter your Name';
            }
            else {
                valid = true;
                errMsg = '';
                if(aiMarkSelectInput.checked){
                    player1Name = aiNameInput.value;
                    player2Name = 'AI';
                    aiMark = 'O';
                    huMark = 'X';
                }
                else {
                    player1Name = 'AI';
                    player2Name = aiNameInput.value;
                    aiMark = 'X';
                    huMark = 'O';
                }
            }
            break;
    }
}

function renderBoard(pos){
    if(turnNumber == 0){
        let count =0;
        boardArr.forEach(box => {
            const boxDiv = document.createElement('div');
            boxDiv.classList.add('box');
            boxDiv.id = 'item' + count;
            const divContent = document.createElement('div');
            divContent.classList.add('box-content');
            divContent.id = 'sign' + count;
            count ++;
            divContent.innerHTML = box;
            boxDiv.appendChild(divContent);
            contentDiv.appendChild(boxDiv);
            boxDiv.addEventListener('click', makeMove);
        });
        turnNumber ++;
        contentDiv.style.visibility = 'visible';
    }
    else {
        let boxId = '#sign' + pos;
        let boxContainerId = '#item' + pos;
        document.querySelector(boxId).innerHTML = boardArr[pos];
        document.querySelector(boxContainerId).classList.add('marked');
        turnNumber ++;
        if(currentTurn == 'X'){
            xPositions.push(pos);
        }
        else {
            oPositions.push(pos);
        }
        gameBoard.gameOver();
        if(winner != ''){
            winnerDiv.style.visibility = 'visible';
            if(winner == 'X'){
                winner = player1Name;
            }
            else {
                winner = player2Name;
            }
            winnerDiv.innerHTML = `The Winner is ${winner}`;
            restartDiv.style.visibility = 'visible';
            turnDiv.style.visibility = 'hidden';
            makeBoxesUnclickable();
            secondNameInput.value = '';
            firstNameInput.value = '';
            aiNameInput.value = '';
        }
        else if (turnNumber == 10){
            winnerDiv.style.visibility = 'visible';
            winnerDiv.innerHTML = 'It is a Tie';
            restartDiv.style.visibility = 'visible';
            turnDiv.style.visibility = 'hidden';
            secondNameInput.value = '';
            firstNameInput.value = '';
            aiNameInput.value = '';
            makeBoxesUnclickable();
        }
    }
    if ((winner == '') && (turnNumber != 10)) {
        if(gameMode == 2){
            if(aiMark == 'X'){
                if(turnNumber%2 != 0){
                    makeAiMove();
                }
            }
            else {
                if(turnNumber%2 == 0){
                    makeAiMove();
                }
            }
        }
    }
}


function makeMove(e){
    let pos = -1;
    pos = parseInt(e.target.id.charAt(4));
    if (gameBoard.isEmpty(pos)){
        if(turnNumber%2 == 0){
            currentTurn = 'O';
            turnSpan.classList.remove('o-turn');
            turnSpan.classList.add('x-turn');
        }
        else {
            currentTurn = 'X';
            turnSpan.classList.add('o-turn');
            turnSpan.classList.remove('x-turn');
        }
        
        players.forEach(player => {
            // player[0] is the player sign 'X' or 'O'
            if (player[0] == currentTurn){
                if (currentTurn == 'X'){
                    player.drawX(pos);
                }
                else {
                    player.drawO(pos);
                }
            }
        });
        renderBoard(pos);
    }
}

function makeAiMove(){
    let foundPos = false;
    let pos = -1;
    while(!foundPos){
        pos = generateRandom();
        if(gameBoard.isEmpty(pos)){
            foundPos = true;
        }
    }
    if(aiMark == 'X'){
        player1.drawX(pos);
        currentTurn = 'X';
        turnSpan.classList.add('o-turn');
        turnSpan.classList.remove('x-turn');
    }
    else {
        player2.drawO(pos);
        currentTurn = 'O';
        turnSpan.classList.remove('o-turn');
        turnSpan.classList.add('x-turn');
    }
    renderBoard(pos);
}

function generateRandom(maxLimit = 9){
    let rand = Math.random() * maxLimit;
  
    rand = Math.floor(rand); // 99
  
    return rand;
  }

function restartGame(){
    // Resets all the game Variables
    boardArr = ['','','','','','','','',''];
    xPositions = [];
    oPositions = [];
    currentTurn = '';
    winner = '';
    turnNumber = 0;
    currentPos = -1;
    gameMode = 0;
    winnerDiv.style.visibility = 'hidden';
    aiBtn.style.visibility = 'visible';
    pvpBtn.style.visibility = 'visible';
    contentDiv.style.visibility = 'hidden';
    contentDiv.innerHTML = '';
    restartDiv.style.visibility = 'hidden';
    playersDiv.style.visibility = 'hidden';
    turnSpan.classList.remove('o-turn');
    turnSpan.classList.add('x-turn');
}

function makeBoxesUnclickable(){
    const allBoxes = document.querySelectorAll('.box');
    allBoxes.forEach(box => {
        box.style.pointerEvents = "none";
    })
}

