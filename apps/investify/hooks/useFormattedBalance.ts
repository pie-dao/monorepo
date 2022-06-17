import { useMemo } from 'react';

export function useFormattedBalance(
  balanceAmount: number,
  defaultLocale: string,
  defaultCurrency: string,
): string | null {
  const balance = useMemo(() => {
    const number = new Intl.NumberFormat(defaultLocale ?? 'en-US', {
      style: 'currency',
      currency: defaultCurrency ?? 'USD',
    }).format(balanceAmount ?? 0);
    return number;
  }, [balanceAmount, defaultCurrency, defaultLocale]);
  return balance;
}
