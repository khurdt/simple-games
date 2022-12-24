import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import './pazzak.css';
import PazzakCard from './pazzak-card/pazzakCard';
import TypeOfCard from './typeOfCard';
import { useHorizontalScroll } from './useSideScroll';
import SpinAnimation from './spinAnimationButton/spin';
import conditionsArray from './condtionsArray';
import conditionResponseArray from './conditionResponseArray';

function Pazzak(props, ref) {

  const [inGame, setInGame] = useState(false);
  const [endGame, setEndGame] = useState(false);

  const [player1, setPlayer1] = useState({
    player: 1,
    score: [],
    board: Array(9).fill('a'),
    boardCount: [0],
    totalCount: 0,
    hand: [],
    stand: false
  })
  const [player2, setPlayer2] = useState({
    player: 2,
    score: [],
    board: Array(9).fill('a'),
    boardCount: [0],
    totalCount: 0,
    hand: [],
    stand: false
  })
  const [turn, setTurn] = useState({
    player: '0',
    played: false
  });

  const [optionSign, setOptionSign] = useState([]);
  const scrollRef = useHorizontalScroll();
  const smartPhone = (window.innerWidth < 850);
  const [refresh, setRefresh] = useState(false);
  const isplayer1Turn = turn.player === '1' || turn.player === '2stand';
  const notPlayedCard = turn.played === false;
  const [deck, setDeck] = useState([]);

  useEffect(() => {
    let cards = Array.from(Array(11).keys()).slice(1);
    setDeck([...cards.concat(...cards).concat(...cards).concat(...cards)])
  }, []);

  useImperativeHandle(ref, () => ({
    startGame(p1Hand, p2Hand) {
      newDeck().then(() => {
        setPlayer1({ ...player1, hand: p1Hand });
        setPlayer2({ ...player2, hand: p2Hand });
        setInGame(true);
        setRefresh(!refresh);
      }).then(() => {
        // whoGoesFirst(p1Hand, p2Hand);
      }).catch((error) => console.log(error));
    }
  }));

  const startGame = () => {
    newDeck().then(() => {
      setPlayer1({
        ...player1,
        board: Array(9).fill('a'),
        boardCount: [0],
        totalCount: 0
      });
      setPlayer2({
        ...player2,
        board: Array(9).fill('a'),
        boardCount: [0],
        totalCount: 0
      });
      setEndGame(false);
      setRefresh(!refresh);
    }).then(() => whoGoesFirst()).catch((error) => console.log(error));
  }

  const newDeck = () => {
    return new Promise((resolve, reject) => {
      let deck = [];
      let cards = Array.from(Array(11).keys()).slice(1);
      for (let i = 0; i < 4; i++) {
        deck = [...deck].concat(...cards);
      }
      for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
      }
      if (deck.length === 40) {
        setDeck(deck);
        resolve(deck);
      };
    })
  }

  const getCard = () => {
    let index = Math.floor(Math.random() * (deck.length - 1));
    let number = deck.reduce((a, e, i) => (i === index) ? a = e : a);
    setDeck(deck.filter((e, i) => { return i !== index }));
    return number;
  }

  const whoGoesFirst = () => {
    let player1Card = getCard();
    let player2Card = getCard();
    if (player1Card > player2Card) {
      newDeck().then(() => {
        setTurn({ ...turn, player: '1' });
        player1Turn(getCard());
      }).catch((error) => console.log(error));
    } else
      if (player1Card < player2Card) {
        newDeck().then(() => {
          setTurn({ ...turn, player: '2' });
          player2Turn(getCard());
        }).catch((error) => console.log(error));
      } else if (player1Card === player2Card) { whoGoesFirst(); }
  }

  const player1Turn = (number, cardIndex) => {
    handlePlayerTurn(number, cardIndex, player1, setPlayer1)
  }

  const player2Turn = (number, cardIndex) => {
    handlePlayerTurn(number, cardIndex, player2, setPlayer2)
  }

  const handlePlayerTurn = (number, cardIndex, player, setPlayer) => {
    const card = TypeOfCard(number);
    if (card.name !== 'deck') {
      setPlayer({
        ...player,
        hand: player.hand.filter((c, i) => i !== cardIndex)
      });
    }

    let newBoardCount = card.action(number, player.boardCount);
    let total = newBoardCount.reduce((total, a) => total += a, 0);
    setPlayer({
      ...player,
      boardCount: newBoardCount,
      totalCount: total
    });

    let index = player.board.indexOf('a');
    player.board[index] = number;
    setRefresh(!refresh)
  }

  const checkWin = (player) => {
    let result;
    return new Promise((resolve, reject) => {
      handleCheckWin(player).then((result) => {
        handleResults(result, player).then((result) => {
          result = result;
        }).catch((error) => console.log(error));
      }).catch((error) => console.log(error));
      resolve(result);
    })
  }

  const handleCheckWin = (player) => {
    return new Promise((resolve, reject) => {
      let conditions = conditionsArray(player, player1, player2);
      for (let i = 0; i < conditions.length; i++) {
        (conditions[i].condition) && resolve(conditions[i].name);
      }
    });
  }

  const handleResults = (result, player) => {
    return new Promise((resolve, reject) => {
      let responses = conditionResponseArray(player, player1, player2, setPlayer1, setPlayer2, setEndGame, setRefresh, refresh);
      for (let i = 0; i < responses.length; i++) {
        if (responses[i].name === result) {
          responses[i].action();
          resolve(responses[i].name);
        }
      }
    })
  }

  const playFromHand = (c, i, option) => {
    setTurn({ ...turn, played: true });
    let plus = `+${c.slice(2, 3)}`;
    let minus = `-${c.slice(2, 3)}`;
    if (isplayer1Turn && option) {
      let findSign = optionSign.find((e) => e.index === i && e.player === 1);
      player1Turn(((findSign.isPlus) ? plus : minus), i)
    } else if (isplayer1Turn) {
      player1Turn(c, i);
    } else if (!isplayer1Turn && option) {
      let findSign = optionSign.find((e) => e.index === i && e.player === 2);
      player2Turn(((findSign.isPlus) ? plus : minus), i)
    } else if (!isplayer1Turn) {
      player2Turn(c, i);
    }
  }

  const endTurn = () => {
    let player = (isplayer1Turn) ? (player1) : (player2);
    checkWin(player).then((result) => {
      if (!endGame) {
        if (isplayer1Turn && !player2.stand) {
          setTurn({ player: '2', played: false });
          player2Turn(getCard());
        } else if (!isplayer1Turn && !player1.stand) {
          setTurn({ player: '1', played: false });
          player1Turn(getCard());
        } else if (player1.stand) {
          setTurn({ ...turn, played: false });
          player2Turn(getCard());
        } else if (player2.stand) {
          setTurn({ ...turn, played: false });
          player1Turn(getCard());
        }
      }
    }).catch((error) => console.log(error))
  }

  if (!inGame) { return <div></div> }

  return (
    <>
      <Row style={{ justifyContent: 'space-around', margin: 'auto', maxWidth: '800px', height: 'auto', paddingTop: '50px' }}>
        <Row className='player1Board' style={{ width: '300px', position: 'relative', margin: 'auto' }}>
          <div className="player1">
            <div className="player1-item">Player 1</div>
            <div className="player1-item">{player1.totalCount}</div>
            <div className="player1-item" style={(isplayer1Turn) ? { backgroundColor: 'red' } : { backgroundColor: 'grey' }}></div>
          </div>
          <div className="scoreboard1">
            <div className="bubble" style={(player1.score.length > 0) ? { backgroundColor: 'red' } : {}}></div>
            <div className="bubble" style={(player1.score.length > 1) ? { backgroundColor: 'red' } : {}}></div>
            <div className="bubble" style={(player1.score.length > 2) ? { backgroundColor: 'red' } : {}}></div>
          </div>
          {player1.board.map((c, i) => {
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
          <Row className='ml-auto pt-3 justify-content-center' style={{ width: '400px', position: 'relative', minHeight: '110px' }}>
            {player1.hand.map((c, i) => {
              const type = TypeOfCard(c);
              const option = (type.name === 'plusAndminus' || type.name === 'plusAndMinusT');
              return (
                <Col key={i} xs={3} sm={3} md={3}>
                  <div className='cell' style={{ cursor: 'pointer' }}
                    onClick={() => { (isplayer1Turn && notPlayedCard && !endGame) && playFromHand(c, i, option); }}>
                    {(c !== 'a') &&
                      <PazzakCard c={c} />
                    }
                  </div>
                  {(option) &&
                    <div className="option-holder">
                      <SpinAnimation setOptionSign={setOptionSign} optionSign={optionSign} i={i} player={1} />
                    </div>
                  }
                </Col>
              )
            })}
          </Row>
          <div style={{ height: '70px', textAlign: 'center' }}>
            {(!endGame && isplayer1Turn) &&
              <Button
                style={{ width: '200px', textAlign: 'center', marginTop: '30px', marginLeft: 'auto', marginRight: 'auto', }}
                onClick={() => endTurn()}>
                End Turn
              </Button>
            }
          </div>
        </Row>
        <Row className='player2Board' style={{ width: '300px', position: 'relative', margin: 'auto' }}>
          <div className="player2">
            <div className="player2-item">{player2.totalCount}</div>
            <div className="player2-item">Player 2</div>
            <div className="player2-item" style={(!isplayer1Turn) ? { backgroundColor: 'red' } : { backgroundColor: 'grey' }}></div>
          </div>
          <div className="scoreboard2">
            <div className="bubble" style={(player2.score.length > 0) ? { backgroundColor: 'red' } : {}}></div>
            <div className="bubble" style={(player2.score.length > 1) ? { backgroundColor: 'red' } : {}}></div>
            <div className="bubble" style={(player2.score.length > 2) ? { backgroundColor: 'red' } : {}}></div>
          </div>
          {player2.board.map((c, i) => {
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
          <Row className='mr-auto pt-3 justify-content-center' style={{ width: '400px', position: 'relative', minHeight: '110px' }}>
            {player2.hand.map((c, i) => {
              const type = TypeOfCard(c);
              const option = (type.name === 'plusAndminus' || type.name === 'plusAndMinusT');
              return (
                <Col key={i} xs={3} sm={3} md={3}>
                  <div className='cell' style={{ cursor: 'pointer' }}
                    onClick={() => { (!isplayer1Turn && notPlayedCard && !endGame) && playFromHand(c, i, option); }}>
                    {(c !== 'a') &&
                      <PazzakCard c={c} />
                    }
                  </div>
                  {(option) &&
                    <div className="option-holder">
                      <SpinAnimation setOptionSign={setOptionSign} optionSign={optionSign} i={i} player={2} />
                    </div>
                  }
                </Col>
              )
            })}
          </Row>
          <div style={{ height: '70px', textAlign: 'center' }}>
            {(!endGame && !isplayer1Turn) &&
              <Button
                style={{ width: '200px', textAlign: 'center', marginTop: '30px', marginLeft: 'auto', marginRight: 'auto', }}
                onClick={() => endTurn()}>
                End Turn
              </Button>
            }
          </div>
        </Row>
        {endGame ?
          <Button
            style={{ maxWidth: '300px', textAlign: 'center', margin: '30px' }}
            onClick={() => { startGame(); }}>
            Start Next Round
          </Button>
          :
          <>
            <div style={{ maxWidth: '200px', textAlign: 'center', margin: '30px' }}></div>
            <Button onClick={() => whoGoesFirst()}>Who Goes First</Button>
          </>
        }
      </Row>
    </>
  )
};

export default forwardRef(Pazzak);