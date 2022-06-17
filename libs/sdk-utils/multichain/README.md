# sdk-utils-multichain

The multichain module is a utility for allowing cross-network requests to be made to several chains at once. The module handles:

- Fetching data across the different networks
- Graceful error handling in the case of a network issue
- Returning data in a standardised interface
- A simplified API to capture instances where network differences are material

# How to use

## Basic Usage

---

The simplest way to use multichain is to setup a multichain wrapper to pass common multichain config to all your contracts:

```ts
// create a new contract wrapper
const multichain = new MultiChainContractWrapper(config);

// generate a multichain contract by wrapping an existing ethers contract
// and adding per-contract overrides
const multichainContract = multichain.wrap(contract, overrides);

// call the contract using `.multichain` or `.mc`:
const res = await multichainContract.multichain.allowance('0x...');
// is equal to
const res = await multichainContract.mc.allowance('0x...');

// get the data:
console.log(res)

>>> data: {
>>>   1: { status: 'fulfilled', value: BigNumber },
>>>   137: { status: 'rejected', reason: Error }
>>> },
>>> meta: { results: 2, ok: 1, err: 1 }

```

## Config

---

There are 2 ways to configure multichain

1. Configuration shared by all contracts
2. Configuration specific to a single contract

### Configuration shared by all contracts.

When setting up the wrapper, config settings will be shared between all wrapped contracts.

This is useful when you want to setup something like a set of providers, that aren't likely to change every time you want to add a new contract.

The wrapper config object is a key value pairing of chain ids to config settings. Supported settings include:

`provider`: an ethers `Provider`. This can include custom providers that inherit from the abstract provider class.

`exclude`: a boolean value, indicating whether or not to make calls to a particular network by default (this can be overriden on a per-contract basis).

As an example:

```ts
const config: MultiChainWrapperConfig = {
  [1]: {
    provider: new ethers.providers.JsonRpcProvider('https://rpc.ankr.com/eth'),
  },
  [42161]: {
    provider: new ethers.providers.JsonRpcProvider(
      'https://rpc.ankr.com/arbitrum',
    ),
    // by default, calls will not be make to Arbitrum
    exclude: true,
  },
};

const multichain = new MultiChainContractWrapper(config);
```

### Configuration specific to a single contract

While settings like Providers might be shared between contract instances, there are some properties that absolutely will need to be changed on a per contract and per-chain basis.

The most common of these is `address`. Let's say we want to call the USDC balance of the zero address on Ethereum and Arbitrum.

[Ethereum USDC Address: 0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48](https://etherscan.io/token/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48)

[Arbitrum One USDC Address: 0xff970a61a04b1ca14834a43f5de4533ebddb5cc8](https://arbiscan.io/token/0xff970a61a04b1ca14834a43f5de4533ebddb5cc8)

We need a way to tell the multichain wrapper to send the respective calls to different locations. This can be done when we either _wrap_ or _create_ the contact, using _overrides_

### Overrides

Overrides have all the same configuration options as the `MultichainWrapperConfig` but also allow you to pass an address, for each chain:

```ts
const overrides: MultiChainConfigOverrides = {
  [1]: {
    address: `0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48`,
  },
  [42161]: {
    address: `0xff970a61a04b1ca14834a43f5de4533ebddb5cc8`,
  },
};

// take an existing ethers ERC20 contract instance and pass the overrides
const multichainErc20Contract = multichain.wrap(baseErc20Contract, overrides);

// create a new contract with multichain enabled
const multichainErc20Contract = multichain.create(
  address,
  ABI,
  signerOrProvider,
  overrides,
);
```

## Wrapping and Creating

You can think of the global contract wrapper as primarily a way to share settings across contract instances. To actually make contract calls we still need the ethers contract instance, but first we need to wrap the contract.

We can either wrap an existing ethers contract, or we can create one.

### Creating

You can use the wrapper to create a new ethers contract and it will return a new multichain enabled contract, simply provide the following parameters:

`address`: The address for the contract you want to connect to.\*

`ABI`: The JSON ABI for the contract. All contracts in a multichain call must use the same ABI

`provider`: (optional) the provider for the contract to use in the default case.

`overrides`: (optional) Any configuration (including addresses) that need to be changed from the wrapper.

```ts
// create a new contract

const newMultichainContract = multichain.create<Erc20>('0x....', ABI, provider);

// this will also work, assuming a provider for the chain you need was passed to the multichain wrapper

const newMultichainContract = multichain.create<Erc20>('0x....', ABI);
```

**\*Note:** _The address must be a valid ethereum address on a chain where you have passed a provider. This provider can be passed to the contract when you create it OR can be one of the providers passed when the wrapper was initialised._

The reason we need to pass this information for a single chain is because the multicall wrapper returns a _decorated_ contract: specifically, it will work as normal like a standard ethers contract _if you don't make a multichain call_:

```ts
// this will just return a single result as normal
newMultichainContract.balanceOf(ethers.constants.zeroAddress);
```

### Wrapping

Assuming you already have a contract setup, you can just `wrap` the existing contract - internally this is the same function that is called during the create process. Wrapping is even simpler:

```ts
const unwrappedcontract = new ethers.Contract('0x...', ABI, providerOrSigner);
const wrapped = multicall.wrap(unwrappedContract);
```

## The Multichain Response

Under the hood, multichain uses the ES20 `Promise.allSettled` to serialise multiple simulataneous calls into a series of responses. The calls are returned collectively in the `data` property, each with a `status` that is either `'fulfilled'` or `'rejected'`.

- A `'fulfilled'` response has a `value` property that contains the multichain response.
- A `'rejected'` response has a `reason` property containing the error.

There is also a `meta` property containing the total number of results, errors and successes.

## Typescript support

The SDK is fully written in typescript. Contract types are inferred automatically. You can also pass a generic typechain type during `.wrap` or `.create` and types will be added to multichain automatically.
