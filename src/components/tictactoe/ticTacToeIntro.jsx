import React, { useEffect, useState } from 'react';
import { Row, Col, Form, Button, Card } from 'react-bootstrap';
import TicTacToeGame from './ticTacToeGame';
import './ticTacToe.css';

export default function TicTacToeIntro(props) {
    const { onBackClick } = props;
    const [firstPlayer, setFirstPlayer] = useState('X');
    const [aiPlayer, setAiPlayer] = useState('X');
    const [secondPlayer, setSecondPlayer] = useState('X');
    const [difficulty, setDifficulty] = useState('easy');
    const [localMultiplayer, setLocalMultiplayer] = useState(false);
    // const [warning, setWarning] = useState('');
    const [inGame, setInGame] = useState(false);
    const [resumeGame, setResumeGame] = useState((localStorage.getItem('savedGame') !== null) ? true : false);

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

    let size = (window.innerWidth < 575 && window.innerWidth > 487) ? 4 : (window.innerWidth < 400) ? 6 : 5;

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
                    <Row style={{ margin: '0px', padding: '0px', width: '100%' }}>
                        <Col className='mb-3 mt-3 ml-3'>
                            <Button type='button' onClick={() => { onBackClick() }}>Return</Button>
                        </Col>
                    </Row>
                    <div className='m-2'>
                        <Card className='m-auto' style={{ maxWidth: '500px', backgroundColor: '#1E2127', color: 'white' }}>
                            <Card.Title className='m-3' style={{ fontSize: '30px' }} >
                                Tic Tac Toe
                            </Card.Title>
                            <Row className='m-auto'>
                                <Col> <Button onClick={singlePlayer} style={(!localMultiplayer) ? { border: '2px solid red', width: '130px' } : { width: '130px' }}>Single Player</Button></Col>
                                <Col><Button onClick={passAndPlay} style={(localMultiplayer) ? { border: '2px solid red', width: '130px' } : { width: '130px' }}>Pass And Play</Button></Col>
                            </Row>
                            <Row className='m-auto'>
                                <Col>
                                    <Form style={{ display: 'flex', margin: 'auto' }}>
                                        <Form.Group className='m-2' style={{ width: '100px' }} >
                                            <Form.Label>P1:</Form.Label>
                                            <Form.Control
                                                style={{ backgroundColor: '#1E2127', color: 'white', textAlign: 'center' }}
                                                type='text'
                                                value={firstPlayer}
                                                onChange={(e) => handlePlayerName(e.target.value)} required />
                                            {/* {usernameErr && <p style={{ color: 'red', padding: '1px' }}>{usernameErr}</p>} */}
                                        </Form.Group>
                                        {localMultiplayer ?
                                            <Form.Group className='m-2' style={{ width: '100px' }}>
                                                <Form.Label>P2:</Form.Label>
                                                <Form.Control
                                                    style={{ backgroundColor: '#1E2127', color: 'white', textAlign: 'center' }}
                                                    type='text'
                                                    value={secondPlayer}
                                                    onChange={(e) => handleSecondPlayerName(e.target.value)} required />
                                                {/* {passwordErr && <p style={{ color: 'red', padding: '1px' }}>{passwordErr}</p>} */}
                                            </Form.Group> :
                                            <Form.Group className='m-2' style={{ width: '100px' }}>
                                                <Form.Label>AI:</Form.Label>
                                                <Form.Control
                                                    style={{ backgroundColor: '#1E2127', color: 'white', textAlign: 'center' }}
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
                                    <h4 style={{ textAlign: 'center' }}>Difficulty:</h4>
                                    <Col className='button-grid' style={{ maxWidth: '490px' }}>
                                        <Button className="m-2 difficulty-buttons" style={(difficulty === 'easy') ? { backgroundColor: 'green' } : {}} onClick={() => changeDifficulty('easy')}>easy</Button>
                                        <Button className="m-2 difficulty-buttons" style={(difficulty === 'moderate') ? { backgroundColor: 'yellow' } : {}} onClick={() => changeDifficulty('moderate')}>moderate</Button>
                                        <Button className="m-2 difficulty-buttons" style={(difficulty === 'hard') ? { backgroundColor: 'orange' } : {}} onClick={() => changeDifficulty('hard')}>hard</Button>
                                        <Button className="m-2 difficulty-buttons" style={(difficulty === 'impossible') ? { backgroundColor: 'red' } : {}} onClick={() => changeDifficulty('impossible')}>impossible</Button>
                                    </Col>
                                </Row>
                            }
                            <Row className='justify-content-md-space-between footer' style={{ marginBottom: '10px', marginTop: '20px' }}>
                                {resumeGame ?
                                    <Col>
                                        <Button style={{ width: '120px', marginLeft: '10px' }} onClick={() => { setResumeGame(false); setInGame(true); }}>New Game</Button>
                                    </Col> :
                                    <Col></Col>
                                }
                                <Col xs={size} sm={4} md={4} style={{ margin: '0px', padding: '0px' }}>
                                    {resumeGame ?
                                        <Button style={window.innerWidth < 400 ? { maxWidth: '140px', marginLeft: '25px' } : { maxWidth: '140px', marginLeft: '10px' }} onClick={() => setInGame(true)}>Resume Game</Button> :
                                        <Button style={window.innerWidth < 400 ? { maxWidth: '140px', marginLeft: '55px' } : { maxWidth: '140px', marginLeft: '10px' }} onClick={() => setInGame(true)}>Start Game</Button>
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



