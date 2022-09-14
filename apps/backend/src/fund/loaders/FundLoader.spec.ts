import {
  CoinGeckoAdapter,
  TheGraphAdapter,
  DEFAULT_FUNDS,
} from '@domain/data-sync';
import { Token } from '@domain/feature-funds';
import { SentryService } from '@ntegral/nestjs-sentry';
import { SupportedChain } from '@shared/util-types';
import BigNumber from 'bignumber.js';
import { isRight, Right } from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/TaskEither';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, Mongoose } from 'mongoose';
import { MongoPieVaultRepository } from '../repository';
import { MarketDataModel, TokenModel } from '../repository/entity';
import { MongoTokenRepository } from '../repository/MongoTokenRepository';
import { FundLoader } from './FundLoader';
import * as E from 'fp-ts/Either';

jest.setTimeout(10 * 60 * 1000);

const DECENTRALAND_ADDRESS = '0x0f5d2fb29fb7d3cfee444a200298f468908cc942';

describe('Given a Fund Loader', () => {
  let connection: Mongoose;
  let mongod: MongoMemoryServer;
  let target: FundLoader;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    connection = await connect(mongod.getUri());
    target = new FundLoader(
      new MongoTokenRepository(),
      new MongoPieVaultRepository(),
      new CoinGeckoAdapter(),
      new TheGraphAdapter(),
      new SentryService(),
    );
  });

  afterAll(async () => {
    await connection.disconnect();
    await mongod.stop();
  });

  test('When ensuring funds exist with an empty database Then we get the newly created funds back', async () => {
    const result = (await target.ensureFundsExist()()) as Right<Token[]>;

    expect(isRight(result)).toBeTruthy();

    for (const fund of result.right) {
      expect(fund === null).toBeFalsy();
    }
  });

  test('When ensuring funds exist with an empty database Then the funds are created', async () => {
    await target.ensureFundsExist()();

    const result = await TokenModel.count().exec();

    expect(result).toEqual(DEFAULT_FUNDS.length);
  });

  test('When ensuring funds exist with existing funds Then it runs without an error', async () => {
    await target.ensureFundsExist()();
    const result = await target.ensureFundsExist()();

    expect(isRight(result)).toBeTruthy();
  });

  test('When loading current Coin Gecko Data Then it runs without an error', async () => {
    const result = await target.loadMarketData();

    expect(isRight(result)).toBeTruthy();
  });

  test('When loading current Coin Gecko Data Then new market data entries are created', async () => {
    await target.loadMarketData();

    const result = await MarketDataModel.count().exec();

    expect(result).toBeGreaterThan(0);
  });

  test('When loading current Coin Gecko Data Twice Then no duplicates are created', async () => {
    await target.loadMarketData();

    const firstCount = await MarketDataModel.count().exec();

    await target.loadMarketData();

    const secondCount = await MarketDataModel.count().exec();

    expect(firstCount).toEqual(secondCount);
  });

  test('When loading underlyings Then they are properly saved', async () => {
    const underlyings = await target.ensureUnderlyingsExist(
      [
        {
          address: DECENTRALAND_ADDRESS,
          balance: new BigNumber(0),
          decimals: 0,
          chain: SupportedChain.ETHEREUM,
          name: 'Decentraland',
          supply: 100,
          symbol: 'MANA',
        },
      ],
      {
        [DECENTRALAND_ADDRESS]: {
          usd: 1,
        },
      },
    )();

    const result = await TokenModel.find().exec();
    const marketData = await MarketDataModel.find().exec();

    expect(result.length).toEqual(1);
    expect(result[0].address).toEqual(DECENTRALAND_ADDRESS);
    expect(marketData.length).toEqual(1);
  });

  test('When loading underlyings Then they are properly saved', async () => {
    await target.ensureUnderlyingsExist(
      [
        {
          address: DECENTRALAND_ADDRESS,
          balance: new BigNumber(0),
          decimals: 0,
          chain: SupportedChain.ETHEREUM,
          name: 'Decentraland',
          supply: 100,
          symbol: 'MANA',
        },
      ],
      {},
    )();

    const result = await TokenModel.find().exec();
    const marketData = await MarketDataModel.find().exec();

    expect(result.length).toEqual(1);
    expect(result[0].address).toEqual(DECENTRALAND_ADDRESS);
    expect(marketData.length).toEqual(1);
  });

  test('When getting underlying assets Then they are properly returned', async () => {
    for (const fund of DEFAULT_FUNDS) {
      const result = await pipe(
        target.getPieDetails({
          ...fund,
          marketData: [],
        }),
        TE.chain((details) => target.getUnderlyingAssets(details)),
      )();

      expect(isRight(result)).toBeTruthy();
    }
  });
});
