import { YieldvaultAbi } from '@shared/util-blockchain';
import { PieSmartPool } from './PieSmartPool';
import { PieVault } from './PieVault';

export type Fund = PieVault | PieSmartPool | YieldvaultAbi;
