import React from "react";
import TypeOfCard from "../../typeOfCard";
import './pazzakCard.css'

export default function PazzakCard(props) {
  const { c } = props;
  const type = TypeOfCard(c);

  return (
    <div className="card-container">
      <div className="top" style={{ backgroundColor: type.color }}>
        <div className='bubbleTop' style={{ backgroundColor: type.color }}>
          <span className="signTop">{type.sign}</span>
        </div>
        <div className="triangleUp"></div>
      </div>
      <div>
        <div className='number'>
          {c}
        </div>
      </div>
      <div className="bottom" style={type.name === 'plusAndMinus' ? { backgroundColor: 'red' } : { backgroundColor: type.color }}>
        {type.name === 'plusAndMinus' &&
          <div className='bubbleBottom'>
            <span className="signBottom">-</span>
          </div>
        }
        <div className="triangleBottom" style={type.name === 'plusAndMinus' ? { backgroundColor: 'red' } : { backgroundColor: type.color }}></div>
      </div>
    </div>
  )
}