import chains from './chains.json';

export const getChain = (chainId: number) =>
  chains.find((c) => c.chainId === chainId);

// Not all chains are relevant for PieDAO products, you can define the priority ones here
const SUPPORTED_CHAINS = {
  ETHEREUM: 1,
  POLYGON: 137,
  FANTOM: 250,
  AVALANCE: 41334,
  OPTIMISM: 11,
  ARBITRUM: 42161,
  GNOSIS: 100,
} as const;

/**
 * @SUPPORTED_CHAIN_NAMES is the user friendly name of the network defined above
 * @CHAIN_INFORMATION is the extended information coming from https://github.com/DefiLlama/chainlist
 * @CHAIN_MAP is a mapping between the two
 */
export type SUPPORTED_CHAIN_NAMES = keyof typeof SUPPORTED_CHAINS;
export type CHAIN_INFORMATION = typeof chains[0];
export type CHAIN_MAP = Record<SUPPORTED_CHAIN_NAMES, CHAIN_INFORMATION>;

export const SUPPORTED_CHAIN_DETAILS = (
  Object.entries(SUPPORTED_CHAINS) as [SUPPORTED_CHAIN_NAMES, number][]
)
  // fetch the chain details for each chain
  .map(([name, chainId]) => ({ [name]: getChain(chainId) }))
  // create a single object out of the array of objects
  .reduce((obj, value) => ({ ...obj, ...value }), {}) as CHAIN_MAP;
