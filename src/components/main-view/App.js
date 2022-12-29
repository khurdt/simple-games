import React from 'react';
import TicTacToeIntro from '../tictactoe/ticTacToeIntro';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import './App.css';
import { Row, Col, Container, Card } from 'react-bootstrap';
import TicTacToeImg from '../../images/tictactoeimg.png';
import PickCards from '../pazzak/pickCards/pickCards';
import Navigation from '../navbar/navbar';

export default function App() {
  let navigate = useNavigate();

  return (
    <>
      <Navigation />
      <div className="App-header">
        <Routes>
          <Route
            exact
            path="/"
            element={
              <Container fluid style={{ margin: '0', padding: '0' }}>
                <Container style={{ paddingTop: '100px' }}>
                  <Row className='m-auto'>
                    <Col className='m-auto' xs={12} sm={12} md={4}>
                      <Card className='m-auto' style={{ width: '250px', height: '200px', backgroundColor: '#282c34', border: 'none', margin: 'auto' }}>
                        <Link to='tictactoe' style={{ textDecoration: 'none' }}>
                          <Card.Title className='title'>Tic Tac Toe</Card.Title>
                          <Card.Img style={{ height: '200px' }} src={TicTacToeImg}></Card.Img>
                        </Link>
                      </Card>
                    </Col>
                    <Col className='m-auto' xs={12} sm={12} md={4}>
                      <Card className='m-auto' style={{ width: '250px', height: '200px', backgroundColor: '#282c34', border: 'none', margin: 'auto' }}>
                        <Link to='pazzak' style={{ textDecoration: 'none' }}>
                          <Card.Title className='title'>Pazzak</Card.Title>
                          {/* <Card.Img style={{ height: '200px' }}></Card.Img> */}
                        </Link>
                      </Card>
                    </Col>
                  </Row>
                </Container>
              </Container>
            }
          />
          <Route path="tictactoe" element={<TicTacToeIntro onBackClick={() => navigate(-1)} />} />
          <Route path="pazzak" element={<PickCards onBackClick={() => navigate(-1)} navigate={navigate} />} />
        </Routes>
      </div>
    </>
  );
}
