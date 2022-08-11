import { Strategy, YieldVault, YieldVaultHistory } from '@domain/feature-funds';
import { SupportedChain } from '@shared/util-types';
import BigNumber from 'bignumber.js';
import { Right } from 'fp-ts/lib/Either';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, Mongoose } from 'mongoose';
import { MongoYieldVaultRepository } from '.';
import { MongoPieVaultRepository } from './MongoPieVaultRepository';
import { PIE_VAULT_0 } from './MongoPieVaultRepository.spec';

const OLD = 1644509027;
const NEW = 1654509027;

const STRATEGY_0: Strategy = {
  chain: SupportedChain.ETHEREUM,
  address: '0x14b18b66CF0136D7F0805d70Daa922A53707bCbb',
  kind: 'Strategy Token',
  name: 'Strategy Token',
  underlyingToken: {
    chain: SupportedChain.ETHEREUM,
    address: '0x7B7D39cD201067EF189276Af04fE40fb50C73D99',
    name: 'Strategy Token',
    symbol: 'ST',
    decimals: 18,
    kind: 'Token',
    marketData: [],
    coinGeckoId: '',
  },
  trusted: true,
  vaults: [],
  yields: [],
};

const HISTORY_0: YieldVaultHistory = {
  timestamp: new Date(OLD),
  underlyingToken: {
    chain: SupportedChain.ETHEREUM,
    address: '0x24b18b66CF0136D7F0805d70Daa922A53707bCbb',
    name: 'Fun Token',
    symbol: 'FUN',
    decimals: 18,
    kind: 'Token',
    marketData: [],
    coinGeckoId: '',
  },
  totalStrategyHoldings: new BigNumber('1'),
  userDepositLimit: new BigNumber('1'),
  vaultDepositLimit: new BigNumber('1'),
  estimatedReturn: new BigNumber('1'),
  exchangeRate: new BigNumber('1'),
  totalFloat: new BigNumber('1'),
  lockedProfit: new BigNumber('1'),
  totalUnderlying: new BigNumber('1'),

  withdrawalQueue: [STRATEGY_0],
};

const HISTORY_1: YieldVaultHistory = {
  timestamp: new Date(NEW),
  underlyingToken: {
    chain: SupportedChain.ETHEREUM,
    address: '0x34b18b66CF013637F0805d70Daa922A53707bCbb',
    name: 'History Token',
    symbol: 'HST',
    decimals: 18,
    kind: 'Token',
    marketData: [],
    coinGeckoId: '',
  },
  totalStrategyHoldings: new BigNumber('2'),
  userDepositLimit: new BigNumber('2'),
  vaultDepositLimit: new BigNumber('2'),
  estimatedReturn: new BigNumber('2'),
  exchangeRate: new BigNumber('2'),
  totalFloat: new BigNumber('2'),
  lockedProfit: new BigNumber('2'),
  totalUnderlying: new BigNumber('2'),
};

const YIELD_VAULT_0: YieldVault = {
  chain: SupportedChain.ETHEREUM,
  address: '0x1eCa39776894a91Cb3203B88BF0404eeBA077107',
  name: 'Yield Fund Token',
  decimals: 18,
  kind: 'YieldVault',
  symbol: 'YFT',
  coinGeckoId: '',
  history: [],
  marketData: [],
  strategies: [],
};

const YIELD_VAULT_1: YieldVault = {
  chain: SupportedChain.ETHEREUM,
  address: '0x2eCa39776894a91Cb3203B88BF0404eeBA077207',
  name: 'Other Fund Token',
  decimals: 18,
  kind: 'YieldVault',
  symbol: 'OFT',
  coinGeckoId: '',
  history: [],
  marketData: [],
  strategies: [],
};

const YIELD_VAULT_2: YieldVault = {
  chain: SupportedChain.ETHEREUM,
  address: '0x3eCa39276894a91Cb3203B88BF0404eeBA077307',
  name: 'Very Fun Token',
  decimals: 18,
  kind: 'YieldVault',
  symbol: 'VFT',
  coinGeckoId: '',
  history: [],
  marketData: [],
  strategies: [],
};

