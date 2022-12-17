import React from "react";
import './pazzakCard.css'

export default function PazzakCard(props) {
  const { c } = props;
  let specialArray = ['D', '+-1T', '2 & 4', '3 & 6']
  let deck = (typeof c === 'number');
  let special = (specialArray.includes(c))
  let plusAndminus = (c.indexOf('+-') > -1 && !special);
  let plus = c.indexOf('+') > -1 && c.indexOf('+-') === -1;
  let minus = c.indexOf('-') > -1 && c.indexOf('+-') === -1;
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
        <div className='bubbleTop' style={{ backgroundColor: color }}>
          <span className="signTop">{sign}</span>
        </div>
        <div className="triangleUp"></div>
      </div>
      <div>
        <div className='number'>
          {c}
        </div>
      </div>
      <div className="bottom" style={plusAndminus ? { backgroundColor: 'red' } : { backgroundColor: color }}>
        {(plusAndminus) &&
          <div className='bubbleBottom'>
            <span className="signBottom">-</span>
          </div>
        }
        <div className="triangleBottom" style={plusAndminus ? { backgroundColor: 'red' } : { backgroundColor: color }}></div>
      </div>
    </div>
  )
}