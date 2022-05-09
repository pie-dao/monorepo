import { Claimer } from "./staking.types.Claimer";

export interface Claims {
    chainId: number;
    rewardToken: string;
    windowIndex: number;
    totalRewardsDistributed: string;
    recipients: { [key: string]: Claimer }
    stats: {}
}