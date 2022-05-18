import { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import Head from 'next/head';
import { wrapper } from '../store';
import './styles.css';

function CustomApp({ Component, ...rest }: AppProps) {
  const { props, store } = wrapper.useWrappedStore(rest);
  return (
    <Provider store={store}>
      <Head>
        <title>Welcome to investify!</title>
      </Head>
      <Component {...props.PageProps} />
    </Provider>
  );
}

export default CustomApp;
