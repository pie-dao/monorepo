import { Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ethers } from 'ethers';
import * as moment from 'moment';
import * as ethDater from 'ethereum-block-by-date';
import { EpochDocument, EpochEntity } from './entities/epoch.entity';
import { MerkleTreeDistributor } from '../helpers/merkleTreeDistributor/merkleTreeDistributor';
import { Staker, Lock } from './types/staking.types.Staker';
import { Vote } from './types/staking.types.Vote';
import { FreeRider } from './types/staking.types.FreeRider';
import { Participation } from './types/staking.types.Participation';
import { Delegate } from './types/staking.types.Delegate';
import * as lodash from 'lodash';
import * as pieABI from './abis/Pie.json';
import { Console, Command, createSpinner } from 'nestjs-console';
import * as inquirer from 'inquirer';

@Injectable()
@Console()
export class StakingService {
  private SLICE_ADDRESS = ethers.utils.getAddress('0x1083D743A1E53805a95249fEf7310D75029f7Cd6');
  private snapshotSpaceID = process.env.SNAPSHOT_SPACE_ID;
  private graphUrl = process.env.GRAPH_URL;
  private snapshotUrl = 'https://hub.snapshot.org/graphql';
  private ethProvider = process.env.INFURA_RPC;

  constructor(
    private httpService: HttpService,
    @InjectModel(EpochEntity.name) private epochModel: Model<EpochDocument>,
  ) {}

  @Command({
    command: 'generate-epoch',
    description: 'Generate a new Epoch using CLI.'
  })
  async generateEpochCommand(): Promise<void> {
    let params = await inquirer.prompt([
      {
        type: 'input',
        name: 'month',
        message: 'Which is the month (number) you want to generate the epoch for?',
      },
      {
        type: 'input',
        name: 'year',
        message: 'Which is the year you want to generate the epoch for?',
      },      
      {
        type: 'input',
        name: 'distributedRewards',
        message: 'How many rewards you want to distribute?',
      },
      {
        type: 'input',
        name: 'windowIndex',
        message: 'Which will be the windowIndex for this epoch?',
      },
      {
        type: 'input',
        name: 'prevWindowIndex',
        message: 'Which will be the previous WindowIndex for this epoch?',
        default: params => params.windowIndex - 1
      },
      {
        type: 'input',
        name: 'blockNumber',
        message: 'Which will be the blockNumber for this epoch?',
      }, 
      {
        type: 'input',
        name: 'proposals',
        message: 'What are the proposal Ids (comma separated string, or empty for use them all)?',
      },           
    ]);

    try {
      if(params.month === undefined || params.year === undefined || params.distributedRewards === undefined || params.windowIndex === undefined || params.blockNumber === undefined) {
        console.error("month / year / distributedRewards / windowIndex / blockNumber are mandatory params.");
      }

      const spin = createSpinner();
      spin.start(`Generating the epoch...`);

      /* istanbul ignore next */
      let proposalsIds = params.proposals ? params.proposals.split(",").map(id => '"' + id + '"') : null;
      
      let epoch = await this.generateEpoch(
        params.month,
        params.year, 
        params.distributedRewards, 
        params.windowIndex, 
        params.prevWindowIndex, 
        params.blockNumber, 
        proposalsIds
      );

      spin.succeed('Epoch has been generated!!');
    } catch(error) {
      console.log(error);
    }
  }

  setEthProvider(provider: string): void {
    this.ethProvider = provider;
  }

  getEthProvider(): string {
    return this.ethProvider;
  }

  setSnapshotUrl(url: string): void {
    this.snapshotUrl = url;
  }

  getSnapshotUrl(): string {
    return this.snapshotUrl;
  }

