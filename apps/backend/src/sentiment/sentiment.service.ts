import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as moment from 'moment';
import { Model } from 'mongoose';
import { CreateSentimentDto } from './dto/create-sentiment.dto';
import {
  SentimentDocument,
  SentimentEntity,
} from './entities/sentiment.entity';

@Injectable()
export class SentimentService {
  constructor(
    @InjectModel(SentimentEntity.name)
    private sentimentModel: Model<SentimentDocument>,
  ) {}

  create(sentiment: CreateSentimentDto): Promise<SentimentDocument> {
    if (!sentiment.timestamp) {
      sentiment.timestamp = moment().unix().toString();
    }

    const sentimentModel = new this.sentimentModel(sentiment);
    return sentimentModel.save();
  }

  async report(days: number): Promise<any> {
    const sentiments = await this.getSentiments(days);

    const report = {
      positive: {
        amount: 0,
        percentage: 0,
      },
      negative: {
        amount: 0,
        percentage: 0,
      },
    };

    sentiments.forEach((sentiment) => {
      switch (sentiment.vote) {
        case 'positive':
          report.positive.amount++;
          break;
        case 'negative':
          report.negative.amount++;
          break;
      }
    });

    const totalVotes = report.positive.amount + report.negative.amount;
    report.positive.percentage = Math.round(
      (report.positive.amount * 100) / totalVotes,
    );
    report.negative.percentage = Math.floor(
      (report.negative.amount * 100) / totalVotes,
    );

    return report;
  }

  private async getSentiments(days: number): Promise<SentimentEntity[]> {
    const filters = {
      timestamp: {
        $gte: moment().subtract(days, 'days').unix().toString(),
      },
    };

    return this.sentimentModel.find(filters).lean();
  }
}
