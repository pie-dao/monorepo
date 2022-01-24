import Head from 'next/head'
import styles from "../styles/Home.module.css";

import Hero from "../components/Hero";
import Metaverse from "../components/Metaverse";
import ScrollingBoxes from "../components/ScrollingBoxes";
import UnderlyingTokens from "../components/UnderlyingTokens";
import Methodology from "../components/Methodology";
import Roi from "../components/Roi";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Home Page</title>
        <meta name="description" content="PieDAO Metaverse - Home Page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="text-white grid place-items-center">
        {/* Hero Section */}
        <Hero />
        {/* Metaverse Section */}
        <Metaverse />
        {/* ScrollingBoxes Section */}
        <ScrollingBoxes />
        {/* UnderlyingTokens Section */}
        <UnderlyingTokens />
        {/* Methodology Section */}
        {/* <Methodology /> */}
        {/* Roi Section */}
        {/* <Roi /> */}
      </div>

    </div>
  )
}
