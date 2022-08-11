import { Token } from '@domain/feature-funds';
import { SupportedChain } from '@shared/util-types';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, Mongoose } from 'mongoose';
import { TokenModel } from './entity';
import { MongoTokenRepository } from './MongoTokenRepository';

const TOKEN_0: Token = {
  address: '0x832356dc07d3C36E524A9ADF8072C4bC3563f045',
  chain: SupportedChain.ETHEREUM,
  coinGeckoId: '',
  decimals: 18,
  kind: 'token',
  marketData: [],
  name: 'Why Though?',
  symbol: 'WHY',
};

const TOKEN_1: Token = {
  address: '0xC57612Ad25ca397765f4836C020eb8BFE08e2821',
  chain: SupportedChain.ETHEREUM,
  coinGeckoId: '',
  decimals: 18,
  kind: 'token',
  marketData: [],
  name: 'I like coffee',
  symbol: 'ILC',
};

const TOKEN_2: Token = {
  address: '0x546E5633181F4Cb84dBf7959154de314ee0145C0',
  chain: SupportedChain.ETHEREUM,
  coinGeckoId: '',
  decimals: 18,
  kind: 'nothing',
  marketData: [],
  name: 'Where are my keys?',
  symbol: 'WAMK',
};

describe('Given a Mongo Pie Vault Repository', () => {
  let connection: Mongoose;
  let target: MongoTokenRepository;
  let mongod: MongoMemoryServer;

  beforeEach(async () => {
    mongod = await MongoMemoryServer.create();
    connection = await connect(mongod.getUri());
    target = new MongoTokenRepository();
  });

  afterEach(async () => {
    await connection.disconnect();
    await mongod.stop();
  });

  test('When trying to find with an eq query Then it works', async () => {
    await target.save(TOKEN_0)();
    await target.save(TOKEN_1)();
    await target.save(TOKEN_2)();

    const result = await target.find({
      entity: {
        orderBy: {
          symbol: 'asc',
        },
        filter: {
          kind: {
            $eq: 'token',
          },
        },
      },
    })();

    expect(result.map((it) => it.symbol)).toEqual(['ILC', 'WHY']);
  });

  test('When trying to find with an in query Then it works', async () => {
    await target.save(TOKEN_0)();
    await target.save(TOKEN_1)();
    await target.save(TOKEN_2)();

    const tokens = await target.find({
      entity: {
        filter: {
          kind: {
            $eq: 'token',
          },
        },
      },
    })();

    const symbols = tokens.map((it) => it.symbol);

    const result = await target.find({
      entity: {
        orderBy: {
          symbol: 'desc',
        },
        filter: {
          symbol: {
            $in: symbols,
          },
        },
      },
    })();

    expect(result.map((it) => it.symbol)).toEqual(['WHY', 'ILC']);
  });
});
