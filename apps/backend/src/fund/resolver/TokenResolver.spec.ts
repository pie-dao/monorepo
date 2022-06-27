import { Test, TestingModule } from '@nestjs/testing';
import { TokenResolver } from '.';
import { MongooseConnectionProvider } from '../repository';
import { MongoTokenRepository } from '../repository/MongoTokenRepository';

describe('TokenResolver', () => {
  let resolver: TokenResolver;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [MongoTokenRepository],
      providers: [
        TokenResolver,
        MongoTokenRepository,
        MongooseConnectionProvider,
      ],
    }).compile();

    resolver = module.get<TokenResolver>(TokenResolver);
  });

  afterEach(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