const YIELD_VAULT_WITH_HISTORY: YieldVault = {
  ...YIELD_VAULT_0,
  history: [HISTORY_0],
};

describe('Given a Mongo Yield Vault Repository', () => {
  let connection: Mongoose;
  let mongod: MongoMemoryServer;
  let target: MongoYieldVaultRepository;

  beforeEach(async () => {
    mongod = await MongoMemoryServer.create();
    connection = await connect(mongod.getUri());
    target = new MongoYieldVaultRepository();
  });

  afterEach(async () => {
    await connection.disconnect();
    await mongod.stop();
  });

  it('When creating a new Yield Vault Entity then it is created', async () => {
    await target.save(YIELD_VAULT_WITH_HISTORY)();

    const result = await target.findOne({
      chain: YIELD_VAULT_WITH_HISTORY.chain,
      address: YIELD_VAULT_WITH_HISTORY.address,
    })();

    const yieldVault = (result as Right<YieldVault>).right;

    // 📕 Note that we need to do this because YIELD_VAULT and yieldVault will never
    // be equal. Mongoose adds all sorts of stuff to the object that we don't want
    // but the lean() option won't work because we have custom types
    expect(yieldVault.kind).toEqual(YIELD_VAULT_WITH_HISTORY.kind);
    expect(yieldVault.history.length).toEqual(
      YIELD_VAULT_WITH_HISTORY.history.length,
    );

    const history = yieldVault.history[0];

    expect(history.underlyingToken.kind).toEqual(
      YIELD_VAULT_WITH_HISTORY.history[0].underlyingToken.kind,
    );
    expect(history.totalStrategyHoldings).toBeInstanceOf(BigNumber);
    expect(history.withdrawalQueue.length).toEqual(
      YIELD_VAULT_WITH_HISTORY.history[0].withdrawalQueue.length,
    );

    const strategy = history.withdrawalQueue[0];

    expect(strategy.underlyingToken.kind).toEqual(
      YIELD_VAULT_WITH_HISTORY.history[0].withdrawalQueue[0].underlyingToken
        .kind,
    );
  });

  it('When adding a new Yield Vault history entry, Then it is added properly', async () => {
    const saveResult = await target.save(YIELD_VAULT_WITH_HISTORY)();
    const yieldVault = (saveResult as Right<YieldVault>).right;

    await target.addFundHistory(
      {
        chain: yieldVault.chain,
        address: yieldVault.address,
      },
      HISTORY_1,
    )();

    // 👇 By default this only returns the latest history entry so we test the filter here too
    const result = await target.findOne(
      {
        chain: yieldVault.chain,
        address: yieldVault.address,
      },
      {
        history: {
          limit: 2,
          orderBy: { timestamp: 'asc' },
        },
      },
    )();

    const updatedYieldVault = (result as Right<YieldVault>).right;

    expect(
      updatedYieldVault.history.map((e) => e.underlyingToken.symbol),
    ).toEqual(['FUN', 'HST']);
  });

  it('When saving multiple Yield Vault entities Then they are all found by find', async () => {
    await target.save(YIELD_VAULT_0)();
    await target.save(YIELD_VAULT_1)();
    await target.save(YIELD_VAULT_2)();

    const result = await target.find({
      entity: {
        orderBy: { symbol: 'desc' },
        limit: 2,
      },
    })();

    expect(result.map((e) => e.symbol)).toEqual(['YFT', 'VFT']);
  });

  it('When saving many types of entities Then they can be queried by type', async () => {
    const pieRepo = new MongoPieVaultRepository();

    await target.save(YIELD_VAULT_0)();
    await target.save(YIELD_VAULT_1)();
    await pieRepo.save(PIE_VAULT_0)();

    const result = await target.find()();

    expect(result.map((e) => e.symbol)).toEqual(['YFT', 'OFT']);
  });
});
