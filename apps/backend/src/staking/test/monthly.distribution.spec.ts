import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { Test, TestingModule } from '@nestjs/testing';
import { EpochEntity, EpochSchema } from '../entities/epoch.entity';
import { StakingService } from '../staking.service';

describe('StakingService', () => {
  let service: StakingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

  it('Use this test to generate a new epoch', async () => {
    const month = 5;
    const year = 2022;
    const blockNumber = 14881677;
    const distributedRewards = '149744.16892452948';
    const windowIndex = 8;
    const proposalsIdsToExclude = [
      '0x07cdffdae0321c8f939a54648ca7671b880f024af0f4bb6a190d468ffa0d93b7',
    ];

    const prevWindowIndex = windowIndex - 1;

    const result = await service.generateEpoch(
      month,
      year,
      distributedRewards,
      windowIndex,
      prevWindowIndex,
      blockNumber,
      proposalsIdsToExclude,
    );

    console.log(JSON.stringify(result));
  });
});
