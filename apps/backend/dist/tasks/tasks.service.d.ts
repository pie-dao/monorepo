import { HttpService } from '@nestjs/axios';
import { AirdropResponse } from './types/tasks.types.AirdropResponse';
export declare class TasksService {
    private httpService;
    private graphUrl;
    private GRAPH_MAX_PAGE_LENGTH;
    private KPI_AIRDROP_AMOUNT;
    constructor(httpService: HttpService);
    getKpiAirdrop(blockNumber: number): Promise<AirdropResponse>;
    private fetchVeDoughBalances;
    private getResponse;
}
