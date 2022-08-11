import { CoinGeckoAdapter } from '@domain/data-sync';
import { Test, TestingModule } from '@nestjs/testing';
import { PieVaultResolver } from '.';
import {
  MongooseConnectionProvider,
  MongoPieVaultRepository,
} from '../repository';

describe('PieVaultResolver', () => {
  let resolver: PieVaultResolver;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [MongoPieVaultRepository],
      providers: [
        CoinGeckoAdapter,
        PieVaultResolver,
        MongoPieVaultRepository,
        MongooseConnectionProvider,
      ],
    }).compile();

    resolver = module.get<PieVaultResolver>(PieVaultResolver);
  });

  afterEach(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
