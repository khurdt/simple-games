import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import './pazzak.css';
import PazzakCard from './pazzak-card/pazzakCard';
import TypeOfCard from './typeOfCard';
import { useHorizontalScroll } from './useSideScroll';

function Pazzak(props, ref) {

  const [inGame, setInGame] = useState(false);
  const [endGame, setEndGame] = useState(false);

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
  const [turn, setTurn] = useState({
    player: '1',
    played: false
  });
  const [player1Hand, setPlayer1Hand] = useState([]);
  const [player2Hand, setPlayer2Hand] = useState([]);
  const isplayer1Turn = turn.player === '1' || turn.player === '2stand';
  const notPlayedCard = turn.played === false;
  const [deck, setDeck] = useState([]);

  useEffect(() => {
    let cards = Array.from(Array(11).keys()).slice(1);
    setDeck([...cards].concat(...cards).concat(...cards).concat(...cards));
  }, []);

  useImperativeHandle(ref, () => ({
    startGame(p1Hand, p2Hand) {
      setInGame(true);
      setPlayer1Hand(p1Hand);
      setPlayer2Hand(p2Hand);
      newDeck();
      whoGoesFirst();
    }
  }));

  const startGame = () => {
    setPlayer1Board(Array(9).fill('a'));
    setPlayer2Board(Array(9).fill('a'));
    setPlayer1BoardCount([0]);
    setPlayer2BoardCount([0]);
    setPlayer1TotalCount(0);
    setPlayer2TotalCount(0);
    newDeck();
    whoGoesFirst();
  }

  const newDeck = () => {
    let cards = Array.from(Array(11).keys()).slice(1);
    setDeck([...cards].concat(...cards).concat(...cards).concat(...cards));
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    setRefresh(!refresh);
  }

  const getCard = () => {
    let index = Math.floor(Math.random() * (deck.length - 1));
    let number = deck.reduce((a, e, i) => (i === index) ? a = e : a);
    setDeck(deck.filter((e, i) => { return i !== index }));
    return number;
  }

  const whoGoesFirst = async () => {
    let player1Card = getCard();
    let player2Card = getCard();
    if (player1Card > player2Card) {
      newDeck();
      setTurn({ ...turn, player: '1' });
      player1Turn(getCard());
    } else
      if (player1Card < player2Card) {
        newDeck();
        setTurn({ ...turn, player: '2' });
        player2Turn(getCard());
      } else
        if (player1Card === player2Card) { whoGoesFirst(); }
  }

  const player1Turn = (number, cardIndex) => {
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
    checkWin(1);
  }

  const player2Turn = (number, cardIndex) => {
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
    player2Board[index] = number;
    setRefresh(!refresh);
    checkWin(2)
  }

  const playFromHand = (c, i, option) => {
    setTurn({ ...turn, played: true });
    let plus = `+${c.slice(2, 3)}`;
    let minus = `-${c.slice(2, 3)}`;
    if (isplayer1Turn && option) {
      player1Turn(((isPlus) ? plus : minus), i)
    } else if (isplayer1Turn) {
      player1Turn(c, i);
    } else if (!isplayer1Turn && option) {
      player2Turn((isPlus) ? plus : minus, i)
    } else if (!isplayer1Turn) {
      player2Turn(c, i);
    }
  }

  const endTurn = () => {
    console.log(deck);
    if (isplayer1Turn && turn.player !== '2stand') {
      setTurn({ player: '2', played: false });
      player2Turn(getCard());
    } else if (!isplayer1Turn && turn.player !== '1stand') {
      setTurn({ player: '1', played: false });
      player1Turn(getCard());
    } else if (turn.player === '1stand') {
      setTurn({ ...turn, played: false });
      player2Turn(getCard());
    } else if (turn.player === '2stand') {
      setTurn({ ...turn, played: false });
      player1Turn(getCard());
    }
  }

  const checkWin = (player) => {
    let win;
    if (player === 1) {
      win = handleCheckWin(player1TotalCount, player1Board);
      if (win === 'automaticWin') {
        let playerScore = [...player1Score];
        playerScore.push(1);
        setPlayer1Score(playerScore);
        setEndGame(true);
      } else if (win === '20') {
        setTurn({ ...turn, player: '1stand' })
        endTurn();
      } else if (win === 'broke') {
        let playerScore = [...player2Score];
        playerScore.push(1);
        setPlayer2Score(playerScore);
        setEndGame(true);
      }
    } else if (player === 2) {
      win = handleCheckWin(player2TotalCount, player2Board);
      if (win === 'automaticWin') {
        let playerScore = [...player2Score];
        playerScore.push(1);
        setPlayer2Score(playerScore);
        setEndGame(true);
      } else if (win === '20') {
        setTurn({ ...turn, player: '2stand' })
        endTurn();
      } else if (win === 'broke') {
        let playerScore = [...player1Score];
        playerScore.push(1);
        setPlayer1Score(playerScore);
        setEndGame(true);
      }
    }
  }
  const handleCheckWin = (total, board) => {
    let allSlotsFilled = board.indexOf('a') === -1;
    if (allSlotsFilled === true) { return 'automaticWin' }
    if (total < 20 && allSlotsFilled === false) { return 'under' }
    if (total === 20) { return '20' }
    if (total > 20) { return 'broke' }
  }

  if (!inGame) { return <div></div> }

  return (
    <>
      <Row style={{ justifyContent: 'space-around', margin: 'auto', maxWidth: '800px', height: 'auto', paddingTop: '50px' }}>
        <Row className='player1Board' style={{ width: '300px', position: 'relative', margin: 'auto' }}>
          <div className="player1">
            <div className="player1-item">Player 1</div>
            <div className="player1-item">{player1TotalCount}</div>
            <div className="player1-item" style={(isplayer1Turn) ? { backgroundColor: 'red' } : { backgroundColor: 'grey' }}></div>
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
          <Row className='ml-auto pt-3 justify-content-center' style={{ width: '400px', position: 'relative', minHeight: '110px' }}>
            {player1Hand.map((c, i) => {
              const type = TypeOfCard(c);
              const option = (type.name === 'plusAndminus' || type.name === 'plusAndMinusT');
              return (
                <Col key={i} xs={3} sm={3} md={3}>
                  <div className='cell' style={{ cursor: 'pointer' }}
                    onClick={() => { (isplayer1Turn && notPlayedCard && !endGame) && playFromHand(c, i, option); }}>
                    {(c !== 'a') &&
                      <PazzakCard c={c} inGame={inGame} isPlus={isPlus} setIsPlus={setIsPlus} />
                    }
                  </div>
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
            <div className="player2-item">{player2TotalCount}</div>
            <div className="player2-item">Player 2</div>
            <div className="player2-item" style={(!isplayer1Turn) ? { backgroundColor: 'red' } : { backgroundColor: 'grey' }}></div>
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
          <Row className='mr-auto pt-3 justify-content-center' style={{ width: '400px', position: 'relative', minHeight: '110px' }}>
            {player2Hand.map((c, i) => {
              const type = TypeOfCard(c);
              const option = (type.name === 'plusAndminus' || type.name === 'plusAndMinusT');
              return (
                <Col key={i} xs={3} sm={3} md={3}>
                  <div className='cell' style={{ cursor: 'pointer' }}
                    onClick={() => (!isplayer1Turn && notPlayedCard && !endGame) && (c, i, option)}>
                    {(c !== 'a') &&
                      <PazzakCard c={c} inGame={inGame} isPlus={isPlus} setIsPlus={setIsPlus} />
                    }
                  </div>
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
            onClick={() => { startGame(); setEndGame(false); }}>
            Start Next Round
          </Button>
          :
          <div style={{ maxWidth: '200px', textAlign: 'center', margin: '30px' }}></div>
        }
      </Row>
    </>
  )
};

export default forwardRef(Pazzak);