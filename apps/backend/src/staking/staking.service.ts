import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as ethDater from 'ethereum-block-by-date';
import { ethers } from 'ethers';
import * as inquirer from 'inquirer';
import * as lodash from 'lodash';
import * as moment from 'moment';
import { Model } from 'mongoose';
import { Command, Console, createSpinner } from 'nestjs-console';
import { MerkleTreeDistributor } from '../helpers/merkleTreeDistributor/merkleTreeDistributor';
import { pieAbi as pieABI } from './abis';
import { EpochDocument, EpochEntity } from './entities/epoch.entity';
import { antoEpoch, totoEpoch } from './test/stubs';
import { Delegate } from './types/staking.types.Delegate';
import { Participation } from './types/staking.types.Participation';
import { Lock, Staker } from './types/staking.types.Staker';
import { Vote } from './types/staking.types.Vote';
@Injectable()
@Console()
export class StakingService {
  private SLICE_ADDRESS = ethers.utils.getAddress(
    '0x1083D743A1E53805a95249fEf7310D75029f7Cd6',
  );
  private snapshotSpaceID = process.env.SNAPSHOT_SPACE_ID;
  private graphUrl = process.env.GRAPH_URL;
  private snapshotUrl = 'https://hub.snapshot.org/graphql';
  private ethProvider = process.env.INFURA_RPC;

  constructor(
    private httpService: HttpService,
    @InjectModel(EpochEntity.name) private epochModel: Model<EpochDocument>,
  ) {}

  @Command({
    command: 'cross-check-epochs',
    description: 'Cross Check Epochs Nestjs/Python.',
  })
  async crossCheckEpochs(): Promise<void> {
    Object.keys(totoEpoch['merkleTree']['claims']).forEach((address) => {
      const antoClaim = antoEpoch['claims'][ethers.utils.getAddress(address)];
      const totoClaim = totoEpoch['merkleTree']['claims'][address];

      if (totoClaim.amount != antoClaim.amount) {
        console.log(address, totoClaim.amount, antoClaim.amount);
      }
    });

    return;
  }

