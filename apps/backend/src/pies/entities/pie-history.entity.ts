import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { BigNumber } from 'bignumber.js';
import { Document } from 'mongoose';
import { UnderlyingAsset } from '../domain/pie';

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
  marginalTVL: BigNumber;

  @Prop()
  @ApiProperty()
  totalSupply: BigNumber;

  @Prop()
  @ApiProperty()
  underlyingAssets: UnderlyingAsset[];
}

export const PieHistorySchema = SchemaFactory.createForClass(PieHistoryEntity);
