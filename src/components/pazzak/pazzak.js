import React, { useEffect, useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './pazzak.css';

export default function Pazzak() {

  const [player1Score, setPlayer1Score] = useState([]);
  const [player2Score, setPlayer2Score] = useState([]);
  let player1Board = Array(9).fill('1');
  let player2Board = Array(9).fill('2');
  let player1Hand = Array(4).fill('1');
  let player2Hand = Array(4).fill('2');
  let deck = [];

  useEffect(() => {
    startGame();
  }, [])

  const getCard = () => {
    let index = Math.floor(Math.random() * (deck.length - 1));
    let number = deck.reduce((a, e, i) => (i === index) ? a = e : a);
    deck = deck.filter((e, i) => { return i !== index });
    return number;
  }

  const startGame = () => {
    let cards = Array.from(Array(11).keys()).slice(1);
    for (let i = 0; i < 4; i++) {
      deck = [...deck].concat(...cards);
    }
    let player1Card = getCard();
    let player2Card = getCard();
  }

  return (
    <>
      <Row className="justify-content-center">
        <Row className='ml-auto mr-1 player1Board' style={{ width: '300px', position: 'relative' }}>
          <div className="player1">
            <div className="player1-item">Player 1</div>
            <div className="player1-item">10</div>
            <div className="player1-item"></div>
          </div>
          <div className="scoreboard1">
            <div className="bubble" style={(player1Score.length > 0) ? { backgroundColor: 'red' } : {}}></div>
            <div className="bubble" style={(player1Score.length > 1) ? { backgroundColor: 'red' } : {}}></div>
            <div className="bubble" style={(player1Score.length > 2) ? { backgroundColor: 'red' } : {}}></div>
          </div>
          {player1Board.map((c, i) => {
            return (
              <Col key={i} xs={4} sm={4} md={4}>
                <div className='cell' style={c === '1' ? { backgroundColor: '#292929' } : {}}></div>
              </Col>
            )
          })}
        </Row>
        <Row className='mr-auto ml-1 player2Board' style={{ width: '300px', position: 'relative' }}>
          <div className="player2">
            <div className="player2-item">10</div>
            <div className="player2-item">Player 2</div>
            <div className="player2-item"></div>
          </div>
          <div className="scoreboard2">
            <div className="bubble" style={(player2Score.length > 0) ? { backgroundColor: 'red' } : {}}></div>
            <div className="bubble" style={(player2Score.length > 1) ? { backgroundColor: 'red' } : {}}></div>
            <div className="bubble" style={(player2Score.length > 2) ? { backgroundColor: 'red' } : {}}></div>
          </div>
          {player2Board.map((c, i) => {
            return (
              <Col key={i} xs={4} sm={4} md={4}>
                <div className='cell' style={c === '2' ? { backgroundColor: '#292929' } : {}}></div>
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
                <div className='cell'></div>
              </Col>
            )
          })}
        </Row>
        <Row className='mr-auto' style={{ width: '400px', position: 'relative' }}>
          {player2Hand.map((c, i) => {
            return (
              <Col key={i} xs={3} sm={3} md={3}>
                <div className='cell'></div>
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