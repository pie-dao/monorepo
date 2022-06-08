import { ethers } from 'ethers';

export type LibraryProvider =
  | ethers.providers.Web3Provider
  | ethers.providers.JsonRpcProvider;
