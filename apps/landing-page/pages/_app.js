import { useEffect } from "react";
import Head from "next/head";
import { hotjar } from "react-hotjar";
import "swiper/css/bundle";
import "../styles/globals.css";

import Footer from "../components/Footer";
import Layout from "../components/Layout";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    hotjar.initialize(2803048, 6);
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="title" content="PLAY" />
        <meta
          name="description"
          content="The PLAY token captures the value of projects operating in the areas of blockchain gaming and virtual entertainment within the metaverse."
        />
        <meta
          property="og:url"
          content="https://play-metaverse-token.netlify.app/"
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="PLAY" />
        <meta
          property="og:description"
          content="The PLAY token captures the value of projects operating in the areas of blockchain gaming and virtual entertainment within the metaverse."
        />
        <meta
          property="og:image"
          content="https://play-metaverse-token.netlify.app/metaverse_man_fb.png"
        />
        <meta name="twitter:title" content="PLAY" />
        <meta
          name="twitter:description"
          content="The PLAY token captures the value of projects operating in the areas of blockchain gaming and virtual entertainment within the metaverse."
        />
        <meta
          name="twitter:image"
          content="https://play-metaverse-token.netlify.app/metaverse_man_fb.png"
        />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <Layout>
        <Component {...pageProps} />
        <Footer />
      </Layout>
    </>
  );
}

export default MyApp;
