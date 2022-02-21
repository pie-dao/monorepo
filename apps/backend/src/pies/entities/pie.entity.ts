import { ApiProperty } from "@nestjs/swagger";
import { IsHexadecimal, IsObject } from "class-validator";
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { PieHistoryEntity } from './pie-history.entity';
import * as mongoose from 'mongoose';

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

  @Prop({type: Object})
  @ApiProperty()
  @IsObject()
  image: {
    thumb: string,
    small: string,
    large: string
  }; 
}

export const PieSchema = SchemaFactory.createForClass(PieEntity);