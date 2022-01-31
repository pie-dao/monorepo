import { VaultState } from "./Vault";
import { NETWORKS } from "../../utils/networks";

export const vaultState: VaultState = {
  vaults: [
    {
      name: 'USDC',
      description: 'Balanced Stablecoin farming strategies for USDC assets across L2 chains.',
      network: NETWORKS.POLYGON,
      symbol: 'USDC',
      address: '0x0449b34c8abf9d7bd22c42695c9b672131188ccf',
      token: {
        decimals: 6,
        address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174'
      }
    },
    // {
    //   name: 'DAI',
    //   description: `Exotic DAI strategies chasing high yields.
    //     Extra risk, extra rewards.`,
    //   network: NETWORKS.AVALANCHE,
    //   symbol: 'DAI',
    //   address: '0x21a3366cAbB5991a6F2612887FfCB0657023065E',
    // }
  ],
  selected: null,
  isLoading: false,
};