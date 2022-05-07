import { VaultSpecifics } from '../../Vault';

const USDC: VaultSpecifics = {
  name: 'USDC FTM',
  description: `
      USDC is a stablecoin pegged to U.S. dollar value issued by Centre consortium. 
      Auxo USDC Vault seeks yield by allocating deposited USDC on strategies involving lending, liquidity provision, yield farming and more.
    `,
  symbol: 'USDC',
  address: '0x662556422AD3493fCAAc47767E8212f8C4E24513',
  token: {
    decimals: 6,
    address: '0x04068da6c83afcfa0e13ba15a6696662335d5b75',
  },
  auth: {
    address: '0xA86fc7aD871B5247f13BB38a08a67bE4d38e577B',
    isDepositor: false,
  },
  cap: {
    underlying: null,
  },
  strategies: [
    {
      name: 'Beethoven LP Strategy - USDC/fUSDT/MIM liquidity pool',
      allocation: 0.5,
      description: `
          Supplies liquidity to Beethovenx in the Ziggy Stardust & Magic Internet Money pool.

          LP position earns trading fees and BEETS. This strategy tries to maximise yield by providing part of earned BEETS in the Fidelio Duetto 80/20 pool and staking Fidelio Duetto BPTs to earn more BEETS. 

          Earned rewards are sold and reinvested.
          `,
      links: [
        {
          name: 'Beethovenx',
          to: 'https://beets.fi',
        },
        {
          name: 'Ziggy Stardust & Magic Internet Money',
          to: 'https://beets.fi/#/pool/0xd163415bd34ef06f57c58d2aed5a5478afb464cc00000000000000000000000e',
        },
        {
          name: 'Fidelio Duetto 80/20',
          to: 'https://beets.fi/#/pool/0xcde5a11a4acb4ee4c805352cec57e236bdbc3837000200000000000000000019',
        },
      ],
    },
    {
      name: 'Tarot Lender',
      allocation: 0.5,
      description: `
          Supplies USDC on the Tarot decentralized lending protocol. 
          Tarot gives users the opportunity to participate as lenders in isolated lending pools.

          The strategy rebalances the available USDC between Tarot pools to maximise yield.
        `,
      links: [
        {
          name: 'Tarot',
          to: 'https://www.tarot.to',
        },
      ],
    },
  ],
};

export default USDC;
