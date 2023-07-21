import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "react-feather";
import './playerButtons.scss';

export default function PlayerButtons(props) {
  const { endTurn, handleStand } = props;
  const [open, setOpen] = useState('initial');

  return (
    <>
      {/* {open !== 'true' &&
        <div className={(open === 'initial') ? 'actionButton actionOpen' :
          (open === 'false') ? 'actionButton actionClose' : ''} onClick={() => setOpen('true')}>
          <ChevronLeft />
          <span>actions</span>
        </div>
      }
      <div className={open === 'initial' ? 'option-container' :
        (open === 'true' ?
          'option-container open' :
          (open === 'false') &&
          'option-container close'
        )}
        style={{ display: 'flex', justifyContent: 'center', paddingTop: '20px' }}>
        <div
          style={{ width: '100px' }} className='customButton'
          onClick={() => endTurn()}>
          End Turn
        </div>
        <div
          style={{ width: '100px' }} className='customButton'
          onClick={() => handleStand()}>
          Stand
        </div>
        <ChevronRight style={{ cursor: 'pointer', marginTop: '3px' }} onClick={() => setOpen('false')} />
      </div> */}
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '40px' }}>
        <div
          style={{ width: '100px' }} className='customButton'
          onClick={() => endTurn()}>
          End Turn
        </div>
        <div
          style={{ width: '100px' }} className='customButton'
          onClick={() => handleStand()}>
          Stand
        </div>
      </div>
    </>
  )

}