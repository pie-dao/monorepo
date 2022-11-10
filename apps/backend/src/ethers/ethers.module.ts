import { Provider } from '@ethersproject/providers';
import { Module } from '@nestjs/common';
import { MultiCallWrapper } from '@sdk-utils/multicall';
import { ethers } from 'ethers';

export const EthersProvider = {
  provide: Provider,
  useValue: new MultiCallWrapper(
    new ethers.providers.JsonRpcProvider(
      'https://mainnet.infura.io/v3/25ed038142a3459d9e8c0c7fd42bd58a',
    ),
  ).multicallProvider,
};

export type EthersProvider = typeof EthersProvider;

@Module({
  providers: [EthersProvider],
  exports: [EthersProvider],
})
export class EthersModule {}
