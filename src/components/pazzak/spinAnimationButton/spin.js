import React, { useEffect, useState } from "react";
import { RefreshCw, Plus, Minus } from 'react-feather';
import './spin.css';

export default function SpinAnimation(props) {
    const { setOptionSign, optionSign, i, player } = props;
    const [spin, setSpin] = useState(false);
    const [isPlus, setIsPlus] = useState(true);
    const [refresh, setRefresh] = useState(true);

    useEffect(() => {
        let array = optionSign;
        array.push({ index: i, player: player, isPlus: isPlus });
    }, []);

    const handleAnimation = () => {
        setSpin(true);
        setTimeout(() => {
            setSpin(false);
        }, 1000)
    }

    const handleSignChange = () => {
        let index = optionSign.findIndex((e) => e.index === i && e.player === player);
        optionSign[index].isPlus = !isPlus;
        setIsPlus(!isPlus);
    }

    return (
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', margin: 'auto', width: '50px' }}>
            <div className="switchSign">
                <RefreshCw className={(spin) ? 'spin' : ''} width={15} height={15}
                    color={(isPlus) ? 'blue' : 'red'}
                    onClick={() => {
                        handleAnimation();
                        handleSignChange();
                        console.log(optionSign);
                    }} />
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