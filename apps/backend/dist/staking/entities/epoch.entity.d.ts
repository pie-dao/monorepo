import { Document } from 'mongoose';
export declare type EpochDocument = EpochEntity & Document;
export declare class EpochEntity {
    startDate: number;
    endDate: number;
    startBlock: number;
    endBlock: number;
    participants: Array<any>;
    proposals: Array<string>;
    merkleTree: any;
    stakingStats: any;
    slice: any;
    rewards: Array<any>;
}
export declare const EpochSchema: import("mongoose").Schema<Document<EpochEntity, any, any>, import("mongoose").Model<any, any, any>, undefined, any>;
