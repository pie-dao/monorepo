import useSWR from 'swr';
import fetcher from '../utils/fetcher';
import underlyingData from '../config/underlyingData.json';

function useUnderlyingData() {
  // const { data, error } = useSWR(`/api/history`, fetcher);
  return {
    underlyingData,
    isLoading: false,
    isError: false,
  };
}

export default useUnderlyingData;
