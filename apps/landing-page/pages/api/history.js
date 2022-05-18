const getPieHistory = async (req, res) => {
  const headers = {
    method: 'GET',
    'Content-Type': 'application/json',
  };
  try {
    const fetchPieHistory = await fetch(
      `https://piedao-nestjs.herokuapp.com/pies/history?address=0x33e18a092a93ff21ad04746c7da12e35d34dc7c4&limit=168`,
      { headers },
    );
    const pieHistory = await fetchPieHistory.json();
    return res.status(200).json(pieHistory);
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      error: e,
    });
  }
};

export default getPieHistory;
