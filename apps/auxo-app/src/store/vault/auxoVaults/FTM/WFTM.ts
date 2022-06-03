import { VaultSpecifics } from '../../Vault';

const WFTM: VaultSpecifics = {
  name: 'WFTM FTM',
  description: `
        Fantom is a smart contract platform that intends to solve the scalability issues of existing public distributed ledger technologies. FTM is the native token of the Fantom ecosystem and WFTM is its wrapped version.
        You can wrap your FTM for WFTM at Sushi.
        `,
  symbol: 'WFTM',
  address: '0x16AD251B49E62995eC6f1b6A8F48A7004666397C',
  token: {
    decimals: 18,
    address: '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83',
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
      name: 'Tarot Lender',
      allocation: 1,
      description: `
            Supplies WFTM on Tarot decentralized lending protocol. 
            Tarot gives users the opportunity to participate as lenders in isolated lending pools. 
            
            The strategy rebalances the available WFTM between Tarot isolated lending pools to have the best yield possible.          `,
      links: [
        {
          name: 'Tarot',
          to: 'https://www.tarot.to',
        },
      ],
    },
  ],
};

export default WFTM;
