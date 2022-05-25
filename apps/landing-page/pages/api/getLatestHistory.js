import { BACKEND_URL } from './apiConfig';

const getLatestHistory = async (pie) => {
  const headers = {
    method: 'GET',
    'Content-Type': 'application/json',
  };
  try {
    const fetchPieHistory = await fetch(
      `${BACKEND_URL}/pies/latest-history?address=${pie}`,
      { headers },
    );
    const pieHistory = await fetchPieHistory.json();
    return pieHistory;
  } catch (e) {
    console.error(e);
  }
};

export default getLatestHistory;
