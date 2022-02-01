import {PieEntity} from '../../entities/pie.entity';

const pies = [
  {
    symbol: "BTC++",
    name: "PieDAO BTC++",
    address: "0x0327112423f3a68efdf1fcf402f6c5cb9f7c33fd", 
    history: [], 
    coingecko_id: "piedao-btc",
    image: {
      thumb: "/public/btc/thumb/icon.png",
      small: "/public/btc/small/icon.png",
      large: "/public/btc/large/icon.png",
    }    
  },
  {
    symbol: "DEFI+S", 
    name: "PieDAO DEFI Small Cap",
    address: "0xad6a626ae2b43dcb1b39430ce496d2fa0365ba9c", 
    history: [], 
    coingecko_id: "piedao-defi-small-cap",
    image: {
      thumb: "/public/defi_s/thumb/icon.png",
      small: "/public/defi_s/small/icon.png",
      large: "/public/defi_s/large/icon.png",
    }      
  },
  {
    symbol: "DEFI++",
    name: "PieDAO DEFI++", 
    address: "0x8d1ce361eb68e9e05573443c407d4a3bed23b033", 
    history: [], 
    coingecko_id: "piedao-defi",
    image: {
      thumb: "/public/defi_plus/thumb/icon.png",
      small: "/public/defi_plus/small/icon.png",
      large: "/public/defi_plus/large/icon.png",
    }       
  },
  {
    symbol: "BCP",
    name: "PieDAO Balanced Crypto Pie", 
    address: "0xe4f726adc8e89c6a6017f01eada77865db22da14", 
    history: [], 
    coingecko_id: "piedao-balanced-crypto-pie",
    image: {
      thumb: "/public/bcp/thumb/icon.png",
      small: "/public/bcp/small/icon.png",
      large: "/public/bcp/large/icon.png",
    }     
  },
  {
    symbol: "YPIE", 
    name: "PieDAO Yearn Ecosystem Pie", 
    address: "0x17525E4f4Af59fbc29551bC4eCe6AB60Ed49CE31", 
    history: [], 
    coingecko_id: "piedao-yearn-ecosystem-pie",
    image: {
      thumb: "/public/ypie/thumb/icon.png",
      small: "/public/ypie/small/icon.png",
      large: "/public/ypie/large/icon.png",
    }
  },
  {
    symbol: "PLAY", 
    name: "Metaverse NFT Index", 
    address: "0x33e18a092a93ff21ad04746c7da12e35d34dc7c4", 
    history: [], 
    coingecko_id: "metaverse-nft-index",
    image: {
      thumb: "/public/play/thumb/icon.png",
      small: "/public/play/small/icon.png",
      large: "/public/play/large/icon.png",
    }      
  },
  {
    symbol: "DEFI+L",
    name: "PieDAO DEFI Large Cap",  
    address: "0x78f225869c08d478c34e5f645d07a87d3fe8eb78", 
    history: [], 
    coingecko_id: "piedao-defi-large-cap",
    image: {
      thumb: "/public/defi_l/thumb/icon.png",
      small: "/public/defi_l/small/icon.png",
      large: "/public/defi_l/large/icon.png",
    }    
  },
  {
    symbol: "USD++",
    name: "USD Index Pie",  
    address: "0x9a48bd0ec040ea4f1d3147c025cd4076a2e71e3e", 
    history: [], 
    coingecko_id: "",
    image: {
      thumb: "/public/defi_l/thumb/icon.png",
      small: "/public/defi_l/small/icon.png",
      large: "/public/defi_l/large/icon.png",
    }      
  },
  {
    name: "NOT_EXISTING_PIE", 
    symbol: "NOT_EXISTING_PIE", 
    address: "0x0000000000000000000000000000000000000000", 
    history: [], 
    coingecko_id: "",
    image: {
      thumb: "",
      small: "",
      large: "",
    }      
  },
];

export const PiesStub = (): PieEntity[]  => {
  // returning all pies...
  return pies;
}

export const PieStub = (): PieEntity  => {
  // returning a random pie...
  return pies[0];
}