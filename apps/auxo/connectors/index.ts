import { Web3Provider } from '@ethersproject/providers';
import { SUPPORTED_CHAINS } from '../utils/networks';

export const RPC_URLS: Record<number, string> = {
  [SUPPORTED_CHAINS.MAINNET]: 'https://eth.llamarpc.com',
  [SUPPORTED_CHAINS.FANTOM]: 'https://1rpc.io/ftm',
  [SUPPORTED_CHAINS.POLYGON]: 'https://polygon.llamarpc.com',
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
