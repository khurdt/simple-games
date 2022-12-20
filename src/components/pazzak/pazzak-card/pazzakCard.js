import React, { useState } from "react";
import TypeOfCard from "../typeOfCard";
import './pazzakCard.css'
import SpinAnimation from "../spinAnimationButton/spin";

export default function PazzakCard(props) {
  const { c, inGame, turn, player1Turn, player2Turn } = props;
  const [isPlus, setIsPlus] = useState(true);
  const [spin, setSpin] = useState(false);

  const type = TypeOfCard(c);
  const plusAndMinus = type.name === 'plusAndminus'
  const plus = type.name === 'plus'
  const option = (type.name === 'plusAndminus' || type.name === 'plusAndMinusT');

  const handleTurn = () => {
    let plus = `+${c.slice(2, 3)}`;
    let minus = `-${c.slice(2, 3)}`;
    if (turn === 'player1' && option) {
      player1Turn((isPlus) ? plus : minus)
    } else if (turn === 'player1') {
      player1Turn(c);
    }
    if (turn === 'player2' && option) {
      player2Turn((isPlus) ? plus : minus)
    } else if (turn === 'player2') {
      player2Turn(c);
    }

  }

  return (
    <>
      <div className="card-container" onClick={() => (inGame) && handleTurn()}>
        <div className="top" style={{ backgroundColor: type.color }}>
          <div className='bubbleTop' style={{ backgroundColor: type.color }}>
            <span className="signTop" style={(plusAndMinus || plus) ? { marginLeft: '0.6px' } : {}}>{type.sign}</span>
          </div>
          <div className="triangleUp"></div>
        </div>
        <div>
          <div className='number'>
            {(plusAndMinus || type.name === 'plusAndMinusT') ?
              <div style={{ position: 'relative', display: 'flex', marginLeft: '13px' }}>
                <div className="plusSign">
                  {c.slice(0, 1)}
                </div>
                <div className="minusSign">
                  {c.slice(1, 2)}
                </div>
                <div>
                  {c.slice(2)}
                </div>
              </div>
              :
              <>
                {c}
              </>
            }
          </div>
        </div>
        <div className="bottom" style={plusAndMinus ? { backgroundColor: 'red' } : { backgroundColor: type.color }}>
          {plusAndMinus &&
            <div className='bubbleBottom'>
              <span className="signBottom">-</span>
            </div>
          }
          <div className="triangleBottom" style={plusAndMinus ? { backgroundColor: 'red' } : { backgroundColor: type.color }}></div>
        </div>
      </div>
      {(option && inGame) &&
        <div className="option-holder">
          <SpinAnimation spin={spin} setSpin={setSpin} setIsPlus={setIsPlus} isPlus={isPlus} />
        </div>
      }
    </>
  )
}