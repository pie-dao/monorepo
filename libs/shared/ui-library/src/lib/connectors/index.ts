import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { Web3Provider } from '@ethersproject/providers';
import { NetworkConnector } from '@web3-react/network-connector';
import { SUPPORTED_CHAINS, SUPPORTED_CHAIN_ID } from '../types/types';
import { chainMap } from '../utils/network';

export const RPC_URLS: Record<number, string> = {
  [SUPPORTED_CHAINS.MAINNET]:
    'https://mainnet.infura.io/v3/' + process.env.REACT_APP_INFURA_API_KEY,
  [SUPPORTED_CHAINS.FANTOM]: 'https://rpc.ftm.tools/',
  [SUPPORTED_CHAINS.POLYGON]:
    'https://polygon-mainnet.infura.io/v3/' +
    process.env.REACT_APP_INFURA_API_KEY,
};

export const network = (chainId: SUPPORTED_CHAIN_ID = 1) => {
  return new NetworkConnector({
    urls: RPC_URLS,
    defaultChainId: Number(chainMap[chainId as SUPPORTED_CHAIN_ID].chainId),
  });
};

export const injected = new InjectedConnector({
  supportedChainIds: [
    SUPPORTED_CHAINS.MAINNET,
    SUPPORTED_CHAINS.FANTOM,
    SUPPORTED_CHAINS.POLYGON,
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
  },
  supportedChainIds: [
    SUPPORTED_CHAINS.FANTOM,
    SUPPORTED_CHAINS.POLYGON,
    SUPPORTED_CHAINS.MAINNET,
  ],
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
});
