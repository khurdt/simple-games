import React, { useState } from "react";
import TypeOfCard from "../typeOfCard";
import './pazzakCard.css'
import { Plus, Minus } from 'react-feather'

export default function PazzakCard(props) {
  const { c } = props;

  const type = TypeOfCard(c);
  const plusAndMinus = type.name === 'plusAndminus';
  const plus = type.name === 'plus';
  const minus = type.name === 'minus';
  const option = (type.name === 'plusAndminus' || type.name === 'plusAndMinusT');

  return (
    <>
      <div className="card-container">
        <div className="top" style={{ backgroundColor: type.color }}>
          <div className='bubbleTop' style={{ backgroundColor: type.color }}>
            <span className="signTop">{type.sign}</span>
          </div>
          <div className="triangleUp"></div>
        </div>
        <div>
          <div className='number'>
            {(option) ?
              <div style={{ position: 'relative', display: 'flex', marginLeft: '13px' }}>
                <div className="plusSign">
                  <Plus width={13} height={13} color={'white'} />
                </div>
                <div className="minusSign">
                  <Minus width={13} height={13} color={'white'} />
                </div>
                <div>
                  {c.slice(2)}
                </div>
              </div>
              :
              (plus || minus) ?
                <>
                  {type.sign}{c.slice(1)}
                </>
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
              <span className="signBottom"><Minus width={13} height={13} color={'white'} /></span>
            </div>
          }
          <div className="triangleBottom" style={plusAndMinus ? { backgroundColor: 'red' } : { backgroundColor: type.color }}></div>
        </div>
      </div>
    </>
  )
}