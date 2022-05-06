import { Module } from '@nestjs/common';
import { SentimentService } from './sentiment.service';
import { SentimentController } from './sentiment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SentimentSchema, SentimentEntity } from './entities/sentiment.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SentimentEntity.name, schema: SentimentSchema },
    ]),
    ConfigModule,
  ],
  controllers: [SentimentController],
  providers: [SentimentService],
})
export class SentimentModule {}
