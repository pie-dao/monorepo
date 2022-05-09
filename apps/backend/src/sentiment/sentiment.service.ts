import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SentimentEntity, SentimentDocument } from './entities/sentiment.entity';
import * as moment from 'moment';
import { CreateSentimentDto } from './dto/create-sentiment.dto';

@Injectable()
export class SentimentService {

  constructor(
    @InjectModel(SentimentEntity.name) private sentimentModel: Model<SentimentDocument>
  ) {}
  
  async create(
    sentiment: CreateSentimentDto
  ): Promise<SentimentDocument> {
    return new Promise(async(resolve, reject) => {
      try {
        if(!sentiment.timestamp) {
          sentiment.timestamp = moment().unix().toString();
        }
        
        let sentimentModel = new this.sentimentModel(sentiment);
        let sentimentDB = await sentimentModel.save();
        resolve(sentimentDB);      
      } catch(error) {
        reject(error);
      }      
    });
  }

  async report(
    days: number
  ): Promise<any> {
    let sentiments = await this.getSentiments(days);
    
    let report = {
      positive: {
        amount: 0,
        percentage: 0
      },
      negative: {
        amount: 0,
        percentage: 0
      }      
    };

    sentiments.forEach(sentiment => {
      switch(sentiment.vote) {
        case 'positive':
          report.positive.amount++;
          break;
        case 'negative':
          report.negative.amount++;
          break;          
      }
    });

    let totalVotes = report.positive.amount + report.negative.amount;
    report.positive.percentage = Math.round((report.positive.amount * 100) / totalVotes);
    report.negative.percentage = Math.floor((report.negative.amount * 100) / totalVotes);

    return report;
  }

  private async getSentiments(days: number): Promise<SentimentEntity[]> {
    return new Promise(async(resolve, reject) => {
      try {
        let filters = {
          'timestamp': {
            $gte: moment().subtract(days, 'days').unix().toString()
          }
        };

        let cgCoinEntity = await this.sentimentModel.find(filters)
        .lean();
  
        resolve(cgCoinEntity);        
      } catch(error) {
        reject(error);
      }
    });
  }
}
