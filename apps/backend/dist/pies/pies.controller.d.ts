import { PieHistoryEntity } from './entities/pie-history.entity';
import { PieEntity } from './entities/pie.entity';
import { PiesService } from './pies.service';
export declare class PiesController {
    private readonly piesService;
    constructor(piesService: PiesService);
    getPies(name?: string, address?: string): Promise<PieEntity[]>;
    getPieHistory(name?: string, address?: string): Promise<PieHistoryEntity[]>;
    getPieByAddress(address: string): Promise<PieEntity>;
    getPieByName(name: string): Promise<PieEntity>;
}
