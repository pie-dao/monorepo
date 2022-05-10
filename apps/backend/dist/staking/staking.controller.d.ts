import { EpochEntity } from './entities/epoch.entity';
import { StakingService } from './staking.service';
import { FreeRider } from './types/staking.types.FreeRider';
export declare class StakingController {
    private readonly stakingService;
    constructor(stakingService: StakingService);
    getStakers(ids?: string): Promise<any[]>;
    getLocks(locked_at?: string, ids?: string): Promise<any[]>;
    getEpochs(startDate?: number): Promise<Array<EpochEntity>>;
    getEpoch(windowIndex?: number): Promise<EpochEntity>;
    getFreeRiders(month?: number, blockNumber?: number, proposals?: string): Promise<FreeRider[]>;
}
