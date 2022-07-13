import React from 'react';
import TicTacToeGame from './ticTacToeGame';
import './ticTacToe.css';

export default function TicTacToeIntro() {
    let origBoard,
        humanPlayer,
        aiPlayer,
        secondPlayer,
        difficulty,
        emptySpots = undefined,
        localMultiplayer = (localStorage.getItem('multiplayer') !== null) ? JSON.parse(localStorage.getItem('multiplayer')) : false;

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

    const warning = undefined;
    // document.querySelector('.warning');
    const cells = undefined;
    // document.querySelectorAll('.cell');
    const levels = undefined;
    // document.querySelectorAll('.level');
    const aiName = undefined;
    // document.querySelector('#aiName');
    const playerName = undefined;
    // document.querySelector('#playerName');
    const secondPlayerName = undefined;
    // document.querySelector('#secondPlayer');

    // aiName.addEventListener('change', handleAiName, false);
    // playerName.addEventListener('change', handlePlayerName, false);
    // secondPlayerName.addEventListener('change', handleSecondPlayerName, false);

    const replay = () => {
        let replay = 'replay';
        for (let i = 0; i <= 8; i++) {
            document.getElementById(`${i}`).classList.remove('move');
        }
        startGame(replay);
    }

    const startGame = (replay) => {
        humanPlayer = (localStorage.getItem('playerName') !== null) ? (localStorage.getItem('playerName')) : 'O';
        aiPlayer = (localStorage.getItem('aiName') !== null) ? (localStorage.getItem('aiName')) : 'X';
        secondPlayer = (localStorage.getItem('secondPlayerName') !== null) ? (localStorage.getItem('secondPlayerName')) : 'X';
        difficulty = (localStorage.getItem('difficulty') !== null) ? localStorage.getItem('difficulty') : 'easy';
        aiName.value = aiPlayer;
        playerName.value = humanPlayer;
        secondPlayerName.value = secondPlayer;

        let badValues = [null, '', ' '];
        if (badValues.includes(aiPlayer) || badValues.includes(humanPlayer) || badValues.includes(secondPlayer)) {
            secondPlayer = 'X';
            secondPlayerName.value = 'X';
            aiPlayer = 'X';
            aiName.value = 'X';
            humanPlayer = 'O';
            playerName.value = 'O';
        }
        document.querySelector('.endgame').style.display = 'none';
        document.querySelector('.difficulty').innerText = difficulty;
        if (localStorage.getItem('savedGame') === null || replay !== undefined) {
            origBoard = Array.from(Array(9).keys());
            for (let i = 0; i < cells.length; i++) {
                cells[i].innerText = '';
                cells[i].style.removeProperty('background-color');
                cells[i].addEventListener('click', turnClick, false);
            }
        } else {
            origBoard = JSON.parse(localStorage.getItem('savedGame'));
            for (let i = 0; i < cells.length; i++) {
                for (let i = 0; i < origBoard.length; i++) {
                    cells[i].innerText = (origBoard[i] === aiPlayer || origBoard[i] === humanPlayer) ? origBoard[i] : '';
                    cells[i].style.removeProperty('background-color');
                    cells[i].addEventListener('click', turnClick, false);
                }
            }
        }
    }

    /**---------------------------------------------------Turns----------------------------------------------------------------------*/

    const turnClick = (square) => {
        //make sure no one takes more turns than they ought
        let humanMoves = origBoard.filter(elem => elem === humanPlayer),
            aiMoves = origBoard.filter(elem => elem === aiPlayer),
            p2Moves = origBoard.filter(elem => elem === secondPlayer);
        if (typeof origBoard[square.target.id] == 'number') {
            //first player turn
            if ((humanMoves.length <= aiMoves.length || humanMoves.length <= p2Moves.length)) {
                turn(square.target.id, humanPlayer);
            }
            //ai turn
            if (!checkWin(origBoard, humanPlayer) && !checkTie() && localMultiplayer === false && (aiMoves <= humanMoves)) {
                turn(bestSpot(), aiPlayer);
            }
            //second player turn
            if (!checkWin(origBoard, humanPlayer) && !checkTie() && (humanMoves > p2Moves) && localMultiplayer === true) {
                turn(square.target.id, secondPlayer);
            }
        }
    }

    const turn = (squareId, player) => {
        origBoard[squareId] = player;
        localStorage.setItem('savedGame', JSON.stringify(origBoard));
        document.getElementById(squareId).classList.add('move');
        document.getElementById(squareId).innerText = player;
        let gameWon = checkWin(origBoard, player);
        if (gameWon) gameOver(gameWon);
    }

    /**---------------------------------------------------Score Checking----------------------------------------------------------------------*/

    const checkWin = (board, player) => {
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

    const gameOver = (gameWon) => {
        for (let index of winCombos[gameWon.index]) {
            document.getElementById(index).style.backgroundColor = gameWon.player === humanPlayer ? 'blue' : 'red';
        }
        for (let i = 0; i < cells.length; i++) {
            cells[i].removeEventListener('click', turnClick, false);
        }
        declareWinner(gameWon.player + ' wins');
    }

    const checkTie = () => {
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

    const declareWinner = (who) => {
        localStorage.removeItem('savedGame');
        document.querySelector('.endgame').style.display = 'block';
        document.querySelector('.endgame-text').innerText = who;
    }

    const emptySquares = () => {
        emptySpots = origBoard.filter(id => typeof id == 'number');
        return emptySpots;
    }

    /**---------------------------------------------------Settings----------------------------------------------------------------------*/

    const openSettings = () => {
        document.querySelector('.settings').style.display = 'block';
        for (let i = 0; i < levels.length; i++) {
            levels[i].addEventListener('click', changeDifficulty, false);
        }
        if (localMultiplayer === true) {
            document.querySelector('.secondPlayer-settings').classList.add('display');
            document.querySelector('.single-player').classList.add('display');
        } else {
            document.querySelector('.ai-settings').classList.add('display');
            document.querySelector('.pass-and-play').classList.add('display');
        }
    }

    const closeSettings = () => {
        document.querySelector('.warning').innerText = '';
        document.querySelector('.settings').style.display = 'none';
    }

    const changeDifficulty = (e) => {
        if (emptySquares().length === 9) {
            difficulty = e.target.id;
            document.querySelector('.difficulty').innerText = difficulty;
            localStorage.setItem('difficulty', difficulty);
        } else {
            warning.innerText = `please reset game first before change`
            // warning.classList.add('hide');
        }
    }

    const handleAiName = (e) => {
        if (emptySquares().length === 9) {
            if (e.target.value !== humanPlayer) {
                aiPlayer = e.target.value
                localStorage.setItem('aiName', e.target.value);
            } else {
                warning.innerText = `icons cannot be the same`
                aiPlayer = 'X';
                aiName.value = 'X';
            }
        } else {
            warning.innerText = 'please reset game first before change';
            aiName.value = aiPlayer;
        }
    }

    const handlePlayerName = (e) => {
        if (emptySquares().length === 9) {
            if (e.target.value !== aiPlayer) {
                humanPlayer = e.target.value;
                localStorage.setItem('playerName', e.target.value);
            } else {
                warning.innerText = `icons cannot be the same`
                humanPlayer = 'O';
                playerName.value = 'O';
            }
        } else {
            warning.innerText = 'please reset game first before change'
            playerName.value = humanPlayer;
        }
    }

    const handleSecondPlayerName = (e) => {
        if (emptySquares().length === 9) {
            if (e.target.value !== humanPlayer) {
                secondPlayer = e.target.value;
                localStorage.setItem('secondPlayerName', e.target.value);
            } else {
                warning.innerText = `icons cannot be the same`
                secondPlayer = 'X';
                playerName.value = 'X';
            }
        } else {
            warning.innerText = 'please reset game first before change'
            playerName.value = secondPlayer;
        }
    }

    const passAndPlay = () => {
        localMultiplayer = true;
        localStorage.setItem('multiplayer', JSON.stringify(true));
        document.querySelector('.secondPlayer-settings').classList.add('display');
        document.querySelector('.single-player').classList.add('display');
        document.querySelector('.ai-settings').classList.remove('display');
        document.querySelector('.pass-and-play').classList.remove('display');
        replay();
    }

    const singlePlayer = () => {
        localMultiplayer = false;
        localStorage.setItem('multiplayer', JSON.stringify(false));
        document.querySelector('.secondPlayer-settings').classList.remove('display');
        document.querySelector('.single-player').classList.remove('display');
        document.querySelector('.ai-settings').classList.add('display');
        document.querySelector('.pass-and-play').classList.add('display');
        replay();
    }

    /**---------------------------------------------------AI logic----------------------------------------------------------------------*/

    const bestSpot = () => {
        let aiPlays = origBoard.filter(element => element === aiPlayer).length

        if (difficulty === 'easy') {
            return emptySquares()[Math.floor(Math.random() * emptySpots.length)];
        }
        else if (difficulty === 'moderate') {
            if (aiPlays < 2) {
                return minimax(origBoard, aiPlayer).index
            } else {
                return emptySquares()[Math.floor(Math.random() * emptySpots.length)];
            }
        }
        else if (difficulty === 'hard') {
            if (aiPlays < 3) {
                return minimax(origBoard, aiPlayer).index
            } else {
                return emptySquares()[Math.floor(Math.random() * emptySpots.length)];
            }
        }
        else if (difficulty === 'impossible') {
            return minimax(origBoard, aiPlayer).index
        }
    }

    //straight from youtube
    const minimax = (newBoard, player) => {
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

            /**this will call minimax again and again alternating between players 
             * when each player takes there move, it will add its score to the moves array
            */
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
            //this will pick the first highest score
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        } else {
            let bestScore = 10000;
            //this will pick the lowest score
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }

        return moves[bestMove];
    }


    return (
        <div>
            <div className="settings">
                <div onClick={closeSettings()} className="exit-settings">X</div>
                <div>Difficulty: <span className="difficulty"></span></div>
                <div className="difficulty-levels">
                    <button className="level" id="easy">Easy</button>
                    <button className="level" id="moderate">Moderate</button>
                    <button className="level" id="hard">Hard</button>
                    <button className="level" id="impossible">Impossible</button>
                </div>
                <div className="warning"></div>
                <form className="icons">
                    <div>
                        <label for="playerName">P1</label>
                        <input type="text" id="playerName" name="playerName" maxlength="1" />
                    </div>
                    <div className="ai-settings">
                        <label for="aiName">AI</label>
                        <input type="text" id="aiName" name="aiName" maxlength="1" />
                    </div>
                    <div className="secondPlayer-settings">
                        <label for="secondPlayer">P2</label>
                        <input type="text" id="secondPlayer" name="secondPlayer" maxlength="1" />
                    </div>
                </form>
                <button onClick={passAndPlay()} className="pass-and-play">Pass And Play</button>
                <button onClick={singlePlayer()} className="single-player">Single Player</button>
                <button onClick={replay()} className="reset">Reset Game</button>
                <button onClick={closeSettings()} className="close-settings">Close</button>
            </div>
            <TicTacToeGame />
        </div>
    );
}



