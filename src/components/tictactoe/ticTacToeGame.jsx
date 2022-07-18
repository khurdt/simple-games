import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { Row, Col, Button, Modal } from 'react-bootstrap';

export default function TicTacToeGame(props) {
    const { difficulty, localMultiplayer, firstPlayer, secondPlayer, aiPlayer, resumeGame, inGame, setInGame, setResumeGame } = props;
    const [endgame, setEndGame] = useState(false);
    const [tieGame, setTieGame] = useState(false);
    const [show, setShow] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [winCombo, setWinCombo] = useState([]);
    const [origBoard, setOrigBoard] = useState(
        (localStorage.getItem('savedGame') === null || resumeGame === false) ?
            Array.from(Array(9).keys()) :
            JSON.parse(localStorage.getItem('savedGame'))
    );
    const [players, setPlayers] = useState([]);
    const [gameWon, setGameWon] = useState({
        player: '',
        index: [],
        color: ''
    });
    // const cells = useRef();
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
        if (localMultiplayer) {
            setPlayers([firstPlayer, secondPlayer])
        } else {
            setPlayers([firstPlayer, aiPlayer])
        }
        setResumeGame(true);
    }, [inGame, origBoard])

    const resetGame = () => {
        setEndGame(false);
        setShow(false);
        setOrigBoard(Array.from(Array(9).keys()));
        setWinCombo([]);
        setGameWon({});
        setTieGame(false);
    }

    /**---------------------------------------------------Turns----------------------------------------------------------------------*/

    const turnClick = (item, i) => {
        let p1Moves = (origBoard.filter(elem => elem === firstPlayer).length),
            aiMoves = (origBoard.filter(elem => elem === aiPlayer).length),
            p2Moves = (origBoard.filter(elem => elem === secondPlayer).length);

        if (typeof origBoard[i] == 'number') {
            if ((p1Moves <= aiMoves || p1Moves <= p2Moves)) {
                turn(i, firstPlayer);
            }
            //ai turn
            if (!checkWin(origBoard, firstPlayer) && !checkTie() && localMultiplayer === false && (aiMoves <= p1Moves)) {
                turn(bestSpot(), aiPlayer);
            }
            //second player turn
            if (!checkWin(origBoard, firstPlayer) && !checkTie() && (p1Moves > p2Moves) && localMultiplayer === true) {
                turn(i, secondPlayer);
            }
        }
    }

    const turn = (squareId, player) => {
        origBoard[squareId] = player;
        setRefresh(!refresh);
        localStorage.setItem('savedGame', JSON.stringify(origBoard));
        let gameWon = checkWin(origBoard, player);
        (gameWon) && gameOver(gameWon);
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
        let gameWon = null
        //win is the the 3 values in array
        for (let [index, win] of winCombos.entries()) {
            //has a player played in every spot of a certain array, if so, then elem will equal true;
            if (win.every((element) => plays.indexOf(element) > -1)) {
                gameWon = {
                    index: index,
                    player: player,
                    color: ((player === aiPlayer ? 'red' : (player === firstPlayer) ? 'blue' : 'purple'))
                };
                break;
            }
        }
        return gameWon;
    }

    const gameOver = (gameWon) => {
        setGameWon(gameWon);
        let winCombo = [];
        for (let index of winCombos[gameWon.index]) {
            winCombo.push(index);
        };
        setWinCombo(winCombo);
        declareWinner(gameWon.player + ' wins');
    }

    const checkTie = () => {
        if (emptySquares().length === 0) {
            setTieGame(true);
            declareWinner();
            return true;
        }
        return false;
    }

    const declareWinner = () => {
        localStorage.removeItem('savedGame');
        setEndGame(true);
        setResumeGame(false);
        setShow(true);
    }

    const emptySquares = () => {
        emptySpots = origBoard.filter(id => typeof id == 'number');
        return emptySpots;
    }

    const bestSpot = () => {
        let aiPlays = origBoard.filter(element => element === aiPlayer).length

        if (difficulty === 'easy') {
            if (aiPlays <= 1 && aiPlays > 0) {
                return minimax(origBoard, aiPlayer).index
            } else {
                return emptySquares()[Math.floor(Math.random() * emptySpots.length)];
            }
        }
        else if (difficulty === 'moderate') {
            if (aiPlays < 2 && aiPlays > 0) {
                return minimax(origBoard, aiPlayer).index
            } else {
                return emptySquares()[Math.floor(Math.random() * emptySpots.length)];
            }
        }
        else if (difficulty === 'hard') {
            if (aiPlays < 3 && aiPlays > 0) {
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
    // you can access the elements with itemsRef.current[n]

    return (
        <div>
            <Row>
                <Col className='m-3'>
                    {endgame === true ?
                        <Button type='button' onClick={() => { setEndGame(false); setInGame(false); }}>Return</Button> :
                        <Button type='button' onClick={() => { setInGame(false); }}>Return</Button>
                    }
                </Col>
            </Row>
            <Row className='justify-content-md-center'>
                <table className='table' style={(tieGame === true) ? { backgroundColor: 'green' } : {}}>
                    <tbody>
                        <tr className='tr'>
                            {origBoard.map((item, i) => {
                                if (i < 3) {
                                    return (
                                        <td
                                            key={i}
                                            onClick={() => { turnClick(item, i) }}
                                            style={(gameWon.player === item && winCombo.includes(i)) ? { backgroundColor: gameWon.color } : {}}
                                            className='cell'>
                                            <div className={(players.includes(item)) ? 'clicked' : 'notClicked'}>{item}</div>
                                        </td>
                                    );
                                }
                            })}
                        </tr>
                        <tr className='tr'>
                            {origBoard.map((item, i) => {
                                if (i >= 3 && i < 6) {
                                    return (
                                        <td
                                            key={i}
                                            onClick={() => { turnClick(item, i) }}
                                            style={(gameWon.player === item && winCombo.includes(i)) ? { backgroundColor: gameWon.color } : {}}
                                            className='cell'>
                                            <div className={(players.includes(item)) ? 'clicked' : 'notClicked'}>{item}</div>
                                        </td>
                                    );
                                }
                            })}
                        </tr>
                        <tr className='tr'>
                            {origBoard.map((item, i) => {
                                if (i >= 6) {
                                    return (
                                        <td
                                            key={i}
                                            onClick={() => { turnClick(item, i) }}
                                            style={(gameWon.player === item && winCombo.includes(i)) ? { backgroundColor: gameWon.color } : {}}
                                            className='cell'>
                                            <div className={(players.includes(item)) ? 'clicked' : 'notClicked'}>{item}</div>
                                        </td>
                                    );
                                }
                            })}
                        </tr>
                    </tbody>
                </table>
            </Row>
            <Modal show={show} onHide={() => setShow(false)} className='details-modal .modal-content'>
                <Modal.Header style={{ textAlign: 'center', fontSize: '30px' }} closeButton>
                    Game!
                </Modal.Header>
                <Modal.Body style={{ fontSize: '20px', minHeight: '100px', textAlign: 'center', marginTop: '20px', color: (tieGame === true) ? 'green' : gameWon.color }}>{(tieGame === true) ? 'Its a Tie!' : `${gameWon.player} Wins!`}</Modal.Body>
                <Modal.Footer className='.details-footer'>
                    <Button className='close-button' style={{ marginRight: 'auto' }} variant="secondary" onClick={() => { setEndGame(false); setInGame(false); setShow(false); }}>
                        Change Settings
                    </Button>
                    <Button className='close-button' variant="secondary" onClick={() => resetGame()}>
                        Replay
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );

}
