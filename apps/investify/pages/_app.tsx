import { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import Head from 'next/head';
import { wrapper } from '../store';

function CustomApp({ Component, ...rest }: AppProps) {
  const { props, store } = wrapper.useWrappedStore(rest);
  return (
    <Provider store={store}>
      <Head>
        <title>Welcome to investify!</title>
      </Head>
      <main className="app">
        <Component {...props.PageProps} />
      </main>
    </Provider>
  );
}

export default CustomApp;
