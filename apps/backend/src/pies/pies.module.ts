import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StakingModule } from '../staking/staking.module';
import {
  CgCoinEntity,
  CgCoinSchema,
  PieHistoryEntity,
  PieHistorySchema,
  PieEntity,
  PieSchema,
  PiesService,
  PiesController,
  PieRepository,
  MongoPieRepository,
} from '.';

export const MongoPieRepositoryProvider = {
  provide: PieRepository,
  useClass: MongoPieRepository,
};

@Module({
  imports: [
    HttpModule,
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
