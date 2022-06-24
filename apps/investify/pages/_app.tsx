import type { ReactElement, ReactNode } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { AppProps, NextWebVitalsMetric } from 'next/app';
import { Provider } from 'react-redux';
import { GoogleAnalytics, usePagesViews, event } from 'nextjs-google-analytics';
import { Web3ReactProvider } from '@web3-react/core';
import getLibrary from '../connectors';
import { Web3ContextProvider } from '../components/MultichainProvider/MultichainProvider';
import { wrapper } from '../store';
import './styles.css';

export function reportWebVitals({
  id,
  name,
  label,
  value,
}: NextWebVitalsMetric) {
  event(name, {
    category: label === 'web-vital' ? 'Web Vitals' : 'Next.js custom metric',
    value: Math.round(name === 'CLS' ? value * 1000 : value),
    label: id,
    nonInteraction: true,
  });
}

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

require('../mocks');

function CustomApp({ Component, ...rest }: AppPropsWithLayout) {
  const { props, store } = wrapper.useWrappedStore(rest);
  usePagesViews();
  const getLayout = Component.getLayout ?? ((page) => page);
  return (
    <Web3ContextProvider>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Provider store={store}>
          <Head>
            <title>Welcome to investify!</title>
          </Head>
          <GoogleAnalytics />
          <main className="h-full">
            {getLayout(<Component {...props.pageProps} />)}
          </main>
        </Provider>
      </Web3ReactProvider>
    </Web3ContextProvider>
  );
}

export default CustomApp;
