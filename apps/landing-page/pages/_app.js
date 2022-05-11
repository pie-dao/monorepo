import { useState, useEffect } from "react";
import Head from "next/head";
import { hotjar } from "react-hotjar";
import "swiper/css/bundle";
import "../styles/globals.css";
// TODO: 👇 figure out how to get rollup working with nx
import "@shared/ui-components/public/output.css";

import Footer from "../components/Footer";
import Layout from "../components/Layout";
import CookieBar from "../components/CookieBar";

function MyApp({ Component, pageProps }) {
  const [isOpen, setIsOpen] = useState(!!pageProps.showCookiePolicy);

  useEffect(() => {
    hotjar.initialize(2803048, 6);
  }, []);

  return (
    <>
      <Head>
        <title>PLAY Metaverse Token</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="title" content="PLAY Metaverse Token" />
        <meta
          name="description"
          content="The PLAY token captures the value of projects operating in the areas of blockchain gaming and virtual entertainment within the metaverse."
        />
        <meta property="og:url" content={process.env.NEXT_PUBLIC_URL} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="PLAY Metaverse Token" />
        <meta
          property="og:description"
          content="The PLAY token captures the value of projects operating in the areas of blockchain gaming and virtual entertainment within the metaverse."
        />
        <meta
          property="og:image"
          content={`${process.env.NEXT_PUBLIC_URL}/play_metaverse_card_social.png`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@PieDAO_DeFi" />
      </Head>
      <Layout>
        <Component {...pageProps} />
        <Footer margin={isOpen ? "mb-16" : ""} />
        <CookieBar isOpen={isOpen} setIsOpen={setIsOpen} />
      </Layout>
    </>
  );
}

export default MyApp;
