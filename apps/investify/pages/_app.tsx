import { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import Head from 'next/head';
import type { NextWebVitalsMetric } from 'next/app';
import { GoogleAnalytics, usePagesViews, event } from 'nextjs-google-analytics';
import { wrapper } from '../store';

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

function CustomApp({ Component, ...rest }: AppProps) {
  const { props, store } = wrapper.useWrappedStore(rest);
  usePagesViews();
  return (
    <Provider store={store}>
      <Head>
        <title>Welcome to investify!</title>
      </Head>
      <GoogleAnalytics />
      <main className="app">
        <Component {...props.PageProps} />
      </main>
    </Provider>
  );
}

export default CustomApp;
