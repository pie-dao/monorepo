import { BigNumber, ethers } from 'ethers';
import { BigNumberReference } from '../store/products/products.types';

export function formatBalanceCurrency(
  balanceAmount: number,
  defaultLocale?: string,
  defaultCurrency?: string,
  compact?: boolean,
): string | null {
  const balance = new Intl.NumberFormat(defaultLocale ?? 'en-US', {
    style: 'currency',
    currency: defaultCurrency ?? 'USD',
    notation: compact ? 'compact' : 'standard',
    compactDisplay: 'short',
    maximumFractionDigits: 2,
  }).format(balanceAmount ?? 0);
  return balance;
}

export function formatBalance(
  balanceAmount: number,
  defaultLocale?: string,
  fixed = 2,
  notation: 'compact' | 'standard' | 'scientific' | 'engineering' = 'compact',
): string | null {
  const balance = new Intl.NumberFormat(defaultLocale ?? 'en-US', {
    style: 'decimal',
    notation: notation ?? 'compact',
    maximumFractionDigits: fixed ?? 0,
  }).format(balanceAmount ?? 0);
  return balance;
}

export function formatAsPercent(
  num: number,
  defaultLocale?: string,
  maximumFractionDigits?: number,
): string {
  return new Intl.NumberFormat(defaultLocale ?? 'en-US', {
    style: 'percent',
    maximumFractionDigits: maximumFractionDigits ?? 3,
  }).format(num / 100);
}

export const smallToBalance = (
  n: string,
  decimals: number,
): BigNumberReference => ({
  /**
   * Convert a standard number to a balance object
   */
  value: ethers.utils.parseUnits(n.toString(), decimals).toString(),
  label: Number(n),
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

export const percentageBetween = (
  n1: BigNumber,
  n2: BigNumber,
  decimals: number,
): BigNumberReference => {
  const total = n1.add(n2);
  const percentage = n1
    .mul(ethers.utils.parseUnits('100', decimals))
    .div(total);
  return toBalance(percentage, decimals);
};
