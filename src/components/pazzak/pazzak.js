import React, { useEffect, useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import './pazzak.css';
import PazzakCard from './pazzak-card/pazzakCard';
import TypeOfCard from './typeOfCard';
import { useHorizontalScroll } from './useSideScroll';

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
  const [isPlus, setIsPlus] = useState(true);

  const scrollRef = useHorizontalScroll();
  const smartPhone = (window.innerWidth < 850);
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

  const player1Turn = (number, cardIndex) => {
    setTurn('player1');

    const card = TypeOfCard(number);
    if (card.name !== 'deck') {
      let newHand = player1Hand.filter((c, i) => i !== cardIndex);
      setPlayer1Hand(newHand);
    }
    let newBoardCount = card.action(number, player1BoardCount);
    let total = newBoardCount.reduce((total, a) => total += a, 0);
    setPlayer1BoardCount(newBoardCount);
    setPlayer1TotalCount(total);


    let index = player1Board.indexOf('a');
    player1Board[index] = number;
    setRefresh(!refresh);
  }

  const player2Turn = (number, cardIndex) => {
    setTurn('player2');

    const card = TypeOfCard(number);
    if (card.name !== 'deck') {
      let newHand = player2Hand.filter((c, i) => i !== cardIndex);
      setPlayer2Hand(newHand);
    }
    let newBoardCount = card.action(number, player2BoardCount);
    let total = newBoardCount.reduce((total, a) => total += a, 0);
    setPlayer2BoardCount(newBoardCount);
    setPlayer2TotalCount(total);

    let index = player2Board.indexOf('a');
    player2Board[index] = (number) ? number : getCard();
    setRefresh(!refresh);
  }
  const handleTurn = (c, i, option) => {
    let plus = `+${c.slice(2, 3)}`;
    let minus = `-${c.slice(2, 3)}`;
    if (turn === 'player1' && option) {
      player1Turn(((isPlus) ? plus : minus), i)
    } else if (turn === 'player1') {
      player1Turn(c, i);
    } else if (turn === 'player2' && option) {
      player2Turn((isPlus) ? plus : minus, i)
    } else if (turn === 'player2') {
      player2Turn(c, i);
    }
  }

  return (
    <>
      <Button className='m-2' onClick={() => startGame()}>Start Game</Button>
      {smartPhone ?
        <div className="m-auto" ref={scrollRef} style={{ overflow: "auto", maxWidth: '350px' }}>
          <div style={{ whiteSpace: 'nowrap', display: 'flex', justifyContent: 'center', marginLeft: '330px' }}>
            <Row className='player1Board' style={{ width: '300px', position: 'relative', margin: 'auto' }}>
              <div className="player1">
                <div className="player1-item">Player 1</div>
                <div className="player1-item">{player1TotalCount}</div>
                <div className="player1-item" style={turn === 'player1' ? { backgroundColor: 'red' } : { backgroundColor: 'grey' }}></div>
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
              <Row className='ml-auto pt-3' style={{ width: '400px', position: 'relative' }}>
                {player1Hand.map((c, i) => {
                  const type = TypeOfCard(c);
                  const option = (type.name === 'plusAndminus' || type.name === 'plusAndMinusT');
                  return (
                    <Col key={i} xs={3} sm={3} md={3}>
                      <div className='cell' style={{ cursor: 'pointer' }} onClick={() => (turn === 'player1') && handleTurn(c, i, option)}>
                        {(c !== 'a') &&
                          <PazzakCard c={c} inGame={inGame} isPlus={isPlus} setIsPlus={setIsPlus} />
                        }
                      </div>
                    </Col>
                  )
                })}
              </Row>
            </Row>
            <Row className='player2Board' style={{ width: '300px', position: 'relative', margin: 'auto' }}>
              <div className="player2">
                <div className="player2-item">{player2TotalCount}</div>
                <div className="player2-item">Player 2</div>
                <div className="player2-item" style={turn === 'player2' ? { backgroundColor: 'red' } : { backgroundColor: 'grey' }}></div>
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
              <Row className='mr-auto pt-3' style={{ width: '400px', position: 'relative' }}>
                {player2Hand.map((c, i) => {
                  const type = TypeOfCard(c);
                  const option = (type.name === 'plusAndminus' || type.name === 'plusAndMinusT');
                  return (
                    <Col key={i} xs={3} sm={3} md={3}>
                      <div className='cell' style={{ cursor: 'pointer' }} onClick={() => (turn === 'player2') && handleTurn(c, i, option)}>
                        {(c !== 'a') &&
                          <PazzakCard c={c} inGame={inGame} isPlus={isPlus} setIsPlus={setIsPlus} />
                        }
                      </div>
                    </Col>
                  )
                })}
              </Row>
            </Row>
          </div>
        </div>
        :
        <Row style={{ justifyContent: 'space-around', margin: 'auto', maxWidth: '800px', height: 'auto' }}>
          <Row className='player1Board' style={{ width: '300px', position: 'relative', margin: 'auto' }}>
            <div className="player1">
              <div className="player1-item">Player 1</div>
              <div className="player1-item">{player1TotalCount}</div>
              <div className="player1-item" style={turn === 'player1' ? { backgroundColor: 'red' } : { backgroundColor: 'grey' }}></div>
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
            <Row className='ml-auto pt-3' style={{ width: '400px', position: 'relative' }}>
              {player1Hand.map((c, i) => {
                const type = TypeOfCard(c);
                const option = (type.name === 'plusAndminus' || type.name === 'plusAndMinusT');
                return (
                  <Col key={i} xs={3} sm={3} md={3}>
                    <div className='cell' style={{ cursor: 'pointer' }} onClick={() => (turn === 'player1') && handleTurn(c, i, option)}>
                      {(c !== 'a') &&
                        <PazzakCard c={c} inGame={inGame} isPlus={isPlus} setIsPlus={setIsPlus} />
                      }
                    </div>
                  </Col>
                )
              })}
            </Row>
          </Row>
          <Row className='player2Board' style={{ width: '300px', position: 'relative', margin: 'auto' }}>
            <div className="player2">
              <div className="player2-item">{player2TotalCount}</div>
              <div className="player2-item">Player 2</div>
              <div className="player2-item" style={turn === 'player2' ? { backgroundColor: 'red' } : { backgroundColor: 'grey' }}></div>
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
            <Row className='mr-auto pt-3' style={{ width: '400px', position: 'relative' }}>
              {player2Hand.map((c, i) => {
                const type = TypeOfCard(c);
                const option = (type.name === 'plusAndminus' || type.name === 'plusAndMinusT');
                return (
                  <Col key={i} xs={3} sm={3} md={3}>
                    <div className='cell' style={{ cursor: 'pointer' }} onClick={() => (turn === 'player2') && handleTurn(c, i, option)}>
                      {(c !== 'a') &&
                        <PazzakCard c={c} inGame={inGame} isPlus={isPlus} setIsPlus={setIsPlus} />
                      }
                    </div>
                  </Col>
                )
              })}
            </Row>
          </Row>
        </Row>
      }
    </>
  )
}