import { VaultSpecifics } from '../../Vault';

const MIM: VaultSpecifics = {
  name: 'MIM FTM',
  description: `
      MIM is provided by Abracadabra Finance as a stablecoin that allows the borrowing and free exchange of various stablecoins.
      This makes it a hugely flexible and attractive choice for yield seeking vaults like Auxo.
    `,
  symbol: 'MIM',
  address: '0xa9dD5345ed912b359102DdD03f72738291f9f389',
  token: {
    decimals: 18,
    address: '0x82f0b8b456c1a451378467398982d4834b6829c1',
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
      name: 'Strategy name: Hundred lending',
      allocation: 1,
      description: `
            Supplies (DAI|MIM) on Hundred Finance decentralized lending protocol. 
            Hundred Finance gives the users the possibility to participate in lending markets by lending their assets.
            This strategy stakes h(DAI|MIM) (a token representing lending position on Hundred) in Hundred Gauges for additional yield.
          `,
      links: [
        {
          name: 'Smart Contract for the Auxo MIM Strategy',
          to: 'https://ftmscan.com/address/0x40BceC61AfCA3E8B02d61240dAaE9c07dfd67893',
        },
        {
          name: 'Hundred Finance',
          to: 'https://hundred.finance/',
        },
      ],
    },
  ],
};

export default MIM;
