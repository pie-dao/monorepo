import { BigNumber, ethers } from 'ethers';
import { BigNumberReference } from '../store/products/products.types';
import { zeroBalance } from './balances';
import { toBalance } from './formatBalance';

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

  const scaledPerShare = Number(
    ethers.utils.formatUnits(amountPerShare, decimals),
  );
  const bigAvailable = shares.mul(scaledPerShare);
  return toBalance(bigAvailable, decimals);
};
