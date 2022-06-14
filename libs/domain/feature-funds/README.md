# Funds

Funds are smart contracts that represent a managed collection of assets, or act as a wrapper for an asset.

The following types of funds are supported:

- [Pie Vaults](#pie-vaults)
- [Pie Smart Pools](#pie-smart-pools)
- [Yield Vaults](#yield-vaults)

This package contains their Typescript-idiomatic representations for them, and it also contains domain logic
for executing read operations.

All funds are represented as an ERC-20 token, and each fund has a specific purpose and underlying mechanism.

All funds can stake and lend assets and you can also embed funds in each other, since all 3 are ERC-20 tokens.

For example you can include a Pie Vault in another Pie Vault.


## Pie Smart Pools

Pie Smart Pools are non-custodial smart contracts, the first implementation of a DAO-governed AMM pool. They add extra functionality on top of vanilla AMMs pools.

Providing liquidity to one of these Pies gets you tokenized exposure to the underlying assets and additionally generates yield from the liquidity in these pools to perform token swaps.

The Pie Smart Pools are asset management agnostic. At the time of writing, Pie Smart Pools are compatible with the Balancer interface.

More info [here](https://docs.piedao.org/technical/untitled).


## Pie Vaults

Pie Vaults are an evolution of Pie Smart Pools, but without the swapping functionality.

Weights can also be changed in Pie Vaults but rebalancing is not automatic.

What Pie Vaults add to the mix is the ability to deploy strategies for their underlying tokens. These strategies
include staking and lending. For example `SUSHI` can be supplied to a Pie Vault and then `SUSHI` can be staked to
get `xSUSHI`.

Note that *Pie Vaults only work with tokens that have a tokenized representation of the strategy* (for example `SUSHI` + `xSUSHI`).


## Yield Vault

Yield Vaults can be used to tokenize a yield-generating strategy for those tokens that don't have one.