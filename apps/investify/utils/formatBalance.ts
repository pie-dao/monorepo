import { BigNumber, ethers, FixedNumber } from 'ethers';
import { BigNumberReference } from '../store/products/products.types';

export function formatBalanceCurrency(
  balanceAmount: number,
  defaultLocale: string,
  defaultCurrency: string,
): string | null {
  const balance = new Intl.NumberFormat(defaultLocale ?? 'en-US', {
    style: 'currency',
    currency: defaultCurrency ?? 'USD',
  }).format(balanceAmount ?? 0);
  return balance;
}

export function formatBalance(
  balanceAmount: number,
  defaultLocale: string,
  fixed: number,
): string | null {
  const balance = new Intl.NumberFormat(defaultLocale ?? 'en-US', {
    style: 'decimal',
    maximumFractionDigits: fixed ?? 0,
  }).format(balanceAmount ?? 0);
  return balance;
}

export const smallToBalance = (
  n: number,
  decimals: number,
): BigNumberReference => ({
  /**
   * Convert a standard number to a balance object
   */
  value: ethers.utils.parseUnits(n.toString(), decimals).toString(),
  label: n,
});

export const toBalance = (
  n: number | BigNumber,
  decimals: number,
): BigNumberReference => ({
  /**
   * Convert a big number or number to a balance object
   */
  label: Number(ethers.utils.formatUnits(n, decimals)),
  value: String(n),
});
