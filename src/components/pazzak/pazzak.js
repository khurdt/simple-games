import React, { useEffect, useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import './pazzak.css';
import PazzakCard from './pazzak-card/pazzakCard';
import TypeOfCard from './typeOfCard';

export default function Pazzak(props) {

  const { player1Cards, player2Cards } = props;

  const [inGame, setInGame] = useState(true);

  const [player1Score, setPlayer1Score] = useState([]);
  const [player2Score, setPlayer2Score] = useState([]);

  const [player1Board, setPlayer1Board] = useState(Array(9).fill('a'));
  const [player2Board, setPlayer2Board] = useState(Array(9).fill('a'));

  const [player1BoardCount, setPlayer1BoardCount] = useState([0]);
  const [player2BoardCount, setPlayer2BoardCount] = useState([0]);
  const [player1TotalCount, setPlayer1TotalCount] = useState(0);
  const [player2TotalCount, setPlayer2TotalCount] = useState(0);

  const [refresh, setRefresh] = useState(false);
  const [turn, setTurn] = useState('');
  const [player1Hand, setPlayer1Hand] = useState(player1Cards);
  const [player2Hand, setPlayer2Hand] = useState(player2Cards);
  let deck = [];

  useEffect(() => {
  }, []);


  const startGame = () => {
    newDeck();
    whoGoesFirst();
  }

  const newDeck = () => {
    let cards = Array.from(Array(11).keys()).slice(1);
    for (let i = 0; i < 4; i++) {
      deck = [...deck].concat(...cards);
    }
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    console.log(deck);
  }

  const getCard = () => {
    let index = Math.floor(Math.random() * (deck.length - 1));
    let number = deck.reduce((a, e, i) => (i === index) ? a = e : a);
    deck = deck.filter((e, i) => { return i !== index });
    return number;
  }

  const whoGoesFirst = () => {
    let player1Card = getCard();
    let player2Card = getCard();
    if (player1Card > player2Card) { player1Turn(getCard()); } else
      if (player1Card < player2Card) { player2Turn(getCard()); } else
        if (player1Card === player2Card) { whoGoesFirst(); }
  }

  const player1Turn = (number) => {
    setTurn('player1');

    const card = TypeOfCard(number);
    let newBoardCount = card.action(number, player1BoardCount);
    console.log(newBoardCount);
    let total = newBoardCount.reduce((total, a) => total += a, 0);
    setPlayer1BoardCount(newBoardCount);
    setPlayer1TotalCount(total);

    let index = player1Board.indexOf('a');
    player1Board[index] = number;
    setRefresh(!refresh);
  }

  const player2Turn = (number) => {
    setTurn('player2');

    const card = TypeOfCard(number);
    let newBoardCount = card.action(number, player2BoardCount);
    let total = newBoardCount.reduce((total, a) => total += a, 0);
    setPlayer2BoardCount(newBoardCount);
    setPlayer2TotalCount(total);

    let index = player2Board.indexOf('a');
    player2Board[index] = (number) ? number : getCard();
    setRefresh(!refresh);
  }

  const handleSpinAnimation = () => {

  }

  return (
    <>
      <Button className='m-2' onClick={() => startGame()}>Start Game</Button>
      <Row className="justify-content-center">
        <Row className='ml-auto mr-1 player1Board' style={{ width: '300px', position: 'relative' }}>
          <div className="player1">
            <div className="player1-item">Player 1</div>
            <div className="player1-item">{player1TotalCount}</div>
            <div className="player1-item" style={turn === 'player1' ? { backgroundColor: 'red' } : {}}></div>
          </div>
          <div className="scoreboard1">
            <div className="bubble" style={(player1Score.length > 0) ? { backgroundColor: 'red' } : {}}></div>
            <div className="bubble" style={(player1Score.length > 1) ? { backgroundColor: 'red' } : {}}></div>
            <div className="bubble" style={(player1Score.length > 2) ? { backgroundColor: 'red' } : {}}></div>
          </div>
          {player1Board.map((c, i) => {
            return (
              <Col key={i} xs={4} sm={4} md={4}>
                <div className='cell' style={c === 'a' ? { backgroundColor: '#292929' } : {}}>
                  {(c !== 'a') &&
                    <PazzakCard c={c} />
                  }
                </div>
              </Col>
            )
          })}
        </Row>
        <Row className='mr-auto ml-1 player2Board' style={{ width: '300px', position: 'relative' }}>
          <div className="player2">
            <div className="player2-item">{player2TotalCount}</div>
            <div className="player2-item">Player 2</div>
            <div className="player2-item" style={turn === 'player2' ? { backgroundColor: 'red' } : {}}></div>
          </div>
          <div className="scoreboard2">
            <div className="bubble" style={(player2Score.length > 0) ? { backgroundColor: 'red' } : {}}></div>
            <div className="bubble" style={(player2Score.length > 1) ? { backgroundColor: 'red' } : {}}></div>
            <div className="bubble" style={(player2Score.length > 2) ? { backgroundColor: 'red' } : {}}></div>
          </div>
          {player2Board.map((c, i) => {
            return (
              <Col key={i} xs={4} sm={4} md={4}>
                <div className='cell' style={c === 'a' ? { backgroundColor: '#292929' } : {}}>
                  {(c !== 'a') &&
                    <PazzakCard c={c} />
                  }
                </div>
              </Col>
            )
          })}
        </Row>
      </Row>
      <Row className='justify-content-center m-auto pt-4'>
        <Row className='ml-auto' style={{ width: '400px', position: 'relative' }}>
          {player1Hand.map((c, i) => {
            return (
              <Col key={i} xs={3} sm={3} md={3}>
                <div className='cell' style={{ cursor: 'pointer' }}>
                  {(c !== 'a') &&
                    <PazzakCard c={c} inGame={inGame} player1Turn={player1Turn} player2Turn={player2Turn} turn={turn} />
                  }
                </div>
              </Col>
            )
          })}
        </Row>
        <Row className='mr-auto' style={{ width: '400px', position: 'relative' }}>
          {player2Hand.map((c, i) => {
            return (
              <Col key={i} xs={3} sm={3} md={3}>
                <div className='cell' style={{ cursor: 'pointer' }}>
                  {(c !== 'a') &&
                    <PazzakCard c={c} inGame={inGame} player1Turn={player1Turn} player2Turn={player2Turn} turn={turn} />
                  }
                </div>
              </Col>
            )
          })}
        </Row>
      </Row>
    </>
  )
}