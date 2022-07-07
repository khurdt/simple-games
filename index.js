let origBoard;
const humanPlayer = 'O';
const aiPlayer = 'X';
const winCombos = [
  //top to bottom
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  //left to right
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  //diagonal
  [0, 4, 8],
  [6, 4, 2]
]

let difficulty = 'easy';
let emptySpots = undefined;

const cells = document.querySelectorAll('.cell');
const levels = document.querySelectorAll('.level');

startGame();

function startGame() {
  document.querySelector('.endgame').style.display = 'none';
  document.querySelector('.difficulty').innerText = difficulty;
  origBoard = Array.from(Array(9).keys());
  console.log(origBoard);
  for (let i = 0; i < cells.length; i++) {
    cells[i].innerText = '';
    cells[i].style.removeProperty('background-color');
    cells[i].addEventListener('click', turnClick, false);
  }
}

function turnClick(square) {
  if (typeof origBoard[square.target.id] == 'number') {
    turn(square.target.id, humanPlayer);

    if (!checkWin(origBoard, humanPlayer) && !checkTie()) {
      turn(bestSpot(), aiPlayer);
    }
  }
}

function turn(squareId, player) {
  origBoard[squareId] = player;
  document.getElementById(squareId).innerText = player;
  let gameWon = checkWin(origBoard, player);
  if (gameWon) gameOver(gameWon);
}

function checkWin(board, player) {
  /** 
   * reduce method will go through every element in the board array and give a single value
  * a is the accumulator which is the value that is given back at the end 
  * e is the element of the board array
  * i is the index
  */
  let plays = board.reduce((a, e, i) =>
    //if element equals player then concat index
    (e === player) ? a.concat(i) : a, []);

  let gameWon = null;
  //win is the the 3 values in array
  for (let [index, win] of winCombos.entries()) {
    //has a player played in every spot of a certain array, if so, then elem will equal true;
    if (win.every((element) => plays.indexOf(element) > -1)) {
      gameWon = {
        index: index,
        player: player
      };
      break;
    }
  }
  return gameWon;
}

function gameOver(gameWon) {
  for (let index of winCombos[gameWon.index]) {
    document.getElementById(index).style.backgroundColor = gameWon.player === humanPlayer ? 'blue' : 'red';
  }
  for (let i = 0; i < cells.length; i++) {
    cells[i].removeEventListener('click', turnClick, false);
  }
  declareWinner(gameWon.player + ' wins');
}

function declareWinner(who) {
  document.querySelector('.endgame').style.display = 'block';
  document.querySelector('.endgame-text').innerText = who;
}

function emptySquares() {
  emptySpots = origBoard.filter(id => typeof id == 'number');
  return emptySpots;
}

function openSettings() {
  document.querySelector('.settings').style.display = 'block';
  for (let i = 0; i < levels.length; i++) {
    levels[i].addEventListener('click', changeDifficulty, false);
  }
}

function closeSettings() {
  document.querySelector('.warning').innerText = '';
  document.querySelector('.settings').style.display = 'none';
}

function changeDifficulty(e) {
  if (emptySquares().length === 9) {
    difficulty = e.target.id;
    document.querySelector('.difficulty').innerText = difficulty;
    closeSettings();
  } else {
    document.querySelector('.warning').innerText = 'currently in a game!'
  }
}

function bestSpot() {
  let aiPlays = origBoard.filter(element => element === aiPlayer).length
  console.log(aiPlays);
  if (difficulty === 'easy') {
    return emptySquares()[Math.floor(Math.random() * emptySpots.length)];
  } else if (difficulty === 'moderate') {
    if (aiPlays < 2) {
      return minimax(origBoard, aiPlayer).index
    } else {
      return emptySquares()[Math.floor(Math.random() * emptySpots.length)];
    }
  } else if (difficulty === 'hard') {
    if (aiPlays < 3) {
      return minimax(origBoard, aiPlayer).index
    } else {
      return emptySquares()[Math.floor(Math.random() * emptySpots.length)];
    }
  } else if (difficulty === 'impossible') {
    return minimax(origBoard, aiPlayer).index
  }
}

function checkTie() {
  if (emptySquares().length === 0) {
    for (let i = 0; i < cells.length; i++) {
      cells[i].style.backgroundColor = 'green';
      cells[i].removeEventListener('click', turnClick, false);
    }
    declareWinner('Tie Game!');
    return true;
  }
  return false;
}

//straight from youtube
function minimax(newBoard, player) {
  let availSpots = emptySquares(newBoard)

  if (checkWin(newBoard, player)) {
    return { score: -10 };
  } else if (checkWin(newBoard, aiPlayer)) {
    return { score: 10 };
  } else if (availSpots.length === 0) {
    return { score: 0 };
  }
  let moves = [];
  for (let i = 0; i < availSpots.length; i++) {
    let move = {};
    move.index = newBoard[availSpots[i]];
    newBoard[availSpots[i]] = player;

    if (player == aiPlayer) {
      let result = minimax(newBoard, humanPlayer);
      move.score = result.score;
    } else {
      let result = minimax(newBoard, aiPlayer);
      move.score = result.score;
    }

    newBoard[availSpots[i]] = move.index;

    moves.push(move);
  }

  let bestMove;
  if (player === aiPlayer) {
    let bestScore = -10000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    let bestScore = 10000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
}