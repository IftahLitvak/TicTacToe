
// let boardArr = ['X','O','O','X','X','O','O','X','O'];
let boardArr = ['','','','','','','','',''];
let xPositions = [];
let oPositions = [];
let winPos = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
let currentTurn = '';
let winner = '';
let turnNumber = 0;
let currentPos = -1;

const contentDiv = document.querySelector('.content');

renderBoard(currentPos);

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
            document.querySelector('.main-text').innerHTML = `The Winner is ${winner}`;
        }
        else if (turnNumber == 10){
            document.querySelector('.main-text').innerHTML = 'It is a Tie';
        }
    }


}

const player = (type) => {
    
    const prototype = gameBoard;
    return Object.assign({}, prototype, type);
};

const iftah = player('X');
const liel = player('O');
const players = [iftah, liel];

function makeMove(e){
    let pos = -1;
    pos = parseInt(e.target.id.charAt(4));
    if (gameBoard.isEmpty(pos)){
        if(turnNumber%2 == 0){
            currentTurn = 'O';
        }
        else {
            currentTurn = 'X';
        }
        players.forEach(player => {
            if (player[0] == currentTurn){
                if (currentTurn == 'X'){
                    boardArr[pos] = 'X';
                    player.drawX(pos);
                }
                else {
                    boardArr[pos] = 'O';
                    player.drawO(pos);
                }
            }
        });
        renderBoard(pos);
    }
    

}


