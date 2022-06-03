import { useSelectedVault } from './useSelectedVault';

export enum WITHDRAWAL {
  'NOTSTARTED',
  'REQUESTED',
  'READY',
  'COMPLETE',
}

export const useStatus = (): WITHDRAWAL => {
  /**
   * (a) get user batched burn receipt by using userBatchBurnReceipts(address) (this will give you a Receipt { round, shares } object)
   * (b) check that round > 0 && shares > 0. If that is not the case, the user has no withdrawal pending.
   * (c) get current batched burn round using batchBurnRound() method (will redeploy the implementation contract in a moment so that you should be able to get that).
   * (d) Compare user's round from step (a) and batchBurnRound from step (c). There are 2 cases:
   *   (1)  The batchBurnRound is greater than the user's round: the user has underlying waiting for him :))))
   *   (2) The batchBurnRound is  equal to the user's round: the user needs to wait for next burning event
   * In the first case you can check how much the user should receive by doing (receipt is the receipt from step (1) ):
   *   receipt.shares * batchBurns(batchBurn).amountPerShare
   */
  const vault = useSelectedVault();
  const batchBurnRound = vault?.stats?.batchBurnRound;
  const userBatchBurnRound = vault?.userBalances?.batchBurn.round;
  if (batchBurnRound && userBatchBurnRound) {
    if (batchBurnRound > userBatchBurnRound) {
      return WITHDRAWAL.READY;
    } else {
      return WITHDRAWAL.REQUESTED;
    }
  }
  return WITHDRAWAL.NOTSTARTED;
};
