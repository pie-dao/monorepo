const getPieHistory = async (pie) => {
  const headers = {
    method: "GET",
    "Content-Type": "application/json",
  };
  try {
    const fetchPieHistory = await fetch(
      `https://piedao-nestjs.herokuapp.com/pies/history?address=${pie}`,
      { headers }
    );
    const pieHistory = await fetchPieHistory.json();
    return pieHistory;
  } catch (e) {
    console.error(e);
  }
};

export default getPieHistory;
