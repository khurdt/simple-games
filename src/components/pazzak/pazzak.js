import React, { useEffect, useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import './pazzak.css';
import PazzakCard from './pazzak-card/pazzakCard';
import PickCards from './pickCards/pickCards';

export default function Pazzak() {

  const [player1Score, setPlayer1Score] = useState([]);
  const [player2Score, setPlayer2Score] = useState([]);
  const [player1Board, setPlayer1Board] = useState(Array(9).fill('a'));
  const [player2Board, setPlayer2Board] = useState(Array(9).fill('b'));
  const [player1BoardCount, setPlayer1BoardCount] = useState(0);
  const [player2BoardCount, setPlayer2BoardCount] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [turn, setTurn] = useState('');
  let player1Hand = Array(4).fill('a');
  let player2Hand = Array(4).fill('b');
  let deck = [];

  useEffect(() => {
  }, [player1Board, player2Board, deck]);


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
    if (player1Card > player2Card) { player1Turn(); } else
      if (player1Card < player2Card) { player2Turn(); } else
        if (player1Card === player2Card) { whoGoesFirst(); }
  }

  const Count = () => {
    setPlayer1BoardCount(player1Board.reduce((total, a) => (a !== 'a') ? total += parseInt(a) : total, 0))
    setPlayer2BoardCount(player2Board.reduce((total, a) => (a !== 'b') ? total += parseInt(a) : total, 0))
  }

  const player1Turn = (myCard) => {
    setTurn('player1');
    let index = player1Board.indexOf('a');
    player1Board[index] = (myCard) ? myCard : getCard();
    setRefresh(!refresh);
    Count();
    console.log(player1Board);
  }

  const player2Turn = (myCard) => {
    setTurn('player2');
    let index = player2Board.indexOf('b');
    player2Board[index] = (myCard) ? myCard : getCard();
    setRefresh(!refresh);
    Count();
  }

  return (
    <>
      <Button className='m-2' onClick={() => startGame()}>Start Game</Button>
      <Row className="justify-content-center">
        <Row className='ml-auto mr-1 player1Board' style={{ width: '300px', position: 'relative' }}>
          <div className="player1">
            <div className="player1-item">Player 1</div>
            <div className="player1-item">{player1BoardCount}</div>
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
            <div className="player2-item">{player2BoardCount}</div>
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
                <div className='cell' style={c === 'b' ? { backgroundColor: '#292929' } : {}}>
                  {(c !== 'b') &&
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
                <div className='cell' style={{ cursor: 'pointer' }} onClick={() => { (turn === 'player1') && player1Turn(c) }}>
                  {(c !== 'a') &&
                    <PazzakCard c={c} />
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
                <div className='cell' style={{ cursor: 'pointer' }} onClick={() => (turn === 'player2') && player2Turn(c)}>
                  {(c !== 'b') &&
                    <PazzakCard c={c} />
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



// const cells = document.querySelectorAll('.cell');

// for (let i = 0; i < cells.length; i++) {
//   cells[i].innerText = '';
//   cells[i].style.removeProperty('background-color');
//   cells[i].addEventListener('click', turnClick, false);
// }

// function turnClick(cell) {
//   let card = document.createElement('div');
//   card.classNameList.add('cardNumber');
//   card.innerText = cell.target.id;
//   card.style.backgroundColor = 'blue';
//   document.getElementById(cell.target.id).append(card);

// }