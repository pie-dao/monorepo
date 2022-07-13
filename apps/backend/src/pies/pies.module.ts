import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CgCoinEntity,
  CgCoinSchema,
  MongoPieRepository,
  PieEntity,
  PieHistoryEntity,
  PieHistorySchema,
  PieRepository,
  PieSchema,
  PiesController,
  PiesService,
} from '.';
import { EthersModule } from '../ethers';
import { MonitoringModule } from '../monitoring';
import { StakingModule } from '../staking/staking.module';

export const MongoPieRepositoryProvider = {
  provide: PieRepository,
  useClass: MongoPieRepository,
};

@Module({
  imports: [
    HttpModule,
    EthersModule,
    MonitoringModule,
    StakingModule,
    MongooseModule.forFeature([{ name: PieEntity.name, schema: PieSchema }]),
    MongooseModule.forFeature([
      { name: PieHistoryEntity.name, schema: PieHistorySchema },
    ]),
    MongooseModule.forFeature([
      { name: CgCoinEntity.name, schema: CgCoinSchema },
    ]),
  ],
  controllers: [PiesController],
  providers: [PiesService, MongoPieRepositoryProvider],
  exports: [MongoPieRepositoryProvider],
})
export class PiesModule {}
