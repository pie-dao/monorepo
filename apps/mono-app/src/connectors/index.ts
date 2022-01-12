import { InjectedConnector } from "@web3-react/injected-connector";
import { ChainIds } from "../constants";
import { Web3Provider } from '@ethersproject/providers'

export const injected = new InjectedConnector({
  supportedChainIds: [
    ChainIds.POLYGON,
    ChainIds.MAINNET
  ]
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
