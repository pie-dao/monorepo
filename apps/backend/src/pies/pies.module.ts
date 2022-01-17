import { Module } from '@nestjs/common';
import { HttpModule} from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { PieEntity, PieSchema } from './entities/pie.entity';
import { PieHistoryEntity, PieHistorySchema } from './entities/pie-history.entity';
import { PiesController } from './pies.controller';
import { PiesService } from './pies.service';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([{ name: PieEntity.name, schema: PieSchema }]),
    MongooseModule.forFeature([{ name: PieHistoryEntity.name, schema: PieHistorySchema }])
  ],
  controllers: [PiesController],
  providers: [PiesService]
})
export class PiesModule {}
