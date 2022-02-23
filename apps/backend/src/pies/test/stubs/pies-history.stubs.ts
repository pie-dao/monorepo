import { PieHistoryEntity } from 'src/pies/entities/pie-history.entity';
import { BigNumber } from 'bignumber.js';

const histories = [
  {
    underlyingAssets: [
      {address: "0xba100000625a3754423978a60c9317c58a424e3D", amount: "145232089140239205", usd: "3.6685625716824423183"},
      {address: "0xBBbbCA6A901c926F240b89EacB641d8Aec7AEafD", amount: "20437259837801076081", usd: "5.22895467854075651963"}
    ], 
    timestamp: "1628253732831", 
    marginalTVL: new BigNumber("26.13762717355117514798"),
    totalSupply: new BigNumber("26.13762717355117514798"),
    nav: 0,
    decimals: 18,
    pie: {
      usd: 671863,
      usd_market_cap: 8507603.84069643,
      usd_24h_vol: 27.63934871442503,
      usd_24h_change: 1536.874503249737,
      ticks: []
    }    
  },
  {
    underlyingAssets: [
      {address: "0xba100000625a3754423978a60c9317c58a424e3D", amount: "145232089140239205", usd: "3.6685625716824423183"},
      {address: "0xBBbbCA6A901c926F240b89EacB641d8Aec7AEafD", amount: "20437259837801076081", usd: "5.22895467854075651963"}
    ], 
    timestamp: "1628253732831", 
    marginalTVL: new BigNumber("26.13762717355117514798"),
    totalSupply: new BigNumber("26.13762717355117514798"),
    nav: 0,
    decimals: 18,
    pie: {
      usd: 671863,
      usd_market_cap: 8507603.84069643,
      usd_24h_vol: 27.63934871442503,
      usd_24h_change: 1536.874503249737,
      ticks: []
    }    
  },
]

export const PieHistoryStub = (): PieHistoryEntity[]  => {
  // returning all pies...
  return histories;
}