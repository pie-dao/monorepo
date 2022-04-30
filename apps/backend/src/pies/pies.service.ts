import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Interval } from '@nestjs/schedule';
import { BigNumber } from 'bignumber.js';
import { ethers } from 'ethers';
import * as lodash from 'lodash';
import * as moment from 'moment';
import { Model } from 'mongoose';
import { Command, Console, createSpinner } from 'nestjs-console';
import { StakingService } from 'src/staking/staking.service';
import * as erc20 from './abis/erc20.json';
import * as erc20byte32 from './abis/erc20byte32.json';
import * as pieGetterABI from './abis/pieGetterABI.json';
import { PieDto } from './dto/pies.dto';
import { CgCoinDocument, CgCoinEntity } from './entities/cg_coin.entity';
import {
  PieHistoryDocument,
  PieHistoryEntity,
} from './entities/pie-history.entity';
import { PieDocument, PieEntity } from './entities/pie.entity';

const EVERY_HOUR = 1000 * 60 * 60;
const EVERY_MINUTE = 1000 * 60;
const DOUGH_ADDRESS = '0xad32a8e6220741182940c5abf610bde99e737b2d';

@Injectable()
@Console()
export class PiesService {
  private pies = [
    {
      symbol: 'BTC++',
      name: 'PieDAO BTC++',
      address: '0x0327112423f3a68efdf1fcf402f6c5cb9f7c33fd',
      history: [],
      coingecko_id: 'piedao-btc',
    },
    {
      symbol: 'DEFI+S',
      name: 'PieDAO DEFI Small Cap',
      address: '0xad6a626ae2b43dcb1b39430ce496d2fa0365ba9c',
      history: [],
      coingecko_id: 'piedao-defi-small-cap',
    },
    {
      symbol: 'DEFI++',
      name: 'PieDAO DEFI++',
      address: '0x8d1ce361eb68e9e05573443c407d4a3bed23b033',
      history: [],
      coingecko_id: 'piedao-defi',
    },
    {
      symbol: 'BCP',
      name: 'PieDAO Balanced Crypto Pie',
      address: '0xe4f726adc8e89c6a6017f01eada77865db22da14',
      history: [],
      coingecko_id: 'piedao-balanced-crypto-pie',
    },
    {
      symbol: 'YPIE',
      name: 'PieDAO Yearn Ecosystem Pie',
      address: '0x17525E4f4Af59fbc29551bC4eCe6AB60Ed49CE31',
      history: [],
      coingecko_id: 'piedao-yearn-ecosystem-pie',
    },
    {
      symbol: 'PLAY',
      name: 'Metaverse NFT Index',
      address: '0x33e18a092a93ff21ad04746c7da12e35d34dc7c4',
      history: [],
      coingecko_id: 'metaverse-nft-index',
    },
    {
      symbol: 'DEFI+L',
      name: 'PieDAO DEFI Large Cap',
      address: '0x78f225869c08d478c34e5f645d07a87d3fe8eb78',
      history: [],
      coingecko_id: 'piedao-defi-large-cap',
    },
    {
      symbol: 'DEFI+L',
      name: 'PieDAO DEFI Large Cap',
      address: '0x78f225869c08d478c34e5f645d07a87d3fe8eb78',
      history: [],
      coingecko_id: 'piedao-defi-large-cap',
    },
    {
      symbol: 'USD++',
      name: 'USD Index Pie',
      address: '0x9a48bd0ec040ea4f1d3147c025cd4076a2e71e3e',
      history: [],
      coingecko_id: '',
    },
    {
      name: 'NOT_EXISTING_PIE',
      symbol: 'NOT_EXISTING_PIE',
      address: '0x0000000000000000000000000000000000000000',
      history: [],
      coingecko_id: '',
    },
  ];

  private readonly logger = new Logger(PiesService.name);

  constructor(
    private httpService: HttpService,
    private stakingService: StakingService,
    @InjectModel(PieEntity.name) private pieModel: Model<PieDocument>,
    @InjectModel(PieHistoryEntity.name)
    private pieHistoryModel: Model<PieHistoryDocument>,
    @InjectModel(CgCoinEntity.name)
    private cgCoinModel: Model<CgCoinDocument>,
  ) {}

