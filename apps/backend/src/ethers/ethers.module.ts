import { Provider } from '@ethersproject/providers';
import { Module } from '@nestjs/common';
import { MultiCallWrapper } from '@sdk-utils/multicall';
import { ethers } from 'ethers';

export const EthersProvider = {
  provide: Provider,
  useValue: new MultiCallWrapper(
    new ethers.providers.JsonRpcProvider(process.env.INFURA_RPC),
  ).multicallProvider,
};

@Module({
  providers: [EthersProvider],
  exports: [EthersProvider],
})
export class EthersModule {}
