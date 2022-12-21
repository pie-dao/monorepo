import { BigNumberish, ethers } from 'ethers';

export const toBalance = (
  n: BigNumberish,
  decimals: number,
  precision = 0,
): number => {
  if (!n) return 0;

  const stringLabel = ethers.utils.formatUnits(n, decimals);
  return Number(parseFloat(stringLabel).toFixed(precision));
};
