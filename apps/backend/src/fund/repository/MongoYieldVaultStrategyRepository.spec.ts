import {
  TestStrategy,
  YieldData,
  YieldVaultStrategy,
} from '@domain/feature-funds';
import { SupportedChain } from '@shared/util-types';
import { Right } from 'fp-ts/lib/Either';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, Mongoose } from 'mongoose';
import { MongoYieldVaultStrategyRepository } from '.';

const vaults = ['0x7B7D39cD202067AF189276Af04fE40fb50C73D98'];

const yields: YieldData[] = [
  {
    apr: 0.1,
    apy: {
      compoundingFrequency: 1,
      value: 0.1,
    },
    timestamp: new Date(),
  },
];

const STRATEGY_0 = new TestStrategy(
  SupportedChain.ETHEREUM,
  '0xA4b18b66CF0136D7F0805D70DCC923A53707bCbb',
  'ST0V',
  {
    chain: SupportedChain.ETHEREUM,
    address: '0x7B7D39cD202067AF189276Af04fE40fb50C73D99',
    name: 'Strategy Token 0',
    symbol: 'ST0',
    decimals: 18,
    kind: 'Token',
    marketData: [],
    coinGeckoId: '',
  },
  true,
  vaults,
  yields,
);

const STRATEGY_1 = new TestStrategy(
  SupportedChain.ETHEREUM,
  '0xA4b18b66AF0136D7F0805d70DBB922A53707bCbb',
  'ST1V',
  {
    chain: SupportedChain.ETHEREUM,
    address: '0x7B7D39cD201067EF189276Af04fE40fb50C73D99',
    name: 'Strategy Token 1',
    symbol: 'ST1',
    decimals: 18,
    kind: 'Token',
    marketData: [],
    coinGeckoId: '',
  },
  true,
);

describe('Given a Mongo Yield Vault Strategy Repository', () => {
  let connection: Mongoose;
  let mongod: MongoMemoryServer;
  let target: MongoYieldVaultStrategyRepository;

  beforeEach(async () => {
    mongod = await MongoMemoryServer.create();
    connection = await connect(mongod.getUri());
    target = new MongoYieldVaultStrategyRepository();
  });

  afterEach(async () => {
    await connection.disconnect();
    await mongod.stop();
  });

  it('When creating a new Yield Vault Strategy Entity then it is created', async () => {
    await target.save(STRATEGY_0)();

    const result = (await target.findOne(
      STRATEGY_0.chain,
      STRATEGY_0.address,
    )()) as Right<YieldVaultStrategy>;

    expect(result.right.name).toEqual(STRATEGY_0.name);
    expect(result.right.vaults).toEqual(STRATEGY_0.vaults);
  });

  it('When saving multiple Yield Vault entities Then they are all found by find', async () => {
    await target.save(STRATEGY_0)();
    await target.save(STRATEGY_1)();

    const result = await target.find({
      contract: {
        orderBy: {
          _id: 'desc',
        },
        limit: 3,
      },
    })();

    expect(result.map((e) => e.name)).toEqual(['ST1V', 'ST0V']);
  });

  it('When saving yield data Then it is saved', async () => {
    await target.save(STRATEGY_1)();

    await target.addYieldData(
      STRATEGY_1.chain,
      STRATEGY_1.address,
      yields[0],
    )();

    const result = (await target.findOne(
      STRATEGY_1.chain,
      STRATEGY_1.address,
    )()) as Right<YieldVaultStrategy>;

    expect(result.right.yields.length).toEqual(1);
  });
});
