import React from 'react';
import ReactDOM from 'react-dom';
import App from './src/app';
import { StateProvider } from './src/state/store';

const Root = () => (
    <StateProvider>
        <App />
    </StateProvider>
);

ReactDOM.render(<Root />, document.getElementById('root'));
