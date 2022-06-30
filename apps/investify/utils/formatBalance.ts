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
