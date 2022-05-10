import useSWR from "swr";
import fetcher from "../utils/fetcher";

function useUnderlyingData() {
  const { data, error } = useSWR(`/api/history`, fetcher);
  return {
    underlyingData: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export default useUnderlyingData;
