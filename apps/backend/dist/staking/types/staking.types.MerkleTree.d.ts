export interface MerkleTree {
    chainId: number;
    rewardToken: string;
    windowIndex: number;
    totalRewardsDistributed: string;
    merkleRoot: string;
    claims: {};
    stats: {};
}
