import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Pie, PieHistory } from './domain/pie';
import {
  PieHistoryDocument,
  PieHistoryEntity,
} from './entities/pie-history.entity';
import { PieDocument, PieEntity } from './entities/pie.entity';

@Injectable()
export class PiesRepository {
  constructor(
    @InjectModel(PieEntity.name) private pieModel: Model<PieDocument>,
    @InjectModel(PieHistoryEntity.name)
    private pieHistoryModel: Model<PieHistoryDocument>,
  ) {}

  async create(pie: Pie): Promise<Pie> {
    const pieEntity = new this.pieModel({
      name: pie.name,
      symbol: pie.symbol,
      address: pie.address,
      history: [],
      coingecko_id: pie.coingeckoId,
    });

    for (const history of pie.history) {
      const historyEntity = new this.pieHistoryModel({
        timestamp: history.timestamp,
        nav: history.nav,
        decimals: history.decimals,
        marginalTVL: history.marginalTVL,
        totalSupply: history.totalSupply,
        underlyingAssets: history.underlyingAssets,
      });
      pieEntity.history.push(await historyEntity.save());
    }

    await pieEntity.save();

    return pie;
  }

  async findByName(name: string): Promise<Pie[]> {
    return this.pieModel.find({ name }).populate('history').map(entityToPie);
  }

  async findOneBySymbol(symbol: string): Promise<Pie> {
    const result = await this.pieModel
      .findOne({ symbol })
      .populate('history')
      .exec();
    return entityToPie([result])[0];
  }

  async findAll(): Promise<Pie[]> {
    return this.pieModel.find().populate('history').map(entityToPie);
  }
}

const entityToPie = (docs: PieDocument[]): Pie[] => {
  return docs.map((doc) => {
    return {
      name: doc.name,
      symbol: doc.symbol,
      address: doc.address,
      history: entityToHistory(doc.history),
      coingeckoId: doc.coingecko_id,
    };
  });
};

const entityToHistory = (docs: PieHistoryEntity[]): PieHistory[] => {
  return docs.map((doc) => {
    return {
      timestamp: doc.timestamp,
      nav: doc.nav,
      decimals: doc.decimals,
      marginalTVL: doc.marginalTVL,
      totalSupply: doc.totalSupply,
      underlyingAssets: doc.underlyingAssets.map((x) => x),
    };
  });
};
