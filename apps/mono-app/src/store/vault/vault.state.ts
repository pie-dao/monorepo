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
      name: 'USDC FTM',
      description: 'Beets strategy across MIM-USDC-USDT',
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
      }
    },
  ],
  selected: null,
  isLoading: false,
};