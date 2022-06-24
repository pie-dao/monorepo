import { SupportedCurrency } from './SupportedCurrency';

/**
 * Open, high, low, close data type.
 */
export type OHLC = {
  open: number;
  high: number;
  low: number;
  close: number;
  currency: SupportedCurrency;
  from: Date;
  to: Date;
};
