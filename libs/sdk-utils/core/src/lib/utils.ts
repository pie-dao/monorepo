import { Provider } from '@ethersproject/abstract-provider';
import { Contract, ContractInterface, ethers, Signer } from 'ethers';

/**
 * Casting a contract inline can lose type signature information.
 * This helper adds a generic to properly ensure type information is not lost at compile time.
 * @returns an ethers JS contract with full type inference
 */
export const typesafeContract = <T extends Contract>(
  address: string,
  abi: ContractInterface,
  signerOrProvider?: Signer | Provider | undefined,
) => new ethers.Contract(address, abi, signerOrProvider) as T;

/**
 * Implement the decorator pattern by combining two objects and returning both type signatures
 * @returns the original object with the new fields.
 */
export const decorate = <B, A>(base: B, additional: A): B & A => {
  return { ...base, ...additional };
};

export type SignerOrProvider = Signer | Provider;
