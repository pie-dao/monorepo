import { ethers } from 'ethers';

export type SetStateType<T extends any> = (t: T) => void;
export type LibraryProvider =
  | ethers.providers.Web3Provider
  | ethers.providers.JsonRpcProvider;

// Cast null, optional or undefined properties as definite
export type Defined<T> = {
  [P in keyof T]-?: NonNullable<T[P]>;
};
