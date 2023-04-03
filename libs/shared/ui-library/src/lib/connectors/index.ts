import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { Web3Provider } from '@ethersproject/providers';
import { NetworkConnector } from '@web3-react/network-connector';
import { SUPPORTED_CHAINS, SUPPORTED_CHAIN_ID } from '../types/types';
import { chainMap, isChainSupported } from '../utils/network';

export const RPC_URLS: Record<number, string> = {
  [SUPPORTED_CHAINS.MAINNET]:
    'https://bestnet.alexintosh.com/rpc/jordan-gab-testing',
  [SUPPORTED_CHAINS.FANTOM]: 'https://rpc.ftm.tools/',
  [SUPPORTED_CHAINS.POLYGON]:
    'https://polygon-mainnet.infura.io/v3/2ce335a6c916456097e41f062748a6d8',
  [SUPPORTED_CHAINS.GOERLI]: 'https://rpc.ankr.com/eth_goerli',
};

export const network = (chainId = 1) => {
  return new NetworkConnector({
    urls: RPC_URLS,
    defaultChainId: isChainSupported(chainId)
      ? Number(chainMap[chainId as SUPPORTED_CHAIN_ID].chainId)
      : 1,
  });
};

export const injected = new InjectedConnector({
  supportedChainIds: [
    SUPPORTED_CHAINS.MAINNET,
    SUPPORTED_CHAINS.FANTOM,
    SUPPORTED_CHAINS.POLYGON,
    SUPPORTED_CHAINS.GOERLI,
  ],
});

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

export const walletconnect = new WalletConnectConnector({
  rpc: {
    [SUPPORTED_CHAINS.FANTOM]: RPC_URLS[SUPPORTED_CHAINS.FANTOM],
    [SUPPORTED_CHAINS.POLYGON]: RPC_URLS[SUPPORTED_CHAINS.POLYGON],
    [SUPPORTED_CHAINS.MAINNET]: RPC_URLS[SUPPORTED_CHAINS.MAINNET],
    [SUPPORTED_CHAINS.GOERLI]: RPC_URLS[SUPPORTED_CHAINS.GOERLI],
  },
  supportedChainIds: [
    SUPPORTED_CHAINS.FANTOM,
    SUPPORTED_CHAINS.POLYGON,
    SUPPORTED_CHAINS.MAINNET,
    SUPPORTED_CHAINS.GOERLI,
  ],
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
});
