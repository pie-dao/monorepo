import '../styles/globals.css';
// TODO: 👇 figure out how to get rollup working with nx
import '@shared/util-ui-components/public/output.css';

import Layout from '../components/Layout';

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
