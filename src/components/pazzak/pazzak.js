import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import './pazzak.css';
import PazzakCard from './pazzak-card/pazzakCard';
import TypeOfCard from './typeOfCard';
import SpinAnimation from './spinAnimationButton/spin';
import conditionsArray from './condtionsArray';
import conditionResponseArray from './conditionResponseArray';
import PlayerButtons from './playerButtons-component/playerButtons';

function Pazzak(props, ref) {
  const { navigate } = props;

  const [inGame, setInGame] = useState(false);
  const [endGameModal, setEndGameModal] = useState({
    player: '',
    result: ''
  })
  const [endGame, setEndGame] = useState(false);

  const [player1, setPlayer1] = useState({
    player: 1,
    score: [],
    board: Array(9).fill('a'),
    boardCount: [0],
    totalCount: 0,
    hand: [],
    stand: false,
    garauntee: false
  })
  const [player2, setPlayer2] = useState({
    player: 2,
    score: [],
    board: Array(9).fill('a'),
    boardCount: [0],
    totalCount: 0,
    hand: [],
    stand: false,
    garauntee: false
  })
  const [turn, setTurn] = useState({
    player: 0,
    played: false
  });
  let cards = Array.from(Array(11).keys()).slice(1);
  const [deck, setDeck] = useState(
    // (localStorage.getItem('deck') === null) ?
    [...cards.concat(...cards).concat(...cards).concat(...cards)]
    // JSON.parse(localStorage.getItem('deck'))
  );
  const [optionSign, setOptionSign] = useState([]);
  const [refresh, setRefresh] = useState(false);

  // const scrollRef = useHorizontalScroll();
  // const smartPhone = (window.innerWidth < 850);

  const isplayer1Turn = turn.player === 1;
  let currentPlayer = (isplayer1Turn) ? player1 : player2;
  let otherPlayer = (isplayer1Turn) ? player2 : player1;
  const notPlayedCard = turn.played === false;

  useEffect(() => {

  }, []);

  useImperativeHandle(ref, () => ({
    async startGame(p1Hand, p2Hand) {
      await newDeck().then(() => {
        player1.hand = p1Hand;
        player2.hand = p2Hand;
        setInGame(true);
        whoGoesFirst();
      }).catch((error) => console.log(error));
    }
  }));

  const endTheGame = (result, player) => {
    setEndGame(true);
    endGameModal.result = result;
    if (player) { endGameModal.player = player; }
  }

  const startGame = async () => {
    if (player1.score.length !== 3 && player2.score.length !== 3) {
      await newDeck().then(() => {
        player1.board = Array(9).fill('a');
        player1.boardCount = [0];
        player1.totalCount = 0;
        player1.stand = false;
        player1.garauntee = false;
        player2.board = Array(9).fill('a');
        player2.boardCount = [0];
        player2.totalCount = 0;
        player2.stand = false;
        player2.garauntee = false;
        setEndGame(false);
      }).then(() => whoGoesFirst()).catch((error) => console.log(error));
    } else {
      navigate('/')
    }
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
    let newDeck = deck.filter((e, i) => { return i !== index })
    setDeck(newDeck);
    localStorage.setItem('deck', JSON.stringify(newDeck));
    return number;
  }

  const whoGoesFirst = async () => {
    let player1Card = getCard();
    let player2Card = getCard();
    if (player1Card > player2Card) {
      await newDeck().then(() => {
        turn.player = 1;
        playerTurn(getCard());
      }).catch((error) => console.log(error));
    } else
      if (player1Card < player2Card) {
        await newDeck().then(() => {
          turn.player = 2;
          playerTurn(getCard());
        }).catch((error) => console.log(error));
      } else if (player1Card === player2Card) { whoGoesFirst(); }
  }

  const playerTurn = (number, cardIndex) => {
    let player = (turn.player === 1) ? player1 : player2;
    const card = TypeOfCard(number);

    if (card.name !== 'deck') {
      const newHand = player.hand.filter((c, i) => i !== cardIndex);
      player.hand = newHand;
    }

    const newBoardCount = card.action(number, player.boardCount);
    const total = newBoardCount.reduce((total, a) => total += a, 0);
    player.boardCount = newBoardCount;
    player.totalCount = total;

    const index = player.board.indexOf('a');
    player.board[index] = number;
    console.log(deck);
    setRefresh(!refresh);
    if (total === 20) { handleStand(); }
  }

  const checkWin = () => {
    return new Promise((resolve, reject) => {
      handleCheckWin().then((result) => {
        handleResults(result).then((result) => {
          console.log(result);
        }).catch((error) => console.log(error));
      }).catch((error) => console.log(error));
      resolve();
    });
  }

  const handleCheckWin = () => {
    const currentPlayer = (turn.player === 1) ? player1 : player2;
    return new Promise((resolve, reject) => {
      let conditions = conditionsArray(currentPlayer, otherPlayer, player1, player2);
      for (let i = 0; i < conditions.length; i++) {
        (conditions[i].condition) && resolve(conditions[i].name);
      }
    });
  }

  const handleResults = (result) => {
    return new Promise((resolve, reject) => {
      let responses = conditionResponseArray(currentPlayer, otherPlayer, player1, player2, endTheGame);
      for (let i = 0; i < responses.length; i++) {
        if (responses[i].name === result) {
          const myAction = responses[i].action;
          myAction();
          resolve(responses[i].name);
        }
      }
    });
  }

  const playFromHand = (c, i, option) => {
    const player = (turn.player === 1) ? player1 : player2;
    turn.played = true;
    let plus = `+${c.slice(2, 3)}`;
    let minus = `-${c.slice(2, 3)}`;
    const winIfTie = (c.includes('T'));
    if (option) {
      if (winIfTie) { player.garauntee = winIfTie }
      let findSign = optionSign.find((e) => e.index === i && e.player === player.player);
      playerTurn(((findSign.isPlus) ? plus : minus), i)
    } else {
      playerTurn(c, i);
    }
  }

  const handleStand = () => {
    currentPlayer.stand = true;
    endTurn();
  }

  const endTurn = async () => {
    await checkWin().then((result) => {
      if (!endGame) {
        if (!otherPlayer.stand) {
          turn.player = otherPlayer.player;
          turn.played = false;
          playerTurn(getCard());
        } else if (otherPlayer.stand && !currentPlayer.stand) {
          turn.played = false;
          playerTurn(getCard());
        }
      }
    }).catch((error) => console.log(error))
  }

  if (!inGame) { return <div></div> }

  return (
    <>
      {endGame &&
        <div className='endGameModal'>Player {endGameModal.player} {endGameModal.result}
          <div onClick={startGame} style={{ width: '150px', marginTop: '10px', paddingTop: '3px' }} className='customButton'>OK</div>
        </div>
      }
      <div className='game-container'>
        <Row className={turn.player === 1 ? 'player1Board' : 'player1Board hide'}
          style={(turn.player !== 1 && window.innerWidth < 700) ? { display: 'none' } : { width: '300px', position: 'relative', margin: 'auto' }}>
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
            {(!endGame && isplayer1Turn) ?
              <PlayerButtons endTurn={endTurn} handleStand={handleStand} />
              : (player1.stand) &&
              <h5 className='mt-4'>Stand</h5>
            }
          </div>
        </Row>
        <Row className={turn.player === 2 ? 'player2Board' : 'player2Board hide'}
          style={(turn.player !== 2 && window.innerWidth < 700) ? { display: 'none' } : { width: '300px', position: 'relative', margin: 'auto' }}>
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
            {(!endGame && !isplayer1Turn) ?
              <PlayerButtons endTurn={endTurn} handleStand={handleStand} />
              : (player2.stand) &&
              <h5 className='mt-4'>Stand</h5>
            }
          </div>
        </Row>
      </div>
    </>
  )
};

export default forwardRef(Pazzak);