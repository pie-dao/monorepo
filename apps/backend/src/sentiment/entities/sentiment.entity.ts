import { ApiProperty } from "@nestjs/swagger";
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SentimentDocument = SentimentEntity & Document;

@Schema()
export class SentimentEntity {
  @Prop()
  @ApiProperty()
  timestamp: string;

  @Prop()
  @ApiProperty()
  vote: 'positive' | 'negative';
}

export const SentimentSchema = SchemaFactory.createForClass(SentimentEntity);