import React, { Component } from 'react'

import Logo from './Logo/Logo';
import SearchBar from './../../containers/components/SearchBar/SearchBar';
import UserPanel from './../../containers/components/UserPanel/UserPanel';
import './Header.css';
class Header extends Component {
    render() {
        return (
            <header className='header'>
                <div className='card-container'>
                    <div className='header-area'>
                        <Logo />
                        <div className='search-area'>
                            <SearchBar />
                        </div>
                        <div className='user-panel-area'>
                            <UserPanel />
                        </div>
                    </div>
                </div>
            </header>
        );
    }
}

export default Header;