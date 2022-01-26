import { InjectedConnector } from "@web3-react/injected-connector";
import { SafeAppConnector } from '@gnosis.pm/safe-apps-web3-react'
import { PortisConnector } from '@web3-react/portis-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'
import { Web3Provider } from '@ethersproject/providers'
import { NetworkConnector } from '@web3-react/network-connector'
import { SupportedChains } from "../utils/networks";

// export const network = new NetworkConnector({
//   urls: { 137: 'https://polygon-mainnet.infura.io/v3/9ee4b6a28d1c4016981930ed7a8d7122' },
//   defaultChainId: 137
// })

export const injected = new InjectedConnector({
  supportedChainIds: Object.values(SupportedChains)
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
      : 'any'
  )
  library.pollingInterval = 12000;
  return library
}


export const gnosisSafe = new SafeAppConnector()

// export const walletconnect = new WalletConnectConnector({
//   supportedChainIds,
//   rpc: INFURA_NETWORK_URLS,
//   qrcode: true,
// })

// // mainnet only
// export const portis = new PortisConnector({
//   dAppId: PORTIS_ID ?? '',
//   networks: [1],
// })

// mainnet only
export const walletlink = new WalletLinkConnector({
  url: '',
  appName: 'Piedao',
  appLogoUrl: '',
  supportedChainIds: Object.values(SupportedChains),
})
