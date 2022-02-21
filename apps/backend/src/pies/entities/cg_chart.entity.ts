import { ApiProperty } from "@nestjs/swagger";
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CgChartDocument = CgChartEntity & Document;

@Schema()
export class CgChartEntity {
  @ApiProperty()
  @Prop()
  prices: Array<Array<Number>>;

  @ApiProperty()
  @Prop()
  market_caps: Array<Array<Number>>;


  @ApiProperty()
  @Prop()
  total_volumes: Array<Array<Number>>;
}

export const CgChartSchema = SchemaFactory.createForClass(CgChartEntity);