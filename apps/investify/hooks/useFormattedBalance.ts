import { useMemo } from 'react';

export function useFormattedBalance(
  balanceAmount: number,
  defaultLocale: string,
  defaultCurrency: string,
  short = false,
): string | null {
  const balance = useMemo(() => {
    const number = new Intl.NumberFormat(defaultLocale ?? 'en-US', {
      style: 'currency',
      currency: defaultCurrency ?? 'USD',
      notation: short ? 'compact' : 'standard',
      compactDisplay: short ? 'short' : 'long',
      maximumSignificantDigits: 4,
    }).format(balanceAmount ?? 0);
    return number;
  }, [balanceAmount, defaultCurrency, defaultLocale, short]);
  return balance;
}
