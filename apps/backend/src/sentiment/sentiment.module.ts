import { Module } from '@nestjs/common';
import { SentimentService } from './sentiment.service';
import { SentimentController } from './sentiment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SentimentSchema, SentimentEntity } from './entities/sentiment.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: SentimentEntity.name, schema: SentimentSchema }])
  ],
  controllers: [SentimentController],
  providers: [SentimentService]
})
export class SentimentModule {}
