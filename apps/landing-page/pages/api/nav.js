const getPie = async (pieAddress) => {
  const headers = {
    method: "GET",
    "Content-Type": "application/json",
  };

  const fetchPie = await fetch(
    `https://piedao-backend-stage.herokuapp.com/pies/pie-nav-chart?address=${pieAddress}`,
    { headers }
  );
  const pieInfo = await fetchPie.json();

  return pieInfo;
};

export default getPie;
