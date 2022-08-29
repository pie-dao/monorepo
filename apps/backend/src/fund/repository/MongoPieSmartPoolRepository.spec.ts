import { PieSmartPool, PieSmartPoolHistory } from '@domain/feature-funds';
import { SupportedChain } from '@shared/util-types';
import BigNumber from 'bignumber.js';
import { Right } from 'fp-ts/lib/Either';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, Mongoose } from 'mongoose';
import { MongoPieSmartPoolRepository } from '.';

const OLD = 1644509027;
const NEW = 1654509027;
const RELATIONS = {
  chain: SupportedChain.ETHEREUM,
  marketData: [],
};

const HISTORY_0: PieSmartPoolHistory = {
  timestamp: new Date(OLD),
  underlyingTokens: [
    {
      ...RELATIONS,
      address: '0x2eCa39776894a91Cb3203B88aF2404eeBA077307',
      name: 'Quantum Tunneling Token',
      decimals: 18,
      kind: 'Token',
      coinGeckoId: '',
      symbol: 'QTT',
    },
  ],
  controller: '0x2eCa39776894a91Cb3203B88aF2404eeBA077306',
  publicSwapSetter: '0x2eCa39776894a91Cb3203B88aF2404eeBA077207',
  tokenBinder: '0x2eCa39776894a91Cb3203B88aa2404eeBA077307',
  circuitBreaker: '0x2eCa39776894a91Cb3203B88aF2404eeBA055307',
  publicSwapEnabled: true,
  cap: new BigNumber('1'),
  annualFee: new BigNumber('1'),
  feeRecipient: '0x2eCa39776894a91Cb3103B88aF2404eeBA077307',
  balancerPoolAddress: '0x2eCa39771894a91Cb3203B88aF2404eeBA077307',
  swapFee: new BigNumber('1'),
  denormalizedWeights: [
    {
      token: {
        ...RELATIONS,
        address: '0x2eCa39776894a91Cb3203B88aF2404eeBA077307',
        name: 'Quantum Tunneling Token',
        decimals: 18,
        kind: 'Token',
        coinGeckoId: '',
        symbol: 'QTT',
      },
      weight: new BigNumber('1'),
    },
  ],
  targetWeights: [],
  startWeights: [],
  joinExitEnabled: true,
};

const HISTORY_1: PieSmartPoolHistory = {
  timestamp: new Date(NEW),
  underlyingTokens: [
    {
      ...RELATIONS,
      address: '0x2eCa39776894a11Cb3203B88aF2404eeBA077307',
      name: 'Fuzzy Logic Token',
      decimals: 18,
      kind: 'Token',
      coinGeckoId: '',
      symbol: 'FLT',
    },
  ],
  controller: '0x2eCa39776894a91ab3203B88aF2404eeBA077306',
  publicSwapSetter: '0x2eCa39776894a91Cb3203B88aF2404eeBA077207',
  tokenBinder: '0x2eCa39776894491Cb3203B88aa2404eeBA077307',
  circuitBreaker: '0x2eCa39776894a97Cb3203B88aF2404eeBA055307',
  publicSwapEnabled: true,
  cap: new BigNumber('2'),
  annualFee: new BigNumber('2'),
  feeRecipient: '0x2eCa39776894a91Cb8103B88aF2404eeBA077307',
  balancerPoolAddress: '0x2eCa39771894a919b3203B88aF2404eeBA077307',
  swapFee: new BigNumber('2'),
  denormalizedWeights: [
    {
      token: {
        ...RELATIONS,
        address: '0x2eCa39776894a11Cb3203B88aF2404eeBA077307',
        name: 'Fuzzy Logic Token',
        decimals: 18,
        kind: 'Token',
        coinGeckoId: '',
        symbol: 'FLT',
      },
      weight: new BigNumber('2'),
    },
  ],
  targetWeights: [],
  startWeights: [],
  joinExitEnabled: true,
};

const PIE_SMART_POOL_0: PieSmartPool = {
  ...RELATIONS,
  address: '0x2eCa39776894a91Cb3203B88aF0404eeBA077307',
  name: 'Smart Cookie Pool',
  decimals: 18,
  kind: 'PieSmartPool',
  symbol: 'SCP',
  coinGeckoId: '',
  marketData: [],
  history: [],
};

