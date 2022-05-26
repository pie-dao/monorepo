import { AppProps, NextWebVitalsMetric } from 'next/app';
import type { ReactElement, ReactNode } from 'react';
import type { NextPage } from 'next';
import { Provider } from 'react-redux';
import Head from 'next/head';
import { GoogleAnalytics, usePagesViews, event } from 'nextjs-google-analytics';
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

function CustomApp({ Component, ...rest }: AppPropsWithLayout) {
  const { props, store } = wrapper.useWrappedStore(rest);
  usePagesViews();
  const getLayout = Component.getLayout ?? ((page) => page);
  return (
    <Provider store={store}>
      <Head>
        <title>Welcome to investify!</title>
      </Head>
      <GoogleAnalytics />
      <main data-theme="investify" className="h-full">
        {getLayout(<Component {...props.PageProps} />)}
      </main>
    </Provider>
  );
}

export default CustomApp;
