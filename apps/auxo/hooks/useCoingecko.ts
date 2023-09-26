import ky from 'ky-universal';
import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import qs from 'qs';

type ContractAddress = string;
type Currency = string;

async function fetchPrice(
  contractAddress: ContractAddress,
  currency: Currency,
): Promise<number> {
  const query = {
    contract_addresses: contractAddress,
    vs_currencies: currency,
  };

  const queryString = qs.stringify(query, {
    encodeValuesOnly: true,
    charset: 'iso-8859-1',
  });

  const requestUrl = `https://api.coingecko.com/api/v3/simple/token_price/ethereum${
    queryString ? `?${queryString}` : ''
  }`;

  try {
    const response = await ky(requestUrl);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = await response.json();
    const lowerCaseContractAddress = contractAddress.toLowerCase();
    for (const key in data) {
      if (key.toLowerCase() === lowerCaseContractAddress) {
        const price = data[key][currency];
        if (price) {
          return price;
        }
        throw new Error(
          `No data found for currency: ${currency} at contract address: ${contractAddress}`,
        );
      }
    }
    throw new Error(`No data found for contract address: ${contractAddress}`);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

function useCoinGeckoTokenPrice(
  contractAddress: ContractAddress,
  currency: Currency,
  options?: UseQueryOptions<number, Error>,
): UseQueryResult<number, Error>;

function useCoinGeckoTokenPrice(
  contractAddress: ContractAddress[],
  currency: Currency,
  options?: UseQueryOptions<Record<ContractAddress, number>, Error>,
): UseQueryResult<Record<ContractAddress, number>, Error>;

function useCoinGeckoTokenPrice(
  contractAddress: ContractAddress | ContractAddress[],
  currency: Currency,
  options?: UseQueryOptions<number | Record<ContractAddress, number>, Error>,
): UseQueryResult<number | Record<ContractAddress, number>, Error> {
  return useQuery(
    Array.isArray(contractAddress)
      ? ['multiple', ...contractAddress, currency]
      : [contractAddress, currency],
    async () => {
      // Case when only one contract address is passed
      if (typeof contractAddress === 'string') {
        return fetchPrice(contractAddress, currency);
      }

      // Case when an array of contract addresses is passed
      else {
        const prices = await Promise.all(
          contractAddress?.map((address) => fetchPrice(address, currency)),
        );
        return Object.fromEntries(
          contractAddress?.map((address, i) => [address, prices[i]]),
        );
      }
    },
    {
      staleTime: 1000 * 60 * 5, // data will be considered stale after 5 minutes
      cacheTime: 1000 * 60 * 30, // data will be cached for 30 minutes
      retry: 1, // retry once if the query fails
      ...options,
    },
  );
}

export { useCoinGeckoTokenPrice, fetchPrice };