  // TODO: we shall add pagination here...
  getEpochs(startDate?: number): Promise<Array<EpochEntity>> {
    return new Promise(async (resolve, reject) => {
      try {
        let epochsDB = null;

        if (startDate) {
          epochsDB = await this.epochModel
            .find({ startDate: { $gte: startDate } })
            .lean();
        } else {
          epochsDB = await this.epochModel
            .find()
            .lean();
        }

        if (epochsDB.length) {
          resolve(epochsDB);
        } else {
          throw new NotFoundException('Sorry, no epochs has been founded on our database.');
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  getEpoch(windowIndex?: number): Promise<EpochEntity> {
    return new Promise(async (resolve, reject) => {
      try {
        let epochDB = null;

        if (windowIndex) {
          epochDB = await this.epochModel
            .findOne({ 'merkleTree.windowIndex': windowIndex })
            .lean();
        } else {
          epochDB = await this.epochModel
            .findOne()
            .sort({ _id: -1 })
            .lean();
        }

        if (epochDB) {
          resolve(epochDB);
        } else {
          throw new NotFoundException("Sorry, can't find any epoch with this id.")
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  getStakers(ids?: Array<string>, blockNumber?: number, condition?: string): Promise<Staker[]> {
    return new Promise(async (resolve, reject) => {
      try {
        let lastID = "";
        let blocks = 1000;
        let stakers = [];

        let holders = await this.fetchStakers(blocks, lastID, ids, condition, blockNumber);

        while (holders.length > 0) {
          stakers = stakers.concat(holders);
          holders = await this.fetchStakers(blocks, holders[holders.length - 1].id, ids, condition, blockNumber);
        }

        resolve(stakers);
      } catch (error) {
        /* istanbul ignore next */
        reject(error);
      }
    });
  }

  getRewards(windowIndex: number): Promise<any[]> {
    return new Promise(async (resolve, reject) => {
      try {
        let lastID = "";
        let blocks = 1000;
        let rewards = [];

        let claimedRewards = await this.fetchRewards(blocks, lastID, windowIndex);

        /* istanbul ignore next */
        while (claimedRewards.length > 0) {
          rewards = rewards.concat(claimedRewards);
          claimedRewards = await this.fetchRewards(blocks, claimedRewards[claimedRewards.length - 1].id, windowIndex);
        }

        resolve(rewards);
      } catch (error) {
        /* istanbul ignore next */
        reject(error);
      }
    });
  }

  getLocks(lockedAt?: string, ids?: Array<string>): Promise<Lock[]> {
    return new Promise(async (resolve, reject) => {
      try {
        let lastID = "";
        let blocks = 1000;
        let locks = [];

        if (!lockedAt) {
          let date = new Date();
          lockedAt = Math.floor(Number(date) / 1000).toString();
        }

        let stakersLocks = await this.fetchLocks(blocks, lastID, lockedAt, ids);

        while (stakersLocks.length > 0) {
          locks = locks.concat(stakersLocks);
          stakersLocks = await this.fetchLocks(blocks, stakersLocks[stakersLocks.length - 1].id, lockedAt, ids);
        }

        resolve(locks);
      } catch (error) {
        reject(error);
      }
    });
  }

  getDelegates(): Promise<Delegate[]> {
    return new Promise(async (resolve, reject) => {
      try {
        let lastID = "";
        let blocks = 1000;
        let delegates = [];

        let delegatesArray = await this.fetchDelegates(blocks, lastID);

        while (delegatesArray.length > 0) {
          delegates = delegates.concat(delegatesArray);
          delegatesArray = await this.fetchDelegates(blocks, delegatesArray[delegatesArray.length - 1].id);
        }

        resolve(delegates);
      } catch (error) {
        /* istanbul ignore next */
        reject(error);
      }
    });
  }

  getParticipations(votes: Vote[], blockNumber: number): Promise<Participation[]> {
    return new Promise(async (resolve, reject) => {
      try {
        if (votes && votes.length == 0) {
          throw new NotFoundException("sorry, votes can't be an empty array");
        }

        // retrieving the stakers from our subgraph...
        let stakers = await this.getStakers(null, blockNumber, null);

        // generating the participations...
        const participations = [];

        stakers.forEach(staker => {
          let stakerVotes: Vote[] = votes.filter(vote => vote.voter.toLowerCase() == staker.id);
          let participation = stakerVotes.length ? 1 : 0;

          let element: Participation = {
            address: staker.id,
            participation: participation,
            staker: staker,
            votes: stakerVotes,
            delegatedTo: undefined
          };

          participations.push(element);
        });

        // retrieving the delegators...
        let delegates: Delegate[] = await this.getDelegates();
        // including the delegtors into participations...
        let participationsIncludesDelegates = this.includeDelegates(participations, delegates);
        resolve(participationsIncludesDelegates);
      } catch (error) {
        reject(error);
      }
    });
  }

  getFreeRiders(month: number, blockNumber: number, proposalsIds: Array<string>): Promise<FreeRider[]> {
    return new Promise(async (resolve, reject) => {
      try {
        // fetching all votes from snapshot in the last 3 months...
        let from = moment({ year: moment().year(), month: month - 4, day: 1 });
        let to = moment({ year: moment().year(), month: month - 1, day: 1 }).endOf('month');

        let votes = await this.getSnapshotVotes(from.unix(), to.unix(), proposalsIds);

        // getting all voters addresses from snapshot's votes...
        let voters = await this.getVotersFromShapshotVotes(votes, blockNumber);

        // fetching all the stakers which have NOT voted in the last 3 months...
        let stakers = await this.getStakers(voters, blockNumber, 'id_not_in');

        // creating the freeRiders dataStruct...
        let votedTimeRange = this.generateBackmonthTimestamp(3, false);
        let freeRiders = [];

        stakers.forEach(staker => {
          let oldestLock = this.getOldestLock(staker.accountLocks);

          let isFreeRider = false;

          /* istanbul ignore next */
          if (oldestLock && oldestLock.lockedAt < votedTimeRange) {
            console.log("staker", staker.id, oldestLock.lockedAt, votedTimeRange);
            isFreeRider = true;
          }

          let freeRider = {
            id: staker.id,
            isFreeRider: isFreeRider,
            oldestLock: oldestLock,
            stakingData: staker
          } as FreeRider

          freeRiders.push(freeRider);
        });

        resolve(freeRiders);
      } catch (error) {
        /* istanbul ignore next */
        reject(error);
      }
    });
  }

  generateEpoch(
    month: number,
    year: number,
    distributedRewards: string,
    windowIndex: number,
    prevWindowIndex: number,
    blockNumber: number,
    proposalsIds: Array<string>
  ): Promise<EpochEntity> {
    return new Promise(async (resolve, reject) => {
      try {
        // fetching all votes from snapshot in the last month...
        let from = moment({ year: year, month: month - 1, day: 1 });
        let to = from.clone().endOf('month');

        let votes: Vote[] = await this.getSnapshotVotes(from.unix(), to.unix(), proposalsIds);

        let previousEpoch: EpochEntity = null;
        let rewards: any[] = [];

        if (prevWindowIndex !== undefined && prevWindowIndex >= 0) {
          // retrieving previous epoch from database...
          previousEpoch = await this.getEpoch(prevWindowIndex);
          // genereting the rewards array...
          rewards = await this.getRewards(prevWindowIndex);
        }

        // generating the participations...
        let participations: Participation[] = await this.getParticipations(votes, blockNumber);
        // generating the merkleTreeDistribution...
        let merkleTreeDistributor = new MerkleTreeDistributor();
        const merkleTree = await merkleTreeDistributor.generateMerkleTree(
          distributedRewards,
          windowIndex,
          participations,
          previousEpoch,
          rewards
        );
        // finally, saving the epoch into database...
        let epoch = await this.saveEpoch(participations, merkleTree, votes, rewards, from.unix(), to.unix(), blockNumber);
        /* istanbul ignore next */
        resolve(epoch);
      } catch (error) {
        reject(error);
      }
    });
  }

  private saveEpoch(
    participations: Array<Participation>,
    merkleTree: Object,
    votes: Vote[],
    rewards: any[],
    startDate: number,
    endDate: number,
    blockNumber: number
  ): Promise<EpochEntity> {
    return new Promise(async (resolve, reject) => {
      try {
        const provider = new ethers.providers.JsonRpcProvider(this.ethProvider);
        const ethDaterHelper = new ethDater(provider);

        let startBlock = await ethDaterHelper.getDate(
          startDate * 1000,
          true
        );

        let endBlock = await ethDaterHelper.getDate(
          endDate * 1000,
          true
        );

        const epochModel = new this.epochModel();
        epochModel.startDate = startDate;
        epochModel.endDate = endDate;
        epochModel.startBlock = startBlock.block;
        epochModel.endBlock = endBlock.block;
        epochModel.merkleTree = merkleTree;
        epochModel.rewards = rewards;
        epochModel.participants = await this.getVotersFromShapshotVotes(votes, blockNumber);
        epochModel.proposals = this.getProposalsFromParticipations(participations);
        epochModel.stakingStats = lodash.get(await this.fetchstakingStats(1, blockNumber), 0);
        epochModel.slice = await this.getSliceBreakdown();

        let epochDB = await epochModel.save();
        resolve(epochDB);

      } catch (error) {
        reject(error);
      }
    });
  }

  getSliceBreakdown(): Promise<any> {
    return new Promise(async(resolve, reject) => {
      try {
        const provider = new ethers.providers.JsonRpcProvider(process.env.INFURA_RPC);
        let rewardsContract = new ethers.Contract(this.SLICE_ADDRESS, pieABI, provider);

        let decimals = await rewardsContract.decimals();
        let totalSupply = await rewardsContract.totalSupply();
        let tokens = await rewardsContract.calcTokensForAmount(totalSupply.toString());
        let underlying = [];

        for(let i = 0; i < tokens.length; i += 2) {
          let underlyingAddress = lodash.get(tokens[i], 0).toLowerCase();
          let underlyingContract = new ethers.Contract(underlyingAddress, pieABI, provider);

          underlying.push({
            address: underlyingAddress,
            amount: tokens[i+1].toString(),
            symbol: await underlyingContract.symbol(),
            decimals: await underlyingContract.decimals(),
            price: 0
          });
        };

        let assets = underlying.map(asset => asset.address).join(',');

        let url = `https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${assets}&vs_currencies=usd`;
        let response = await this.httpService.get(url).toPromise();
        let prices = response.data;
        let marketCapUSD = 0;

        Object.keys(prices).forEach(address => {
          let underlyingAsset = underlying.find(asset => asset.address == address);
          underlyingAsset.price = prices[address];

          let underlyingMarketCapUSD = parseFloat(underlyingAsset.amount) * underlyingAsset.price.usd;
          marketCapUSD += underlyingMarketCapUSD;
        });

        resolve({
          nav: parseFloat((marketCapUSD / parseFloat(totalSupply.toString())).toFixed(2)),
          totalSupply: totalSupply.toString(),
          decimals: decimals,
          symbol: await rewardsContract.symbol(),
          underlying: underlying
        });
      } catch(error) {
        /* istanbul ignore next */
        reject(error);
      }
    });
  }

  private includeDelegates(entries: Participation[], delegates: Delegate[]): Participation[] {
    entries.forEach(entry => {
      entry.address = ethers.utils.getAddress(entry.address);
    });

    let mappedDelegates = {};
    delegates.forEach(entry => {
      mappedDelegates[ethers.utils.getAddress(entry.delegate)] = ethers.utils.getAddress(entry.delegator);
    });

    let mappedEntries = {};
    entries.forEach(entry => {
      mappedEntries[entry.address] = entry;
    });

    Object.keys(mappedDelegates).forEach(delegate_address => {
      /* istanbul ignore next */
      if (mappedEntries[delegate_address].participation == 1) {
        mappedEntries[mappedDelegates[delegate_address]].participation = 1;
        mappedEntries[mappedDelegates[delegate_address]].delegatedTo = delegate_address;
        mappedEntries[mappedDelegates[delegate_address]].votes = mappedEntries[delegate_address].votes;
      }
    });

    entries = Object.keys(mappedEntries).map(key => mappedEntries[key]);
    return entries;
  }

  private fetchDelegates(blocks: number, lastID: string): Promise<Delegate[]> {
    return new Promise(async (resolve, reject) => {
      try {
        let query = `{
          delegates(first: ${blocks}, where: {id_gt: "${lastID}"}) {
            id
            delegator
            delegate
          }
        }`;

        let response = await this.httpService.post(
          this.graphUrl,
          {
            query: query
          }
        ).toPromise();

        resolve(response.data.data.delegates);
      } catch (error) {
        /* istanbul ignore next */
        reject(error);
      }
    })
  }

  private fetchLocks(blocks: number, lastID: string, lockedAt?: string, ids?: Array<string>): Promise<Lock[]> {
    return new Promise(async (resolve, reject) => {
      try {
        let query = null;

        if (ids) {
          query = `{
            locks(first: ${blocks}, where: {id_gt: "${lastID}", lockedAt_lt: ${lockedAt}, staker_in: [${ids}]}) {
              id
              lockDuration
              lockedAt
              amount
              lockId
              withdrawn
              staker {
                id
                accountVeTokenBalance
                accountWithdrawableRewards
                accountWithdrawnRewards
              }
            }
          }`;
        } else {
          query = `{
            locks(first: ${blocks}, where: {id_gt: "${lastID}", lockedAt_lt: ${lockedAt}}) {
              id
              lockDuration
              lockedAt
              amount
              lockId
              withdrawn
              staker {
                id
                accountVeTokenBalance
                accountWithdrawableRewards
                accountWithdrawnRewards
              }
            }
          }`;
        }

        let response = await this.httpService.post(
          this.graphUrl,
          {
            query: query
          }
        ).toPromise();

        resolve(response.data.data.locks);
      } catch (error) {
        reject(error);
      }
    })
  }

  private fetchStakers(blocks: number, lastID: string, ids?: Array<string>, condition?: string, blockNumber?: number): Promise<Staker[]> {
    return new Promise(async (resolve, reject) => {
      try {
        /* istanbul ignore next */
        if (!condition) {
          condition = 'id_in';
        }

        let query = `{
          stakers(first: ${blocks}, `;

        if (blockNumber) {
          query += `, block: {number: ${blockNumber}}`;
        }

        query += `, where: {id_gt: "${lastID}"`;
        
        /* istanbul ignore next */
        if (ids) {
          query += `, ${condition}: [${ids.map(id => '"' + id + '"')}]`;
        }

        query += `}) {
            id
            accountVeTokenBalance
            accountWithdrawableRewards
            accountWithdrawnRewards
            accountLocks {
              id
              lockId
              lockDuration
              lockedAt
              amount
              withdrawn
              ejected
              boosted
            }
            accountRewards {
              id
              timestamp
              amount
              type
            }
          }
        }`;

        let response = await this.httpService.post(
          this.graphUrl,
          {
            query: query
          }
        ).toPromise();

        resolve(response.data.data.stakers);
      } catch (error) {
        /* istanbul ignore next */
        reject(error);
      }
    })
  }

  private fetchstakingStats(blocks: number, blockNumber: number): Promise<Staker[]> {
    return new Promise(async (resolve, reject) => {
      try {
        let query = `{
          globalStats(
            first: ${blocks}, 
            orderBy: timestamp, 
            orderDirection: desc,
            block: {number: ${blockNumber}}
          ) {
            id
            depositedLocksCounter
            depositedLocksValue
            withdrawnLocksCounter
            withdrawnLocksValue
            ejectedLocksCounter
            ejectedLocksValue
            boostedLocksCounter
            boostedLocksValue
            averageTimeLock
            totalDoughStaked
            veTokenTotalSupply
            stakersCounter
            timestamp
          }
        }`;

        let response = await this.httpService.post(
          this.graphUrl,
          {
            query: query
          }
        ).toPromise();

        resolve(response.data.data.globalStats);
      } catch (error) {
        /* istanbul ignore next */
        reject(error);
      }
    })
  }

  private fetchRewards(blocks: number, lastID: string, windowIndex: number): Promise<Staker[]> {
    return new Promise(async (resolve, reject) => {
      try {
        let query = `{
          rewards(
            first: ${blocks}, 
            where: {id_gt: "${lastID}", windowIndex: ${windowIndex}}) {
              id
              timestamp
              amount
              account
              rewardToken
              windowIndex
              accountIndex
              type
          }
        }`;

        let response = await this.httpService.post(
          this.graphUrl,
          {
            query: query
          }
        ).toPromise();

        resolve(response.data.data.rewards);
      } catch (error) {
        /* istanbul ignore next */
        reject(error);
      }
    })
  }

  private getSnapshotVotes(from: number, to: number, proposalsIds: Array<string>): Promise<Vote[]> {
    return new Promise(async (resolve, reject) => {
      try {
        let blocks = 1000;
        let skip = 0;
        let snapshotVotes = [];

        let votes = await this.fetchSnapshotVotes(from, to, blocks, skip, proposalsIds);

        while (votes.length > 0) {
          snapshotVotes = snapshotVotes.concat(votes);
          skip += blocks;
          votes = await this.fetchSnapshotVotes(from, to, blocks, skip, proposalsIds);
        }

        resolve(snapshotVotes);
      } catch (error) {
        /* istanbul ignore next */
        reject(error);
      }
    });
  }

  private fetchSnapshotVotes(from, to, blocks, skip, proposalsIds): Promise<Vote[]> {
    return new Promise(async (resolve, reject) => {
      try {
        /* istanbul ignore next */
        let proposalsIdsString = proposalsIds ? proposalsIds.join(",") : '';

        let response = await this.httpService.post(
          this.snapshotUrl,
          {
            query: `{
              votes (
                first: ${blocks},
                skip: ${skip},
                where: {
                  space: "${this.snapshotSpaceID}"
                  created_gte: ${from}
                  created_lte: ${to}
                  proposal_in: [${proposalsIdsString}]
                }
              ) {
                id
                voter
                created
                vp
                proposal {
                  id
                  created
                  state
                  snapshot
                  title
                  link
                  choices               
                }
                choice
                space {
                  id
                }
              }
            }`
          }
        ).toPromise();

        resolve(response.data.data.votes.filter(vote => {
          /* istanbul ignore next */
          if (vote.proposal.state == 'closed') {
            return vote;
          }
        }));
      } catch (error) {
        /* istanbul ignore next */
        reject(error);
      }
    });
  }

  /* istanbul ignore next */
  private generateBackmonthTimestamp(months: number, milliseconds: boolean): number {
    let date = new Date();
    date.setMonth(date.getMonth() - months);

    /* istanbul ignore next */
    if (milliseconds) {
      return Number(date);
    } else {
      return Math.floor(Number(date) / 1000);
    }
  }

  private getProposalsFromParticipations(participations: Array<any>): Array<string> {
    let proposals = [];

    participations.forEach(staker => {
      staker.votes.forEach(vote => {
        let exists = proposals.find(proposal => proposal.id == vote.proposal.id);

        if (!exists) {
          let proposal = {
            id: vote.proposal.id,
            snapshot: vote.proposal.snapshot,
            title: vote.proposal.title,
            url: vote.proposal.link
          };

          proposals.push(proposal);
        }
      });
    });

    // removing duplicates from the proposals array...
    proposals = proposals.sort().filter(function (item, pos, ary) {
      return !pos || item != ary[pos - 1];
    });

    return proposals;
  }

  private async getVotersFromShapshotVotes(votes: Array<any>, blockNumber: number): Promise<Array<string>> {
    // creating an array of voters...
    let voters = Array.from(votes, vote => vote.voter.toLowerCase());
    // removing duplicates from the voters array...
    voters = Array.from(new Set(voters)).sort();
    // retrieving the delegations...
    let delegations = await this.getDelegates();
    // adding the delegator into the participants...
    delegations.forEach(delegation => {
      if (voters.includes(delegation.delegate)) {
        /* istanbul ignore next */
        voters.push(delegation.delegator);
      }
    });
    // creating the final voters struct...
    let votersStruct = [];

    voters.forEach(voter => {
      let votesArray = votes.filter(vote => vote.voter.toLowerCase() == voter);

      votersStruct.push({
        address: voter,
        votes: votesArray.map(vote => {
          return {
            proposal: vote.proposal.id,
            vote: vote.proposal.choices[vote.choice - 1],
            score: vote.vp
          }
        })
      });
    });

    return votersStruct;
  }

  /* istanbul ignore next */
  private getOldestLock(locks: Array<any>): any {
    let oldestTimestamp = this.generateBackmonthTimestamp(0, false);
    let oldestLock = null;

    locks.forEach(lock => {
      /* istanbul ignore next */
      if (lock.lockedAt < oldestTimestamp) {
        oldestTimestamp = lock.lockedAt;
        oldestLock = lock;
      }
    });

    return oldestLock;
  }
}
