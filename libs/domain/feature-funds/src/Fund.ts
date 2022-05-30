import { FundSnapshot } from './FundSnapshot';
import { PieSmartPool } from './PieSmartPool';
import { PieVault } from './PieVault';
import { Token } from './Token';
import { YieldVault } from './YieldVault';

/**
 * A fund type holds the current state of a fund, and also an array of
 * historical states.
 */
export type Fund<S extends FundSnapshot> = Token &
  S & {
    /**
     * The kind of fund which can be used in tagged unions.
     */
    kind: string;
    /**
     * Historical snapshots of the fund.
     */
    snapshots: S[];
  };

export type AnyFund = PieVault | PieSmartPool | YieldVault;
