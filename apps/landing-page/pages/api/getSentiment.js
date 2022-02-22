const getSentiment = async () => {
  const headers = {
    method: "GET",
    "Content-Type": "application/json",
  };

  const fetchSentiment = await fetch(
    `https://piedao-backend-stage.herokuapp.com/sentiment/report?days=7`,
    { headers }
  );
  const sentiment = await fetchSentiment.json();

  return sentiment;
};

export default getSentiment;
