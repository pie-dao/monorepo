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
    {name: "BTC++", address: "0x0327112423f3a68efdf1fcf402f6c5cb9f7c33fd", history: []},
    {name: "DEFI+S", address: "0xad6a626ae2b43dcb1b39430ce496d2fa0365ba9c", history: []},
    {name: "DEFI++", address: "0x8d1ce361eb68e9e05573443c407d4a3bed23b033", history: []},
    {name: "BCP", address: "0xe4f726adc8e89c6a6017f01eada77865db22da14", history: []},
    {name: "YPIE", address: "0x17525E4f4Af59fbc29551bC4eCe6AB60Ed49CE31", history: []},
    {name: "PLAY", address: "0x33e18a092a93ff21ad04746c7da12e35d34dc7c4", history: []},
    {name: "DEFI+L", address: "0x78f225869c08d478c34e5f645d07a87d3fe8eb78", history: []},
    {name: "USD++", address: "0x9a48bd0ec040ea4f1d3147c025cd4076a2e71e3e", history: []},
    {name: "NOT_EXISTING_PIE", address: "0x0000000000000000000000000000000000000000", history: []}
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
    this.logger.debug("updateNAVs is running");

    // instance of the pie-getter contract...
    const provider = new ethers.providers.JsonRpcProvider(process.env.INFURA_RPC);
    const contract = new ethers.Contract(process.env.PIE_GETTER_CONTRACT, pieGetterABI, provider);

    // retrieving all pies from database...
    let pies = await this.getPies(undefined, undefined, test);

    // for each pie, we iterate to fetch the underlying assets...
    for(let k = 0; k < pies.length; k++) {
      const pie = new this.pieModel(pies[k]);

      try {
        let pieContract = new ethers.Contract(pie.address, erc20, provider);
        
        let pieSupply = await pieContract.totalSupply();
        let pieDecimals = await pieContract.decimals();
        let piePrecision = new BigNumber(10).pow(pieDecimals);
        let totalSupply = new BigNumber(pieSupply.toString()).div(piePrecision);

        let result = await contract.callStatic.getAssetsAndAmountsForAmount(pie.address, pieSupply);
        let underlyingAssets = result[0];
        let underylingTotals = result[1];
        
        let url = `https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${underlyingAssets.join(',')}&vs_currencies=usd`;
        
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
          let marketCapUSD = new BigNumber(underylingTotals[i].toString()).times(usdPrice).div(precision);

          // refilling the underlyingAssets of the History Entity...
          history.underlyingAssets.push({
            address: underlyingAssets[i], 
            symbol: symbol, 
            decimals: decimals,
            amount: underylingTotals[i].toString(),
            usdPrice: usdPrice.toString(),
            marketCapUSD: marketCapUSD.toString()
          });

          // updating the global amount of usd for the main pie of this history entity...
          pieMarketCapUSD = pieMarketCapUSD.plus(marketCapUSD);
        };

        // finally updating the total amount in usd...
        history.marketCapUSD = pieMarketCapUSD;
        history.totalSupply = pieSupply;
        history.decimals = pieDecimals;
        history.nav = (pieMarketCapUSD.toNumber() / totalSupply.toNumber());

        // and saving the history entity...
        let historyDB = await history.save();
        
        // pushing the new history into the main Pie Entity...
        pie.history.push(historyDB);

        // and finally saving the Pie Entity as well...
        let pieDB = await pie.save();

        this.logger.debug(pie.name, "nav updated");
      } catch(error) {
        this.logger.error(pie.name, error.message);
      }
    };

    return true;
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
          } else {
            if(!test) {
              pies = pies.filter(pie => pie.name != "NOT_EXISTING_PIE");
            }
          }     
      }

      if(error) {
        reject(error);
      } else {
        resolve(pies);
      }      
      
    });
  }

  getPieHistory(name?, address?): Promise<PieHistoryEntity[]> {
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
        resolve(await this.getPieHistoryDetails(pie));
      } else {
        reject(error);
      }
      
    });
  }

  getPieHistoryDetails(pie: PieEntity): Promise<PieHistoryEntity[]> {
    return new Promise(async(resolve, reject) => {
      try {
        let pieHistories = await this.pieHistoryModel.find({
          '_id': { $in: pie.history }
        }).lean();
  
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
