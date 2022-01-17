import { Claimer } from "./staking.types.Claimer";

export interface MerkleTree {
    chainId: number;
    rewardToken: string;
    windowIndex: number;
    totalRewardsDistributed: string;
    merkleRoot: string;
    claims: {},
    stats: {}
}