import { CoinGeckoAdapter } from '@domain/data-sync';
import { isRight, Right } from 'fp-ts/lib/Either';
import { connect, Mongoose } from 'mongoose';
import { TokenEntity, TokenModel } from '../entity';
import { MongoTokenRepository } from '../repository/MongoTokenRepository';
import { FundLoader } from './FundLoader';

describe('Given a Fund Loader', () => {
  let connection: Mongoose;
  let target: FundLoader;

  beforeAll(async () => {
    connection = await connect(process.env.MONGO_DB_TEST);
  });

  afterAll(async () => {
    await connection.disconnect();
  });

  beforeEach(async () => {
    await TokenModel.deleteMany({}).exec();
    target = new FundLoader(new MongoTokenRepository(), new CoinGeckoAdapter());
  });

  it('When ensuring funds exist with an empty database Then we get the newly created funds back', async () => {
    const result = (await target.ensureFundsExist()()) as Right<TokenEntity[]>;

    expect(isRight(result)).toBeTruthy();

    for (const fund of result.right) {
      expect(fund === null).toBeFalsy();
    }
  });

  it('When ensuring funds exist with existing funds Then it runs without an error', async () => {
    await target.ensureFundsExist()();
    const result = await target.ensureFundsExist()();

    expect(isRight(result)).toBeTruthy();
  });

  it('When loading current Coin Gecko Data Then it runs without an error', async () => {
    const result = await target.loadCgMarketData();

    console.log(result);

    expect(isRight(result)).toBeTruthy();
  });
});
