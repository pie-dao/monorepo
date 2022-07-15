import Cookies from 'cookies';
import getCoinData from './api/getCoinData';
import getLatestHistory from './api/getLatestHistory';
import getSentiment from './api/getSentiment';
import Hero from '../components/Hero';
import Metaverse from '../components/Metaverse';
import ScrollingBoxes from '../components/ScrollingBoxes';
import UnderlyingTokens from '../components/UnderlyingTokens';
import Methodology from '../components/Methodology';
import Ovens from '../components/Ovens';
import Roi from '../components/Roi';
import AboutUsTwitter from '../components/AboutUsTwitter';
import ExploreProducts from '../components/ExploreProducts';
import PlayBar from '../components/PlayBar';
import Chart from '../components/Chart';
import posts from '../content/twitterPosts.json';
import morePies from '../content/morePies.json';

export async function getServerSideProps({ req, res }) {
  // const expoloreMore = [
  //   '0x8d1ce361eb68e9e05573443c407d4a3bed23b033',
  //   '0xe4f726adc8e89c6a6017f01eada77865db22da14',
  // ];
  const playAddress = '0x33e18a092a93ff21ad04746c7da12e35d34dc7c4';
  const play = await getCoinData(playAddress);
  // eslint-disable-next-line no-undef
  // const morePies = await Promise.all(
  //   expoloreMore.map(async (pie) => {
  //     const pieData = await getLatestHistory(pie);
  //     return pieData;
  //   }),
  // );

  const cookies = new Cookies(req, res);
  const showCookiePolicy = cookies.get('cookiePolicy') !== 'accepted';
  // const sentiment = await getSentiment();

  return {
    props: {
      play,
      showCookiePolicy,
      // sentiment,
    },
  };
}

export default function Home({ play, sentiment }) {
  return (
    <div className="text-white">
      <Hero actualPrice={play?.coin?.market_data?.current_price?.usd} />
      <PlayBar
        actualPrice={play?.coin?.market_data?.current_price?.usd}
        priceChange={play?.coin?.market_data?.price_change_percentage_24h}
      />
      <Metaverse />
      <ScrollingBoxes />
      {/* {play && play.coin && sentiment && (
        <Chart play={play.coin} sentiment={sentiment} />
      )} */}
      <UnderlyingTokens />
      <Methodology />
      <Roi />
      <AboutUsTwitter twitterPosts={posts} />
      <Ovens />
      {morePies && <ExploreProducts morePies={morePies} />}
    </div>
  );
}
