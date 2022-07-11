import { PieVault, PieVaultHistory } from '@domain/feature-funds';
import { SupportedChain } from '@shared/util-types';
import BigNumber from 'bignumber.js';
import { Right } from 'fp-ts/lib/Either';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, Mongoose } from 'mongoose';
import { MongoPieVaultRepository } from './';

const OLD = 1644509027;
const NEW = 1654509027;

const HISTORY_0: PieVaultHistory = {
  timestamp: new Date(OLD),
  entryFee: new BigNumber('1'),
  exitFee: new BigNumber('1'),
  annualizedFee: new BigNumber('1'),
  feeBeneficiary: '0x2eCf39776894a91Cb3203B88BF0404eeBA077307',
  feeBeneficiaryEntryShare: new BigNumber('1'),
  feeBeneficiaryExitShare: new BigNumber('1'),
  outstandingAnnualizedFee: new BigNumber('1'),
  locked: false,
  cap: new BigNumber('1'),
  underlyingTokens: [
    {
      token: {
        chain: SupportedChain.ETHEREUM,
        address: '0x2eCa39776894a97Cb3203B88BF0404eeBA077307',
        name: 'I Am Hungry Token',
        decimals: 18,
        kind: 'Token',
        symbol: 'IHT',
        coinGeckoId: '',
        marketData: [],
      },
      balance: new BigNumber('1'),
    },
  ],
};

const HISTORY_1: PieVaultHistory = {
  timestamp: new Date(NEW),
  entryFee: new BigNumber('2'),
  exitFee: new BigNumber('2'),
  annualizedFee: new BigNumber('2'),
  feeBeneficiary: '0x2eCf39776894a91Cb3203B88BF0404eeBA077307',
  feeBeneficiaryEntryShare: new BigNumber('2'),
  feeBeneficiaryExitShare: new BigNumber('2'),
  outstandingAnnualizedFee: new BigNumber('2'),
  locked: false,
  cap: new BigNumber('2'),
  underlyingTokens: [
    {
      token: {
        chain: SupportedChain.ETHEREUM,
        address: '0x2eCa39776894a97Cb3203B88BF0404eeBA077307',
        name: 'I Ran Out of WD-40 Token',
        decimals: 18,
        kind: 'Token',
        symbol: 'WDT',
        coinGeckoId: '',
        marketData: [],
      },
      balance: new BigNumber('2'),
    },
  ],
};

export const PIE_VAULT_0 = new PieVault(
  SupportedChain.ETHEREUM,
  '0x2eCa39776894a91Cb3203B88BF0404eeBA077307',
  'Delicious Pie',
  'DPT',
  18,
  '',
);

const PIE_VAULT_1 = new PieVault(
  SupportedChain.ETHEREUM,
  '0x2eCa39776894a91Cb3203B88BF0404eeBA077307',
  'Fragrant Pie',
  'FPT',
  18,
  '',
);

const PIE_VAULT_2 = new PieVault(
  SupportedChain.ETHEREUM,
  '0x2eCa39776894a91Cb3203B88BF0404eeBA077307',
  'Weird Pie',
  'WPT',
  18,
  '',
);

const PIE_VAULT_WITH_HISTORY = new PieVault(
  SupportedChain.ETHEREUM,
  PIE_VAULT_0.address,
  PIE_VAULT_0.name,
  PIE_VAULT_0.symbol,
  PIE_VAULT_0.decimals,
  '',
  [HISTORY_0],
  [],
);

describe('Given a Mongo Pie Vault Repository', () => {
  let connection: Mongoose;
  let target: MongoPieVaultRepository;
  let mongod: MongoMemoryServer;

  beforeEach(async () => {
    mongod = await MongoMemoryServer.create();
    connection = await connect(mongod.getUri());
    target = new MongoPieVaultRepository();
  });

  afterEach(async () => {
    await connection.disconnect();
    await mongod.stop();
  });

  it('When creating a new Pie Vault Entity then it is created', async () => {
    await target.save(PIE_VAULT_WITH_HISTORY)();

    const result = await target.findOne(
      PIE_VAULT_WITH_HISTORY.chain,
      PIE_VAULT_WITH_HISTORY.address,
    )();

    const pieVault = (result as Right<PieVault>).right;

    // 📕 Note that we need to do this because YIELD_VAULT and PieVault will never
    // be equal. Mongoose adds all sorts of stuff to the object that we don't want
    // but the lean() option won't work because we have custom types
    expect(pieVault.kind).toEqual(PIE_VAULT_WITH_HISTORY.kind);
    expect(pieVault.history.length).toEqual(
      PIE_VAULT_WITH_HISTORY.history.length,
    );

    const history = pieVault.history[0];

    expect(history.timestamp).toEqual(HISTORY_0.timestamp);
    expect(history.entryFee).toBeInstanceOf(BigNumber);
    expect(history.underlyingTokens.length).toEqual(
      HISTORY_0.underlyingTokens.length,
    );

    const underlying = history.underlyingTokens[0];

    expect(underlying.token.address).toEqual(
      HISTORY_0.underlyingTokens[0].token.address,
    );
  });

  it('When adding a new Pie Vault history entry, Then it is added properly', async () => {
    const saveResult = await target.save(PIE_VAULT_WITH_HISTORY)();
    const pieVault = (saveResult as Right<PieVault>).right;

    await target.addHistoryEntry(pieVault.chain, pieVault.address, HISTORY_1)();

    // 👇 By default this only returns the latest history entry so we test the filter here too
    const result = await target.findOne(pieVault.chain, pieVault.address, {
      history: {
        limit: 2,
        orderBy: { timestamp: 'asc' },
      },
    })();

    const updatedPieVault = (result as Right<PieVault>).right;

    expect(
      updatedPieVault.history.flatMap((e) =>
        e.underlyingTokens.map((t) => t.token.symbol),
      ),
    ).toEqual(['IHT', 'WDT']);
  });

  it('When saving multiple Pie Vault entities Then they are all found by find', async () => {
    await target.save(PIE_VAULT_0)();
    await target.save(PIE_VAULT_1)();
    await target.save(PIE_VAULT_2)();

    const result = await target.findAll({
      token: {
        orderBy: { symbol: 'desc' },
        limit: 2,
      },
    })();

    expect(result.map((e) => e.symbol)).toEqual(['WPT', 'FPT']);
  });
});
