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
import * as moment from 'moment';
import * as ethDater from 'ethereum-block-by-date';
import { Command, Console, createSpinner } from 'nestjs-console';
import * as fs from 'fs';
import * as lodash from 'lodash';

@Injectable()
@Console()
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
        thumb: "/public/usd_plus/thumb/icon.png",
        small: "/public/usd_plus/small/icon.png",
        large: "/public/usd_plus/large/icon.png",
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

  // 08/06/2021 - PieGetter Contract Creation Date
  // private startingBlockNumber = 12595880;

  // 01/01/2022 - Custom Starting Date of your choise
  private startingBlockNumber = 13916166;

  private readonly logger = new Logger(PiesService.name);
  private historySpin = createSpinner();
  private historyToBeFetched = 0;
  private historyResolved = 0;
  private historyRejected = 0;

  private blockSpin = createSpinner();
  private blockToBeFetched = 0;
  private blockResolved = 0;
  private blockRejected = 0;

  constructor(
    private httpService: HttpService,
    @InjectModel(PieEntity.name) private pieModel: Model<PieDocument>,
    @InjectModel(PieHistoryEntity.name) private pieHistoryModel: Model<PieHistoryDocument>
  ) {}

  private async generateBackBlocks(provider: ethers.providers.JsonRpcProvider): Promise<Array<any>> {
    // retrieving the start block infos from the chain...
    let startBlock = await provider.getBlock(this.startingBlockNumber);
    // removing minutes and seconds, and add 1 hour, to start fresh and clean...
    let startTimestamp = moment(startBlock.timestamp * 1000).minutes(0).seconds(0).add(1, 'hour');
    // calculating latest hour timestamp, starting from current block from chain...
    let endBlock = await provider.getBlock(await provider.getBlockNumber());
    let endTimestamp = moment(endBlock.timestamp * 1000).minutes(0).seconds(0);

    this.blockSpin.info(`startBlock: ${startBlock.number} - startTimestamp: ${startTimestamp.toDate().getTime()} - ${startTimestamp.format('DD/MM/YYYY')}`);
    this.blockSpin.info(`endBlock: ${endBlock.number} - endTimestamp: ${endTimestamp.toDate().getTime()} - ${endTimestamp.format('DD/MM/YYYY')}`);    

    // iterating all over the timestamps in the range of interest...
    let currentBlock = startBlock.number;
    let backBlocks = [];

    // while((startTimestamp.toDate().getTime() < endTimestamp.toDate().getTime())) {
      while(currentBlock < endBlock.number) {
      backBlocks.push({
        timestamp: startTimestamp.toDate().getTime(),
        block: currentBlock
      });

      startTimestamp = startTimestamp.add(1, 'hour');
      currentBlock += 276;
    }

    this.blockSpin.info(`latest calculated block: ${currentBlock} - latest calculated timestamp: ${startTimestamp.toDate().getTime()} - ${startTimestamp.format('DD/MM/YYYY')}`);
    this.blockSpin.succeed(`total blocks to be processed ${backBlocks.length}`);
    return backBlocks;
  }

  private async generatePieBackHistory(pie: PieDocument, backBlock: any, provider: ethers.providers.JsonRpcProvider): Promise<any> {
    return new Promise(async(resolve, reject) => {
      try {
        const contract = new ethers.Contract(process.env.PIE_GETTER_CONTRACT, pieGetterABI, provider);
        let pieContract = new ethers.Contract(pie.address, erc20, provider);        
        let pieSupply = await pieContract.totalSupply({blockTag: backBlock.block});
        let pieDecimals = await pieContract.decimals({blockTag: backBlock.block});
        let piePrecision = new BigNumber(10).pow(pieDecimals);
        let totalSupply = new BigNumber(pieSupply.toString()).div(piePrecision);
  
        // fetching the pie's market infos back in time...
        let startDate = moment(backBlock.timestamp * 1000);
        let marketHistory = null;

        if(pie.coingecko_id) {
          marketHistory = await this.httpService
            .get(`https://api.coingecko.com/api/v3/coins/${pie.coingecko_id}/history?date=${startDate.format('DD-MM-YYYY')}&localization=false`).toPromise();          
        }
  
        // creating the pieHistory Enity...
        const history = new this.pieHistoryModel({timestamp: backBlock.timestamp * 1000, amount: 0, underlyingAssets: []});
        let pieMarketCapUSD = new BigNumber(0);
        // filling the values we've got so far...
        history.totalSupply = pieSupply;
        history.decimals = pieDecimals;        
        // filling the pie details previously fetched...
        history.pie = {
          ticks: [], 
          ...{
            usd: marketHistory ? marketHistory.data.market_data.current_price.usd : 0,
            usd_market_cap: marketHistory ? marketHistory.data.market_data.market_cap.usd : 0,
            usd_24h_vol: marketHistory ? marketHistory.data.market_data.total_volume.usd : 0,
            usd_24h_change: 0 // TODO: this can maybe be calculated somehow?
          }
        };
        // trying to fetch the ticks, back in time...
        try {
          let endDate = startDate.subtract(1, 'months');
          let ticksResponse = await this.httpService
            .get(`https://api.coingecko.com/api/v3/coins/${pie.coingecko_id}/market_chart/range?vs_currency=usd&from=${endDate.unix()}&to=${backBlock.timestamp}`).toPromise();   
          history.pie.ticks = ticksResponse.data;
        } catch(error) {
          this.logger.error(`${pie.name} - error fetching ticks: `, error.message);
        }        
  
        /******************************************************************/
        /*********************** Underlying Assets ************************/
        // fetching all underlying assets for current pie...
        let result = await contract.callStatic.getAssetsAndAmountsForAmount(pie.address, pieSupply, {blockTag: backBlock.block});
        let underlyingAssets = lodash.get(result, 0);
        let underylingTotals = lodash.get(result, 1);
  
        // calculating the underlyingAssets, populating it into the pieHistory
        // and summing the total value of usd for each token price...
        for(let i = 0; i < underlyingAssets.length; i++) {
          let backDate = startDate.subtract(30, 'minutes');
          let underlyingMarketDataResponse = await this.httpService
          .get(`https://api.coingecko.com/api/v3/coins/ethereum/contract/${underlyingAssets[i]}/market_chart/range?vs_currency=usd&from=${backDate.unix()}&to=${backBlock.timestamp}`).toPromise();
  
          let tokenInfo = {
            usd: lodash.get(underlyingMarketDataResponse.data.prices[underlyingMarketDataResponse.data.prices.length - 1], 1),
            usd_market_cap: lodash.get(underlyingMarketDataResponse.data.market_caps[underlyingMarketDataResponse.data.market_caps.length - 1], 1),
            usd_24h_vol: lodash.get(underlyingMarketDataResponse.data.total_volumes[underlyingMarketDataResponse.data.total_volumes.length - 1], 1),
            usd_24h_change: 0 // TODO: this can maybe be calculated somehow?
          };
  
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
          let pieDAOMarketCap = new BigNumber(underylingTotals[i].toString()).times(tokenInfo.usd).div(precision);
  
          // refilling the underlyingAssets of the History Entity...
          history.underlyingAssets.push({
            address: underlyingAssets[i], 
            symbol: symbol, 
            decimals: decimals,
            amount: underylingTotals[i].toString(),
            token_info: tokenInfo,
            pieDAOMarketCap: pieDAOMarketCap,
            pieDAOMarketCapPercentage: 0
          });
  
          // updating the global amount of usd for the main pie of this history entity...
          pieMarketCapUSD = pieMarketCapUSD.plus(pieDAOMarketCap);
        };
  
        // adding the allocation percentage to each underlying asset...
        history.underlyingAssets.forEach((asset: any) => {
          asset.pieDAOMarketCapPercentage = asset.pieDAOMarketCap.times(100).div(pieMarketCapUSD).toString();
          asset.pieDAOMarketCap = asset.pieDAOMarketCap.toString();
        });
        /******************************************************************/
  
        // finally updating the total amount in usd, and the relative nav...
        history.pieDAOMarketCap = pieMarketCapUSD;
        history.nav = (pieMarketCapUSD.toNumber() / totalSupply.toNumber());
  
        // and saving the history entity...
        let historyDB = await history.save();
        
        // pushing the new history into the main Pie Entity...
        pie.history.push(historyDB);
  
        // and finally saving the Pie Entity as well...
        let pieDB = await pie.save();
  
        this.historySpin.text = `Generating a total of ${this.historyToBeFetched} back history: resolved ${++this.historyResolved} | rejected ${this.historyRejected}`;
        resolve({pie: pie.symbol, block: backBlock.block, timestamp: backBlock.timestamp, id: historyDB._id});
      } catch(error) {
        this.historySpin.text = `Generating a total of ${this.historyToBeFetched} back history: resolved ${this.historyResolved} | rejected ${++this.historyRejected}`;
        reject({pie: pie.symbol, block: backBlock.block, timestamp: backBlock.timestamp, error: error.message});
      }
    });
  }

  @Command({
    command: 'generate-pies-back-histories',
    description: 'Generate back histories for pies.'
  })
  async generatePiesBackHistories(): Promise<boolean> {
    let beginning = moment().format('YYYY-MM-DD HH:mm:ss');
    this.historySpin.info(`Generating the back history for all pies, started at ${beginning}`);
        
    const provider = new ethers.providers.JsonRpcProvider(process.env.INFURA_RPC);
    
    // retrieving all the backBlocks, from this.startingBlockNumber up to date...
    let backBlocks = await this.generateBackBlocks(provider);

    // // retrieving all pies from database...
    // let pies = await this.getPies(undefined, undefined, false);

    // this.historyToBeFetched = backBlocks.length * pies.length;
    // this.historySpin.start(`Generating a total of ${this.historyToBeFetched} back history...`);    

    // // for each block, from past to present...
    // let backBlocksHistoryPromises = [];

    // backBlocks.forEach(async(backBlock) => {
    //   // for each pie, we iterate to fetch the underlying assets...
    //   let piesBackHistoryPromises = [];

    //   for(let k = 0; k < pies.length; k++) {
    //     const pie = new this.pieModel(pies[k]);
    //     piesBackHistoryPromises.push(this.generatePieBackHistory(pie, backBlock, provider));
    //   };

    //   backBlocksHistoryPromises.push(Promise.allSettled(piesBackHistoryPromises));
    // });

    // let results = await Promise.allSettled(backBlocksHistoryPromises);
    // console.log(JSON.stringify(results));

    // let end = moment().format('YYYY-MM-DD HH:mm:ss');
    // this.historySpin.succeed(`${this.historyToBeFetched} back histories have been generated, ended at ${end}`);

    return true;
  }

  // Use this every 5 minutes cron setup for testing purposes.
  // */5 * * * *
  // USe this every hour cron setup for production releases.
  // 0 * * * *
  // @Cron('0 * * * *')
  async updateNAVs(test?: boolean): Promise<boolean> {
    // instance of the pie-getter contract...
    let timestamp = Date.now();
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
      pieHistoryPromises.push(this.CalculatePieHistory(provider, pie, coingeckoPiesInfos, timestamp));
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

  CalculatePieHistory(provider: ethers.providers.JsonRpcProvider, pie: PieDocument, coingeckoPiesInfos: any, timestamp: number): Promise<any> {
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
        let underlyingAssets = lodash.get(result, 0);
        let underylingTotals = lodash.get(result, 1);

        let url = `https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${underlyingAssets.join(',')}&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true`;

        // fetching the prices for each underlying contract...
        let response = await this.httpService.get(url).toPromise();
        let prices = response.data;

        // creating the pieHistory Enity...
        const history = new this.pieHistoryModel({timestamp: timestamp, amount: 0, underlyingAssets: []});
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
            pieDAOMarketCap: pieDAOMarketCap,
            pieDAOMarketCapPercentage: 0
          });

          // updating the global amount of usd for the main pie of this history entity...
          pieMarketCapUSD = pieMarketCapUSD.plus(pieDAOMarketCap);
        };

        // adding the allocation percentage to each underlying asset...
        history.underlyingAssets.forEach((asset: any) => {
          asset.pieDAOMarketCapPercentage = asset.pieDAOMarketCap.times(100).div(pieMarketCapUSD).toString();
          asset.pieDAOMarketCap = asset.pieDAOMarketCap.toString();
        });

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

  getPieHistory(name?, address?, from?: string, to?: string, order?: 'descending' | 'ascending', limit?: number): Promise<any> {
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
        let history = await this.getPieHistoryDetails(pie, order, from, to, limit);
        delete pie.history;
        resolve({history: history, pie: pie});
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

  async getPieNavChart(name?: string, address?: string): Promise<any> {
    try {
      let asset = await this.getPieHistory(name, address, null, null, 'descending', 1);

      let response = {
        name: asset.pie.name,
        symbol: asset.pie.symbol,
        nav: asset.history[0].nav,
        ticks: asset.history[0].pie.ticks.prices.slice(0, 16) // TODO: change me with real value...
      };

      return response;      
    } catch(error) {
      throw new Error(error);
    }
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
