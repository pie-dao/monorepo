import { Document } from 'mongoose';
export declare type TreasuryDocument = TreasuryEntity & Document;
export interface AssetValues {
    assets: number;
    debt: number;
    total: number;
}
export declare class AssetEntity {
    network: string;
    protocol: string;
    assets: number;
    debt: number;
    total: number;
}
export declare const AssetSchema: import("mongoose").Schema<Document<AssetEntity, any, any>, import("mongoose").Model<any, any, any>, undefined, any>;
export declare class TreasuryEntity {
    treasury: number;
    underlying_assets: AssetEntity[];
}
export declare const TreasurySchema: import("mongoose").Schema<Document<TreasuryEntity, any, any>, import("mongoose").Model<any, any, any>, undefined, any>;
