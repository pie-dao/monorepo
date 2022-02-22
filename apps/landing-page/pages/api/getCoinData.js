const getCoinData = async (address) => {
  const headers = {
    method: "GET",
    "Content-Type": "application/json",
  };
  try {
    const fetchPieHistory = await fetch(
      `https://piedao-backend-stage.herokuapp.com/pies/coin?address=${address}&limit=1&order=descending`,
      { headers }
    );
    const coinData = await fetchPieHistory.json();
    return coinData[0];
  } catch (e) {
    console.error(e);
  }
};

export default getCoinData;
