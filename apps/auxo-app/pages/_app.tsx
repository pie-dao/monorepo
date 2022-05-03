import type { AppProps } from "next/app";
import Head from "next/head";
import { Layout } from "../src/components/UI/Layout";
import React from "react";
import { store } from "../src/store";
import { Provider } from "react-redux";
import { Web3ReactProvider } from "@web3-react/core";
import getLibrary from "../src/connectors";
import { Web3ContextProvider } from "../src/hooks/multichain/MultipleProviderContext";
import "./index.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Web3ContextProvider>
        <Web3ReactProvider getLibrary={getLibrary}>
          <Provider store={store}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </Provider>
        </Web3ReactProvider>
      </Web3ContextProvider>
    </>
  );
}
