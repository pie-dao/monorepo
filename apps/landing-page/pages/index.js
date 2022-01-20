import Head from 'next/head'
import styles from "../styles/Home.module.css";

import Hero from "../components/Hero";
import Metaverse from "../components/Metaverse";

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
      </div>

    </div>
  )
}
