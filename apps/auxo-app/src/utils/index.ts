import { BigNumber } from "@ethersproject/bignumber";
import Big from 'big.js';
import { Balance } from "../store/vault/Vault";

export type Awaited<T> = T extends PromiseLike<infer U> ? U : T;
export type AwaitedReturn<F extends (...args: any) => any> = Awaited<
  ReturnType<F>
>;

// format 1000000000 -> '1,000,000,000'
export const prettyNumber = (n?: number): string =>
  n ? n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "0";

export const toScale = (amount: number, decimals: number) =>
  BigNumber.from(amount).mul(BigNumber.from(10).pow(decimals));

export const fromScale = (n: number | BigNumber, decimals: number, precision = 0): number => {
  if (typeof n === "number") return n;
  
  // ethers BN implementaion ignores decimal point conversion when dividing, so we need
  // to use an alternative approach for decimals >= 0.5
  const numerator = Big(n.toString());
  const raw = numerator.div(Big(10).pow(decimals)).toFixed(precision);
  return Number(raw);
};

export const smallToBalance = (n: number, decimals: number): Balance => ({
  /**
   * Convert a standard number to a balance object
   */
  value: toScale(n, decimals).toString(),
  label: n,
});

export const toBalance = (
  n: number | BigNumber,
  decimals: number,
  precision = 0
): Balance => ({
  /**
   * Convert a big number to a balance object
   */
  label: fromScale(n, decimals, precision),
  value: String(n),
});

export const AUXO_HELP_URL =
  "https://www.notion.so/piedao/Auxo-Vaults-12adac7ebc1e43eeb0c5db4c7cd828e2";

export const zeroApyMessage = (apy: number | undefined): string => {
  if (apy !== 0 && !apy) return "N/A";
  else return apy === 0 ? "New Vault" : apy.toFixed(2) + " %";
};
