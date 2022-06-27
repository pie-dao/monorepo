import { BigNumber } from 'bignumber.js';
import { FundHistory } from './FundHistory';
import { Token } from './Token';

/**
 * Represents the state of a {@link YieldVault} at the given {@link timestamp}.
 */
export type YieldVaultHistory = FundHistory & {
  /**
   * The underlying token the vault accepts.
   */
  underlyingToken: Token;

  /**
   * The percentage of profit recognized each harvest to reserve as fees.
   * A fixed point number where 1e18 represents 100% and 0 represents 0%.
   */
  harvestFeePercent?: BigNumber;

  /**
   * The address receiving harvest fees (denominated in Vault's shares).
   */
  harvestFeeReceiver?: string;

  /**
   * The percentage of shares recognized each burning to reserve as fees.
   * A fixed point number where 1e18 represents 100% and 0 represents 0%.
   */
  burningFeePercent?: BigNumber;

  /**
   * The address receiving burning fees (denominated in Vault's shares).
   */
  burningFeeReceiver?: string;

  /**
   * The period in seconds during which multiple harvests can occur
   * regardless if they are taking place before the harvest delay has elapsed.
   * Long harvest delays open up the Vault to profit distribution DOS attacks.
   */
  harvestWindow?: BigNumber;

  /**
   * The period in seconds over which locked profit is unlocked.
   * Cannot be 0 as it opens harvests up to sandwich attacks.
   */
  harvestDelay?: BigNumber;

  /**
   * The value that will replace harvestDelay next harvest.
   * In the case that the next delay is 0, no update will be applied.
   */
  nextHarvestDelay?: BigNumber;

  /**
   * The total amount of underlying tokens held in strategies at the time of the last harvest.
   * Includes maxLockedProfit, must be correctly subtracted to compute available/free holdings.
   */
  totalStrategyHoldings: BigNumber;

  /**
   * Exchange rate at the beginning of latest harvest window
   */
  lastHarvestExchangeRate?: BigNumber;

  lastHarvestIntervalInBlocks?: BigNumber;

  /**
   * The block number when the first harvest in the most recent harvest window occurred.
   */
  lastHarvestWindowStartBlock?: BigNumber;
  /**
   * A timestamp representing when the first harvest in the most recent harvest window occurred.
   * May be equal to lastHarvest if there was/has only been one harvest in the most last/current window.
   */
  lastHarvestWindowStart?: Date;

  /**
   * A timestamp representing when the most recent harvest occurred.
   */
  lastHarvest?: Date;

  /**
   * The amount of locked profit at the end of the last harvest.
   */
  maxLockedProfit?: BigNumber;

  /**
   * Current batched burning round.
   */
  batchBurnRound?: BigNumber;

  /**
   * Balance reserved to batched burning withdrawals.
   */
  batchBurnBalance?: BigNumber;

  /**
   * Amount of shares a single address can hold.
   */
  userDepositLimit: BigNumber;

  /**
   * Amount of underlying cap for this vault.
   */
  vaultDepositLimit: BigNumber;

  /**
   * Estimated return recorded during last harvest.
   */
  estimatedReturn: BigNumber;

  /**
   * The amount of underlying tokens a share can be redeemed for.
   */
  exchangeRate: BigNumber;

  /**
   * The amount of underlying tokens that idly sit in the Vault.
   */
  totalFloat: BigNumber;

  /**
   * The current amount of locked profit.
   */
  lockedProfit: BigNumber;

  /**
   * The total amount of underlying tokens the Vault holds.
   */
  totalUnderlying: BigNumber;

  /**
   * An ordered array of strategies representing the withdrawal queue.
   * The queue is processed in descending order, meaning the last index will be withdrawn from first.
   * Strategies that are untrusted, duplicated, or have no balance are filtered out when encountered at
   * withdrawal time, not validated upfront, meaning the queue may not reflect the "true" set used
   * for withdrawals.
   */
  withdrawalQueue?: Strategy[];
};

export type Strategy = {
  name: string;
  /**
   * The underlying token the strategy accepts.
   */
  underlyingToken: Token;

  /**
   * The amount of underlying tokens deposited in this strategy.
   */
  depositedAmount: BigNumber;

  /**
   * The estimated amount of underlying tokens managed by the strategy.
   */
  estimatedAmount: BigNumber;

  /**
   * The strategy manager.
   */
  manager: string;

  /**
   * The strategist (TODO: who is this?)
   */
  strategist: string;

  /**
   * Tells whether Vault will operate on a strategy.
   */
  trusted: boolean;
  /**
   * Used to determine profit and loss during harvests of the strategy.
   */
  balance: BigNumber;
};
