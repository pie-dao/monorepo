import { Web3Provider } from '@ethersproject/providers';
import { SUPPORTED_CHAINS } from '../utils/networks';

export const RPC_URLS: Record<number, string> = {
  [SUPPORTED_CHAINS.MAINNET]: process.env.NEXT_PUBLIC_TESTNET
    ? 'http://127.0.0.1:8545/'
    : 'https://mainnet.infura.io/v3/2ce335a6c916456097e41f062748a6d8',
  [SUPPORTED_CHAINS.FANTOM]: process.env.NEXT_PUBLIC_TESTNET
    ? 'http://127.0.0.1:8546'
    : 'https://rpc.ftm.tools/',
  [SUPPORTED_CHAINS.POLYGON]:
    'https://polygon-mainnet.infura.io/v3/2ce335a6c916456097e41f062748a6d8',
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
