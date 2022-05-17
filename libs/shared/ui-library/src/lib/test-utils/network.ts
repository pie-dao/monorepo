import { ethers } from "ethers";
import { RPC_URLS } from "../connectors";
import { Web3Provider } from "@ethersproject/providers";

function getChainEndpoint(chainId: string) {
  const chainEndpoint = RPC_URLS[Number(chainId)];
  if (!chainEndpoint) {
    throw new Error(`Endpoint not found for chain ID: ${chainId}`);
  }
  return chainEndpoint;
}

export function getChainProvider(chainId: string) {
  const chainEndpoint = getChainEndpoint(chainId);
  return new ethers.providers.JsonRpcProvider(chainEndpoint);
}

export function getLibrary(provider: any): Web3Provider {
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
  return library;
}
