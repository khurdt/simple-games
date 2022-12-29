import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// import logo from '../../images/logo.svg';
import Nav from 'react-bootstrap/Nav';
import { ChevronRight, Home, Menu } from 'react-feather';
import './navbar-view.scss';

export default function Navigation() {
    const [pageActive, setPageActive] = useState('');
    const [showNavBar, setShowNavBar] = useState('initial');

    const handleClose = () => setShowNavBar('false');
    const handleShow = () => setShowNavBar('true');

    useEffect(() => {
        if (window.location.href.includes('user')) { setPageActive('user') }
        else if (window.location.href.includes('login')) { setPageActive('login') }
        else if (window.location.href.includes('register')) { setPageActive('register') }
        else { setPageActive('home') };
    }, [])

    // onLoggedOut = () => {
    //     localStorage.clear();
    //     window.open('/', '_self');
    // }

    const homeTab = {
        color: 'white'
    }

    return (
        <>
            <div className="menu">
                <div>
                    {(showNavBar === 'false' || showNavBar === 'initial') &&
                        <Menu
                            color='white'
                            style={{ width: '30px', height: '30px' }}
                            onClick={handleShow}
                            alt='menu icon' />
                    }
                </div>
            </div>
            <div className={(showNavBar === 'initial') ? 'off-canvas-container' :
                (showNavBar === 'true') ? 'off-canvas-container show' :
                    (showNavBar === 'false') && 'off-canvas-container hide'}>
                <div className='off-canvas-body' style={{ backgroundColor: 'black' }}>
                    <Nav>
                        <Nav.Link className='offcanvas_item' style={homeTab} as={Link} to='/' onClick={() => { handleClose(); setPageActive('home') }}>
                            <Home width={20} height={20} alt='home icon' />
                            <div className='offcanvas-item-title'>Home</div>
                        </Nav.Link>
                    </Nav>

                    <ChevronRight
                        color='white'
                        style={{ width: '30px', height: '30px', marginTop: '20px', marginBottom: '15px', cursor: 'pointer' }}
                        onClick={handleClose}
                        alt='exit icon' />
                </div>
            </div>
        </>
    );
}