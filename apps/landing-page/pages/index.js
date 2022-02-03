import Head from "next/head";
import styles from "../styles/Home.module.css";
import twitterPosts from "./api/twitterPosts";
import getPie from "./api/pie";
import coingeckoData from "./api/mocks/coingeckoData.json";
import Hero from "../components/Hero";
import Metaverse from "../components/Metaverse";
import ScrollingBoxes from "../components/ScrollingBoxes";
import UnderlyingTokens from "../components/UnderlyingTokens";
import Methodology from "../components/Methodology";
import Ovens from "../components/Ovens";
import Roi from "../components/Roi";
import AboutUsTwitter from "../components/AboutUsTwitter";
import ExploreProducts from "../components/ExploreProducts";
import PlayBar from "../components/PlayBar";

export async function getServerSideProps() {
  const posts = await twitterPosts(
    "1463894914132029455,1463871447097557006,1443996166853697537,1479422039836409856,1484209565600296960,1455005260767023108,1474191848386269184,1461440377290952711"
  );

  const playAddress = "0x33e18a092a93ff21ad04746c7da12e35d34dc7c4";

  const playData = await getPie(playAddress);

  return {
    props: {
      posts,
      playData,
    },
  };
}

export default function Home({ posts, playData }) {
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
        <PlayBar play={playData[0].pie} />
        <Metaverse />
        {/* ScrollingBoxes Section */}
        <ScrollingBoxes />
        {/* UnderlyingTokens Section */}
        <UnderlyingTokens underlyingAssets={playData[0].underlyingAssets} />
        {/* Methodology Section */}
        <Methodology />
        {/* Roi Section */}
        <Roi />
        {<AboutUsTwitter twitterPosts={posts} />}
        <Ovens />
        {/* <ExploreProducts coingeckoData={playData} /> */}
      </div>
    </div>
  );
}
