import React from "react";
import './pazzakCard.css'

export default function PazzakCard(props) {
  const { c, deck } = props;
  let special = (typeof c === 'string' && c !== '+-1')
  let plusAndminus = (c === '+-1');
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
        (plusAndminus) ? '+' :
          (minus) ? '-' :
            (plus) && '+';

  return (
    <div className="card-container">
      <div className="top" style={{ backgroundColor: color }}>
        <div className='signTop' style={{ backgroundColor: color }}>{sign}</div>
        <div className="triangleUp"></div>
      </div>
      <div>
        <div className='number'>
          {(sign === '+' && !plusAndminus) && sign}
          {c}
        </div>
      </div>
      <div className="bottom" style={plusAndminus ? { backgroundColor: 'red' } : { backgroundColor: color }}>
        {plusAndminus &&
          <div className='signBottom'>-</div>
        }
        <div className="triangleBottom" style={plusAndminus ? { backgroundColor: 'red' } : { backgroundColor: color }}></div>
      </div>
    </div>
  )
}