const PIE_SMART_POOL_1: PieSmartPool = {
  ...RELATIONS,
  address: '0x2eCa39776894a91Cb3203B88B10404eeBA077307',
  name: 'Smart Wookie Pool',
  decimals: 18,
  kind: 'PieSmartPool',
  symbol: 'SWP',
  coinGeckoId: '',
  marketData: [],
  history: [],
};

const PIE_SMART_POOL_2: PieSmartPool = {
  ...RELATIONS,
  address: '0x2eCa39776894a91db3203B88BF0404eeBA077307',
  name: 'Smart Nookie Pool',
  decimals: 18,
  kind: 'PieSmartPool',
  symbol: 'SNP',
  coinGeckoId: '',
  marketData: [],
  history: [],
};

const PIE_SMART_POOL_WITH_HISTORY: PieSmartPool = {
  ...RELATIONS,
  ...PIE_SMART_POOL_0,
  history: [HISTORY_0],
};

describe('Given a Mongo Pie Smart Pool Repository', () => {
  let connection: Mongoose;
  let mongod: MongoMemoryServer;
  let target: MongoPieSmartPoolRepository;

  beforeEach(async () => {
    mongod = await MongoMemoryServer.create();
    connection = await connect(mongod.getUri());
    target = new MongoPieSmartPoolRepository();
  });

  afterEach(async () => {
    await connection.disconnect();
    await mongod.stop();
  });

  it('When creating a new Pie Smart Pool Entity then it is created', async () => {
    await target.save(PIE_SMART_POOL_WITH_HISTORY)();

    const result = await target.findOne({
      chain: PIE_SMART_POOL_WITH_HISTORY.chain,
      address: PIE_SMART_POOL_WITH_HISTORY.address,
    })();

    const pieSmartPool = (result as Right<PieSmartPool>).right;

    // 📕 Note that we need to do this because PIE_SMART_POOL and PieSmartPool will never
    // be equal. Mongoose adds all sorts of stuff to the object that we don't want
    // but the lean() option won't work because we have custom types
    expect(pieSmartPool.kind).toEqual(PIE_SMART_POOL_WITH_HISTORY.kind);
    expect(pieSmartPool.history.length).toEqual(
      PIE_SMART_POOL_WITH_HISTORY.history.length,
    );

    const history = pieSmartPool.history[0];

    expect(history.timestamp).toEqual(HISTORY_0.timestamp);
    expect(history.annualFee).toBeInstanceOf(BigNumber);

    expect(history.underlyingTokens.length).toEqual(
      HISTORY_0.underlyingTokens.length,
    );

    const underlyingToken = history.underlyingTokens[0];

    expect(underlyingToken.address).toEqual(
      HISTORY_0.underlyingTokens[0].address,
    );
  });

  it('When adding a new Pie Smart Pool history entry, Then it is added properly', async () => {
    const saveResult = await target.save(PIE_SMART_POOL_WITH_HISTORY)();
    const pieSmartPool = (saveResult as Right<PieSmartPool>).right;

    await target.addHistoryEntry(
      pieSmartPool.chain,
      pieSmartPool.address,
      HISTORY_1,
    )();

    // 👇 By default this only returns the latest history entry so we test the filter here too
    const result = await target.findOne(
      {
        chain: pieSmartPool.chain,
        address: pieSmartPool.address,
      },
      {
        history: {
          limit: 2,
          orderBy: { timestamp: 'asc' },
        },
      },
    )();

    const updatedPool = (result as Right<PieSmartPool>).right;

    expect(
      updatedPool.history.flatMap((e) =>
        e.underlyingTokens.map((t) => t.symbol),
      ),
    ).toEqual(['QTT', 'FLT']);
  });

  it('When saving multiple Pie Smart Pool entities Then they are all found by find', async () => {
    await target.save(PIE_SMART_POOL_0)();
    await target.save(PIE_SMART_POOL_1)();
    await target.save(PIE_SMART_POOL_2)();

    const result = await target.find({
      entity: {
        orderBy: { symbol: 'desc' },
        limit: 2,
      },
    })();

    expect(result.map((e) => e.symbol)).toEqual(['SWP', 'SNP']);
  });
});
