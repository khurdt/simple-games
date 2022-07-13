import React from 'react';
import TicTacToeIntro from '../tictactoe/ticTacToeIntro';
import Menu from '../navbar/navbar';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

export default function App() {
  return (
    <Router>
      <Menu />
      <Routes>
        <Route
          exact
          path="/"
          element={
            <>
              <div className="App">
                <div className="App-header">
                  <Link to='tictactoe' style={{ textDecoration: 'none' }} className='project-image'>
                    <h4>Tic Tac Toe</h4>
                  </Link>
                </div>
              </div>
            </>
          }
        />
        <Route path="tictactoe" element={<TicTacToeIntro />} />
      </Routes>
    </Router>
  );
}