  @Command({
    command: 'init-cg-coins',
    description: 'Init Coingecko Coins, back to 90 days before now.',
  })
  async initCgCoins(test?: boolean): Promise<boolean> {
    const spinner = createSpinner();

    try {
      spinner.start(`initCgCoins is running...`);

      // retrieving all pies from database...
      const pies = await this.getPies(undefined, undefined, test);
      const coingeckoCoinsPromises = [];
      const coingeckoChartsPromises = [];
      // fetching all the coins from coingecko, to be use as a model to refill...
      pies.forEach((pie) => {
        if (pie.coingecko_id) {
          coingeckoCoinsPromises.push(this.fetchCgCoins(pie.coingecko_id));
          coingeckoChartsPromises.push(this.fetchCgChart(pie.coingecko_id));
        }
      });

      const coingeckoCoinsResponses = await Promise.allSettled(
        coingeckoCoinsPromises,
      );
      spinner.text = `coins model have been fetched from coingecko...`;
      const coingeckoChartsResponses = await Promise.allSettled(
        coingeckoChartsPromises,
      );
      spinner.text = `coins charts have been fetched from coingecko...`;
      const coinsDbPromises = [];

      coingeckoChartsResponses.forEach((response: any) => {
        const coinModel = <any>(
          coingeckoCoinsResponses.find(
            (el: any) => response.value.id == el.value.id,
          )
        );

        spinner.text = `refilling 90 days history for ${response.value.id}...`;
        response.value.chart.prices.forEach((price, index) => {
          const currentPrice = response.value.chart.prices[index];
          const marketCap = response.value.chart.market_caps[index];
          const totalVolume = response.value.chart.total_volumes[index];
          const timestamp = lodash.get(currentPrice, 0);

          coinsDbPromises.push(
            new this.cgCoinModel({
              timestamp: timestamp,
              coin: {
                id: coinModel.value.id,
                symbol: coinModel.value.symbol,
                name: coinModel.value.name,
                asset_platform_id: coinModel.value.asset_platform_id,
                platforms: coinModel.value.platforms,
                categories: coinModel.value.categories,
                links: coinModel.value.links,
                image: coinModel.value.image,
                contract_address: coinModel.value.contract_address,
                market_data: {
                  current_price: {
                    usd: lodash.get(currentPrice, 1),
                  },
                  market_cap: {
                    usd: lodash.get(marketCap, 1),
                  },
                  total_volume: {
                    usd: lodash.get(totalVolume, 1),
                  },
                },
              },
            }),
          );
        });
      });

      try {
        spinner.text = `Saving all the items into db...`;
        let result = await this.cgCoinModel.collection.insertMany(
          coinsDbPromises,
        );
        spinner.succeed(
          `All the latest 90 days histories have been saved into db correctly`,
        );
        return true;
      } catch (error) {
        spinner.fail(error.message);
        return false;
      }
    } catch (error) {
      spinner.fail(error.message);
      return false;
    }
  }

  @Interval(EVERY_HOUR)
  async updateCgCoins(test?: boolean): Promise<boolean> {
    try {
      const timestamp = moment().unix() * 1000;
      this.logger.debug(`updateCgCoins is running...`);

      // retrieving all pies from database...
      const pies = await this.getPies(undefined, undefined, test);
      const coingeckoCoinsPromises = [];

      pies.forEach((pie) => {
        if (pie.coingecko_id) {
          coingeckoCoinsPromises.push(this.fetchCgCoins(pie.coingecko_id));
        }
      });

      const coingeckoCoinsResponses = await Promise.allSettled(
        coingeckoCoinsPromises,
      );
      const coinsDbPromises = [];
      coingeckoCoinsResponses.forEach((response: any) => {
        coinsDbPromises.push(this.saveCgCoins(response.value, timestamp));
      });

      const coinsDbResponses = await Promise.allSettled(coinsDbPromises);
      coinsDbResponses.forEach((response: any) => {
        this.logger.debug(
          `${response.value.coin.symbol} has been fetched and saved into db correctly.`,
        );
      });
    } catch (error) {
      this.logger.error(error.message);
    }

    return true;
  }

  private async saveCgCoins(
    coingeckoCoin: any,
    timestamp: number,
  ): Promise<CgCoinDocument> {
    return new Promise(async (resolve, reject) => {
      try {
        const coin = new this.cgCoinModel({
          timestamp: timestamp,
          coin: coingeckoCoin,
        });
        const coinDocument = await coin.save();
        resolve(coinDocument);
      } catch (error) {
        reject(error);
      }
    });
  }

