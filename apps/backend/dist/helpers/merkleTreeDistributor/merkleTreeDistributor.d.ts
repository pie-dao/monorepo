import { Claims } from 'src/staking/types/staking.types.Claims';
import { Participation } from 'src/staking/types/staking.types.Participation';
import { MerkleTree } from 'src/staking/types/staking.types.MerkleTree';
import { EpochEntity } from 'src/staking/entities/epoch.entity';
export declare class MerkleTreeDistributor {
    private SLICE_ADDRESS;
    private EXPLODE_DECIMALS;
    constructor();
    private calculateProRata;
    private getUnclaimed;
    generateMerkleTree(totalRewardsDistributed: string, windowIndex: number, participations: Participation[], previousEpoch: EpochEntity, rewards: any[]): Promise<MerkleTree>;
    generateClaims(totalRewardsDistributed: string, windowIndex: number, participations: Participation[], previousEpoch: EpochEntity, rewards: any[]): Promise<Claims>;
}
