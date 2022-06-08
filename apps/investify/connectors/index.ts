import { Web3Provider } from '@ethersproject/providers';
import { SUPPORTED_CHAINS } from '../utils/networks';

export const RPC_URLS: Record<number, string> = {
  [SUPPORTED_CHAINS.MAINNET]:
    'https://mainnet.infura.io/v3/' + process.env.REACT_APP_INFURA_API_KEY,
  [SUPPORTED_CHAINS.FANTOM]: 'https://rpc.ftm.tools/',
  [SUPPORTED_CHAINS.POLYGON]:
    'https://polygon-mainnet.infura.io/v3/' +
    process.env.REACT_APP_INFURA_API_KEY,
};

export default function getLibrary(provider): Web3Provider {
  /**
   * Pass in the root of the application to make the Web3-react
   * hook available to the application
   */
  const library = new Web3Provider(
    provider,
    typeof provider.chainId === 'number'
      ? provider.chainId
      : typeof provider.chainId === 'string'
      ? parseInt(provider.chainId)
      : 'any',
  );
  return library;
}
