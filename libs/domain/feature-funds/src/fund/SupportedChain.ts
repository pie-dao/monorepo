export const SupportedChain = {
  ETHEREUM: 'ETHEREUM',
  POLYGON: 'POLYGON',
  FANTOM: 'FANTOM',
  AVALANCE: 'AVALANCE',
  OPTIMISM: 'OPTIMISM',
  ARBITRUM: 'ARBITRUM',
  GNOSIS: 'GNOSIS',
} as const;

export type SupportedChain = keyof typeof SupportedChain;
