const coingecko = async (coins) => {
  const headers = {
    method: "GET",
    "Content-Type": "application/json",
  };

  const fetchSimpleInfo = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${coins}&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true`
  );
  const simpleInfo = await fetchSimpleInfo.json();

  let coinObj = { ...simpleInfo };

  const coinRequest = async (coin) => {
    const fetchCoin = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=usd&days=1`,
      { headers }
    );

    const fetchInfo = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coin}?localization=false&tickers=false&market_data=false&community_data=false&developer_data=false&sparkline=false`,
      { headers }
    );

    const json = await fetchCoin.json();
    const info = await fetchInfo.json();

    const coinData = {
      ...json,
      ...info,
    };

    coinObj[coin] = { ...coinObj[coin], ...coinData };
    return coinObj;
  };

  await Promise.all(coins.map(coinRequest));
  return coinObj;
};

export default coingecko;
