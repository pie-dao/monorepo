# Domain Glossary

This document contains descriptions of the domain-specific terms that appear in this project. Please refer to this document whenever you bump into terminology that's not clear.

## Auxo Vaults

See [Yield Vaults](#yield-vaults)

## Experipie

See [Pie Vaults](#pie-vaults).


## Fund

Funds are all deployed smart contracts that represent a managed basket of assets, like [Pie Vaults](#pie-vaults), [Pie Smart Pools](#pie-smart-pools) and [Yield Vaults](#yield-vaults).

## Pie Smart Pools

Pie Smart Pools are non-custodial smart contracts, the first implementation of a DAO-governed AMM pool. They add extra functionality on top of vanilla AMMs pools.

Providing liquidity to one of these Pies gets you tokenized exposure to the underlying assets and additionally generates yield from the liquidity in these pools to perform token swaps.

The Pie Smart Pools are asset management agnostic. At the time of writing, Pie Smart Pools are compatible with the Balancer interface.

More info [here](https://docs.piedao.org/technical/untitled).


## Pie Vaults

Pie Vaults are an evolution of Pie Smart Pools, but without the swapping functionality.

Weights can also be changed in Pie Vaults but rebalancing is not automatic.

What Pie Vaults add to the mix is the ability to directly interact with smart contracts and DeFi protocols. This includes staking and lending. For example `SUSHI` can be supplied to a Pie Vault and then `SUSHI` can be staked to
get `xSUSHI`.

Note that *Pie Vaults only work with tokens that have a tokenized representation of the strategy* (for example `SUSHI` + `xSUSHI`).

More info:

- [Here](https://medium.com/piedao/announcing-pievaults-19e2fa4c734e)
- and [here](https://docs.piedao.org/technical/pies-pievaults)



## Yield Vaults

Yield Vaults can be used to tokenize a yield-generating strategy for those tokens that don't have one.

