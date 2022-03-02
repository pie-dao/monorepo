import { ethers } from "ethers";

export type SetStateType<T extends any> = (t: T) => void;
export type LibraryProvider =
  | ethers.providers.Web3Provider
  | ethers.providers.JsonRpcProvider;
