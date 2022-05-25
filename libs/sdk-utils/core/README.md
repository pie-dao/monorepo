# SDK Core

SDK core contains the base SDK components that are reused by all other modules. The core ethos of the package is:

- An additive API that does not change existing workflows.
- First-class plugin support.
- Compile-time error checking > Runtime error checking.

What this means in english is that the SDK wants to stay out of your way until you need it. All SDK modules function using the [decorator pattern](https://refactoring.guru/design-patterns/decorator/typescript/example#:~:text=Decorator%20is%20a%20structural%20pattern,decorators%20follow%20the%20same%20interface), specifically on top of the ethers.js library. Ethers is a well-maintained, battle-tested and well-built library and our aim is not to get in the way of you using it as you see fit.

Instead, SDK modules _wrap_ (or decorate) the ethers.js contract with additional methods and properties, that add support for common operations you might have to write yourself, such as:

- Batching concurrent (or near concurrent) requests through multicall contracts.
- Fetching data from multiple chains simultaneously.
- Subscribing to contract data every X blocks.

We also think Ethers + Typechain represents the current gold standard for DApp development in Typescript, so the SDK will always return you a contract that preserves type definitions of the existing contract, layering on the additional functionality.

## Core Modules

At the heart of the SDK is the `ContractWrapper` class. Subclasses are required to implement a `wrap` method that will return an `ethers.Contract` instance, along with any additional methods or properties on top.

Importantly, ContractWrappers can be chained, an example workflow might be:

```ts
const baseContract: Erc20 = new ethers.Contract('0x...', ERC20ABI);

// both classes are subclasses of the ContractWrapper
const multicall = new MulticallWrapper();
const multichain = new MultichainWrapper();

// type will be `ERC20 & Multicall`
const multicallWrapped = multicall.wrap(baseContract);

// type will be `ERC20 & Multicall & Multichain`
const multicallAndMultichainWrapped = multichain.wrap(multicallWrapped);
```

Hopefully you can see some of the benefits of this approach: you select only the functionality you need and it can be incrementally added to your application without you having to change any existing code - any existing code using ethers.js contracts will work perfectly fine.

## Plugins

Because the SDK modules take a contract in and return a contract out, plugin support is as simple as creating a new instance of ContractWrapper and defining the `wrap` implementation.

# On ethers

_(This section is a WIP)_

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
