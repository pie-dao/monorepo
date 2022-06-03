import { BigNumber } from '@ethersproject/bignumber';
import { ethers } from 'ethers';
import { Balance } from '../store/vault/Vault';

// Only needed for TS < 4.5
export type Awaited<T> = T extends PromiseLike<infer U> ? U : T;
export type AwaitedReturn<F extends (...args: any) => any> = Awaited<
  ReturnType<F>
>;

export const BigNumberMin = (b1: BigNumber, b2: BigNumber): BigNumber =>
  b1.gt(b2) ? b2 : b1;

export const convertFromUnderlying = (
  original: Balance,
  exchangeRate: Balance,
  decimals: number,
): Balance => {
  const valueBN = BigNumber.from(original.value)
    .mul(BigNumber.from(10).pow(decimals))
    .div(exchangeRate?.value ?? 0);

  const stringLabel = ethers.utils.formatUnits(valueBN, decimals);

  const label = Math.round(parseFloat(stringLabel));

  return {
    value: valueBN.toString(),
    label,
  };
};

export const convertToUnderlying = (
  original: Balance,
  exchangeRate: Balance,
  decimals: number,
): Balance => {
  const valueBN = BigNumber.from(original.value)
    .mul(exchangeRate?.value ?? 0)
    .div(BigNumber.from(10).pow(decimals));

  const stringLabel = ethers.utils.formatUnits(valueBN, decimals);

  const label = Math.round(parseFloat(stringLabel));

  return {
    value: valueBN.toString(),
    label,
  };
};

// format 1000000000 -> '1,000,000,000'
export const prettyNumber = (n?: number): string =>
  n ? n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0';

export const toScale = (amount: number, decimals: number) =>
  BigNumber.from(amount).mul(BigNumber.from(10).pow(decimals));

export const fromScale = (
  n: number | BigNumber | undefined,
  decimals: number,
  precision = 0,
): number => {
  if (!n) return 0;
  if (typeof n === 'number') return n;

  const stringLabel = ethers.utils.formatUnits(n, decimals);
  return Number(parseFloat(stringLabel).toFixed(precision));
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
  precision = 0,
): Balance => ({
  /**
   * Convert a big number or number to a balance object
   */
  label: fromScale(n, decimals, precision),
  value: String(n),
});

export const AUXO_HELP_URL =
  'https://www.notion.so/piedao/Auxo-Vaults-12adac7ebc1e43eeb0c5db4c7cd828e2';

export const zeroApyMessage = (apy: number | undefined): string => {
  if (apy !== 0 && !apy) return '--';
  else return apy === 0 ? 'New Vault' : apy.toFixed(2) + ' %';
};
