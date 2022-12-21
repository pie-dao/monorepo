import { Web3Provider } from '@ethersproject/providers';
import { SUPPORTED_CHAINS } from '../utils/networks';

export const RPC_URLS: Record<number, string> = {
  [SUPPORTED_CHAINS.MAINNET]: 'https://rpc.ankr.com/eth',
  [SUPPORTED_CHAINS.FANTOM]: 'https://rpc.ankr.com/fantom',
  [SUPPORTED_CHAINS.POLYGON]: 'https://rpc.ankr.com/polygon',
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
