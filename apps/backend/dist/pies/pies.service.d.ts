import { Model } from 'mongoose';
import { PieDto } from './dto/pies.dto';
import { PieDocument, PieEntity } from './entities/pie.entity';
import { PieHistoryDocument, PieHistoryEntity } from './entities/pie-history.entity';
import { HttpService } from '@nestjs/axios';
export declare class PiesService {
    private httpService;
    private pieModel;
    private pieHistoryModel;
    private pies;
    private readonly logger;
    constructor(httpService: HttpService, pieModel: Model<PieDocument>, pieHistoryModel: Model<PieHistoryDocument>);
    updateNAVs(test?: boolean): Promise<boolean>;
    getPies(name?: string, address?: string, test?: boolean): Promise<PieEntity[]>;
    getPieHistory(name?: any, address?: any): Promise<PieHistoryEntity[]>;
    getPieHistoryDetails(pie: PieEntity): Promise<PieHistoryEntity[]>;
    getPieByAddress(address: string): Promise<PieEntity>;
    getPieByName(name: string): Promise<PieEntity>;
    createPie(pie: PieDto): Promise<PieEntity>;
    deletePie(pie: PieEntity): Promise<PieEntity>;
}
