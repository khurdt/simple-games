import React, { useState } from "react";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import PazzakCard from "../pazzak-card/pazzakCard";
import { useHorizontalScroll } from "../useSideScroll";
import Pazzak from "../pazzak";
import './pickCards.css';

export default function PickCards() {
    const [cards, setCards] = useState(['+1', '+2', '+3', '+4', '+5', '+6', '-1', '-2', '-3', '-4', '-5', '-6', '+-1', '+-2', '+-3', '+-4', '+-5', '+-6', 'D', '+-1T', '2 & 4', '3 & 6']);
    const [startGame, setStartGame] = useState(false);
    const [player1Cards, setPlayer1Cards] = useState(Array(10).fill('a'));
    const [player2Cards, setPlayer2Cards] = useState(Array(10).fill('a'));
    const [refresh, setRefresh] = useState(false);
    const [turn, setTurn] = useState('player1');
    const player1Turn = turn === 'player1';
    const allSlotsFilled = (player1Cards.indexOf('a') === -1 && player2Cards.indexOf('a') === -1);
    const scrollRef = useHorizontalScroll();
    const smartPhone = (window.innerWidth < 850);

    const addCard = (card, cardIndex) => {
        if (player1Turn && player1Cards.indexOf('a') > -1) {
            let index = player1Cards.indexOf('a');
            player1Cards[index] = card;
            let cardArray = cards.filter((e, i) => { return i !== cardIndex });
            cardArray.unshift('a');
            setCards(cardArray);
            setRefresh(!refresh);
        } else if (turn === 'player2' && player2Cards.indexOf('a') > -1) {
            let index = player2Cards.indexOf('a');
            player2Cards[index] = card;
            let cardArray = cards.filter((e, i) => { return i !== cardIndex });
            cardArray.unshift('a');
            setCards(cardArray);
            setRefresh(!refresh);
        }
    }

    const removeCard = (card, cardIndex) => {
        if (player1Turn) {
            cards[cards.indexOf('a')] = card;
            let newArray = player1Cards.filter((e, i) => { return i !== cardIndex });
            newArray.push('a');
            setPlayer1Cards(newArray);
            setRefresh(!refresh);
        } else if (turn === 'player2') {
            cards[cards.indexOf('a')] = card;
            let newArray = player2Cards.filter((e, i) => { return i !== cardIndex });
            newArray.push('a');
            setPlayer2Cards(newArray);
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
                let number = picked1Cards[index];
                picked1Cards = picked1Cards.filter((c, i) => i !== index);
                p1Hand.push(number);
                console.log(p1Hand, picked1Cards);
            }

            while (p2Hand.length < 4) {
                let index = Math.floor(Math.random() * (picked2Cards.length - 1));
                let number = picked2Cards[index];
                picked2Cards = picked2Cards.filter((c, i) => i !== index);
                p2Hand.push(number);
                console.log(p2Hand, picked2Cards);
            }
            if (p1Hand.length === 4 && p2Hand.length === 4) {
                setPlayer1Cards(p1Hand);
                setPlayer2Cards(p2Hand);
                setStartGame(true);
            }
        }
    }

    return (
        <>
            {startGame ? <Pazzak player1Cards={player1Cards} player2Cards={player2Cards} /> :
                <>
                    {smartPhone ?
                        <Row className="justify-content-center m-auto" style={{ maxWidth: '850px', display: 'flex', paddingTop: '100px' }}>
                            <div className="m-auto" ref={scrollRef} style={{ overflow: "auto", maxWidth: '350px' }}>
                                <div style={{ whiteSpace: 'nowrap', display: 'flex', justifyContent: 'center', marginLeft: '975px' }}>
                                    {cards.map((c, i) => {
                                        return (
                                            <Col key={i} style={{ flexFlow: 'nowrap !important', cursor: 'pointer', margin: '10px', width: '70px' }}>
                                                <div className='cell' onClick={() => addCard(c, i)}>
                                                    {(c !== 'a') &&
                                                        <PazzakCard c={c} />
                                                    }
                                                </div>
                                            </Col>
                                        )
                                    })}
                                </div>
                            </div>
                            {player1Turn ?
                                <div>
                                    <h3 className="text-center">Player 1 Hand</h3>
                                    <div className="m-auto" ref={scrollRef} style={{ overflow: "auto", maxWidth: '350px' }}>
                                        <div style={{ whiteSpace: 'nowrap', display: 'flex', justifyContent: 'center', marginLeft: '450px' }}>
                                            {player1Cards.map((c, i) => {
                                                return (
                                                    <Col key={i} onClick={() => ((player1Turn) && c !== 'a') && removeCard(c, i)} style={{ flexFlow: 'nowrap !important', cursor: 'pointer', margin: '10px', width: '70px' }}>
                                                        <div className='cell'>
                                                            {(c !== 'a') &&
                                                                <PazzakCard c={c} />
                                                            }
                                                        </div>
                                                    </Col>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                                :
                                <div>
                                    <h3 className="text-center">Player 2 Hand</h3>
                                    <div className="m-auto" ref={scrollRef} style={{ overflow: "auto", maxWidth: '350px' }}>
                                        <div style={{ whiteSpace: 'nowrap', display: 'flex', justifyContent: 'center', marginLeft: '450px' }}>
                                            {player2Cards.map((c, i) => {
                                                return (
                                                    <Col key={i} onClick={() => (turn === 'player2' && c !== 'a') && removeCard(c, i)} style={{ flexFlow: 'nowrap !important', cursor: 'pointer', margin: '10px', width: '70px' }}>
                                                        <div className='cell'>
                                                            {(c !== 'a') &&
                                                                <PazzakCard c={c} />
                                                            }
                                                        </div>
                                                    </Col>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            }
                            <Button style={{ maxWidth: '300px', textAlign: 'center', margin: '30px' }} onClick={() => (player1Turn) ? setTurn('player2') : setTurn('player1')}>End Turn</Button>
                            {allSlotsFilled &&
                                <Button style={{ maxWidth: '300px', margin: 'auto' }} onClick={() => pickFourCards()}>Start Game</Button>
                            }
                        </Row>
                        :
                        <Row className="justify-content-center m-auto" style={{ display: 'flex', width: '850px', paddingTop: '100px' }}>
                            <Col className="mt-5">
                                <Row className="m-auto justify-content-center" style={{ width: '600px' }}>
                                    {cards.map((c, i) => {
                                        return (
                                            <Col key={i} style={{ display: 'flex', justifyContent: 'center', cursor: 'pointer' }}>
                                                <div className='cell' onClick={() => addCard(c, i)}>
                                                    {(c !== 'a') &&
                                                        <PazzakCard c={c} />
                                                    }
                                                </div>
                                            </Col>
                                        )
                                    })}
                                </Row>
                            </Col>
                            <Col>
                                {player1Turn ?
                                    <div>
                                        <h3 className="text-center">Player 1 Hand</h3>
                                        <Row className="m-auto" style={{ width: '200px' }}>
                                            {player1Cards.map((c, i) => {
                                                return (
                                                    <Col key={i} onClick={() => ((player1Turn) && c !== 'a') && removeCard(c, i)} style={{ display: 'flex', justifyContent: 'center', cursor: 'pointer' }}>
                                                        <div className='cell'>
                                                            {(c !== 'a') &&
                                                                <PazzakCard c={c} />
                                                            }
                                                        </div>
                                                    </Col>
                                                )
                                            })}
                                        </Row>
                                    </div>
                                    :
                                    <div>
                                        <h3 className="text-center">Player 2 Hand</h3>
                                        <Row className="m-auto" ref={scrollRef} style={{ width: '200px' }}>
                                            {player2Cards.map((c, i) => {
                                                return (
                                                    <Col key={i} onClick={() => (turn === 'player2' && c !== 'a') && removeCard(c, i)} style={{ display: 'flex', justifyContent: 'center', cursor: 'pointer' }}>
                                                        <div className='cell'>
                                                            {(c !== 'a') &&
                                                                <PazzakCard c={c} />
                                                            }
                                                        </div>
                                                    </Col>
                                                )
                                            })}
                                        </Row>
                                    </div>
                                }
                            </Col>
                            <Button style={{ maxWidth: '300px', textAlign: 'center', margin: '30px' }} onClick={() => (player1Turn) ? setTurn('player2') : setTurn('player1')}>End Turn</Button>
                            {allSlotsFilled &&
                                <Button style={{ maxWidth: '300px', margin: 'auto' }} onClick={() => pickFourCards()}>Start Game</Button>
                            }
                        </Row>
                    }
                </>
            }
        </>
    )
}