import { Balance, Vault, VaultStats } from '../../store/vault/Vault';
import { AwaitedReturn, fromScale, toBalance } from '../../utils';
import { BigNumber } from '@ethersproject/bignumber';
import { zeroBalance } from '../../utils/balances';
import { Defined } from '../../types/utilities';
import { fetchOnChainData } from './fetchOnChainData';

export type ReturnedChainData = NonNullable<
  AwaitedReturn<typeof fetchOnChainData>
>;

/**
 * Calculate the users' shares available as part of the withdrawal process.
 *
 * Amount available depends on the batch burn round:
 * If the BBR === UserBBR:
 *   available === 0
 * Else:
 *   amount per share * shares
 */
const calculateSharesAvailable = ({
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
}): Balance => {
  if (userBatchBurnRound === batchBurnRound) return zeroBalance();

  const scaledPerShare = fromScale(amountPerShare, decimals);
  const bigAvailable = shares.mul(scaledPerShare);
  return toBalance(bigAvailable, decimals);
};

/**
 * Take the data common to all vaults and convert to a vault stats object
 */
const addVaultStatsToVault = (
  data: ReturnedChainData,
  decimals: number,
): VaultStats => ({
  deposits: toBalance(data.totalUnderlying, decimals),
  lastHarvest: data.lastHarvest.toNumber(),
  currentAPY: toBalance(data.estimatedReturn, decimals, 2),
  batchBurnRound: data.batchBurnRound.toNumber(),
  exchangeRate: toBalance(data.exchangeRate, decimals, 6),
});

/**
 * Take the data specific to the account/user and convert to the relevant
 * Vault state entries
 */
const addUserBalanceDataToVault = (
  accountLevelData: Defined<ReturnedChainData>,
  currentVault: Vault,
  decimals: number,
): Vault => {
  return {
    ...currentVault,

    auth: {
      ...currentVault.auth,
      isDepositor: accountLevelData.isDepositor,
    },

    userBalances: {
      wallet: toBalance(accountLevelData.balanceOfUnderlying, decimals),
      vault: toBalance(accountLevelData.balanceOfVault, decimals),
      vaultUnderlying: toBalance(
        accountLevelData.balanceOfVaultUnderlying,
        decimals,
      ),
      allowance: toBalance(accountLevelData.allowance as BigNumber, decimals),

      batchBurn: {
        round: accountLevelData.userBatchBurnReceipts[0].toNumber(),
        shares: toBalance(accountLevelData.userBatchBurnReceipts[1], decimals),
        available:
          currentVault.userBalances?.batchBurn.available ??
          toBalance(0, decimals),
      },
    },
  };
};

/**
 * Take the existing state object and add informating relating to the batchburn and withdraw process
 * We need this to be separate as it's not guaranteed that we have user and previous batch burn information.
 */
const addBatchBurnDataToState = (
  batchBurnLevelData: Defined<ReturnedChainData>,
  currentVault: Vault,
  decimals: number,
) => {
  return {
    ...currentVault,
    userBalances: {
      ...currentVault.userBalances!,
      batchBurn: {
        ...currentVault.userBalances?.batchBurn!,
        available: calculateSharesAvailable({
          shares: batchBurnLevelData.userBatchBurnReceipts.shares,
          amountPerShare: batchBurnLevelData.batchBurns.amountPerShare,
          decimals,
          batchBurnRound: batchBurnLevelData.batchBurnRound.toNumber(),
          userBatchBurnRound:
            batchBurnLevelData.userBatchBurnReceipts.round.toNumber(),
        }),
      },
    },
  };
};

/**
 * Rebuilds the entire vault as a state object before making a dispatch call.
 * This allows us to check we actually have changes before triggering
 * a state update.
 * Useful for controlling re-renders and preventing hammering of the node.
 */
export const toVault = ({
  existing,
  data,
  account,
}: {
  existing: Vault;
  data: AwaitedReturn<typeof fetchOnChainData>;
  account?: string | null;
}): Vault | undefined => {
  if (!data) return;
  const { decimals } = existing.token;

  let newVault: Vault = {
    ...existing,
    stats: {
      ...addVaultStatsToVault(data, decimals),
    },
    cap: {
      ...existing.cap,
      underlying: toBalance(data.userDepositLimit, decimals),
    },
  };

  // typescript cannot narrow undefined promise responses
  // even though we know our data is in the call, so we cast the data as defined for these functions
  if (account) {
    newVault = addUserBalanceDataToVault(
      data as Defined<ReturnedChainData>,
      newVault,
      decimals,
    );
  }

  if (data.batchBurns && account) {
    newVault = addBatchBurnDataToState(
      data as Defined<ReturnedChainData>,
      newVault,
      decimals,
    );
  }
  return newVault;
};
