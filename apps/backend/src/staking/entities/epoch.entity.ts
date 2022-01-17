import { ApiProperty } from "@nestjs/swagger";
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EpochDocument = EpochEntity & Document;

@Schema()
export class EpochEntity {
  @Prop()
  @ApiProperty()
  startDate: number;

  @Prop()
  @ApiProperty()
  endDate: number;

  @Prop()
  @ApiProperty()
  startBlock: number;

  @Prop()
  @ApiProperty()
  endBlock: number;

  @Prop()
  @ApiProperty()
  participants: Array<any>

  @Prop()
  @ApiProperty()
  proposals: Array<string>

  @Prop({type: Object})
  @ApiProperty()
  merkleTree: any

  @Prop({type: Object})
  @ApiProperty()
  stakingStats: any

  @Prop({type: Object})
  @ApiProperty()
  slice: any  

  // TODO: to be completed, and transformed into one-to-many relationship...
  @Prop()
  @ApiProperty()
  rewards: Array<any> 
}

export const EpochSchema = SchemaFactory.createForClass(EpochEntity);