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

    const handleAiName = (e) => {
        if (e.target.value !== firstPlayer) {
            setAiPlayer(e.target.value);
            localStorage.setItem('aiName', e.target.value);
            setResumeGame(false);
        }
    }

    const handlePlayerName = (e) => {
        if (e.target.value !== aiPlayer) {
            setFirstPlayer(e.target.value);
            localStorage.setItem('playerName', e.target.value);
            setResumeGame(false);
        }
    }

    const handleSecondPlayerName = (e) => {
        if (e.target.value !== firstPlayer) {
            setSecondPlayer(e.target.value);
            localStorage.setItem('secondPlayerName', e.target.value);
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
                        <Col>
                            <Button type='button' onClick={() => { onBackClick() }}>Return</Button>
                        </Col>
                    </Row>
                    <Card className='m-auto' style={{ maxWidth: '500px', backgroundColor: '#1E2127', color: 'white' }}>
                        <Card.Title style={{ fontSize: '30px' }} className='m-3'>Personal Info</Card.Title>
                        <Row>
                            <Col className='m-3' xs={10} md={4}>
                                <Form>
                                    <Form.Group className='m-1'>
                                        <Form.Label>P1:</Form.Label>
                                        <Form.Control
                                            style={{ backgroundColor: '#1E2127', color: 'white' }}
                                            type='text'
                                            value={firstPlayer}
                                            onChange={(e) => handlePlayerName(e.target.value)} required />
                                        {/* {usernameErr && <p style={{ color: 'red', padding: '1px' }}>{usernameErr}</p>} */}
                                    </Form.Group>
                                    {localMultiplayer ?
                                        <Form.Group className='m-1'>
                                            <Form.Label>P2:</Form.Label>
                                            <Form.Control
                                                style={{ backgroundColor: '#1E2127', color: 'white' }}
                                                type='text'
                                                value={secondPlayer}
                                                onChange={(e) => handleSecondPlayerName(e.target.value)} required />
                                            {/* {passwordErr && <p style={{ color: 'red', padding: '1px' }}>{passwordErr}</p>} */}
                                        </Form.Group> :
                                        <Form.Group className='m-1'>
                                            <Form.Label>AI:</Form.Label>
                                            <Form.Control
                                                style={{ backgroundColor: '#1E2127', color: 'white' }}
                                                type='text'
                                                value={aiPlayer}
                                                onChange={(e) => handleAiName(e.target.value)} required />
                                            {/* {emailErr && <p style={{ color: 'red', padding: '1px' }}>{emailErr}</p>} */}
                                        </Form.Group>
                                    }
                                    {localMultiplayer ?
                                        <Button onClick={singlePlayer} className="m-3" variant='primary'>Single Player</Button> :
                                        <Button onClick={passAndPlay} className="m-3" variant='primary'>Pass And Play</Button>
                                    }
                                </Form>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Button className="m-3" style={{ width: '110px' }} onClick={() => changeDifficulty('easy')}>easy</Button>
                                <Button className="m-3" style={{ width: '110px' }} onClick={() => changeDifficulty('moderate')}>moderate</Button>
                                <Button className="m-3" style={{ width: '110px' }} onClick={() => changeDifficulty('hard')}>hard</Button>
                                <Button className="m-3" style={{ width: '110px' }} onClick={() => changeDifficulty('impossible')}>impossible</Button>
                            </Col>
                        </Row>
                    </Card>
                    <Row className='ml-auto'>
                        <Col>
                            {resumeGame ?
                                <Button onClick={() => setInGame(true)}>Resume Game</Button> :
                                <Button onClick={() => setInGame(true)}>Start Game</Button>
                            }
                        </Col>
                    </Row>
                </div>
            }
        </div>
    );
}



