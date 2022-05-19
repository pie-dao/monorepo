#

# On ethers

Working closely with Ethers JS requires us to have an understanding of the internal state of the library. In particular, we need to understand how function calls are made to solidity contracts.

When ethers contracts are instantiated, calldata (read data) is faciliated through the _provider_. Specifically:

1. The contract is created with a provider.
2. The contract functions delegate the call to the `provider.call` method.
3. The `provider.call` method takes a `TransactionRequest` object:

```ts
export type TransactionRequest = {
  to?: string;
  from?: string;
  nonce?: BigNumberish;

  gasLimit?: BigNumberish;
  gasPrice?: BigNumberish;

  data?: BytesLike;
  value?: BigNumberish;
  chainId?: number;

  type?: number;
  accessList?: AccessListish;

  maxPriorityFeePerGas?: BigNumberish;
  maxFeePerGas?: BigNumberish;

  customData?: Record<string, any>;
  ccipReadEnabled?: boolean;
};
```
