import { VaultState } from "./Vault";

export const vaultState: VaultState = {
  vaults: [
    // {
    //   name: 'USDC MATIC',
    //   description: 'Balanced Stablecoin farming strategies for USDC assets across L2 chains.',
    //   network: {
    //     name: 'POLYGON',
    //     chainId: 137
    //   },
    //   symbol: 'USDC',
    //   address: '0x0449b34c8abf9d7bd22c42695c9b672131188ccf',
    //   token: {
    //     decimals: 6,
    //     address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174'
    //   }
    // },
    {
      id: 1,
      name: 'USDC FTM',
      description: `
        USDC is a stablecoin pegged to U.S. dollar value issued by Centre consortium. 
        Auxo USDC Vault seeks yield by allocating deposited USDC on strategies involving lending, liquidity provision, yield farming and more.
      `,
      network: {
        name: 'FANTOM',
        chainId: 250
      },
      symbol: 'USDC',
      address: '0x662556422AD3493fCAAc47767E8212f8C4E24513',
      token: {
        decimals: 6,
        address: '0x04068da6c83afcfa0e13ba15a6696662335d5b75'
      },
      auth: {
        address: '0xA86fc7aD871B5247f13BB38a08a67bE4d38e577B',
        isDepositor: false,
      },
      cap: {
        address: '0x662556422ad3493fcaac47767e8212f8c4e24513',
        underlying: null
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
              to: 'https://beets.fi'
            },
            {
              name: 'Ziggy Stardust & Magic Internet Money',
              to: 'https://beets.fi/#/pool/0xd163415bd34ef06f57c58d2aed5a5478afb464cc00000000000000000000000e'
            },
            {
              name: 'Fidelio Duetto 80/20',
              to: 'https://beets.fi/#/pool/0xcde5a11a4acb4ee4c805352cec57e236bdbc3837000200000000000000000019'
            }
          ]
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
              to: 'https://www.tarot.to'
            }
          ]
        }
      ]
    },   
    {
      id: 2,
      name: 'FRAX FTM',
      description: `
      Frax is a stable coin pegged to U.S. dollar value issued by Frax Finance.
      Auxo FRAX Vault seeks yield by allocating deposited FRAX on strategies involving lending, liquidity provision, yield farming and more.
      `,
      network: {
        name: 'FANTOM',
        chainId: 250
      },
      symbol: 'FRAX',
      address: '0xBC4639e6056c299b5A957C213bcE3ea47210e2BD',
      token: {
        decimals: 18,
        address: '0xdc301622e621166bd8e82f2ca0a26c13ad0be355'
      },
      auth: {
        address: '0xA86fc7aD871B5247f13BB38a08a67bE4d38e577B',
        isDepositor: false,
      },
      cap: {
        address: '0xBC4639e6056c299b5A957C213bcE3ea47210e2BD',
        underlying: null
      },
      strategies: [
        {
          name: 'Tarot Lender',
          allocation: 1,
          description: `
          Supplies FRAX on Tarot decentralized lending protocol. 
          Tarot gives users the opportunity to participate as lenders in isolated lending pools. 
          
          The strategy rebalances the available FRAX between Tarot isolated lending pools to have the best yield possible.
          `,
          links: [
            {
              name: 'Tarot',
              to: 'https://www.tarot.to'
            }
          ]
        }
      ]
    },
    {
      id: 3,
      name: 'wFTM FTM',
      description: `
      Fantom is a smart contract platform that intends to solve the scalability issues of existing public distributed ledger technologies. FTM is the native token of the Fantom ecosystem and wFTM is its wrapped version.
      You can wrap your FTM for wFTM at Sushi.
      `,
      network: {
        name: 'FANTOM',
        chainId: 250
      },
      symbol: 'wFTM',
      address: '0x16AD251B49E62995eC6f1b6A8F48A7004666397C',
      token: {
        decimals: 18,
        address: '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83'
      },
      auth: {
        address: '0xA86fc7aD871B5247f13BB38a08a67bE4d38e577B',
        isDepositor: false,
      },
      cap: {
        address: '0x16AD251B49E62995eC6f1b6A8F48A7004666397C',
        underlying: null
      },
      strategies: [
        {
          name: 'Tarot Lender',
          allocation: 1,
          description: `
          Supplies wFTM on Tarot decentralized lending protocol. 
          Tarot gives users the opportunity to participate as lenders in isolated lending pools. 
          
          The strategy rebalances the available wFTM between Tarot isolated lending pools to have the best yield possible.          `,
          links: [
            {
              name: 'Tarot',
              to: 'https://www.tarot.to'
            }
          ]
        }
      ]
    },
  ],
  selected: null,
  isLoading: false,
};