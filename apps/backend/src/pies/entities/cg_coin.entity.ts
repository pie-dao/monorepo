import { ApiProperty } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IsObject } from 'class-validator';

export type CgCoinDocument = CgCoinEntity & Document;

@Schema()
export class CgCoinEntity {
  @ApiProperty()
  @Prop()
  timestamp: string;

  @Prop({ type: Object })
  @ApiProperty()
  @IsObject()
  coin: object;
}

export const CgCoinSchema = SchemaFactory.createForClass(CgCoinEntity);
