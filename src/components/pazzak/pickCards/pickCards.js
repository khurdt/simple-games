import React, { useState, useRef } from "react";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import PazzakCard from "../pazzak-card/pazzakCard";
import { useHorizontalScroll } from "../useSideScroll";
import Pazzak from "../pazzak";
import './pickCards.css';

export default function PickCards(props) {
    const { navigate } = props;
    const [cards, setCards] = useState(['+1', '+2', '+3', '+4', '+5', '+6', '-1', '-2', '-3', '-4', '-5', '-6', '+-1', '+-2', '+-3', '+-4', '+-5', '+-6', 'D', '+-1T', '2 & 4', '3 & 6']);
    const [startGame, setStartGame] = useState(false);
    const [player1Cards, setPlayer1Cards] = useState(Array(10).fill('a'));
    const [player2Cards, setPlayer2Cards] = useState(Array(10).fill('a'));
    const [refresh, setRefresh] = useState(false);
    const [turn, setTurn] = useState({
        player: '1',
        played: false
    });
    const player1Turn = turn.player === '1';
    const notPlayedCard = turn.played === false;
    const allSlotsFilled = (player1Cards.indexOf('a') === -1 && player2Cards.indexOf('a') === -1);
    const scrollRef = useHorizontalScroll();
    const smartPhone = (window.innerWidth < 850);
    const childRef = useRef(null);


    const addCard = (card, cardIndex) => {
        (player1Turn && player1Cards.indexOf('a') > -1 && notPlayedCard) ?
            setPlayer1Cards(handleAddCard(player1Cards, card, cardIndex)) :
            (!player1Turn && player2Cards.indexOf('a') > -1 && notPlayedCard) &&
            setPlayer2Cards(handleAddCard(player2Cards, card, cardIndex));
    }
    const handleAddCard = (array, card, cardIndex) => {
        let index = array.indexOf('a');
        array[index] = card;
        cards[cardIndex] = `${card}a`;
        setTurn({ ...turn, played: true });
        setRefresh(!refresh);
        return array;
    }

    const removeCard = (card, cardIndex) => {
        (player1Turn && !notPlayedCard) ?
            setPlayer1Cards(handleRemoveCard(player1Cards, card, cardIndex)) :
            (!player1Turn && !notPlayedCard) &&
            setPlayer2Cards(handleRemoveCard(player2Cards, card, cardIndex));
    }
    const handleRemoveCard = (array, card, cardIndex) => {
        cards[cards.indexOf(`${card}a`)] = card;
        array[cardIndex] = 'a';
        setTurn({ ...turn, played: false });
        setRefresh(!refresh);
        return array;
    }

    const endTurn = () => {
        if (player1Turn) {
            turn.player = '2';
            turn.played = false;
            setRefresh(!refresh);
        } else {
            turn.player = '1';
            turn.played = false;
            setRefresh(!refresh);
        }
    }

    const autoPick = () => {
        let filteredCards = cards.filter((c) => !c.includes('a'));
        while (player1Cards.indexOf('a') > -1) {
            let randomCardIndex = Math.floor(Math.random() * (filteredCards.length - 1));
            player1Cards[player1Cards.indexOf('a')] = filteredCards[randomCardIndex];
            filteredCards = filteredCards.filter((c, i) => i !== randomCardIndex);
            setRefresh(!refresh);
        }
        while (player2Cards.indexOf('a') > -1) {
            let randomCardIndex = Math.floor(Math.random() * (filteredCards.length - 1));
            player2Cards[player2Cards.indexOf('a')] = filteredCards[randomCardIndex];
            filteredCards = filteredCards.filter((c, i) => i !== randomCardIndex);
            setRefresh(!refresh);
        }
    }

    const pickFourCards = () => {
        if (allSlotsFilled) {
            let p1Hand = [];
            let p2Hand = [];
            let picked1Cards = player1Cards;
            let picked2Cards = player2Cards;

            while (p1Hand.length < 4) {
                let index = Math.floor(Math.random() * (picked1Cards.length - 1));
                picked1Cards = picked1Cards.filter((c, i) => i !== index);
                (!p1Hand.includes(picked1Cards[index])) && p1Hand.push(picked1Cards[index]);
            }
            while (p2Hand.length < 4) {
                let index = Math.floor(Math.random() * (picked2Cards.length - 1));
                picked2Cards = picked2Cards.filter((c, i) => i !== index);
                (!p2Hand.includes(picked2Cards[index])) && p2Hand.push(picked2Cards[index]);
            }
            if (p1Hand.length === 4 && p2Hand.length === 4) {
                childRef.current.startGame(p1Hand, p2Hand);
                setStartGame(true);
            }
        }
    }

    return (
        <>
            <Pazzak ref={childRef} navigate={navigate} />
            {startGame ?
                <></>
                :
                <>
                    <Row className="justify-content-center m-auto" style={{ maxWidth: '800px', display: 'flex', paddingTop: '10px' }}>
                        <Col className="mt-5" xs={smartPhone ? 12 : 8} sm={smartPhone ? 12 : 8} md={smartPhone ? 12 : 8} >
                            <div className='container' ref={scrollRef}>
                                <div className="child">
                                    {cards.map((c, i) => {
                                        return (
                                            <Col key={i} className='childCards'>
                                                <div className='cell' onClick={() => addCard(c, i)}>
                                                    {(!c.includes('a')) &&
                                                        <PazzakCard c={c} />
                                                    }
                                                </div>
                                            </Col>
                                        )
                                    })}
                                </div>
                            </div>
                        </Col>
                        <Col className="mt-2" xs={smartPhone ? 12 : 4} sm={smartPhone ? 12 : 4} md={smartPhone ? 12 : 4}>
                            <h3 className="text-center">{turn.player === '1' ? 'Player 1 Hand' : 'Player 2 Hand'}</h3>
                            <div className='container' ref={scrollRef}>
                                <div className="child hand">
                                    {player1Cards.map((c, i) => {
                                        return (
                                            <Col key={i}
                                                style={turn.player === '1' ? { display: 'flex' } : { display: 'none' }}
                                                className={turn.player === '1' ? 'childCards animation' : 'childCards'}
                                                onClick={() => ((player1Turn) && c !== 'a') && removeCard(c, i)} >
                                                <div className='cell'>
                                                    {!c.includes('a') &&
                                                        <PazzakCard c={c} />
                                                    }
                                                </div>
                                            </Col>
                                        )
                                    })}
                                    {player2Cards.map((c, i) => {
                                        return (
                                            <Col key={i}
                                                style={turn.player === '2' ? { display: 'flex' } : { display: 'none' }}
                                                className={turn.player === '2' ? 'childCards animation' : 'childCards'}
                                                onClick={() => (!player1Turn && c !== 'a') && removeCard(c, i)} >
                                                <div className='cell'>
                                                    {!c.includes('a') &&
                                                        <PazzakCard c={c} />
                                                    }
                                                </div>
                                            </Col>
                                        )
                                    })}
                                </div>
                            </div>
                        </Col>
                        <Col className="m-auto" xs={12} sm={12} md={12} style={{ width: 'auto', paddingTop: '20px' }}>
                            {allSlotsFilled ?
                                <Button style={{ maxWidth: '300px', margin: 'auto' }} onClick={() => pickFourCards()}>Start Game</Button>
                                :
                                <>
                                    <Button
                                        style={{ maxWidth: '300px', textAlign: 'center', margin: '30px' }}
                                        onClick={() => endTurn()}>
                                        End Turn
                                    </Button>
                                    <Button
                                        style={{ maxWidth: '300px', textAlign: 'center', margin: '30px' }}
                                        onClick={() => autoPick()}>
                                        Auto Pick
                                    </Button>
                                </>
                            }
                        </Col>
                    </Row>
                </>
            }
        </>
    )
}