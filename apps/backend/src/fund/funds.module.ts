import { Module } from '@nestjs/common';
import {
  MongoPieSmartPoolRepository,
  MongoPieVaultRepository,
  MongoYieldVaultRepository,
} from './repository';

@Module({
  imports: [],
  controllers: [],
  providers: [
    MongoPieSmartPoolRepository,
    MongoPieVaultRepository,
    MongoYieldVaultRepository,
  ],
  exports: [
    MongoPieSmartPoolRepository,
    MongoPieVaultRepository,
    MongoYieldVaultRepository,
  ],
})
export class FundsModule {}
