import { BigNumber, ethers } from 'ethers';
import { BigNumberReference } from '../store/products/products.types';
import { zeroBalance } from './balances';

export function formatBalanceCurrency(
  balanceAmount: number,
  defaultLocale = 'en-US',
  defaultCurrency = 'USD',
  compact = false,
  maximumFractionDigits = 2,
): string {
  // Determine the minimum fraction digits required
  const decimalPart = Math.abs(balanceAmount % 1);
  const minimumFractionDigits = decimalPart === 0 ? 0 : maximumFractionDigits;

  // Create a new Intl.NumberFormat instance with the given options
  const formatter = new Intl.NumberFormat(defaultLocale, {
    style: 'currency',
    currency: defaultCurrency,
    notation: compact ? 'compact' : 'standard',
    compactDisplay: 'short',
    minimumFractionDigits,
    maximumFractionDigits,
  });

  // Format the balance amount and return the result
  return formatter.format(balanceAmount ?? 0);
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
    minimumFractionDigits: 0,
    maximumFractionDigits: 6 ?? 0,
  }).format(balanceAmount ?? 0);
  return balance;
}

// Formats a given number as a percentage with optional locale and fraction digits.
// Formats a given number as a percentage with optional locale and fraction digits.
export function formatAsPercent(
  num?: number,
  defaultLocale = 'en-US',
  maximumFractionDigits = 3,
): string {
  // Handle the case when the input number is missing
  if (typeof num === 'undefined') {
    num = 0;
  }

  // Determine the minimum fraction digits required
  const decimalPart = Math.abs(num % 1);
  const decimalStr = decimalPart.toFixed(maximumFractionDigits).slice(2);
  const minimumFractionDigits =
    decimalPart === 0 ? 0 : decimalStr.replace(/0+$/, '').length;

  const formatter = new Intl.NumberFormat(defaultLocale, {
    style: 'percent',
    minimumFractionDigits,
    maximumFractionDigits: Math.max(
      minimumFractionDigits,
      maximumFractionDigits,
    ),
  });

  // Format the number as a percentage and return the result
  return formatter.format(num / 100);
}

export function formatAsPercentOfTotal(
  number: number,
  total: number,
  defaultLocale?: string,
): string {
  if (total === 0 || isNaN(total) || isNaN(number)) {
    throw new Error('Invalid input');
  }

  const percentage = number / total;
  const formatter = new Intl.NumberFormat(defaultLocale ?? 'en-US', {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    useGrouping: false,
  });

  return formatter.format(percentage);
}

export const smallToBalance = (
  n: string,
  decimals: number,
): BigNumberReference => {
  let value: string;
  let label: number;
  try {
    value = ethers.utils.parseUnits(n.toString(), decimals).toString();
    label = Number(n);
    return {
      value,
      label,
    };
  } catch (e) {
    if (e.code === 'NUMERIC_FAULT') {
      console.debug(
        'Error parsing balance, decimals exceeded the specified ones',
      );
      return zeroBalance;
    }
    throw e;
  }
};

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
