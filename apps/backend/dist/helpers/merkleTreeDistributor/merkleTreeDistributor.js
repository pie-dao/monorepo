"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MerkleTreeDistributor = void 0;
const ethers_1 = require("ethers");
const staking_types_Claims_1 = require("../../staking/types/staking.types.Claims");
const staking_types_Participation_1 = require("../../staking/types/staking.types.Participation");
const MerkleDistributorHelper = require("@uma/merkle-distributor");
const staking_types_MerkleTree_1 = require("../../staking/types/staking.types.MerkleTree");
const decimal_js_1 = require("decimal.js");
const epoch_entity_1 = require("../../staking/entities/epoch.entity");
class MerkleTreeDistributor {
    constructor() {
        this.SLICE_ADDRESS = ethers_1.ethers.utils.getAddress('0x1083D743A1E53805a95249fEf7310D75029f7Cd6');
        this.EXPLODE_DECIMALS = new decimal_js_1.Decimal(1e18);
        decimal_js_1.Decimal.set({
            toExpPos: 42,
            precision: 42
        });
    }
    calculateProRata(windowIndex, totalRewardsDistributed, participations) {
        const sliceUnits = new decimal_js_1.Decimal(totalRewardsDistributed).times(this.EXPLODE_DECIMALS);
        let totalVeDoughSupply = new decimal_js_1.Decimal(0);
        participations.forEach(participation => {
            if (windowIndex == 0) {
                if (participation.participation) {
                    totalVeDoughSupply = totalVeDoughSupply.plus(participation.staker.accountVeTokenBalance);
                }
            }
            else {
                totalVeDoughSupply = totalVeDoughSupply.plus(participation.staker.accountVeTokenBalance);
            }
        });
        const proRata = new decimal_js_1.Decimal(sliceUnits).times(this.EXPLODE_DECIMALS).div(totalVeDoughSupply.toString());
        return { proRata: proRata, totalVeDoughSupply: totalVeDoughSupply };
    }
    getUnclaimed(rewards, epoch) {
        return new Promise(async (resolve, reject) => {
            try {
                const claims = epoch.merkleTree.claims;
                let unclaimedTokens = new decimal_js_1.Decimal(0);
                let unclaimed = [];
                Object.keys(claims).forEach(address => {
                    let hasClaimed = rewards.find(reward => reward.account === address);
                    if (!hasClaimed) {
                        unclaimed.push({ address: address, amount: claims[address].amount });
                        unclaimedTokens = unclaimedTokens.plus(claims[address].amount);
                    }
                });
                resolve({ addresses: unclaimed, total: unclaimed.length, tokens: unclaimedTokens });
            }
            catch (error) {
                reject(error);
            }
        });
    }
    async generateMerkleTree(totalRewardsDistributed, windowIndex, participations, previousEpoch, rewards) {
        let claims = await this.generateClaims(totalRewardsDistributed, windowIndex, participations, previousEpoch, rewards);
        const recipientsWithIndex = {};
        Object.keys(claims.recipients).forEach((address, index) => {
            recipientsWithIndex[address] = {
                amount: claims.recipients[address].amount.toString(),
                metaData: claims.recipients[address].metaData,
                accountIndex: index
            };
        });
        const { recipientsDataWithProof, merkleRoot } = MerkleDistributorHelper.createMerkleDistributionProofs(recipientsWithIndex, claims.windowIndex);
        const outputData = {
            chainId: claims.chainId,
            stats: claims.stats,
            rewardToken: claims.rewardToken,
            windowIndex: claims.windowIndex,
            totalRewardsDistributed: claims.totalRewardsDistributed,
            merkleRoot: merkleRoot,
            claims: recipientsDataWithProof,
        };
        return outputData;
    }
    async generateClaims(totalRewardsDistributed, windowIndex, participations, previousEpoch, rewards) {
        let unclaimed = previousEpoch ? await this.getUnclaimed(rewards, previousEpoch) : null;
        let calculations = this.calculateProRata(windowIndex, totalRewardsDistributed, participations);
        let claims = {
            stats: {
                proRata: calculations.proRata.toString(),
                totalVeDoughSupply: calculations.totalVeDoughSupply.toString(),
                notVotingAddresses: {}
            },
            chainId: 1,
            rewardToken: this.SLICE_ADDRESS,
            windowIndex: windowIndex,
            totalRewardsDistributed: null,
            recipients: {}
        };
        let totalCalculatedRewards = new decimal_js_1.Decimal(0);
        let sliceUnits = new decimal_js_1.Decimal(totalRewardsDistributed).times(this.EXPLODE_DECIMALS);
        let minRewarded = sliceUnits;
        let minRewardedStaker = null;
        participations.forEach(participation => {
            let stakerBalance = new decimal_js_1.Decimal(participation.staker.accountVeTokenBalance);
            let stakerProRata = stakerBalance.times(calculations.proRata).div(this.EXPLODE_DECIMALS).truncated();
            if (stakerProRata.lt(minRewarded)) {
                minRewarded = stakerProRata;
                minRewardedStaker = participation.staker.id;
            }
            totalCalculatedRewards = totalCalculatedRewards.plus(stakerProRata);
            claims.recipients[participation.staker.id] = {
                participation: participation.participation,
                amount: stakerProRata,
                metaData: {
                    reason: [`Distribution for epoch ${windowIndex}`],
                    staker: participation.staker
                }
            };
            if (!participation.participation) {
                if (windowIndex != 0) {
                    let notVotingStakerAddress = previousEpoch && previousEpoch.merkleTree.stats.notVotingAddresses
                        ? Object.keys(previousEpoch.merkleTree.stats.notVotingAddresses).find(address => ethers_1.ethers.utils.getAddress(address) == ethers_1.ethers.utils.getAddress(participation.address)) : null;
                    if (!notVotingStakerAddress) {
                        claims.stats.notVotingAddresses[ethers_1.ethers.utils.getAddress(participation.address)] = {
                            amount: stakerProRata,
                            windowIndex: [Number(windowIndex)]
                        };
                    }
                    else {
                        let notVotingStaker = previousEpoch.merkleTree.stats.notVotingAddresses[notVotingStakerAddress];
                        notVotingStaker.amount = stakerProRata.plus(notVotingStaker.amount);
                        notVotingStaker.windowIndex.push(Number(windowIndex));
                        claims.stats.notVotingAddresses[notVotingStakerAddress] = notVotingStaker;
                    }
                }
            }
        });
        if (!minRewarded.eq(sliceUnits)) {
            let delta = new decimal_js_1.Decimal(sliceUnits.minus(totalCalculatedRewards).toFixed(0));
            if (delta.gt(0)) {
                claims.recipients[minRewardedStaker].amount = claims.recipients[minRewardedStaker].amount.plus(delta);
            }
        }
        participations.forEach(participation => {
            let unclaimedAddress = unclaimed ? unclaimed.addresses.find(element => ethers_1.ethers.utils.getAddress(participation.address) === ethers_1.ethers.utils.getAddress(element.address)) : null;
            if (unclaimedAddress) {
                claims.recipients[participation.staker.id].amount =
                    claims.recipients[participation.staker.id].amount.plus(unclaimedAddress.amount);
            }
        });
        let finalCalculatedRewards = new decimal_js_1.Decimal(0);
        Object.keys(claims.recipients).forEach(key => {
            let claim = claims.recipients[key];
            if (!claim.participation) {
                delete claims.recipients[key];
            }
            else {
                finalCalculatedRewards = finalCalculatedRewards.plus(claim.amount);
            }
        });
        claims.totalRewardsDistributed = finalCalculatedRewards;
        return claims;
    }
}
exports.MerkleTreeDistributor = MerkleTreeDistributor;
//# sourceMappingURL=merkleTreeDistributor.js.map