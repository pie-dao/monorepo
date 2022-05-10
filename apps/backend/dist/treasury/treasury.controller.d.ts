import { TreasuryService } from './treasury.service';
import { TreasuryEntity } from './entities/treasury.entity';
import { GetTreasuryQuery } from './dto/getTreasury.dto';
export declare class TreasuryController {
    private readonly treasuryService;
    constructor(treasuryService: TreasuryService);
    getTreasury(params: GetTreasuryQuery): Promise<TreasuryEntity[]>;
}
