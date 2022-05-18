import { InjectedConnector } from '@web3-react/injected-connector';
import { SafeAppConnector } from '@gnosis.pm/safe-apps-web3-react';
import { WalletConnectConnector } from './walletConnect';
import { Web3Provider } from '@ethersproject/providers';
import { NetworkConnector } from '@web3-react/network-connector';
import { SUPPORTED_CHAINS } from '../utils/networks';

export const RPC_URLS: Record<number, string> = {
  [SUPPORTED_CHAINS.MAINNET]:
    'https://mainnet.infura.io/v3/' + process.env.REACT_APP_INFURA_API_KEY,
  [SUPPORTED_CHAINS.FANTOM]: 'https://rpc.ftm.tools/',
  [SUPPORTED_CHAINS.POLYGON]:
    'https://polygon-mainnet.infura.io/v3/' +
    process.env.REACT_APP_INFURA_API_KEY,
};

export const network = new NetworkConnector({
  urls: RPC_URLS,
  defaultChainId: SUPPORTED_CHAINS.FANTOM,
});

export const injected = new InjectedConnector({
  supportedChainIds: [
    SUPPORTED_CHAINS.MAINNET,
    SUPPORTED_CHAINS.FANTOM,
    SUPPORTED_CHAINS.POLYGON,
  ],
});

export default function getLibrary(provider: any): Web3Provider {
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

export const gnosisSafe = new SafeAppConnector();

export const walletconnect = new WalletConnectConnector({
  rpc: {
    [SUPPORTED_CHAINS.FANTOM]: RPC_URLS[SUPPORTED_CHAINS.FANTOM],
  },
  chainId: SUPPORTED_CHAINS.FANTOM,
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
});
