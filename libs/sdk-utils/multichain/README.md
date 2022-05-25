# sdk-utils-multichain

The multichain module is a utility for allowing cross-network requests to be made to several chains at once. The module handles:

- Fetching data across the different networks
- Graceful error handling in the case of a network issue
- Returning data in a standardised interface
- A simplified API to capture instances where network differences are material\*

## How to use

Instantiate the Multichain wrapper somewhere in your application. This allows you to wrap existing contracts and enable multichain support.

You have several options for fetching from chains:

1. Global (recommended):

Determine the chain ids when creating the wrapper, this ensures all contracts will fetch data from the same chains.

This is the simpliest option and is best to standardise data across your application.

2. Per-contract:

Determine the chain ids when wrapping the contract, this ensures all calls made with the wrapped contract will call the same networks.

3. Per-call:

Override the above and reduce/extend the chains on a per call basis. Can be useful when you just want to update the data on the current chain.

## Defining chains

In the simple case, you may pass a list of chainIds, and the multichain util will use the best available provider for that chain. This will be either the public RPC endpoint for that chain, the provider passed by the contract, or the ethers default provider. If a chain does not have an available default, it will throw an error.

If you want more granular control, or want to add your own providers, pass an object containing the chainId mapped to the provider you wish to use.

### Per Chain Config

In an ideal world, contracts are deployed at the same address on each chain, with identical ABIs. This is not always possible, however, so a common operation is to set different parameters when wrapping the contract. You have 2 options to do this:

1. Changing addresses:
   You can pass a mapping of chain Ids to addresses when wrapping the contract, and the multichain handler will automatically route the calls for each chain to the specified address, assuming the same ABI.

2. Changing ABIs:
   Passing multiple ABIs is more challenging - as of the current version it is recommended that you set an ABI/Interface that has methods and properties common to all chains.

### Customised Error Behaviour

It's possible to pass a global error handler that will override the default handler, it's also possible to define error behaviour per-chain. By default, errors in fetching call data will not be caught, which may crash your application. You can disable this by passing `silent: true` to either individual chains or to the whole config object.

## Under the hood

For details on how ethers works, see the core SDK README.

When fetching data from multiple chains, we have a couple of challenges:

1. The result of a multichain call does not match the return signature of the `provider.call` for the single contract call. (`Promise<string>`, where string is the encoded response data). We need additional metadata to be returned.
2. It's challenging to return a typesafe representation of an ethers contract, across multiple chains:
   - The provider and address are readonly properties, so new contracts must be instantiated before calling.
   - We can't access contract calldata to send to other chains in a callback (at least not easily)
   - We need to defer execution of the contract until we have built the other calls

The main solution from reviewing ethers involves:

1. Subclass the provider with a new MultichainProvider.
2. Override and `super()` the `provider.call` method.
3. Access the current contract, calldata and address, when the provider is called.
4. Invoke subsequent calls to different providers.

- At this stage we could either:
  1.  Save the latest calldata against the contract (in a `contract.multicallData`) value
  2.  Return the calldata in a wrapped result

TBC on whether to wrap the contract with a `withMultichain({ /** options **/ })` method that returns the contract with the multichain provider activated OR to just save the data against multichain prop.

The Multichain sdk wraps the ethers Contract instance, by default, contract calls will still be single chain, such as:

```ts
const mcw = new MultiChainWrapper({
  /** config **/
});

const contract = mcw.create('0x...', abi);

// will return a single value
contract.getSomeOnChainData();
```

Multichain instead allows you to return a multichain call as follows:

```ts
contract
  .withMultichain({
    /** overrides **/
  })
  .getSomeOnChainData();
```

---

This library was generated with [Nx](https://nx.dev).

## Running unit tests

Run `nx test sdk-utils-multichain` to execute the unit tests via [Jest](https://jestjs.io).

## Running lint

Run `nx lint sdk-utils-multichain` to execute the lint via [ESLint](https://eslint.org/).
