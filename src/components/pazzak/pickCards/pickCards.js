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
    const scrollRef = useHorizontalScroll();

    const addCard = (card, cardIndex) => {
        if (turn === 'player1' && player1Cards.indexOf('a') > -1) {
            let index = player1Cards.indexOf('a');
            player1Cards[index] = card;
            setCards(cards.filter((e, i) => { return i !== cardIndex }));
            setRefresh(!refresh);
        } else if (turn === 'player2' && player2Cards.indexOf('a') > -1) {
            let index = player2Cards.indexOf('a');
            player2Cards[index] = card;
            setCards(cards.filter((e, i) => { return i !== cardIndex }));
            setRefresh(!refresh);
        }
    }

    const removeCard = (card, cardIndex) => {
        if (turn === 'player1') {
            cards.unshift(card);
            let newArray = player1Cards.filter((e, i) => { return i !== cardIndex });
            newArray.push('a');
            setPlayer1Cards(newArray);
            setRefresh(!refresh);
        } else {
            cards.unshift(card);
            let newArray = player2Cards.filter((e, i) => { return i !== cardIndex });
            newArray.push('a');
            setPlayer2Cards(newArray);
            setRefresh(!refresh);
        }
    }

    const handleCards = () => {
        if (player1Cards.indexOf('a') === -1 && player2Cards.indexOf('a') === -1) {
            let p1Cards = [];
            let p2Cards = [];
            for (let i = 0; i < 4; i++) {
                let number = getCard(1);
                p1Cards.push(number);
            }
            for (let i = 0; i < 4; i++) {
                let number = getCard(2);
                p2Cards.push(number);
            }
            setPlayer1Cards(p1Cards);
            setPlayer2Cards(p2Cards);
            setStartGame(true);
        }
    }

    const getCard = (n) => {
        if (n === 1) {
            let index = Math.floor(Math.random() * (player1Cards.length - 1));
            let number = player1Cards.reduce((a, e, i) => (i === index) ? a = e : a);
            setPlayer1Cards(player1Cards.filter((e, i) => { return i !== index }));
            return number;
        } else {
            let index = Math.floor(Math.random() * (player2Cards.length - 1));
            let number = player2Cards.reduce((a, e, i) => (i === index) ? a = e : a);
            setPlayer2Cards(player2Cards.filter((e, i) => { return i !== index }));
            return number;
        }
    }

    return (
        <>
            {startGame ? <Pazzak player1Cards={player1Cards} player2Cards={player2Cards} /> :
                <>
                    <Button onClick={() => (turn === 'player1') ? setTurn('player2') : setTurn('player1')} >End Turn</Button>
                    <Row className="justify-content-center m-auto" style={{ maxWidth: '1000px' }}>
                        {player1Cards.map((c, i) => {
                            return (
                                <Col key={i} onClick={() => removeCard(c, i)} style={{ display: 'flex', justifyContent: 'center', cursor: 'pointer' }}>
                                    <div className='cell'>
                                        {(c !== 'a') &&
                                            <PazzakCard c={c} />
                                        }
                                    </div>
                                </Col>
                            )
                        })}
                    </Row>
                    <Row className="justify-content-center m-auto" style={{ maxWidth: '1000px' }}>
                        {player2Cards.map((c, i) => {
                            return (
                                <Col key={i} onClick={() => removeCard(c, i)} style={{ display: 'flex', justifyContent: 'center', cursor: 'pointer' }}>
                                    <div className='cell'>
                                        {(c !== 'a') &&
                                            <PazzakCard c={c} />
                                        }
                                    </div>
                                </Col>
                            )
                        })}
                    </Row>

                    <Row className="justify-content-center m-auto" style={{ maxWidth: '600px' }}>
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
                    <Button onClick={() => handleCards()}>Start Game</Button>
                </>
            }
        </>
    )
}