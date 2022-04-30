import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StakingModule } from 'src/staking/staking.module';
import { CgCoinEntity, CgCoinSchema } from './entities/cg_coin.entity';
import {
  PieHistoryEntity,
  PieHistorySchema,
} from './entities/pie-history.entity';
import { PieEntity, PieSchema } from './entities/pie.entity';
import { PiesController } from './pies.controller';
import { PiesService } from './pies.service';
import { MongoPieRepository } from './repository/MongoPieRepository';
import { PieRepository } from './repository/PieRepository';

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
