import { BigNumber, ethers } from 'ethers';
import { BigNumberReference } from '../store/products/products.types';

export function formatBalanceCurrency(
  balanceAmount: number,
  defaultLocale?: string,
  defaultCurrency?: string,
): string | null {
  const balance = new Intl.NumberFormat(defaultLocale ?? 'en-US', {
    style: 'currency',
    currency: defaultCurrency ?? 'USD',
    notation: 'compact',
    compactDisplay: 'short',
    maximumSignificantDigits: 4,
  }).format(balanceAmount ?? 0);
  return balance;
}

export function formatBalance(
  balanceAmount: number,
  defaultLocale?: string,
  fixed?: number,
): string | null {
  const balance = new Intl.NumberFormat(defaultLocale ?? 'en-US', {
    style: 'decimal',
    notation: 'compact',
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
