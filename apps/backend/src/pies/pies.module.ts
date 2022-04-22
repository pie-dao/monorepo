import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CgCoinEntity, CgCoinSchema } from './entities/cg_coin.entity';
import {
  PieHistoryEntity,
  PieHistorySchema,
} from './entities/pie-history.entity';
import { PieEntity, PieSchema } from './entities/pie.entity';
import { PiesController } from './pies.controller';
import { PieRepository } from './pies.repository';
import { PiesService } from './pies.service';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([{ name: PieEntity.name, schema: PieSchema }]),
    MongooseModule.forFeature([
      { name: PieHistoryEntity.name, schema: PieHistorySchema },
    ]),
    MongooseModule.forFeature([
      { name: CgCoinEntity.name, schema: CgCoinSchema },
    ]),
  ],
  controllers: [PiesController],
  providers: [PiesService, PieRepository],
  exports: [PieRepository],
})
export class PiesModule {}