  @Command({
    command: 'generate-epoch',
    description: 'Generate a new Epoch using CLI.',
  })
  async generateEpochCommand(): Promise<void> {
    const params = await inquirer.prompt([
      {
        type: 'input',
        name: 'month',
        message:
          'Which is the month (number) you want to generate the epoch for?',
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
        default: (params) => params.windowIndex - 1,
      },
      {
        type: 'input',
        name: 'blockNumber',
        message: 'Which will be the blockNumber for this epoch?',
      },
      {
        type: 'input',
        name: 'proposals',
        message:
          'What are the proposal Ids you wish to EXCLUDE (comma separated string, or empty to include them all)?',
      },
    ]);

    try {
      if (
        params.month === undefined ||
        params.year === undefined ||
        params.distributedRewards === undefined ||
        params.windowIndex === undefined ||
        params.blockNumber === undefined
      ) {
        console.error(
          'month / year / distributedRewards / windowIndex / blockNumber are mandatory params.',
        );
      }

      const spin = createSpinner();
      spin.start(`Generating the epoch...`);

      /* istanbul ignore next */
      const proposalsIds = params.proposals
        ? params.proposals.split(',')
        : null; // .map(id => '"' + id + '"')

      const epoch = await this.generateEpoch(
        params.month,
        params.year,
        params.distributedRewards,
        params.windowIndex,
        params.prevWindowIndex,
        params.blockNumber,
        proposalsIds,
      );

      spin.succeed('Epoch has been generated!!');
    } catch (error) {
      console.error(error);
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
  async getEpochs(startDate?: number): Promise<Array<EpochEntity>> {
    let epochsDB = null;

    if (startDate) {
      epochsDB = await this.epochModel
        .find({ startDate: { $gte: startDate } })
        .lean()
        .exec();
    } else {
      epochsDB = await this.epochModel.find().lean().exec();
    }

    if (epochsDB.length) {
      return epochsDB;
    } else {
      throw new NotFoundException(
        'Sorry, no epochs has been founded on our database.',
      );
    }
  }

  async getEpoch(windowIndex?: number): Promise<EpochEntity> {
    let epochDB = null;

    if (windowIndex) {
      epochDB = await this.epochModel
        .findOne({ 'merkleTree.windowIndex': windowIndex })
        .lean()
        .exec();
    } else {
      epochDB = await this.epochModel.findOne().sort({ _id: -1 }).lean().exec();
    }

    if (epochDB) {
      return epochDB;
    } else {
      throw new NotFoundException("Sorry, can't find any epoch with this id.");
    }
  }

  async getStakers(
    ids?: Array<string>,
    blockNumber?: number,
    condition?: string,
  ): Promise<Staker[]> {
    const lastID = '';
    const blocks = 1000;
    let stakers = [];

    let holders = await this.fetchStakers(
      blocks,
      lastID,
      ids,
      condition,
      blockNumber,
    );

    while (holders.length > 0) {
      stakers = stakers.concat(holders);
      holders = await this.fetchStakers(
        blocks,
        holders[holders.length - 1].id,
        ids,
        condition,
        blockNumber,
      );
    }

    return stakers;
  }

  async getRewards(windowIndex: number): Promise<any[]> {
    const lastID = '';
    const blocks = 1000;
    let rewards = [];

    let claimedRewards = await this.fetchRewards(blocks, lastID, windowIndex);

    /* istanbul ignore next */
    while (claimedRewards.length > 0) {
      rewards = rewards.concat(claimedRewards);
      claimedRewards = await this.fetchRewards(
        blocks,
        claimedRewards[claimedRewards.length - 1].id,
        windowIndex,
      );
    }

    return rewards;
  }

  async getLocks(lockedAt?: string, ids?: Array<string>): Promise<Lock[]> {
    const lastID = '';
    const blocks = 1000;
    let locks = [];

    if (!lockedAt) {
      const date = new Date();
      lockedAt = Math.floor(Number(date) / 1000).toString();
    }

    let stakersLocks = await this.fetchLocks(blocks, lastID, lockedAt, ids);

    while (stakersLocks.length > 0) {
      locks = locks.concat(stakersLocks);
      stakersLocks = await this.fetchLocks(
        blocks,
        stakersLocks[stakersLocks.length - 1].id,
        lockedAt,
        ids,
      );
    }

    return locks;
  }

  async getDelegates(): Promise<Delegate[]> {
    const lastID = '';
    const blocks = 1000;
    let delegates = [];

    let delegatesArray = await this.fetchDelegates(blocks, lastID);

    while (delegatesArray.length > 0) {
      delegates = delegates.concat(delegatesArray);
      delegatesArray = await this.fetchDelegates(
        blocks,
        delegatesArray[delegatesArray.length - 1].id,
      );
    }

    return delegates;
  }

  async getParticipations(
    votes: Vote[],
    blockNumber: number,
  ): Promise<Participation[]> {
    if (votes && votes.length == 0) {
      throw new NotFoundException("sorry, votes can't be an empty array");
    }

    // retrieving the stakers from our subgraph...
    const stakers = await this.getStakers(null, blockNumber, null);

    // generating the participations...
    const participations = [];

    stakers.forEach((staker) => {
      const stakerVotes: Vote[] = votes.filter(
        (vote) => vote.voter.toLowerCase() == staker.id.toLowerCase(),
      );
      const participation = stakerVotes.length ? 1 : 0;

      const element: Participation = {
        address: staker.id,
        participation: participation,
        staker: staker,
        votes: stakerVotes,
        delegatedTo: undefined,
      };

      participations.push(element);
    });

    // retrieving the delegators...
    const delegates: Delegate[] = await this.getDelegates();
    // including the delegtors into participations...
    return this.includeDelegates(participations, delegates);
  }

  async generateEpoch(
    month: number,
    year: number,
    distributedRewards: string,
    windowIndex: number,
    prevWindowIndex: number,
    blockNumber: number,
    proposalsIds: Array<string>,
  ): Promise<EpochEntity> {
    // fetching all votes from snapshot in the last month...
    const from = moment({ year: year, month: month - 1, day: 1 });
    const to = from.clone().endOf('month');
    const votes: Vote[] = await this.getSnapshotVotes(
      from.unix(),
      to.unix(),
      proposalsIds,
      'not_in',
    );

    let previousEpoch: EpochEntity = null;
    let rewards: any[] = [];

    if (prevWindowIndex !== undefined && prevWindowIndex >= 0) {
      // retrieving previous epoch from database...
      previousEpoch = await this.getEpoch(prevWindowIndex);
      // genereting the rewards array...
      rewards = await this.getRewards(prevWindowIndex);
    }

    // generating the participations...
    const participations: Participation[] = await this.getParticipations(
      votes,
      blockNumber,
    );
    // generating the merkleTreeDistribution...
    const merkleTreeDistributor = new MerkleTreeDistributor();
    const merkleTree = await merkleTreeDistributor.generateMerkleTree(
      distributedRewards,
      windowIndex,
      participations,
      previousEpoch,
      rewards,
    );
    return this.saveEpoch(
      participations,
      merkleTree,
      votes,
      rewards,
      from.unix(),
      to.unix(),
      blockNumber,
    );
  }

  private async saveEpoch(
    participations: Array<Participation>,
    merkleTree: Record<string, any>,
    votes: Vote[],
    rewards: any[],
    startDate: number,
    endDate: number,
    blockNumber: number,
  ): Promise<EpochEntity> {
    const provider = new ethers.providers.JsonRpcProvider(this.ethProvider);
    const ethDaterHelper = new ethDater(provider);

    const startBlock = await ethDaterHelper.getDate(startDate * 1000, true);

    const endBlock = await ethDaterHelper.getDate(endDate * 1000, true);

    const epochModel = new this.epochModel();
    epochModel.startDate = startDate;
    epochModel.endDate = endDate;
    epochModel.startBlock = startBlock.block;
    epochModel.endBlock = endBlock.block;
    epochModel.merkleTree = merkleTree;
    epochModel.rewards = rewards;
    epochModel.participants = await this.getVotersFromShapshotVotes(
      votes,
      blockNumber,
    );
    epochModel.proposals = this.getProposalsFromParticipations(participations);
    epochModel.stakingStats = lodash.get(
      await this.fetchstakingStats(1, blockNumber),
      0,
    );
    epochModel.slice = await this.getSliceBreakdown();

    return epochModel.save();
  }

  async getSliceBreakdown(): Promise<any> {
    const provider = new ethers.providers.JsonRpcProvider(
      process.env.INFURA_RPC,
    );
    const rewardsContract = new ethers.Contract(
      this.SLICE_ADDRESS,
      pieABI,
      provider,
    );

    const decimals = await rewardsContract.decimals();
    const totalSupply = await rewardsContract.totalSupply();
    const tokens = await rewardsContract.calcTokensForAmount(
      totalSupply.toString(),
    );
    const underlying = [];

    for (let i = 0; i < tokens.length; i += 2) {
      const underlyingAddress = lodash.get(tokens[i], 0).toLowerCase();
      const underlyingContract = new ethers.Contract(
        underlyingAddress,
        pieABI,
        provider,
      );

      underlying.push({
        address: underlyingAddress,
        amount: tokens[i + 1].toString(),
        symbol: await underlyingContract.symbol(),
        decimals: await underlyingContract.decimals(),
        price: 0,
      });
    }

    const assets = underlying.map((asset) => asset.address).join(',');

    const url = `https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${assets}&vs_currencies=usd`;
    const response = await this.httpService.get(url).toPromise();
    const prices = response.data;
    let marginalTVL = 0;

    Object.keys(prices).forEach((address) => {
      const underlyingAsset = underlying.find(
        (asset) => asset.address == address,
      );
      underlyingAsset.price = prices[address];

      const underlyingMarketCapUSD =
        parseFloat(underlyingAsset.amount) * underlyingAsset.price.usd;
      marginalTVL += underlyingMarketCapUSD;
    });

    return {
      nav: parseFloat(
        (marginalTVL / parseFloat(totalSupply.toString())).toFixed(2),
      ),
      totalSupply: totalSupply.toString(),
      decimals: decimals,
      symbol: await rewardsContract.symbol(),
      underlying: underlying,
    };
  }

  private includeDelegates(
    entries: Participation[],
    delegates: Delegate[],
  ): Participation[] {
    entries.forEach((entry) => {
      entry.address = ethers.utils.getAddress(entry.address);
    });

    const mappedDelegates = {};
    delegates.forEach((entry) => {
      mappedDelegates[ethers.utils.getAddress(entry.delegate)] =
        ethers.utils.getAddress(entry.delegator);
    });

    const mappedEntries = {};
    entries.forEach((entry) => {
      mappedEntries[entry.address] = entry;
    });

    Object.keys(mappedDelegates).forEach((delegate_address) => {
      /* istanbul ignore next */
      if (
        mappedEntries[delegate_address] &&
        mappedEntries[delegate_address].participation == 1
      ) {
        mappedEntries[mappedDelegates[delegate_address]].participation = 1;
        mappedEntries[mappedDelegates[delegate_address]].delegatedTo =
          delegate_address;
        mappedEntries[mappedDelegates[delegate_address]].votes =
          mappedEntries[delegate_address].votes;
      }
    });

    entries = Object.keys(mappedEntries).map((key) => mappedEntries[key]);
    return entries;
  }

  private async fetchDelegates(
    blocks: number,
    lastID: string,
  ): Promise<Delegate[]> {
    const query = `{
      delegates(first: ${blocks}, where: {id_gt: "${lastID}"}) {
        id
        delegator
        delegate
      }
    }`;

    const response = await this.httpService
      .post(this.graphUrl, {
        query: query,
      })
      .toPromise();

    return response.data.data.delegates;
  }

  private async fetchLocks(
    blocks: number,
    lastID: string,
    lockedAt?: string,
    ids?: Array<string>,
  ): Promise<Lock[]> {
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

    const response = await this.httpService
      .post(this.graphUrl, {
        query: query,
      })
      .toPromise();

    return response.data.data.locks;
  }

  private async fetchStakers(
    blocks: number,
    lastID: string,
    ids?: Array<string>,
    condition?: string,
    blockNumber?: number,
  ): Promise<Staker[]> {
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
      query += `, ${condition}: [${ids.map((id) => '"' + id + '"')}]`;
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

    const response = await this.httpService
      .post(this.graphUrl, {
        query: query,
      })
      .toPromise();

    return response.data.data.stakers;
  }

  private async fetchstakingStats(
    blocks: number,
    blockNumber: number,
  ): Promise<Staker[]> {
    const query = `{
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

    const response = await this.httpService
      .post(this.graphUrl, {
        query: query,
      })
      .toPromise();

    return response.data.data.globalStats;
  }

  private async fetchRewards(
    blocks: number,
    lastID: string,
    windowIndex: number,
  ): Promise<Staker[]> {
    const query = `{
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

    const response = await this.httpService
      .post(this.graphUrl, {
        query: query,
      })
      .toPromise();

    return response.data.data.rewards;
  }

  private async getSnapshotVotes(
    from: number,
    to: number,
    proposalsIds: Array<string>,
    condition: string,
  ): Promise<Vote[]> {
    const blocks = 1000;
    let skip = 0;
    let snapshotVotes = [];

    let votes = await this.fetchSnapshotVotes(
      from,
      to,
      blocks,
      skip,
      proposalsIds,
      condition,
    );

    while (votes.length > 0) {
      snapshotVotes = snapshotVotes.concat(votes);
      skip += blocks;
      votes = await this.fetchSnapshotVotes(
        from,
        to,
        blocks,
        skip,
        proposalsIds,
        condition,
      );
    }

    return snapshotVotes;
  }

  private async fetchSnapshotVotes(
    from,
    to,
    blocks,
    skip,
    proposalsIds,
    condition,
  ): Promise<Vote[]> {
    const proposalsIdsString = proposalsIds ? proposalsIds.join(',') : '';

    const response = await this.httpService
      .post(this.snapshotUrl, {
        query: `{
              votes (
                first: ${blocks},
                skip: ${skip},
                where: {
                  space: "${this.snapshotSpaceID}"
                  created_gte: ${from}
                  created_lte: ${to}
                  proposal_in: [${condition == 'in' ? proposalsIdsString : ''}]
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
            }`,
      })
      .toPromise();

    let votes = response.data.data.votes;

    if (proposalsIds && proposalsIds.length) {
      votes = votes.filter((vote) => {
        /* istanbul ignore next */
        if (
          // filtering out the proposal, excluding the ones we want to exclude...
          !proposalsIds.includes(vote.proposal.id)
        ) {
          return vote;
        }
      });
    }

    return votes;
  }

  /* istanbul ignore next */
  private generateBackmonthTimestamp(
    months: number,
    milliseconds: boolean,
  ): number {
    const date = new Date();
    date.setMonth(date.getMonth() - months);

    /* istanbul ignore next */
    if (milliseconds) {
      return Number(date);
    } else {
      return Math.floor(Number(date) / 1000);
    }
  }

  private getProposalsFromParticipations(
    participations: Array<any>,
  ): Array<string> {
    let proposals = [];

    participations.forEach((staker) => {
      staker.votes.forEach((vote) => {
        const exists = proposals.find(
          (proposal) => proposal.id == vote.proposal.id,
        );

        if (!exists) {
          const proposal = {
            id: vote.proposal.id,
            snapshot: vote.proposal.snapshot,
            title: vote.proposal.title,
            url: vote.proposal.link,
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

  private async getVotersFromShapshotVotes(
    votes: Array<any>,
    blockNumber: number,
  ): Promise<Array<string>> {
    // creating an array of voters...
    let voters = Array.from(votes, (vote) => vote.voter.toLowerCase());
    // removing duplicates from the voters array...
    voters = Array.from(new Set(voters)).sort();
    // retrieving the delegations...
    const delegations = await this.getDelegates();
    // adding the delegator into the participants...
    delegations.forEach((delegation) => {
      if (voters.includes(delegation.delegate)) {
        /* istanbul ignore next */
        voters.push(delegation.delegator);
      }
    });
    // creating the final voters struct...
    const votersStruct = [];

    voters.forEach((voter) => {
      const votesArray = votes.filter(
        (vote) => vote.voter.toLowerCase() == voter,
      );

      votersStruct.push({
        address: voter,
        votes: votesArray.map((vote) => {
          return {
            proposal: vote.proposal.id,
            vote: vote.proposal.choices[vote.choice - 1],
            score: vote.vp,
          };
        }),
      });
    });

    return votersStruct;
  }

  /* istanbul ignore next */
  private getOldestLock(locks: Array<any>): any {
    let oldestTimestamp = this.generateBackmonthTimestamp(0, false);
    let oldestLock = null;

    locks.forEach((lock) => {
      /* istanbul ignore next */
      if (lock.lockedAt < oldestTimestamp) {
        oldestTimestamp = lock.lockedAt;
        oldestLock = lock;
      }
    });

    return oldestLock;
  }
}
