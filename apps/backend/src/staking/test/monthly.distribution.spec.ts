import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { Test, TestingModule } from '@nestjs/testing';
import fs from 'fs';
import { EpochEntity, EpochSchema } from '../entities/epoch.entity';
import { StakingService } from '../staking.service';

describe('StakingService', () => {
  jest.setTimeout(5 * 60 * 1000);

  let service: StakingService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [StakingService],
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
    const month = 6;
    const year = 2022;
    const blockNumber = 15053226;
    const distributedRewards = '113176.171097889';
    const windowIndex = 9;
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
      `merkle-tree-${year}-${month}.json`,
      JSON.stringify(result.merkleTree, null, 4),
    );
  });
});
