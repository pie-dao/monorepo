import { ethers } from "ethers";
export declare type SetStateType<T extends any> = (t: T) => void;
export declare type LibraryProvider = ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider;
export declare type Defined<T> = {
    [P in keyof T]-?: NonNullable<T[P]>;
};
