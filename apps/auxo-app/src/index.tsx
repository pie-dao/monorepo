import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { store } from './store';
import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';
import { Web3ReactProvider } from '@web3-react/core';
import getLibrary from './connectors';
import { BrowserRouter } from 'react-router-dom';
import { Web3ContextProvider } from './hooks/multichain/MultipleProviderContext';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Web3ContextProvider>
        <Web3ReactProvider getLibrary={getLibrary}>
          <Provider store={store}>
            <App />
          </Provider>
        </Web3ReactProvider>
      </Web3ContextProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
