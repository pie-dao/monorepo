import { Module } from '@nestjs/common';
import { ethers } from 'ethers';

export const EthersProvider = {
  provide: ethers.providers.JsonRpcProvider,
  useValue: new ethers.providers.JsonRpcProvider(process.env.INFURA_RPC),
};

@Module({
  providers: [EthersProvider],
  exports: [EthersProvider],
})
export class EthersModule {}
