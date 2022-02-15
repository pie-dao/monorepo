import Cookies from "cookies";
import getPie from "./api/pie";
import getNav from "./api/nav";
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
import SubCharts from "../components/SubCharts";
import posts from "../content/twitterPosts.json";

export async function getServerSideProps({ req, res }) {
  const playAddress = "0x33e18a092a93ff21ad04746c7da12e35d34dc7c4";
  const morePies = [
    "0x8d1ce361eb68e9e05573443c407d4a3bed23b033",
    "0xe4f726adc8e89c6a6017f01eada77865db22da14",
  ];

  const playData = await getPie(playAddress);
  const morePiesData = await Promise.all(
    morePies.map((pieAddress) => getNav(pieAddress))
  );

  const cookies = new Cookies(req, res);
  const showCookiePolicy = cookies.get("cookiePolicy") !== "accepted";

  return {
    props: {
      playData,
      morePiesData,
      showCookiePolicy,
    },
  };
}

export default function Home({ playData, morePiesData }) {
  const { pie: pieHistory, underlyingAssets, nav } = playData.history[0];
  const { pie: pieInfo } = playData;
  return (
    <div className="text-white grid place-items-center">
      <Hero actualPrice={pieHistory.usd} />
      <PlayBar pieHistory={pieHistory} />
      <Metaverse />
      <ScrollingBoxes />
      <Chart
        play={playData}
        pieInfo={pieInfo}
        pieHistory={pieHistory}
        nav={nav}
      />
      <UnderlyingTokens underlyingAssets={underlyingAssets} />
      <Methodology />
      <Roi />
      <AboutUsTwitter twitterPosts={posts} />
      <Ovens />
      <ExploreProducts pies={morePiesData} />
    </div>
  );
}
