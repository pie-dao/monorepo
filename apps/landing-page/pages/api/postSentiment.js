const postSentiment = async (req, res) => {
  const {
    query: { sentiment },
  } = req;
  const headers = {
    "Content-Type": "application/json",
    Bearer: process.env.API_TOKEN,
  };
  const body = JSON.stringify({
    vote: sentiment,
    timestamp: +new Date(),
  });
  try {
    const sentimentData = await fetch(
      `https://piedao-nestjs.herokuapp.com/sentiment`,
      {
        method: "POST",
        headers,
        body,
      }
    );
    const sentiment = await sentimentData.json();
    return res.status(200).json({
      data: sentiment.data,
    });
  } catch (e) {
    console.error(e);
  }
};

export default postSentiment;
