import React from "react";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import PazzakCard from "../pazzak-card/pazzakCard";

export default function PickCards() {
    const cards = ['+1', '+2', '+3', '+4', '+5', '+6', '-1', '-2', '-3', '-4', '-5', '-6', '+-1', '+-2', '+-3', '+-4', '+-5', '+-6', 'D', '+-1T', '2 & 4', '3 & 6']
    return (
        <Row>
            {cards.map((c, i) => {
                return (
                    <Col key={i} xs={4} sm={4} md={4}>
                        <div className='cell'>
                            {(c !== 'a') &&
                                <PazzakCard c={c} />
                            }
                        </div>
                    </Col>
                )
            })}
        </Row>
    )
}