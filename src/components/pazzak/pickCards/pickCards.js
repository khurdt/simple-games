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
    const [turn, setTurn] = useState({
        player: '1',
        played: false
    });
    const player1Turn = turn.player === '1';
    const notPlayedCard = turn.played === false;
    const allSlotsFilled = (player1Cards.indexOf('a') === -1 && player2Cards.indexOf('a') === -1);
    const scrollRef = useHorizontalScroll();
    const smartPhone = (window.innerWidth < 850);


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
        (player1Turn) ?
            setTurn({ player: '2', played: false }) :
            setTurn({ player: '1', played: false });
        // (allSlotsFilled) && pickFourCards();
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
                            {/* <div className="m-auto" ref={scrollRef} style={{ overflow: "auto", maxWidth: '350px' }}>
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
                            } */}
                        </Row>
                        :
                        <Row className="justify-content-center m-auto" style={{ display: 'flex', width: '850px', paddingTop: '100px' }}>
                            <Col className="mt-5">
                                <Row className="m-auto justify-content-center" style={{ width: '600px' }}>
                                    {cards.map((c, i) => {
                                        return (
                                            <Col key={i} style={{ display: 'flex', justifyContent: 'center', cursor: 'pointer' }}>
                                                <div className='cell' onClick={() => addCard(c, i)}>
                                                    {(!c.includes('a')) &&
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
                                                            {!c.includes('a') &&
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
                                                    <Col key={i} onClick={() => (!player1Turn && c !== 'a') && removeCard(c, i)} style={{ display: 'flex', justifyContent: 'center', cursor: 'pointer' }}>
                                                        <div className='cell'>
                                                            {!c.includes('a') &&
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
                        </Row>
                    }
                </>
            }
        </>
    )
}