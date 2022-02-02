import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { PieDto } from './dto/pies.dto';
import { PieDocument, PieEntity } from './entities/pie.entity';
import { ethers } from 'ethers';
import * as pieGetterABI from './abis/pieGetterABI.json';
import * as erc20 from './abis/erc20.json';
import * as erc20byte32 from './abis/erc20byte32.json';
import { PieHistoryDocument, PieHistoryEntity } from './entities/pie-history.entity';
import { BigNumber } from 'bignumber.js';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class PiesService {
  private pies = [
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

  private readonly logger = new Logger(PiesService.name);

  constructor(
    private httpService: HttpService,
    @InjectModel(PieEntity.name) private pieModel: Model<PieDocument>,
    @InjectModel(PieHistoryEntity.name) private pieHistoryModel: Model<PieHistoryDocument>
  ) {}

  // Use this every 5 minutes cron setup for testing purposes.
  // */5 * * * *
  // USe this every hour cron setup for production releases.
  // 0 * * * *
  @Cron('0 * * * *')
  async updateNAVs(test?: boolean): Promise<boolean> {
    // instance of the pie-getter contract...
    const provider = new ethers.providers.JsonRpcProvider(process.env.INFURA_RPC);
    this.logger.debug(`updateNAVs is running for block ${await provider.getBlockNumber()}`);

    // retrieving all pies from database...
    let pies = await this.getPies(undefined, undefined, test);
    let coingeckoPiesInfos = {};

    // fetching all the basic price/24h-change/marketCap infos for all pies...
    try {
      let ids = pies.map(pie => pie.coingecko_id);
      let url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids.join(",")}&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true`;
      
      let response = await this.httpService.get(url).toPromise();
      coingeckoPiesInfos = response.data;
    } catch(error) {
      this.logger.error("Error while fetching prices for all pies", error.message);
    }

    // for each pie, we iterate to fetch the underlying assets...
    let pieHistoryPromises = [];

    for(let k = 0; k < pies.length; k++) {
      const pie = new this.pieModel(pies[k]);
      pieHistoryPromises.push(this.CalculatePieHistory(provider, pie, coingeckoPiesInfos));
    };

    try {
      let responses = await Promise.allSettled(pieHistoryPromises);
      responses.forEach((response: any) => {
        this.logger.debug(`pie: ${response.value.symbol}, status: ${response.status}`)
      });
    } catch(error) {
      console.error(error);
    }

    return true;
  }

  CalculatePieHistory(provider: ethers.providers.JsonRpcProvider, pie: PieDocument, coingeckoPiesInfos: any): Promise<any> {
    return new Promise(async(resolve, reject) => {
      try {
        this.logger.debug(`${pie.symbol} - updating nav...`);
        const contract = new ethers.Contract(process.env.PIE_GETTER_CONTRACT, pieGetterABI, provider);

        let pieContract = new ethers.Contract(pie.address, erc20, provider);        
        let pieSupply = await pieContract.totalSupply();
        let pieDecimals = await pieContract.decimals();
        let piePrecision = new BigNumber(10).pow(pieDecimals);
        let totalSupply = new BigNumber(pieSupply.toString()).div(piePrecision);

        let result = await contract.callStatic.getAssetsAndAmountsForAmount(pie.address, pieSupply);
        let underlyingAssets = result[0];
        let underylingTotals = result[1];

        let url = `https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${underlyingAssets.join(',')}&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true`;

        // fetching the prices for each underlying contract...
        let response = await this.httpService.get(url).toPromise();
        let prices = response.data;

        // creating the pieHistory Enity...
        const history = new this.pieHistoryModel({timestamp: Date.now(), amount: 0, underlyingAssets: []});
        let pieMarketCapUSD = new BigNumber(0);

        // calculating the underlyingAssets, populating it into the pieHistory
        // and summing the total value of usd for each token price...
        for(let i = 0; i < underlyingAssets.length; i++) {
          let underlyingContract = null;

          if(underlyingAssets[i].toLowerCase() !== '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2'.toLowerCase()) {
            // instance of the underlying contract...
            underlyingContract = new ethers.Contract(underlyingAssets[i], erc20, provider);
          } else {
            underlyingContract = new ethers.Contract(underlyingAssets[i], erc20byte32, provider);
          }

          // fetching decimals and calculating precision for the underlyingAsset...
          let decimals = await underlyingContract.decimals();
          let symbol = await underlyingContract.symbol();
          let precision = new BigNumber(10).pow(decimals);

          // calculating the value in usd for a given amount of underlyingAsset...
          let usdPrice = prices[underlyingAssets[i].toLowerCase()].usd;
          let pieDAOMarketCap = new BigNumber(underylingTotals[i].toString()).times(usdPrice).div(precision);

          // refilling the underlyingAssets of the History Entity...
          history.underlyingAssets.push({
            address: underlyingAssets[i], 
            symbol: symbol, 
            decimals: decimals,
            amount: underylingTotals[i].toString(),
            token_info: prices[underlyingAssets[i].toLowerCase()],
            pieDAOMarketCap: pieDAOMarketCap.toString()
          });

          // updating the global amount of usd for the main pie of this history entity...
          pieMarketCapUSD = pieMarketCapUSD.plus(pieDAOMarketCap);
        };

        // finally updating the total amount in usd...
        history.pieDAOMarketCap = pieMarketCapUSD;
        history.totalSupply = pieSupply;
        history.decimals = pieDecimals;
        history.nav = (pieMarketCapUSD.toNumber() / totalSupply.toNumber());

        let ticksResponse = [];
        
        try {
          url = `https://api.coingecko.com/api/v3/coins/${pie.coingecko_id}/market_chart?vs_currency=usd&days=30&interval=hourly`;
          response = await this.httpService.get(url).toPromise();   
          ticksResponse = response.data;
        } catch(error) {
          this.logger.error(`${pie.name} - error fetching ticks: `, error.message);
        }

        history.pie = {ticks: ticksResponse, ...coingeckoPiesInfos[pie.coingecko_id]};

        // and saving the history entity...
        let historyDB = await history.save();
        
        // pushing the new history into the main Pie Entity...
        pie.history.push(historyDB);

        // and finally saving the Pie Entity as well...
        let pieDB = await pie.save();

        this.logger.debug(`${pie.name} - nav updated`);
        resolve(pieDB);
      } catch(error) {
        this.logger.error(pie.name, error.message);
        reject(error);
      }
    });    
  }

  getPies(name?: string, address?: string, test?: boolean): Promise<PieEntity[]> {
    return new Promise(async(resolve, reject) => {
      let pies = [];
      let error = null;
      
      switch(true) {
        case name !== undefined:
          try {
            pies.push(await this.getPieByName(name));
          } catch(catchedError) {
            error = catchedError;
          }
          break;
        case address !== undefined:
          try {
            pies.push(await this.getPieByAddress(address));
          } catch(catchedError) {
            error = catchedError;
          }
          break; 
        default:
          pies = await this.pieModel.find().exec();
          
          // if db is empty, we'll initialize the Pies...
          if(pies.length === 0) {
            for(let i = 0; i < this.pies.length; i++) {
              pies.push(await this.createPie(this.pies[i]));
            };
          }

          if(!test) {
            pies = pies.filter(pie => pie.name != "NOT_EXISTING_PIE");
          }          
      }

      if(error) {
        reject(error);
      } else {
        resolve(pies);
      }      
      
    });
  }

  getPieHistory(name?, address?, from?: string, to?: string, order?: 'descending' | 'ascending', last?: boolean, limit?: number): Promise<PieHistoryEntity[]> {
    return new Promise(async(resolve, reject) => {
      let pie = null;
      let error = null;
      
      switch(true) {
        case name !== undefined:
          try {
            pie = await this.getPieByName(name);
          } catch(catchedError) {
            error = catchedError;
          }
          break;
        case address !== undefined:
          try {
            pie = await this.getPieByAddress(address);
          } catch(catchedError) {
            error = catchedError;
          }
          break; 
        default:
          error = "either a Pie-Name or a Pie-Anddress must be provided";
      }

      if(pie) {
        if(last) {
          let history = await this.getPieHistoryDetails(pie, order, from, to, limit);
          resolve(history);
        } else {
          resolve(await this.getPieHistoryDetails(pie, order, from, to, limit));
        }
      } else {
        reject(error);
      }
      
    });
  }

  getPieHistoryDetails(pie: PieEntity, order: 'descending' | 'ascending', from: string, to: string, limit: number): Promise<PieHistoryEntity[]> {
    return new Promise(async(resolve, reject) => {
      try {
        let filters = {
          '_id': { $in: pie.history }
        };

        if(from || to) {
          if(from && to) {
            filters['timestamp'] = {$gte: from, $lte: to};
          } else {
            if(from) {
              filters['timestamp'] = {$gte: from};
            }

            if(to) {
              filters['timestamp'] = {$lte: to};
            }            
          }
        }

        let pieHistories = await this.pieHistoryModel.find(filters)
        .sort({timestamp: order})
        .limit(Number(limit))
        .lean();
  
        resolve(pieHistories);        
      } catch(error) {
        reject(error);
      }
    });
  }

  getPieByAddress(address: string): Promise<PieEntity> {
    return new Promise(async(resolve, reject) => {
      let pies = await this.pieModel.find().where('address').equals(address).lean();

      if(pies[0]) {
        resolve(pies[0]);
      } else {
        reject("Sorry, can't find any Pie in our database which matches your query.");
      }
    });
  }

  getPieByName(name: string): Promise<PieEntity> {
    return new Promise(async(resolve, reject) => {
      let pies = await this.pieModel.find().where('name').equals(name).lean();

      if(pies[0]) {
        resolve(pies[0]);
      } else {
        reject("Sorry, can't find any Pie in our database which matches your query.");
      }      
    });    
  }

  createPie(pie: PieDto): Promise<PieEntity> {
    return new Promise(async(resolve, reject) => {
      try {
        pie.address = pie.address.toLocaleLowerCase();

        const createdPie = new this.pieModel(pie);
        let pieDB = await createdPie.save();

        resolve(pieDB);
      } catch(error) {
        reject(error);
      }
    });    
  }

  deletePie(pie: PieEntity): Promise<PieEntity> {
    return new Promise(async(resolve, reject) => {
      try {
        let pieDB = await this.pieModel.findOneAndDelete({ address: pie.address.toLocaleLowerCase() });
        resolve(pieDB);
      } catch(error) {
        reject(error);
      }
    });    
  }
}
