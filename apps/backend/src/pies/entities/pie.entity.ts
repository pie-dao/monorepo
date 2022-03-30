import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsHexadecimal } from 'class-validator';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { PieHistoryEntity } from './pie-history.entity';

export type PieDocument = PieEntity & Document;

@Schema()
export class PieEntity {
  @Prop()
  @ApiProperty()
  name: string;

  @Prop()
  @ApiProperty()
  symbol: string;

  @Prop()
  @ApiProperty()
  @IsHexadecimal()
  address: string;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'PieHistoryEntity' }])
  @ApiProperty()
  history: PieHistoryEntity[];

  @Prop()
  @ApiProperty()
  @IsHexadecimal()
  coingecko_id: string;
}

export const PieSchema = SchemaFactory.createForClass(PieEntity);
