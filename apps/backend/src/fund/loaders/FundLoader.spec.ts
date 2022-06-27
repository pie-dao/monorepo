import { CoinGeckoAdapter, DEFAULT_FUNDS } from '@domain/data-sync';
import { SentryService } from '@ntegral/nestjs-sentry';
import { isRight, Right } from 'fp-ts/lib/Either';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, Mongoose } from 'mongoose';
import { MarketDataModel, TokenEntity, TokenModel } from '../repository/entity';
import { MongoTokenRepository } from '../repository/MongoTokenRepository';
import { FundLoader } from './FundLoader';

describe('Given a Fund Loader', () => {
  let connection: Mongoose;
  let mongod: MongoMemoryServer;
  let target: FundLoader;

  beforeEach(async () => {
    mongod = await MongoMemoryServer.create();
    connection = await connect(mongod.getUri());
    target = new FundLoader(
      new MongoTokenRepository(),
      new CoinGeckoAdapter(),
      new SentryService(),
    );
  });

  afterEach(async () => {
    await connection.disconnect();
    await mongod.stop();
  });

  it('When ensuring funds exist with an empty database Then we get the newly created funds back', async () => {
    const result = (await target.ensureFundsExist()()) as Right<TokenEntity[]>;

    expect(isRight(result)).toBeTruthy();

    for (const fund of result.right) {
      expect(fund === null).toBeFalsy();
    }
  });

  it('When ensuring funds exist with an empty database Then the funds are created', async () => {
    await target.ensureFundsExist()();

    const result = await TokenModel.count().exec();

    expect(result).toEqual(DEFAULT_FUNDS.length);
  });

  it('When ensuring funds exist with existing funds Then it runs without an error', async () => {
    await target.ensureFundsExist()();
    const result = await target.ensureFundsExist()();

    expect(isRight(result)).toBeTruthy();
  });

  it('When loading current Coin Gecko Data Then it runs without an error', async () => {
    const result = await target.loadCgMarketData();
    expect(isRight(result)).toBeTruthy();
  });

  it('When loading current Coin Gecko Data Then new market data entries are created', async () => {
    await target.loadCgMarketData();

    const result = await MarketDataModel.count().exec();

    expect(result).toBeGreaterThan(0);
  });

  it('When loading current Coin Gecko Data Twice Then no duplicates are created', async () => {
    await target.loadCgMarketData();

    const firstCount = await MarketDataModel.count().exec();

    await target.loadCgMarketData();

    const secondCount = await MarketDataModel.count().exec();

    expect(firstCount).toEqual(secondCount);
  });
});
