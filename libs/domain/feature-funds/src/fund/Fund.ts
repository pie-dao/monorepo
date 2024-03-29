import { FundHistory } from './FundHistory';
import { PieSmartPool } from './piesmartpool';
import { PieVault } from './pievault';
import { Token } from './Token';
import { YieldVault } from './yieldvault/YieldVault';

/**
 * A fund type holds the current state of a fund, and also an array of
 * historical states.
 */
export interface Fund<H extends FundHistory = FundHistory> extends Token {
  /**
   * The kind of fund which can be used in tagged unions.
   */
  kind: string;
  /**
   * Historical snapshots of the fund.
   */
  history: H[];
}

export type AnyFund = PieVault | PieSmartPool | YieldVault;
