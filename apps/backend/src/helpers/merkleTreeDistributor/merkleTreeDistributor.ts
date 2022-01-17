import { ethers } from 'ethers';
import { Claims } from 'src/staking/types/staking.types.Claims';
import { Participation } from 'src/staking/types/staking.types.Participation';
import * as MerkleDistributorHelper from "@uma/merkle-distributor";
import { MerkleTree } from 'src/staking/types/staking.types.MerkleTree';
import { Decimal } from 'decimal.js';
import { BigNumber } from 'bignumber.js';
import { EpochEntity } from 'src/staking/entities/epoch.entity';

export class MerkleTreeDistributor {
  private SLICE_ADDRESS = ethers.utils.getAddress('0x1083D743A1E53805a95249fEf7310D75029f7Cd6');
  private EXPLODE_DECIMALS = new Decimal(1e18);

  constructor() {
    Decimal.set({
      toExpPos: 42,
      precision: 42
    });
  }

  private calculateProRata(windowIndex: number, totalRewardsDistributed: string, participations: Participation[]): any {
    const sliceUnits = new Decimal(totalRewardsDistributed).times(this.EXPLODE_DECIMALS);

    let totalVeDoughSupply = new Decimal(0);

    participations.forEach(participation => {
      // handle edge case for first distribution...
      /* istanbul ignore next */
      if(windowIndex == 0) {
        if(participation.participation) {
          totalVeDoughSupply = totalVeDoughSupply.plus(participation.staker.accountVeTokenBalance);
        }
      } else {
        /* istanbul ignore next */
        totalVeDoughSupply = totalVeDoughSupply.plus(participation.staker.accountVeTokenBalance);
      }
      
    });

    const proRata = new Decimal(sliceUnits).times(this.EXPLODE_DECIMALS).div(totalVeDoughSupply.toString());
    return { proRata: proRata, totalVeDoughSupply: totalVeDoughSupply };
  }

  private getUnclaimed(rewards, epoch: EpochEntity): Promise<any> {
    return new Promise(async(resolve, reject) => {
      try {
        const claims = epoch.merkleTree.claims;

        let unclaimedTokens = new Decimal(0);
        let unclaimed = [];

        Object.keys(claims).forEach(address => {
          let hasClaimed = rewards.find(reward => reward.account === address);
          /* istanbul ignore next */
          if(!hasClaimed) {
            unclaimed.push({address: address, amount: claims[address].amount});
            unclaimedTokens = unclaimedTokens.plus(claims[address].amount);
          }
        });

        resolve({addresses: unclaimed, total: unclaimed.length, tokens: unclaimedTokens});
      } catch(error) {
        /* istanbul ignore next */
        reject(error);
      }
    });
  }  

  async generateMerkleTree(
    totalRewardsDistributed: string, 
    windowIndex: number, 
    participations: Participation[], 
    previousEpoch: EpochEntity, 
    rewards: any[]
  ): Promise<MerkleTree> {    
    let claims = await this.generateClaims(
      totalRewardsDistributed, windowIndex, participations, previousEpoch, rewards
    );

    const recipientsWithIndex: { [key: string]: any } = {};
    Object.keys(claims.recipients).forEach((address: string, index: number) => {
      recipientsWithIndex[address] = { 
        amount: claims.recipients[address].amount.toString(),
        metaData: claims.recipients[address].metaData,
        accountIndex: index 
      };
    });
  
    const { recipientsDataWithProof, merkleRoot } = MerkleDistributorHelper.createMerkleDistributionProofs(
      recipientsWithIndex,
      claims.windowIndex
    );
  
    const outputData: MerkleTree = {
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

  async generateClaims(
    totalRewardsDistributed: string, 
    windowIndex: number, 
    participations: Participation[], 
    previousEpoch: EpochEntity, 
    rewards: any[]
  ): Promise<Claims> {
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

    let totalCalculatedRewards = new Decimal(0);
    let sliceUnits = new Decimal(totalRewardsDistributed).times(this.EXPLODE_DECIMALS);
    let minRewarded = sliceUnits;
    let minRewardedStaker = null;

    // distributing the rewards to all the users...
    participations.forEach(participation => {
      let stakerBalance = new Decimal(participation.staker.accountVeTokenBalance);
      let stakerProRata = stakerBalance.times(calculations.proRata).div(this.EXPLODE_DECIMALS).truncated();

      // calculating minimum rewarded to add delta...
      if(stakerProRata.lt(minRewarded)) {
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
      }   

      /* istanbul ignore next */
      if(!participation.participation) {
        if(windowIndex != 0) {
          let notVotingStakerAddress = previousEpoch && previousEpoch.merkleTree.stats.notVotingAddresses
           ? Object.keys(previousEpoch.merkleTree.stats.notVotingAddresses).find(address =>
            ethers.utils.getAddress(address) == ethers.utils.getAddress(participation.address)
          ) : null;
  
          if(!notVotingStakerAddress) {
            claims.stats.notVotingAddresses[ethers.utils.getAddress(participation.address)] = {
              amount: stakerProRata,
              windowIndex: [Number(windowIndex)]
            };

          } else {
            let notVotingStaker = previousEpoch.merkleTree.stats.notVotingAddresses[notVotingStakerAddress];
            notVotingStaker.amount = stakerProRata.plus(notVotingStaker.amount);
            notVotingStaker.windowIndex.push(Number(windowIndex));         
  
            claims.stats.notVotingAddresses[notVotingStakerAddress] = notVotingStaker;
          }
        }
      }
    });

    // adding delta to the min reward item...
    /* istanbul ignore next */
    if(!minRewarded.eq(sliceUnits)) {
      let delta = new Decimal(sliceUnits.minus(totalCalculatedRewards).toFixed(0));

      if(delta.gt(0)) {
        claims.recipients[minRewardedStaker].amount = claims.recipients[minRewardedStaker].amount.plus(delta);
      }
    }    

    // calculating the compounds for the unclaimed ones...
    participations.forEach(participation => {
      let unclaimedAddress = unclaimed ? unclaimed.addresses.find(element => 
        ethers.utils.getAddress(participation.address) ===  ethers.utils.getAddress(element.address)
      ) : null;

      if(unclaimedAddress) {
        claims.recipients[participation.staker.id].amount = 
          claims.recipients[participation.staker.id].amount.plus(unclaimedAddress.amount); 
      }       
    });

    // finally, we re-iterate all over the claims, and we remove the not-active ones...
    let finalCalculatedRewards = new Decimal(0);
    Object.keys(claims.recipients).forEach(key => {
      let claim = claims.recipients[key];

      if(!claim.participation) {
        delete claims.recipients[key];
      } else {
        finalCalculatedRewards = finalCalculatedRewards.plus(claim.amount);
      }
    });

    claims.totalRewardsDistributed = finalCalculatedRewards;
    return claims;
  }
}
