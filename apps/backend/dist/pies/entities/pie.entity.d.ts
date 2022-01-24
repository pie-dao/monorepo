import { Document } from 'mongoose';
import { PieHistoryEntity } from './pie-history.entity';
import * as mongoose from 'mongoose';
export declare type PieDocument = PieEntity & Document;
export declare class PieEntity {
    name: string;
    address: string;
    history: PieHistoryEntity[];
}
export declare const PieSchema: mongoose.Schema<Document<PieEntity, any, any>, mongoose.Model<any, any, any>, undefined, any>;
