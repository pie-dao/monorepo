import { Document } from 'mongoose';
import { BigNumber } from 'bignumber.js';
export declare type PieHistoryDocument = PieHistoryEntity & Document;
export declare class PieHistoryEntity {
    timestamp: string;
    nav: number;
    decimals: number;
    marketCapUSD: BigNumber;
    totalSupply: BigNumber;
    underlyingAssets: object[];
}
export declare const PieHistorySchema: import("mongoose").Schema<Document<PieHistoryEntity, any, any>, import("mongoose").Model<any, any, any>, undefined, any>;
