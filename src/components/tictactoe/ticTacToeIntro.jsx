import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import TicTacToeGame from './ticTacToeGame';
import './ticTacToe.css';

export default function TicTacToeIntro(props) {
    const { onBackClick } = props;
    const [firstPlayer, setFirstPlayer] = useState('X');
    const [aiPlayer, setAiPlayer] = useState('X');
    const [secondPlayer, setSecondPlayer] = useState('X');
    const [difficulty, setDifficulty] = useState('easy');
    const [localMultiplayer, setLocalMultiplayer] = useState(false);
    const [warning, setWarning] = useState('');
    const [inGame, setInGame] = useState(false);
    const [resumeGame, setResumeGame] = useState(false);

    useEffect(() => {
        setFirstPlayer((localStorage.getItem('playerName') !== null) ? (localStorage.getItem('playerName')) : 'O');
        setAiPlayer((localStorage.getItem('aiName') !== null) ? (localStorage.getItem('aiName')) : 'X');
        setSecondPlayer((localStorage.getItem('secondPlayerName') !== null) ? (localStorage.getItem('secondPlayerName')) : 'X');
        setDifficulty((localStorage.getItem('difficulty') !== null) ? localStorage.getItem('difficulty') : 'easy');
        setLocalMultiplayer((localStorage.getItem('mulitplayer') !== null) ? localStorage.getItem('multiplayer') : false);
    }, []);

    /**---------------------------------------------------Settings----------------------------------------------------------------------*/

    const changeDifficulty = (difficulty) => {
        setDifficulty(difficulty);
        localStorage.setItem('difficulty', difficulty);
        setResumeGame(false);
    }

    const handleAiName = (name) => {
        if (name !== firstPlayer) {
            setAiPlayer(name);
            localStorage.setItem('aiName', name);
            setResumeGame(false);
        }
    }

    const handlePlayerName = (name) => {
        if (name !== aiPlayer) {
            setFirstPlayer(name);
            localStorage.setItem('playerName', name);
            setResumeGame(false);
        }
    }

    const handleSecondPlayerName = (name) => {
        if (name !== firstPlayer) {
            setSecondPlayer(name);
            localStorage.setItem('secondPlayerName', name);
            setResumeGame(false);
        }
    }

    const passAndPlay = () => {
        setLocalMultiplayer(true);
        localStorage.setItem('multiplayer', JSON.stringify(true));
        setResumeGame(false);
    }

    const singlePlayer = () => {
        setLocalMultiplayer(false);
        localStorage.setItem('multiplayer', JSON.stringify(false));
        setResumeGame(false);
    }

    return (
        <div>
            {inGame ?
                <TicTacToeGame
                    difficulty={difficulty}
                    localMultiplayer={localMultiplayer}
                    firstPlayer={firstPlayer}
                    secondPlayer={secondPlayer}
                    aiPlayer={aiPlayer}
                    resumeGame={resumeGame}
                    inGame={inGame}
                    setInGame={setInGame}
                    setResumeGame={setResumeGame} />
                :
                <div>
                    <Row>
                        <Col className='m-3'>
                            <Button type='button' onClick={() => { onBackClick() }}>Return</Button>
                        </Col>
                    </Row>
                    <div style={{ marginRight: '10px', marginLeft: '10px' }}>
                        <Card className='m-auto' style={{ maxWidth: '500px', backgroundColor: '#1E2127', color: 'white' }}>
                            <Card.Title className='m-2' style={{ fontSize: '30px' }} >
                                Tic Tac Toe:
                            </Card.Title>
                            <Row className='m-auto'>
                                <Col> <Button onClick={singlePlayer} style={(!localMultiplayer) ? { borderColor: 'red', width: '130px' } : { width: '130px' }}>Single Player</Button></Col>
                                <Col><Button onClick={passAndPlay} style={(localMultiplayer) ? { borderColor: 'red', width: '130px' } : { width: '130px' }}>Pass And Play</Button></Col>
                            </Row>
                            <Row className='m-auto'>
                                <Col>
                                    <Form style={{ display: 'flex', margin: 'auto' }}>
                                        <Form.Group className='m-2' style={{ width: '100px' }} >
                                            <Form.Label>P1:</Form.Label>
                                            <Form.Control
                                                style={{ backgroundColor: '#1E2127', color: 'white' }}
                                                type='text'
                                                value={firstPlayer}
                                                onChange={(e) => handlePlayerName(e.target.value)} required />
                                            {/* {usernameErr && <p style={{ color: 'red', padding: '1px' }}>{usernameErr}</p>} */}
                                        </Form.Group>
                                        {localMultiplayer ?
                                            <Form.Group className='m-2' style={{ width: '100px' }}>
                                                <Form.Label>P2:</Form.Label>
                                                <Form.Control
                                                    style={{ backgroundColor: '#1E2127', color: 'white' }}
                                                    type='text'
                                                    value={secondPlayer}
                                                    onChange={(e) => handleSecondPlayerName(e.target.value)} required />
                                                {/* {passwordErr && <p style={{ color: 'red', padding: '1px' }}>{passwordErr}</p>} */}
                                            </Form.Group> :
                                            <Form.Group className='m-2' style={{ width: '100px' }}>
                                                <Form.Label>AI:</Form.Label>
                                                <Form.Control
                                                    style={{ backgroundColor: '#1E2127', color: 'white' }}
                                                    type='text'
                                                    value={aiPlayer}
                                                    onChange={(e) => handleAiName(e.target.value)} required />
                                                {/* {emailErr && <p style={{ color: 'red', padding: '1px' }}>{emailErr}</p>} */}
                                            </Form.Group>
                                        }
                                    </Form>
                                </Col>
                            </Row>
                            {!localMultiplayer &&
                                <Row className='m-auto pt-2'>
                                    <Col style={{ display: 'flex', flexDirection: 'column' }}>
                                        <h4 style={{ textAlign: 'center' }}>Difficulty:</h4>
                                        <Button className="m-2 difficulty-buttons" style={(difficulty === 'easy') ? { backgroundColor: 'green' } : {}} onClick={() => changeDifficulty('easy')}>easy</Button>
                                        <Button className="m-2 difficulty-buttons" style={(difficulty === 'moderate') ? { backgroundColor: 'yellow' } : {}} onClick={() => changeDifficulty('moderate')}>moderate</Button>
                                        <Button className="m-2 difficulty-buttons" style={(difficulty === 'hard') ? { backgroundColor: 'orange' } : {}} onClick={() => changeDifficulty('hard')}>hard</Button>
                                        <Button className="m-2 difficulty-buttons" style={(difficulty === 'impossible') ? { backgroundColor: 'red' } : {}} onClick={() => changeDifficulty('impossible')}>impossible</Button>
                                    </Col>
                                </Row>
                            }
                            <Row style={{ marginRight: '1px', marginBottom: '10px', marginTop: '20px' }}>
                                <Col></Col>
                                <Col></Col>
                                <Col>
                                    {resumeGame ?
                                        <Button style={{ width: '150px' }} onClick={() => setInGame(true)}>Resume Game</Button> :
                                        <Button style={{ width: '150px' }} onClick={() => setInGame(true)}>Start Game</Button>
                                    }
                                </Col>
                            </Row>
                        </Card>
                    </div>
                </div>
            }
        </div>
    );
}



