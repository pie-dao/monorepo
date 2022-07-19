import { BigNumber } from 'ethers';
import { BigNumberReference } from '../store/products/products.types';
import { zeroBalance } from './balances';
import { fromScale, toBalance } from './formatBalance';

export const calculateSharesAvailable = ({
  shares,
  amountPerShare,
  decimals,
  batchBurnRound,
  userBatchBurnRound,
}: {
  shares: BigNumber;
  amountPerShare: BigNumber;
  decimals: number;
  batchBurnRound: number;
  userBatchBurnRound: number;
}): BigNumberReference => {
  if (userBatchBurnRound === batchBurnRound) return zeroBalance;
  const bigAvailable = shares.mul(amountPerShare);

  const formatFixed = fromScale(bigAvailable, decimals);
  return toBalance(formatFixed, decimals);
};
