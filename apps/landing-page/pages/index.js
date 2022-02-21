import Cookies from "cookies";
import getPlayData from "./api/getPlayData";
import getPlayTickers from "./api/getPlayTickers";
import getPieHistory from "./api/getPieHistory";
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
import Chart from "../components/Chart";
import posts from "../content/twitterPosts.json";

export async function getServerSideProps({ req, res }) {
  const morePies = [
    "0x8d1ce361eb68e9e05573443c407d4a3bed23b033",
    "0xe4f726adc8e89c6a6017f01eada77865db22da14",
  ];
  const play = await getPlayData();
  const playTickers = await getPlayTickers(30);
  const underlyingData = await getPieHistory(
    "0x33e18a092a93ff21ad04746c7da12e35d34dc7c4"
  );

  const cookies = new Cookies(req, res);
  const showCookiePolicy = cookies.get("cookiePolicy") !== "accepted";
  return {
    props: {
      play,
      underlyingData,
      showCookiePolicy,
      playTickers,
    },
  };
}

export default function Home({ play, underlyingData, playTickers }) {
  const { market_data } = play;
  const underlyingAssetsLatestHistory =
    underlyingData[underlyingData.length - 1];
  return (
    <div className="text-white">
      <Hero actualPrice={market_data.current_price.usd} />
      <PlayBar
        actualPrice={market_data.current_price.usd}
        priceChange={market_data.price_change_percentage_24h}
      />
      <Metaverse />
      <ScrollingBoxes />
      <Chart
        play={play}
        playTickers={playTickers}
        underlyingData={underlyingData}
      />
      <UnderlyingTokens underlyingData={underlyingAssetsLatestHistory} />
      <Methodology />
      <Roi />
      <AboutUsTwitter twitterPosts={posts} />
      <Ovens />
      {/* <ExploreProducts pies={morePiesHistory} /> */}
    </div>
  );
}
