import { SupportedNetwork } from 'src/treasury/types/treasury.types.Network';

export const networkStub: SupportedNetwork[] = [
  {
    network: 'ethereum',
    apps: [
      {
        appId: 'aave',
        meta: {
          label: 'Aave',
          img: 'https://storage.googleapis.com/zapper-fi-assets/apps/aave.png',
          tags: ['lending'],
          supportedActions: ['view'],
        },
      },
      {
        appId: 'aave-v2',
        meta: {
          label: 'Aave V2',
          img: 'https://storage.googleapis.com/zapper-fi-assets/apps/aave-v2.png',
          tags: ['lending'],
          supportedActions: ['view', 'transact'],
        },
      },
      {
        appId: 'alchemix',
        meta: {
          label: 'Alchemix',
          img: 'https://storage.googleapis.com/zapper-fi-assets/apps/alchemix.png',
          tags: ['lending'],
          supportedActions: ['view'],
        },
      },
      {
        appId: 'convex',
        meta: {
          label: 'Convex',
          img: 'https://storage.googleapis.com/zapper-fi-assets/apps/convex.png',
          tags: ['yield-aggregator'],
          supportedActions: ['view'],
        },
      },
      {
        appId: 'esd',
        meta: {
          label: 'ESD',
          img: 'https://storage.googleapis.com/zapper-fi-assets/apps/esd.png',
          tags: ['seigniorage'],
          supportedActions: ['view'],
        },
      },
      {
        appId: 'loopring',
        meta: {
          label: 'Loopring',
          img: 'https://storage.googleapis.com/zapper-fi-assets/apps/loopring.png',
          tags: ['exchange'],
          supportedActions: ['view'],
        },
      },
      {
        appId: 'olympus',
        meta: {
          label: 'Olympus',
          img: 'https://storage.googleapis.com/zapper-fi-assets/apps/olympus.png',
          tags: ['elastic-finance'],
          supportedActions: ['view'],
        },
      },
      {
        appId: 'ribbon',
        meta: {
          label: 'Ribbon',
          img: 'https://storage.googleapis.com/zapper-fi-assets/apps/ribbon.png',
          tags: ['yield-aggregator'],
          supportedActions: ['view'],
        },
      },
      {
        appId: 'tokens',
        meta: {
          label: 'Tokens',
          img: 'https://storage.googleapis.com/zapper-fi-assets/apps/tokens.png',
          tags: [],
          supportedActions: ['view'],
        },
      },
    ],
  },
  {
    network: 'polygon',
    apps: [
      {
        appId: 'tokens',
        meta: {
          label: 'Tokens',
          img: 'https://storage.googleapis.com/zapper-fi-assets/apps/tokens.png',
          tags: [],
          supportedActions: ['view'],
        },
      },
    ],
  },
  {
    network: 'avalanche',
    apps: [
      {
        appId: 'tokens',
        meta: {
          label: 'Tokens',
          img: 'https://storage.googleapis.com/zapper-fi-assets/apps/tokens.png',
          tags: [],
          supportedActions: ['view'],
        },
      },
    ],
  },
  {
    network: 'arbitrum',
    apps: [
      {
        appId: 'sushiswap-bentobox',
        meta: {
          label: 'SushiSwap BentoBox',
          img: 'https://storage.googleapis.com/zapper-fi-assets/apps/sushiswap-bentobox.png',
          tags: ['lending'],
          supportedActions: ['view'],
        },
      },
      {
        appId: 'tokens',
        meta: {
          label: 'Tokens',
          img: 'https://storage.googleapis.com/zapper-fi-assets/apps/tokens.png',
          tags: [],
          supportedActions: ['view'],
        },
      },
    ],
  },
  {
    network: 'fantom',
    apps: [
      {
        appId: 'tokens',
        meta: {
          label: 'Tokens',
          img: 'https://storage.googleapis.com/zapper-fi-assets/apps/tokens.png',
          tags: [],
          supportedActions: ['view'],
        },
      },
    ],
  },
  {
    network: 'binance-smart-chain',
    apps: [
      {
        appId: 'tokens',
        meta: {
          label: 'Tokens',
          img: 'https://storage.googleapis.com/zapper-fi-assets/apps/tokens.png',
          tags: [],
          supportedActions: ['view'],
        },
      },
    ],
  },
  {
    network: 'optimism',
    apps: [
      {
        appId: 'tokens',
        meta: {
          label: 'Tokens',
          img: 'https://storage.googleapis.com/zapper-fi-assets/apps/tokens.png',
          tags: [],
          supportedActions: ['view'],
        },
      },
    ],
  },
];
