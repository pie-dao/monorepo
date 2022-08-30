export type INTERVAL = '1D' | '1W' | '1M' | '1Y' | 'ALL';

export const dataRanges: INTERVAL[] = ['1D', '1W', '1M', '1Y', 'ALL'];

export const slicePerInterval: Record<INTERVAL, number> = {
  '1D': 24,
  '1W': 24 * 7,
  '1M': 24 * 30,
  '1Y': 24 * 365,
  ALL: 24 * 365 * 3,
};
