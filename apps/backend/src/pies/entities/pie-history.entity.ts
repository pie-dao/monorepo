import { ApiProperty } from "@nestjs/swagger";
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BigNumber } from 'bignumber.js';

export type PieHistoryDocument = PieHistoryEntity & Document;

@Schema()
export class PieHistoryEntity {
  @Prop()
  @ApiProperty()
  timestamp: string;

  @Prop()
  @ApiProperty()
  nav: number;  

  @Prop()
  @ApiProperty()
  decimals: number;  

  @Prop()
  @ApiProperty()
  marketCapUSD: BigNumber;

  @Prop()
  @ApiProperty()
  totalSupply: BigNumber;  

  @Prop()
  @ApiProperty()
  underlyingAssets: object[];  
}

export const PieHistorySchema = SchemaFactory.createForClass(PieHistoryEntity);