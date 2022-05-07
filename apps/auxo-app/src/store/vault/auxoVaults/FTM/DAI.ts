import { VaultSpecifics } from '../../Vault';

const DAI: VaultSpecifics = {
  name: 'DAI FTM',
  description: `
    Dai (DAI) is a decentralized stablecoin that attempts to maintain a value of $1.00 USD. 
    Unlike centralized stablecoins, Dai isn't backed by US dollars in a bank account. 
    Instead, it is backed by collateral on the Maker platform. 
    `,
  symbol: 'DAI',
  address: '0xF939A5C11E6F9884D6052828981e5D95611D8b2e',
  token: {
    decimals: 18,
    address: '0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E',
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
          to: 'https://ftmscan.com/address/0x3001444219dF37a649784e86d5A9c5E871a41E9E',
        },
        {
          name: 'MakerDAO Whitepaper',
          to: 'https://makerdao.com/whitepaper',
        },
      ],
    },
  ],
};

export default DAI;
