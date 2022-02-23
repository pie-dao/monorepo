const getSentiment = async () => {
  const headers = {
    method: "GET",
    "Content-Type": "application/json",
  };

  try {
    const fetchSentiment = await fetch(
      `https://piedao-nestjs.herokuapp.com/sentiment/report?days=7`,
      { headers }
    );
    const sentiment = await fetchSentiment.json();
    return sentiment;
  } catch (e) {
    console.error(e);
  }
};

export default getSentiment;
