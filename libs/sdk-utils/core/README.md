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

# Ethers Under the Hood

Working closely with Ethers JS requires us to have an understanding of the internal state of the library. In particular, we need to understand how function calls are made to solidity contracts.

## The Constructor

Imagine we have:

```ts
const contract = new ethers.Contract<Erc20>(address, erc20Abi);
```

First, we take a look at what happens when we instantiate the contract. The constructor is long, so first remove everything not directly relevant to the interface, which is what we care about:

```ts
    constructor(addressOrName: string, contractInterface: ContractInterface, signerOrProvider?: Signer | Provider) {

        defineReadOnly(
          this,
          "interface",
          getStatic<InterfaceFunc>(new.target, "getInterface")(contractInterface)
        );

        const uniqueNames: { [ name: string ]: Array<string> } = { };
        const uniqueSignatures: { [ signature: string ]: boolean } = { };
```

We can see that the contract is instantiated by defining a readOnly `interface` (`writable: false`) on the `BaseContract`. Stripping out the other constructor code we are left with two rather large forEach loops.

While scary, these essentially do the same as the above: defining readOnly properties for each of the methods and attributes described in the ABI, on the object.

```ts
        Object.keys(this.interface.functions).forEach((signature) => {
            // ...

            if (this.functions[signature] == null) {
                defineReadOnly(this.functions, signature, buildDefault(this, fragment, false));
            }

            // ...
        });

        Object.keys(uniqueNames).forEach((name) => {

            // ...

            if (this.functions[name] == null) {
                defineReadOnly(this.functions, name, this.functions[signature]);
            }

            // ...
        });
    }
```

In particular, we are interested in the `functions` attribute:

```ts
if (this.functions[signature] == null) {
  defineReadOnly(
    this.functions,
    signature,
    buildDefault(this, fragment, false),
  );
}
```

This makes a call to `buildDefault`, which internally (for call data) returns the `buildCall` method.

## Attaching function calls with buildCall

buildCall is another long one, so trimming it down a bit gives us:

```ts
function buildCall(contract: Contract, fragment: FunctionFragment, collapseSimple: boolean): ContractFunction {
    const signerOrProvider = (contract.signer || contract.provider);

    return async function(...args: Array<any>): Promise<any> {

        // ...preamble
        const tx = await populateTransaction(contract, fragment, args);
        const result = await signerOrProvider.call(tx, blockTag);

        try {
            let value = contract.interface.decodeFunctionResult(fragment, result);
            if (collapseSimple && fragment.outputs.length === 1) {
                value = value[0];
            }
            return value;

        } catch (error) {
          // ...
         }
    };
```

Looking at the relevant parts of the code, build call returns a function that takes in any number of arguments. This function will then be invoked when you call `contract['functionName'](...args)`, where it will:

- Await the result of `signerOrProvider.call(tx, blockTag)`
- Decode the result
- Return the result

What we therefore need to understand, is what happens inside the `signerOrProvider.call` workflow.

## Passing to the Provider

`call` does 3 things:

1. Checks there is a provider
2. Validates the transaction
3. Executes the `provider.call()` method

```ts
async call(transaction: Deferrable<TransactionRequest>, blockTag?: BlockTag): Promise<string> {
        this._checkProvider("call");
        const tx = await resolveProperties(this.checkTransaction(transaction));
        return await this.provider.call(tx, blockTag);
}
```

## Use in subclasses

Already we can see an example of how to subclass the BaseProvider with the multicallProvider:

```ts
  async call(
    transaction: Deferrable<ethers.providers.TransactionRequest>,
    blockTag?: string | number | Promise<ethers.providers.BlockTag>
  ): Promise<string> {
    return this.rpcCall(JsonRpcMethod.ethCall, transaction, blockTag)
  }
```

Here, the multicallProvider overrides the `call` method with the multicall `rpcCall` method. The rpcMethod, in turn, handles the batching of multiple contract calls into a single multicall.

Therefore, when subclassing:

- The final result returned to ethers MUST be a Promise<string>
- The result returned will be passed to the returned function from `buildCall`:

```ts
  // you can override this async call()
  const result = await signerOrProvider.call(tx, blockTag);
  try {
      let value = contract.interface.decodeFunctionResult(fragment, result);
      if (collapseSimple && fragment.outputs.length === 1) {
          value = value[0];
      }
    return value;
  }
```

- The result will be passed into `.decodeFunctionResult`, so it's probably best not to do anything crazy before the result has been decoded.

## How to subclass

We might assume that the best option is to subclass the `BaseProvider`, but that will not work.

- BaseProvider does not implment the `detectNetwork` method
- `call` invokes `detectNetwork`

[Small but relevant thread here](https://github.com/ethers-io/ethers.js/issues/1143).

You have a couple of options:

- Subclass a "working" provider (JsonRpcProvider)

  - Works out of the box
  - Cannot wrap non-json rpc providers

- Fully overwrite the call method
  - Much more involved
  - Fully integrates with all providers

As of v0.1 of multichain, we wrap the RPC provider, and will add the additional call methods later.

### Multiple provider wrapping

This can get tricky. Imagine you have

ExtendedProvider1 [
ExtendedProvider0 [
Provider
]
]

We need to be really careful that our base assumptions hold when stacking providers, namely:

- Where does the keyword `this` point to (1 level down)
- What variables are private vs. public

Cardinal sins:

- Assuming wrapped APIs remain static
