import React from 'react';
import { useEffect } from 'react';
import { useRef, useState } from 'react';

export default function TicTacToeGame(props) {
    const { difficulty, localMultiplayer, firstPlayer, secondPlayer, aiPlayer, resumeGame, inGame, setInGame, setResumeGame } = props;
    const [endgame, setEndGame] = useState(true);
    const [origBoard, setOrigBoard] = useState(true);
    const cells = useRef();
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
    let emptySpots;

    useEffect(() => {
        if (inGame === true) {
            startGame();
        }
    }, [inGame])

    const startGame = () => {
        if (localStorage.getItem('savedGame') === null || resumeGame === true) {
            setOrigBoard(Array.from(Array(9).keys()));
            for (let i = 0; i < cells.length; i++) {
                cells[i].innerText = '';
                cells[i].style.removeProperty('background-color');
                cells[i].addEventListener('click', turnClick, false);
            }
        } else {
            setOrigBoard = JSON.parse(localStorage.getItem('savedGame'));
            for (let i = 0; i < cells.length; i++) {
                for (let i = 0; i < origBoard.length; i++) {
                    cells[i].innerText = (origBoard[i] === aiPlayer || origBoard[i] === firstPlayer) ? origBoard[i] : '';
                    cells[i].style.removeProperty('background-color');
                    cells[i].addEventListener('click', turnClick, false);
                }
            }
        }
    }

    /**---------------------------------------------------Turns----------------------------------------------------------------------*/

    const turnClick = (square) => {
        //make sure no one takes more turns than they ought
        let humanMoves = origBoard.filter(elem => elem === firstPlayer),
            aiMoves = origBoard.filter(elem => elem === aiPlayer),
            p2Moves = origBoard.filter(elem => elem === secondPlayer);
        if (typeof origBoard[square.target.id] == 'number') {
            //first player turn
            if ((humanMoves.length <= aiMoves.length || humanMoves.length <= p2Moves.length)) {
                turn(square.target.id, firstPlayer);
            }
            //ai turn
            if (!checkWin(origBoard, firstPlayer) && !checkTie() && localMultiplayer === false && (aiMoves <= humanMoves)) {
                turn(bestSpot(), aiPlayer);
            }
            //second player turn
            if (!checkWin(origBoard, firstPlayer) && !checkTie() && (humanMoves > p2Moves) && localMultiplayer === true) {
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
            document.getElementById(index).style.backgroundColor = gameWon.player === firstPlayer ? 'blue' : 'red';
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
                let result = minimax(newBoard, firstPlayer);
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
            <table>
                <tbody>
                    <tr>
                        <td className="cell" ref={cells} id="0"></td>
                        <td className="cell" ref={cells} id="1"></td>
                        <td className="cell" ref={cells} id="2"></td>
                    </tr>
                    <tr>
                        <td className="cell" ref={cells} id="3"></td>
                        <td className="cell" ref={cells} id="4"></td>
                        <td className="cell" ref={cells} id="5"></td>
                    </tr>
                    <tr>
                        <td className="cell" ref={cells} id="6"></td>
                        <td className="cell" ref={cells} id="7"></td>
                        <td className="cell" ref={cells} id="8"></td>
                    </tr>
                </tbody>
            </table>
            <div className="endgame">
                <div className="endgame-text"></div>
                <button className="endgame-reset">Replay</button>
            </div>
        </div>
    );

}
