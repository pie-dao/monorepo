import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { TreasuryService } from './treasury.service';
import { TreasuryController } from './treasury.controller';
import { TreasuryEntity, TreasurySchema } from './entities/treasury.entity';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: TreasuryEntity.name, schema: TreasurySchema },
    ]),
  ],
  controllers: [TreasuryController],
  providers: [TreasuryService],
})
export class TreasuryModule {}
