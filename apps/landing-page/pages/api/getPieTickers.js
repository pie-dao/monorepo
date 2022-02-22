const getPieTickers = async (pie) => {
  const headers = {
    method: "GET",
    "Content-Type": "application/json",
  };
  try {
    const fetchPieHistory = await fetch(
      `https://piedao-backend-stage.herokuapp.com/pies/market_chart?address=${pie}&days=90`,
      { headers }
    );
    const pieTickers = await fetchPieHistory.json();
    return pieTickers;
  } catch (e) {
    console.error(e);
  }
};

export default getPieTickers;
