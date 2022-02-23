import { InjectedConnector } from "@web3-react/injected-connector";
import { SafeAppConnector } from "@gnosis.pm/safe-apps-web3-react";
import { WalletConnectConnector } from "./walletConnect";
import { Web3Provider } from "@ethersproject/providers";
import { NetworkConnector } from "@web3-react/network-connector";

const isDevEnvironment = process.env.REACT_APP_MERKLE_ROOT === "dev";

export const RPC_URLS = [
  "https://mainnet.infura.io/v3/" + process.env.INFURA_API_KEY,
  "https://rpc.ftm.tools/",
];

export const network = new NetworkConnector({
  urls: {
    1: RPC_URLS[0],
    250: RPC_URLS[1],
  },
  defaultChainId: 250,
});

export const injected = new InjectedConnector({
  supportedChainIds: [1, 250],
});

export default function getLibrary(provider: any): Web3Provider {
  /**
   * Pass in the root of the application to make the Web3-react
   * hook available to the application
   */
  const library = new Web3Provider(
    provider,
    typeof provider.chainId === "number"
      ? provider.chainId
      : typeof provider.chainId === "string"
      ? parseInt(provider.chainId)
      : "any"
  );
  library.pollingInterval = isDevEnvironment ? 12000 : 1000;
  return library;
}

export const gnosisSafe = new SafeAppConnector();

export const walletconnect = new WalletConnectConnector({
  rpc: {
    1: RPC_URLS[0],
  },
  chainId: 1,
  bridge: "https://bridge.walletconnect.org",
  qrcode: true,
});
