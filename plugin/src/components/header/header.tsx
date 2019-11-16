import React from 'react';
import './header.scss';

const Header: React.FC = () => {
    return (
        <div className="header">
            <div className="header__icon"><img src="/ink.svg" alt="ink!"></img></div>
            <div className="header__text">Build smart contracts with <b>ink!</b></div>
        </div>
    );
}

export default Header;