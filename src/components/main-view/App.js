import React, { Component, useCallback } from 'react';
import TicTacToeIntro from '../tictactoe/ticTacToeIntro';
import Menu from '../navbar/navbar';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import './App.css';
import { Button, Row, Col, Container } from 'react-bootstrap';

export default function App() {
  let navigate = useNavigate();

  return (
    <>
      <Menu />
      <div className="App-header">
        <Routes>
          <Route
            exact
            path="/"
            element={
              <Container fluid style={{ margin: '0', padding: '0' }}>
                <div className="App">
                  <div className="App-header">
                    <Container style={{ paddingTop: '100px' }}>
                      <Row md={6}>
                        <Link to='tictactoe' style={{ textDecoration: 'none' }} className='project-image'>
                          <h4>Tic Tac Toe</h4>
                        </Link>
                      </Row>
                    </Container>
                  </div>
                </div>
              </Container>
            }
          />
          <Route path="tictactoe" element={<TicTacToeIntro onBackClick={() => navigate(-1)} />} />
        </Routes>
      </div>
    </>
  );
}
