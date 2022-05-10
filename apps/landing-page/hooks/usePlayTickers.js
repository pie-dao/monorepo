import useSWR from "swr";
import fetcher from "../utils/fetcher";

function usePlayTickers() {
  const { data, error } = useSWR(`/api/tickers`, fetcher);
  return {
    playTickers: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export default usePlayTickers;
