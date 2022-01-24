import { useWeb3React } from "@web3-react/core";
import { SupportedChains } from "../utils/networks";

export const useNetwork = (): string => {
  const { chainId } = useWeb3React();
  let network =  Object.keys(SupportedChains).find(key => SupportedChains[key] === chainId) ?? 'Not Supported';
  return network
}
