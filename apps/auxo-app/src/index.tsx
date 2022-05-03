import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { store } from "./store";
import { Provider } from "react-redux";
import { Web3ReactProvider } from "@web3-react/core";
import getLibrary from "./connectors";
import { Web3ContextProvider } from "./hooks/multichain/MultipleProviderContext";

ReactDOM.render(
  <React.StrictMode>
    <Web3ContextProvider>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Provider store={store}>
          <App />
        </Provider>
      </Web3ReactProvider>
    </Web3ContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
