import type { ReactElement, ReactNode } from 'react';
import type { NextPage } from 'next';
import { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import Head from 'next/head';
import { wrapper } from '../store';
import './styles.css';

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function CustomApp({ Component, ...rest }: AppPropsWithLayout) {
  const { props, store } = wrapper.useWrappedStore(rest);
  const getLayout = Component.getLayout ?? ((page) => page);
  return (
    <Provider store={store}>
      <Head>
        <title>Welcome to investify!</title>
      </Head>
      <div data-theme="investify">
        {getLayout(<Component {...props.PageProps} />)}
      </div>
    </Provider>
  );
}

export default CustomApp;
