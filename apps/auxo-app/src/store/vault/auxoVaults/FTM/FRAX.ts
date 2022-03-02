import { Vault } from "../../Vault";

const FRAX: Omit<Vault, 'id'> = {
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
}
  export default FRAX;