import React, { useState, useEffect } from 'react';
import { remixClient } from './remix/RemixClient';
import { useStateContext, useDispatchContext } from './state/Store';
import { setLoaded } from './state/actions';
import './styles/App.scss';

const App: React.FC = () => {

    const state = useStateContext();
    const dispatch = useDispatchContext();

    const onLoaded = () => {
        setTimeout(() => dispatch(setLoaded()), 1000);
    }

    useEffect(() => {
        remixClient.createClient().then(onLoaded);
    }, []);

    return (
        <div id="app">
            <div className="header">
                <div className="header__icon"><img src="/ink.svg" alt="ink!"></img></div>
                <div className="header__text">
                    Build smart contracts with <b>ink!</b>
                </div>
            </div>
            <main role="main">
                {!state.isLoaded ? <div className="loader-md element--center"></div> : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam"}
            </main>
        </div>
    );
}

export default App;
