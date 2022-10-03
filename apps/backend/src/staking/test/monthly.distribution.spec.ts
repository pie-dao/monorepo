import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { Test, TestingModule } from '@nestjs/testing';
import fs from 'fs';
import { EthersProvider } from '../../ethers';
import { EpochEntity, EpochSchema } from '../entities/epoch.entity';
import { StakingService } from '../staking.service';

describe.skip('Monthly Distribution', () => {
  jest.setTimeout(5 * 60 * 1000);

  let service: StakingService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [StakingService, EthersProvider],
      imports: [
        HttpModule,
        ConfigModule.forRoot(),
        ScheduleModule.forRoot(),
        MongooseModule.forRoot(process.env.MONGO_DB_TEST),
        MongooseModule.forFeature([
          { name: EpochEntity.name, schema: EpochSchema },
        ]),
      ],
    }).compile();

    service = module.get<StakingService>(StakingService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('Use this test to generate a new epoch', async () => {
    const month = 8;
    const year = 2022;
    const blockNumber = 15449618;
    const distributedRewards = '116027.623046077';
    const windowIndex = 11;
    const proposalsIdsToExclude = [];

    const prevWindowIndex = windowIndex - 1;

    const result = await service.generateEpoch(
      month,
      year,
      distributedRewards,
      windowIndex,
      prevWindowIndex,
      blockNumber,
      proposalsIdsToExclude,
      true,
    );

    await fs.promises.writeFile(
      `epochs/epoch-${year}-${month}.json`,
      JSON.stringify(result, null, 4),
    );
  });
});
