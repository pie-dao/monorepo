import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EthersModule } from '../ethers';
import { MerkleTreeDistributor } from '../helpers/merkleTreeDistributor/merkleTreeDistributor';
import { EpochEntity, EpochSchema } from './entities/epoch.entity';
import { StakingController } from './staking.controller';
import { StakingService } from './staking.service';

@Module({
  imports: [
    HttpModule,
    EthersModule,
    MongooseModule.forFeature([
      { name: EpochEntity.name, schema: EpochSchema },
    ]),
  ],
  controllers: [StakingController],
  providers: [StakingService, MerkleTreeDistributor],
  exports: [StakingService, MerkleTreeDistributor],
})
export class StakingModule {}
