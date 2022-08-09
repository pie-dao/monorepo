import { CoinGeckoAdapter } from '@domain/data-sync';
import { SentryService } from '@ntegral/nestjs-sentry';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, Mongoose } from 'mongoose';
import { YieldLoader } from '.';
import { EthersProvider } from '../../ethers';
import { MongoYieldVaultStrategyRepository } from '../repository';

describe('Given a Yield Loader', () => {
  let connection: Mongoose;
  let mongod: MongoMemoryServer;
  let target: YieldLoader;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    connection = await connect(mongod.getUri());
    target = new YieldLoader(
      new MongoYieldVaultStrategyRepository(
        new CoinGeckoAdapter(),
        EthersProvider,
      ),
      new SentryService(),
    );
  });

  afterAll(async () => {
    await connection.disconnect();
    await mongod.stop();
  });

  test('When updating yields Then they update properly', async () => {
    target.updateYields();
    // TODO: We don't have strategies yet.
  });
});
