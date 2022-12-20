import React from "react";
import { RefreshCw, Plus, Minus } from 'react-feather';
import './spin.css';

export default function SpinAnimation(props) {
    const { spin, setSpin, isPlus, setIsPlus } = props;
    const handleAnimation = () => {
        setSpin(true);
        setTimeout(() => {
            setSpin(false);
        }, 1000)
    }
    return (
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', margin: 'auto', width: '50px' }}>
            <div className="switchSign">
                <RefreshCw className={(spin) ? 'spin' : ''} width={15} height={15} color={(isPlus) ? 'blue' : 'red'} onClick={() => { handleAnimation(); setIsPlus(!isPlus); }} />
            </div>
            {isPlus ?
                <div className="sign">
                    <Plus width={15} height={15} />
                </div>
                :
                <div className="sign">
                    <Minus width={15} height={15} />
                </div>
            }
        </div>
    )
}