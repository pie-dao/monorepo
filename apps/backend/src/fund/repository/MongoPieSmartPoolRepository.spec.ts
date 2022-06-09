import { PieSmartPool, PieSmartPoolHistory } from '@domain/feature-funds';
import BigNumber from 'bignumber.js';
import { Right } from 'fp-ts/lib/Either';
import { connect, Mongoose } from 'mongoose';
import { MongoPieSmartPoolRepository } from '.';
import { PieSmartPoolHistoryModel, TokenModel } from '../entity';

const OLD = 1644509027;

const NEW = 1654509027;

const HISTORY_0: PieSmartPoolHistory = {
  timestamp: new Date(OLD),
  underlyingTokens: [
    {
      address: '0x2eCa39776894a91Cb3203B88aF2404eeBA077307',
      name: 'Quantum Tunneling Token',
      decimals: 18,
      kind: 'Token',
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
        address: '0x2eCa39776894a91Cb3203B88aF2404eeBA077307',
        name: 'Quantum Tunneling Token',
        decimals: 18,
        kind: 'Token',
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
      address: '0x2eCa39776894a11Cb3203B88aF2404eeBA077307',
      name: 'Fuzzy Logic Token',
      decimals: 18,
      kind: 'Token',
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
        address: '0x2eCa39776894a11Cb3203B88aF2404eeBA077307',
        name: 'Fuzzy Logic Token',
        decimals: 18,
        kind: 'Token',
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
  address: '0x2eCa39776894a91Cb3203B88aF0404eeBA077307',
  name: 'Smart Cookie Pool',
  decimals: 18,
  kind: 'PieSmartPool',
  symbol: 'SCP',
  history: [],
};

const PIE_SMART_POOL_1: PieSmartPool = {
  address: '0x2eCa39776894a91Cb3203B88B10404eeBA077307',
  name: 'Smart Wookie Pool',
  decimals: 18,
  kind: 'PieSmartPool',
  symbol: 'SWP',
  history: [],
};

const PIE_SMART_POOL_2: PieSmartPool = {
  address: '0x2eCa39776894a91db3203B88BF0404eeBA077307',
  name: 'Smart Nookie Pool',
  decimals: 18,
  kind: 'PieSmartPool',
  symbol: 'SNP',
  history: [],
};

const PIE_SMART_POOL_WITH_HISTORY: PieSmartPool = {
  ...PIE_SMART_POOL_0,
  history: [HISTORY_0],
};

describe('Given a Mongo Yield Vault Repository', () => {
  let connection: Mongoose;
  let target: MongoPieSmartPoolRepository;

  beforeAll(async () => {
    connection = await connect(process.env.MONGO_DB_TEST);
    target = new MongoPieSmartPoolRepository();
  });

  beforeEach(async () => {
    await TokenModel.deleteMany({}).exec();
    await PieSmartPoolHistoryModel.deleteMany({}).exec();
  });

  afterAll(async () => {
    await connection.disconnect();
  });

  it('When creating a new Yield Vault Entity then it is created', async () => {
    await target.save(PIE_SMART_POOL_WITH_HISTORY)();

    const result = await target.findOneByAddress(
      PIE_SMART_POOL_WITH_HISTORY.address,
    )();

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

  it('When adding a new history entry, Then it is added properly', async () => {
    const saveResult = await target.save(PIE_SMART_POOL_WITH_HISTORY)();
    const pieSmartPool = (saveResult as Right<PieSmartPool>).right;

    await target.addHistoryEntry(pieSmartPool, HISTORY_1)();

    // 👇 By default this only returns the latest history entry so we test the filter here too
    const result = await target.findOneByAddress(pieSmartPool.address, {
      limit: 2,
      orderBy: { timestamp: 'asc' },
    })();

    const updatedPool = (result as Right<PieSmartPool>).right;

    expect(
      updatedPool.history.flatMap((e) =>
        e.underlyingTokens.map((t) => t.symbol),
      ),
    ).toEqual(['QTT', 'FLT']);
  });

  it('When saving multiple entities Then they are all found by find', async () => {
    await target.save(PIE_SMART_POOL_0)();
    await target.save(PIE_SMART_POOL_1)();
    await target.save(PIE_SMART_POOL_2)();

    const result = await target.findAll({
      orderBy: { symbol: 'desc' },
      limit: 2,
    })();

    expect(result.map((e) => e.symbol)).toEqual(['SWP', 'SNP']);
  });
});
