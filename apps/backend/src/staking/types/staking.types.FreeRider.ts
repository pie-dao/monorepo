import { Staker } from "./staking.types.Staker";
import { Lock } from "./staking.types.Staker";

export interface FreeRider {
    id: string;
    isFreeRider: boolean; 
    oldestLock: Lock;
    stakingData: Staker;
}