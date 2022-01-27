"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StakingService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const ethers_1 = require("ethers");
const moment = require("moment");
const ethDater = require("ethereum-block-by-date");
const epoch_entity_1 = require("./entities/epoch.entity");
const merkleTreeDistributor_1 = require("../helpers/merkleTreeDistributor/merkleTreeDistributor");
const lodash = require("lodash");
const pieABI = require("./abis/Pie.json");
const nestjs_console_1 = require("nestjs-console");
const inquirer = require("inquirer");
let StakingService = class StakingService {
    constructor(httpService, epochModel) {
        this.httpService = httpService;
        this.epochModel = epochModel;
        this.SLICE_ADDRESS = ethers_1.ethers.utils.getAddress('0x1083D743A1E53805a95249fEf7310D75029f7Cd6');
        this.snapshotSpaceID = process.env.SNAPSHOT_SPACE_ID;
        this.graphUrl = process.env.GRAPH_URL;
        this.snapshotUrl = 'https://hub.snapshot.org/graphql';
        this.ethProvider = process.env.INFURA_RPC;
    }
    async generateEpochCommand() {
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
                message: 'What are the proposal Ids you wish to EXCLUDE (comma separated string, or empty to include them all)?',
            },
        ]);
        try {
            if (params.month === undefined || params.year === undefined || params.distributedRewards === undefined || params.windowIndex === undefined || params.blockNumber === undefined) {
                console.error("month / year / distributedRewards / windowIndex / blockNumber are mandatory params.");
            }
            const spin = nestjs_console_1.createSpinner();
            spin.start(`Generating the epoch...`);
            let proposalsIds = params.proposals ? params.proposals.split(",") : null;
            let epoch = await this.generateEpoch(params.month, params.year, params.distributedRewards, params.windowIndex, params.prevWindowIndex, params.blockNumber, proposalsIds);
            spin.succeed('Epoch has been generated!!');
        }
        catch (error) {
            console.error(error);
        }
    }
    setEthProvider(provider) {
        this.ethProvider = provider;
    }
    getEthProvider() {
        return this.ethProvider;
    }
    setSnapshotUrl(url) {
        this.snapshotUrl = url;
    }
    getSnapshotUrl() {
        return this.snapshotUrl;
    }
    getEpochs(startDate) {
        return new Promise(async (resolve, reject) => {
            try {
                let epochsDB = null;
                if (startDate) {
                    epochsDB = await this.epochModel
                        .find({ startDate: { $gte: startDate } })
                        .lean();
                }
                else {
                    epochsDB = await this.epochModel
                        .find()
                        .lean();
                }
                if (epochsDB.length) {
                    resolve(epochsDB);
                }
                else {
                    throw new common_1.NotFoundException('Sorry, no epochs has been founded on our database.');
                }
            }
            catch (error) {
                reject(error);
            }
        });
    }
    getEpoch(windowIndex) {
        return new Promise(async (resolve, reject) => {
            try {
                let epochDB = null;
                if (windowIndex) {
                    epochDB = await this.epochModel
                        .findOne({ 'merkleTree.windowIndex': windowIndex })
                        .lean();
                }
                else {
                    epochDB = await this.epochModel
                        .findOne()
                        .sort({ _id: -1 })
                        .lean();
                }
                if (epochDB) {
                    resolve(epochDB);
                }
                else {
                    throw new common_1.NotFoundException("Sorry, can't find any epoch with this id.");
                }
            }
            catch (error) {
                reject(error);
            }
        });
    }
    getStakers(ids, blockNumber, condition) {
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
            }
            catch (error) {
                reject(error);
            }
        });
    }
    getRewards(windowIndex) {
        return new Promise(async (resolve, reject) => {
            try {
                let lastID = "";
                let blocks = 1000;
                let rewards = [];
                let claimedRewards = await this.fetchRewards(blocks, lastID, windowIndex);
                while (claimedRewards.length > 0) {
                    rewards = rewards.concat(claimedRewards);
                    claimedRewards = await this.fetchRewards(blocks, claimedRewards[claimedRewards.length - 1].id, windowIndex);
                }
                resolve(rewards);
            }
            catch (error) {
                reject(error);
            }
        });
    }
    getLocks(lockedAt, ids) {
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
            }
            catch (error) {
                reject(error);
            }
        });
    }
    getDelegates() {
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
            }
            catch (error) {
                reject(error);
            }
        });
    }
    getParticipations(votes, blockNumber) {
        return new Promise(async (resolve, reject) => {
            try {
                if (votes && votes.length == 0) {
                    throw new common_1.NotFoundException("sorry, votes can't be an empty array");
                }
                let stakers = await this.getStakers(null, blockNumber, null);
                const participations = [];
                stakers.forEach(staker => {
                    let stakerVotes = votes.filter(vote => vote.voter.toLowerCase() == staker.id);
                    let participation = stakerVotes.length ? 1 : 0;
                    let element = {
                        address: staker.id,
                        participation: participation,
                        staker: staker,
                        votes: stakerVotes,
                        delegatedTo: undefined
                    };
                    participations.push(element);
                });
                let delegates = await this.getDelegates();
                let participationsIncludesDelegates = this.includeDelegates(participations, delegates);
                resolve(participationsIncludesDelegates);
            }
            catch (error) {
                reject(error);
            }
        });
    }
    getFreeRiders(month, blockNumber, proposalsIds) {
        return new Promise(async (resolve, reject) => {
            try {
                let from = moment({ year: moment().year(), month: month - 4, day: 1 });
                let to = moment({ year: moment().year(), month: month - 1, day: 1 }).endOf('month');
                let votes = await this.getSnapshotVotes(from.unix(), to.unix(), proposalsIds, "in");
                let voters = await this.getVotersFromShapshotVotes(votes, blockNumber);
                let stakers = await this.getStakers(voters, blockNumber, 'id_not_in');
                let votedTimeRange = this.generateBackmonthTimestamp(3, false);
                let freeRiders = [];
                stakers.forEach(staker => {
                    let oldestLock = this.getOldestLock(staker.accountLocks);
                    let isFreeRider = false;
                    if (oldestLock && oldestLock.lockedAt < votedTimeRange) {
                        isFreeRider = true;
                    }
                    let freeRider = {
                        id: staker.id,
                        isFreeRider: isFreeRider,
                        oldestLock: oldestLock,
                        stakingData: staker
                    };
                    freeRiders.push(freeRider);
                });
                resolve(freeRiders);
            }
            catch (error) {
                reject(error);
            }
        });
    }
    generateEpoch(month, year, distributedRewards, windowIndex, prevWindowIndex, blockNumber, proposalsIds) {
        return new Promise(async (resolve, reject) => {
            try {
                let from = moment({ year: year, month: month - 1, day: 1 });
                let to = from.clone().endOf('month');
                let votes = await this.getSnapshotVotes(from.unix(), to.unix(), proposalsIds, "not_in");
                let previousEpoch = null;
                let rewards = [];
                if (prevWindowIndex !== undefined && prevWindowIndex >= 0) {
                    previousEpoch = await this.getEpoch(prevWindowIndex);
                    rewards = await this.getRewards(prevWindowIndex);
                }
                let participations = await this.getParticipations(votes, blockNumber);
                let merkleTreeDistributor = new merkleTreeDistributor_1.MerkleTreeDistributor();
                const merkleTree = await merkleTreeDistributor.generateMerkleTree(distributedRewards, windowIndex, participations, previousEpoch, rewards);
                let epoch = await this.saveEpoch(participations, merkleTree, votes, rewards, from.unix(), to.unix(), blockNumber);
                resolve(epoch);
            }
            catch (error) {
                reject(error);
            }
        });
    }
    saveEpoch(participations, merkleTree, votes, rewards, startDate, endDate, blockNumber) {
        return new Promise(async (resolve, reject) => {
            try {
                const provider = new ethers_1.ethers.providers.JsonRpcProvider(this.ethProvider);
                const ethDaterHelper = new ethDater(provider);
                let startBlock = await ethDaterHelper.getDate(startDate * 1000, true);
                let endBlock = await ethDaterHelper.getDate(endDate * 1000, true);
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
            }
            catch (error) {
                reject(error);
            }
        });
    }
    getSliceBreakdown() {
        return new Promise(async (resolve, reject) => {
            try {
                const provider = new ethers_1.ethers.providers.JsonRpcProvider(process.env.INFURA_RPC);
                let rewardsContract = new ethers_1.ethers.Contract(this.SLICE_ADDRESS, pieABI, provider);
                let decimals = await rewardsContract.decimals();
                let totalSupply = await rewardsContract.totalSupply();
                let tokens = await rewardsContract.calcTokensForAmount(totalSupply.toString());
                let underlying = [];
                for (let i = 0; i < tokens.length; i += 2) {
                    let underlyingAddress = lodash.get(tokens[i], 0).toLowerCase();
                    let underlyingContract = new ethers_1.ethers.Contract(underlyingAddress, pieABI, provider);
                    underlying.push({
                        address: underlyingAddress,
                        amount: tokens[i + 1].toString(),
                        symbol: await underlyingContract.symbol(),
                        decimals: await underlyingContract.decimals(),
                        price: 0
                    });
                }
                ;
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
            }
            catch (error) {
                reject(error);
            }
        });
    }
    includeDelegates(entries, delegates) {
        entries.forEach(entry => {
            entry.address = ethers_1.ethers.utils.getAddress(entry.address);
        });
        let mappedDelegates = {};
        delegates.forEach(entry => {
            mappedDelegates[ethers_1.ethers.utils.getAddress(entry.delegate)] = ethers_1.ethers.utils.getAddress(entry.delegator);
        });
        let mappedEntries = {};
        entries.forEach(entry => {
            mappedEntries[entry.address] = entry;
        });
        Object.keys(mappedDelegates).forEach(delegate_address => {
            if (mappedEntries[delegate_address].participation == 1) {
                mappedEntries[mappedDelegates[delegate_address]].participation = 1;
                mappedEntries[mappedDelegates[delegate_address]].delegatedTo = delegate_address;
                mappedEntries[mappedDelegates[delegate_address]].votes = mappedEntries[delegate_address].votes;
            }
        });
        entries = Object.keys(mappedEntries).map(key => mappedEntries[key]);
        return entries;
    }
    fetchDelegates(blocks, lastID) {
        return new Promise(async (resolve, reject) => {
            try {
                let query = `{
          delegates(first: ${blocks}, where: {id_gt: "${lastID}"}) {
            id
            delegator
            delegate
          }
        }`;
                let response = await this.httpService.post(this.graphUrl, {
                    query: query
                }).toPromise();
                resolve(response.data.data.delegates);
            }
            catch (error) {
                reject(error);
            }
        });
    }
    fetchLocks(blocks, lastID, lockedAt, ids) {
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
                }
                else {
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
                let response = await this.httpService.post(this.graphUrl, {
                    query: query
                }).toPromise();
                resolve(response.data.data.locks);
            }
            catch (error) {
                reject(error);
            }
        });
    }
    fetchStakers(blocks, lastID, ids, condition, blockNumber) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!condition) {
                    condition = 'id_in';
                }
                let query = `{
          stakers(first: ${blocks}, `;
                if (blockNumber) {
                    query += `, block: {number: ${blockNumber}}`;
                }
                query += `, where: {id_gt: "${lastID}"`;
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
                let response = await this.httpService.post(this.graphUrl, {
                    query: query
                }).toPromise();
                resolve(response.data.data.stakers);
            }
            catch (error) {
                reject(error);
            }
        });
    }
    fetchstakingStats(blocks, blockNumber) {
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
                let response = await this.httpService.post(this.graphUrl, {
                    query: query
                }).toPromise();
                resolve(response.data.data.globalStats);
            }
            catch (error) {
                reject(error);
            }
        });
    }
    fetchRewards(blocks, lastID, windowIndex) {
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
                let response = await this.httpService.post(this.graphUrl, {
                    query: query
                }).toPromise();
                resolve(response.data.data.rewards);
            }
            catch (error) {
                reject(error);
            }
        });
    }
    getSnapshotVotes(from, to, proposalsIds, condition) {
        return new Promise(async (resolve, reject) => {
            try {
                let blocks = 1000;
                let skip = 0;
                let snapshotVotes = [];
                let votes = await this.fetchSnapshotVotes(from, to, blocks, skip, proposalsIds, condition);
                while (votes.length > 0) {
                    snapshotVotes = snapshotVotes.concat(votes);
                    skip += blocks;
                    votes = await this.fetchSnapshotVotes(from, to, blocks, skip, proposalsIds, condition);
                }
                resolve(snapshotVotes);
            }
            catch (error) {
                reject(error);
            }
        });
    }
    fetchSnapshotVotes(from, to, blocks, skip, proposalsIds, condition) {
        return new Promise(async (resolve, reject) => {
            try {
                let proposalsIdsString = proposalsIds ? proposalsIds.join(",") : '';
                let response = await this.httpService.post(this.snapshotUrl, {
                    query: `{
              votes (
                first: ${blocks},
                skip: ${skip},
                where: {
                  space: "${this.snapshotSpaceID}"
                  created_gte: ${from}
                  created_lte: ${to}
                  proposal_in: [${condition == "in" ? proposalsIdsString : ""}]
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
                }).toPromise();
                let votes = response.data.data.votes;
                if (proposalsIds && proposalsIds.length) {
                    votes = votes.filter(vote => {
                        if (!proposalsIds.includes(vote.proposal.id)) {
                            return vote;
                        }
                    });
                }
                resolve(votes);
            }
            catch (error) {
                reject(error);
            }
        });
    }
    generateBackmonthTimestamp(months, milliseconds) {
        let date = new Date();
        date.setMonth(date.getMonth() - months);
        if (milliseconds) {
            return Number(date);
        }
        else {
            return Math.floor(Number(date) / 1000);
        }
    }
    getProposalsFromParticipations(participations) {
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
        proposals = proposals.sort().filter(function (item, pos, ary) {
            return !pos || item != ary[pos - 1];
        });
        return proposals;
    }
    async getVotersFromShapshotVotes(votes, blockNumber) {
        let voters = Array.from(votes, vote => vote.voter.toLowerCase());
        voters = Array.from(new Set(voters)).sort();
        let delegations = await this.getDelegates();
        delegations.forEach(delegation => {
            if (voters.includes(delegation.delegate)) {
                voters.push(delegation.delegator);
            }
        });
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
                    };
                })
            });
        });
        return votersStruct;
    }
    getOldestLock(locks) {
        let oldestTimestamp = this.generateBackmonthTimestamp(0, false);
        let oldestLock = null;
        locks.forEach(lock => {
            if (lock.lockedAt < oldestTimestamp) {
                oldestTimestamp = lock.lockedAt;
                oldestLock = lock;
            }
        });
        return oldestLock;
    }
};
__decorate([
    nestjs_console_1.Command({
        command: 'generate-epoch',
        description: 'Generate a new Epoch using CLI.'
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StakingService.prototype, "generateEpochCommand", null);
StakingService = __decorate([
    common_1.Injectable(),
    nestjs_console_1.Console(),
    __param(1, mongoose_1.InjectModel(epoch_entity_1.EpochEntity.name)),
    __metadata("design:paramtypes", [axios_1.HttpService,
        mongoose_2.Model])
], StakingService);
exports.StakingService = StakingService;
//# sourceMappingURL=staking.service.js.map