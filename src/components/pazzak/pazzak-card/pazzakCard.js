import React from "react";
import './pazzakCard.css'

export default function PazzakCard(props) {
  const { c, deck, special } = props;
  let plusAndminus = Math.sign(c) === undefined;
  let plus = Math.sign(c) === 1;
  let minus = Math.sign(c) === -1;
  let color =
    (deck) ? '#4dd500' :
      (special) ? 'yellow' :
        (plusAndminus) ? 'blue' :
          (minus) ? 'red' :
            (plus) && 'blue';
  let sign =
    (deck) ? '' :
      (special) ? '' :
        (plusAndminus) ? '+-' :
          (minus) ? '-' :
            (plus) && '+';

  return (
    <div className="card-container">
      <div className="top" style={{ backgroundColor: color }}>
        <div className='sign' style={{ backgroundColor: color }}>{sign}</div>
        <div className="triangleUp"></div>
      </div>
      <div>
        <div className='number'>
          {sign}{c}
        </div>
      </div>
      <div className="bottom" style={plusAndminus ? { backgroundColor: 'red' } : { backgroundColor: color }}>
        <div className="triangleBottom" style={plusAndminus ? { backgroundColor: 'red' } : { backgroundColor: color }}>

        </div>
      </div>
    </div>
  )
}