  private async fetchCgCoins(coingeckoId: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const url = `https://api.coingecko.com/api/v3/coins/${coingeckoId}?localization=false&developer_data=false`;
        const response = await this.httpService.get(url).toPromise();
        resolve(response.data);
      } catch (error) {
        reject(error);
      }
    });
  }

  private async fetchCgChart(coingeckoId: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const url = `https://api.coingecko.com/api/v3/coins/${coingeckoId}/market_chart?vs_currency=usd&days=90&interval=hourly`;
        const response = await this.httpService.get(url).toPromise();
        resolve({ id: coingeckoId, chart: response.data });
      } catch (error) {
        reject(error);
      }
    });
  }

  async getSliceDoughRatio(): Promise<number> {
    const sliceBreakdown = await this.stakingService.getSliceBreakdown();
    const url = `https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${DOUGH_ADDRESS}&vs_currencies=usd`;
    const response = await this.httpService.get(url).toPromise();
    const sliceNav = sliceBreakdown.nav;
    const doughPrice = response.data[DOUGH_ADDRESS].usd;
    return sliceNav / doughPrice;
  }

  getCgCoin(
    address: string,
    from?: string,
    to?: string,
    order?: 'descending' | 'ascending',
    limit?: number,
  ): Promise<CgCoinEntity[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const filters = {
          'coin.contract_address': address,
        };

        if (from || to) {
          if (from && to) {
            filters['timestamp'] = { $gte: from, $lte: to };
          } else {
            if (from) {
              filters['timestamp'] = { $gte: from };
            }
            if (to) {
              filters['timestamp'] = { $lte: to };
            }
          }
        }

        const cgCoinEntity = this.cgCoinModel
          .find(filters)
          .sort({ timestamp: order })
          .limit(Number(limit))
          .lean();

        resolve(cgCoinEntity);
      } catch (error) {
        reject(error);
      }
    });
  }

  getMarketChart(
    address: string,
    days: number,
  ): Promise<{
    prices: Array<Array<number>>;
    market_caps: Array<Array<number>>;
    total_volumes: Array<Array<number>>;
  }> {
    return new Promise(async (resolve, reject) => {
      try {
        const from = moment().subtract(days, 'days').unix() * 1000;
        const coinEntries = await this.getCgCoin(
          address,
          from.toString(),
          null,
          'ascending',
        );

        const marketCharts = {
          prices: [],
          market_caps: [],
          total_volumes: [],
        };

        coinEntries.forEach((coinEntry: any) => {
          marketCharts.prices.push([
            Number(coinEntry.timestamp),
            coinEntry.coin.market_data.current_price.usd,
          ]);
          marketCharts.market_caps.push([
            Number(coinEntry.timestamp),
            coinEntry.coin.market_data.market_cap.usd,
          ]);
          marketCharts.total_volumes.push([
            Number(coinEntry.timestamp),
            coinEntry.coin.market_data.total_volume.usd,
          ]);
        });

        resolve(marketCharts);
      } catch (error) {
        reject(error);
      }
    });
  }

  @Interval(EVERY_MINUTE)
  async updateNAVs(test?: boolean): Promise<boolean> {
    // instance of the pie-getter contract...
    const timestamp = Date.now();
    const provider = new ethers.providers.JsonRpcProvider(
      process.env.INFURA_RPC,
    );
    this.logger.debug(
      `updateNAVs is running for block ${await provider.getBlockNumber()}`,
    );

    // retrieving all pies from database...
    const pies = await this.getPies(undefined, undefined, test);
    let coingeckoPiesInfos = {};

    // fetching all the basic price/24h-change/marketCap infos for all pies...
    try {
      const ids = pies.map((pie) => pie.coingecko_id);
      const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids.join(
        ',',
      )}&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true`;

      const response = await this.httpService.get(url).toPromise();
      coingeckoPiesInfos = response.data;
    } catch (error) {
      this.logger.error(
        'Error while fetching prices for all pies',
        error.message,
      );
    }

    // for each pie, we iterate to fetch the underlying assets...
    const pieHistoryPromises = [];

    for (const pie of pies) {
      const pieModel = new this.pieModel(pie);
      pieHistoryPromises.push(
        this.calculatePieHistory(
          provider,
          pieModel,
          coingeckoPiesInfos,
          timestamp,
        ),
      );
    }

    try {
      const responses = await Promise.allSettled(pieHistoryPromises);
      responses.forEach((response: any) => {
        this.logger.debug(
          `pie: ${response.value.symbol}, status: ${response.status}`,
        );
      });
    } catch (error) {
      console.error(error);
    }

    return true;
  }

  calculatePieHistory(
    provider: ethers.providers.JsonRpcProvider,
    pie: PieDocument,
    coingeckoPiesInfos: any,
    timestamp: number,
  ): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        this.logger.debug(`${pie.symbol} - updating nav...`);
        const contract = new ethers.Contract(
          process.env.PIE_GETTER_CONTRACT,
          pieGetterABI,
          provider,
        );

        const pieContract = new ethers.Contract(pie.address, erc20, provider);
        const pieSupply = await pieContract.totalSupply();
        const pieDecimals = await pieContract.decimals();
        const piePrecision = new BigNumber(10).pow(pieDecimals);
        const totalSupply = new BigNumber(pieSupply.toString()).div(
          piePrecision,
        );

        const result = await contract.callStatic.getAssetsAndAmountsForAmount(
          pie.address,
          pieSupply,
        );
        const underlyingAssets = lodash.get(result, 0);
        const underylingTotals = lodash.get(result, 1);

        const url = `https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${underlyingAssets.join(
          ',',
        )}&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true`;

        // fetching the prices for each underlying contract...
        const response = await this.httpService.get(url).toPromise();
        const prices = response.data;

        // creating the pieHistory Entity...
        const history = new this.pieHistoryModel({
          timestamp: timestamp,
          amount: 0,
          underlyingAssets: [],
        });
        let pieMarketCapUSD = new BigNumber(0);

        // calculating the underlyingAssets, populating it into the pieHistory
        // and summing the total value of usd for each token price...
        for (let i = 0; i < underlyingAssets.length; i++) {
          let underlyingContract = null;

          if (
            underlyingAssets[i].toLowerCase() !==
            '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2'.toLowerCase()
          ) {
            // instance of the underlying contract...
            underlyingContract = new ethers.Contract(
              underlyingAssets[i],
              erc20,
              provider,
            );
          } else {
            underlyingContract = new ethers.Contract(
              underlyingAssets[i],
              erc20byte32,
              provider,
            );
          }

          // fetching decimals and calculating precision for the underlyingAsset...
          const decimals = await underlyingContract.decimals();
          const symbol = await underlyingContract.symbol();
          const precision = new BigNumber(10).pow(decimals);

          // calculating the value in usd for a given amount of underlyingAsset...
          const usdPrice = prices[underlyingAssets[i].toLowerCase()].usd;
          const marginalTVL = new BigNumber(underylingTotals[i].toString())
            .times(usdPrice)
            .div(precision);

          // refilling the underlyingAssets of the History Entity...
          history.underlyingAssets.push({
            address: underlyingAssets[i],
            symbol: symbol,
            decimals: decimals,
            amount: underylingTotals[i].toString(),
            usdPrice: usdPrice.toString(),
            marginalTVL: marginalTVL,
            marginalTVLPercentage: 0,
          });

          // updating the global amount of usd for the main pie of this history entity...
          pieMarketCapUSD = pieMarketCapUSD.plus(marginalTVL);
        }

        // adding the allocation percentage to each underlying asset...
        history.underlyingAssets.forEach((asset: any) => {
          asset.marginalTVLPercentage = asset.marginalTVL
            .times(100)
            .div(pieMarketCapUSD)
            .toString();
          asset.marginalTVL = asset.marginalTVL.toString();
        });

        // finally updating the total amount in usd...
        history.marginalTVL = pieMarketCapUSD;
        history.totalSupply = pieSupply;
        history.decimals = pieDecimals;
        history.nav = pieMarketCapUSD.toNumber() / totalSupply.toNumber();

        // and saving the history entity...
        const historyDB = await history.save();

        // pushing the new history into the main Pie Entity...
        pie.history.push(historyDB);

        // and finally saving the Pie Entity as well...
        const pieDB = await pie.save();

        this.logger.debug(`${pie.name} - nav updated`);
        resolve(pieDB);
      } catch (error) {
        this.logger.error(pie.name, error.message);
        reject(error);
      }
    });
  }

  getPies(
    name?: string,
    address?: string,
    test?: boolean,
  ): Promise<PieEntity[]> {
    return new Promise(async (resolve, reject) => {
      let pies = [];
      let error = null;

      switch (true) {
        case name !== undefined:
          try {
            pies.push(await this.getPieByName(name));
          } catch (caughtError) {
            error = caughtError;
          }
          break;
        case address !== undefined:
          try {
            pies.push(await this.getPieByAddress(address));
          } catch (caughtError) {
            error = caughtError;
          }
          break;
        default:
          pies = await this.pieModel.find().exec();

          // if db is empty, we'll initialize the Pies...
          if (pies.length === 0) {
            for (const pie of this.pies) {
              pies.push(await this.createPie(pie));
            }
          }

          if (!test) {
            pies = pies.filter((pie) => pie.name != 'NOT_EXISTING_PIE');
          }
      }

      if (error) {
        reject(error);
      } else {
        resolve(pies);
      }
    });
  }

  getPieHistory(
    name?,
    address?,
    from?: string,
    to?: string,
    order?: 'descending' | 'ascending',
    limit?: number,
  ): Promise<any> {
    return new Promise(async (resolve, reject) => {
      let pie = null;
      let error = null;

      switch (true) {
        case name !== undefined:
          try {
            pie = await this.getPieByName(name);
          } catch (caughtError) {
            error = caughtError;
          }
          break;
        case address !== undefined:
          try {
            pie = await this.getPieByAddress(address);
          } catch (caughtError) {
            error = caughtError;
          }
          break;
        default:
          error = 'either a Pie-Name or a Pie-Address must be provided';
      }

      if (pie) {
        const history = await this.getPieHistoryDetails(
          pie,
          order,
          from,
          to,
          limit,
        );
        delete pie.history;
        resolve({ history: history, pie: pie });
      } else {
        reject(error);
      }
    });
  }

  getPieHistoryDetails(
    pie: PieEntity,
    order: 'descending' | 'ascending',
    from: string,
    to: string,
    limit: number,
  ): Promise<PieHistoryEntity[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const filters = {
          _id: { $in: pie.history },
        };

        if (from || to) {
          if (from && to) {
            filters['timestamp'] = { $gte: from, $lte: to };
          } else {
            if (from) {
              filters['timestamp'] = { $gte: from };
            }

            if (to) {
              filters['timestamp'] = { $lte: to };
            }
          }
        }

        const pieHistories = this.pieHistoryModel
          .find(filters)
          .sort({ timestamp: order })
          .limit(Number(limit))
          .lean();

        resolve(pieHistories);
      } catch (error) {
        reject(error);
      }
    });
  }

  //! TODO: 👇 something is fishy in these methods as these operations doesn't return a promise!
  getPieByAddress(address: string): Promise<PieEntity> {
    return new Promise(async (resolve, reject) => {
      const pies = await this.pieModel
        .find()
        .where('address')
        .equals(address)
        .lean();

      if (pies[0]) {
        resolve(pies[0]);
      } else {
        reject(
          "Sorry, can't find any Pie in our database which matches your query.",
        );
      }
    });
  }

  getPieByName(name: string): Promise<PieEntity> {
    return new Promise(async (resolve, reject) => {
      const pies = await this.pieModel.find().where('name').equals(name).lean();

      if (pies[0]) {
        resolve(pies[0]);
      } else {
        reject(
          "Sorry, can't find any Pie in our database which matches your query.",
        );
      }
    });
  }

  createPie(pie: PieDto): Promise<PieEntity> {
    return new Promise(async (resolve, reject) => {
      try {
        pie.address = pie.address.toLocaleLowerCase();

        const createdPie = new this.pieModel(pie);
        const pieDB = await createdPie.save();

        resolve(pieDB);
      } catch (error) {
        reject(error);
      }
    });
  }

  deletePie(pie: PieEntity): Promise<PieEntity> {
    return new Promise(async (resolve, reject) => {
      try {
        const pieDB = await this.pieModel.findOneAndDelete({
          address: pie.address.toLocaleLowerCase(),
        });
        resolve(pieDB);
      } catch (error) {
        reject(error);
      }
    });
  }
}
