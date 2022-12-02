import React from 'react';
import './navbar-view.scss';
import { Link } from 'react-router-dom';
import logo from '../../images/logo.svg';
import { Navbar, Nav } from 'react-bootstrap';

class Menu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageActive: ''
        };
    }

    componentDidMount() {
        if (window.location.href.includes('user')) { this.setState({ pageActive: 'user' }) }
        else if (window.location.href.includes('login')) { this.setState({ pageActive: 'login' }) }
        else if (window.location.href.includes('register')) { this.setState({ pageActive: 'register' }) }
        else { this.setState({ pageActive: 'home' }) };
    }

    onLoggedOut = () => {
        localStorage.clear();
        window.open('/', '_self');
    }

    render() {

        let homeIcon = {
            color: 'white',
            borderBottom: (!(window.location.href.includes('tictactoe' || 'login' || 'register'))) ? '2px solid #1266F1' : '0px'
        };
        // let userIcon = {
        //     color: 'white',
        //     borderBottom: (pageActive === 'user' || window.location.href.includes('tictactoe')) ? '2px solid #1266F1' : '0px'
        // };

        return (
            <>
                <Navbar style={{ backgroundColor: '#1E2127', height: '56px', margin: '0', padding: '0', zIndex: '100' }}>
                    <Navbar.Brand style={{ color: '#61dafb', fontSize: '20px' }}><img src={logo} className="App-logo" alt="logo" /><span>React Games</span></Navbar.Brand>
                    <Nav className='ml-auto' style={{ backgroundColor: '#1E2127', padding: '5px', display: 'flex' }}>
                        <Nav.Link className='text-center' as={Link} onClick={() => { this.setState({ pageActive: 'home' }) }} style={homeIcon} to='/simple-games'>Games</Nav.Link>
                        {/* <Nav.Link className='text-center' as={Link} onClick={() => { this.setState({ pageActive: 'tictactoe' }) }} style={userIcon} to='/tictactoe'>Tic Tac Toe</Nav.Link> */}
                    </Nav>
                </Navbar>
            </>
        );
    }
}

export default Menu;