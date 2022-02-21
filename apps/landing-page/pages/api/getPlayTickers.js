import CoinGecko from "coingecko-api";

const getPlayTickers = async (days) => {
  const CoinGeckoClient = new CoinGecko();
  try {
    const play = await CoinGeckoClient.coins.fetchMarketChart(
      "metaverse-nft-index",
      {
        vs_currency: "usd",
        days,
      }
    );
    return play.data;
  } catch (e) {
    console.error(e);
  }
};

export default getPlayTickers;
