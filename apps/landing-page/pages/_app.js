import "swiper/css/bundle";
import "../styles/globals.css";
import Head from "next/head";

import Footer from "../components/Footer";
import Layout from "../components/Layout";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="The PLAY token captures the value of projects operating in the areas of blockchain gaming and virtual entertainment within the metaverse."
        />
      </Head>
      <Layout>
        <Component {...pageProps} />
        <Footer />
      </Layout>
    </>
  );
}

export default MyApp;
