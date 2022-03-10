
import { Vault, VaultSpecifics } from '../../Vault';

const USDC: VaultSpecifics = {
    name: 'USDC Polygon',
    description: `
        USDC is a stablecoin pegged to U.S. dollar value issued by Centre consortium. 
        Auxo USDC Vault seeks yield by allocating deposited USDC on strategies involving lending, liquidity provision, yield farming and more.
      `,
    symbol: 'USDC',
    address: '0x0449b34c8abf9d7bd22c42695c9b672131188ccf',
    token: {
        decimals: 6,
        address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174'
    },
    auth: {
        address: '0xbc4639e6056c299b5a957c213bce3ea47210e2bd',
        isDepositor: false,
    },
    cap: {
        address: '0x0449b34c8abf9d7bd22c42695c9b672131188ccf',
        underlying: null
    },
    strategies: []
}

// instantiate top level vault info here
export const Polygon: Vault[] = [USDC]
    .map((vault) => ({
        network: {
            name: 'POLYGON',
            chainId: 137,
            multicall: '0xd130B43062D875a4B7aF3f8fc036Bc6e9D3E1B3E'
        },
        ...vault,
    }
    ));