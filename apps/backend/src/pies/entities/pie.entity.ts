import { ApiProperty } from "@nestjs/swagger";
import { IsHexadecimal } from "class-validator";
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
  @IsHexadecimal()
  address: string;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'PieHistoryEntity' }])
  @ApiProperty()
  history: PieHistoryEntity[];  
}

export const PieSchema = SchemaFactory.createForClass(PieEntity);