import React from 'react';

export default function TicTacToeGame() {

    return (
        <div>
            <table>
                <tr>
                    <td className="cell" id="0"></td>
                    <td className="cell" id="1"></td>
                    <td className="cell" id="2"></td>
                </tr>
                <tr>
                    <td className="cell" id="3"></td>
                    <td className="cell" id="4"></td>
                    <td className="cell" id="5"></td>
                </tr>
                <tr>
                    <td className="cell" id="6"></td>
                    <td className="cell" id="7"></td>
                    <td className="cell" id="8"></td>
                </tr>
            </table>
            <div className="endgame">
                <div className="endgame-text"></div>
                <button onClick="ticTacToe.replay()" className="endgame-reset">Replay</button>
            </div>
        </div>
    );

}
