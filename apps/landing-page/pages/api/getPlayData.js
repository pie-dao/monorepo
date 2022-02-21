import CoinGecko from "coingecko-api";

const getPlayData = async () => {
  const CoinGeckoClient = new CoinGecko();
  try {
    const play = await CoinGeckoClient.coins.fetch("metaverse-nft-index", {
      localization: false,
      developer_data: false,
    });
    return play.data;
  } catch (e) {
    console.error(e);
  }
};

export default getPlayData;
