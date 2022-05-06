import { ethers } from 'ethers';
import { Claims } from '../../staking/types/staking.types.Claims';
import { Participation } from '../../staking/types/staking.types.Participation';
import * as MerkleDistributorHelper from '@uma/merkle-distributor';
import { MerkleTree } from '../../staking/types/staking.types.MerkleTree';
import { Decimal } from 'decimal.js';
import { BigNumber } from 'bignumber.js';
import { EpochEntity } from '../../staking/entities/epoch.entity';

export class MerkleTreeDistributor {
  private SLICE_ADDRESS = ethers.utils.getAddress(
    '0x1083D743A1E53805a95249fEf7310D75029f7Cd6',
  );
  private EXPLODE_DECIMALS = new Decimal(1e18);

  constructor() {
    Decimal.set({
      toExpPos: 42,
      precision: 42,
    });
  }

  private calculateProRata(
    windowIndex: number,
    totalRewardsDistributed: string,
    participations: Participation[],
  ): any {
    const sliceUnits = new Decimal(totalRewardsDistributed).times(
      this.EXPLODE_DECIMALS,
    );

    let totalVeDoughSupply = new Decimal(0);

    participations.forEach((participation) => {
      // handle edge case for first distribution...
      /* istanbul ignore next */
      if (windowIndex == 0) {
        if (participation.participation) {
          totalVeDoughSupply = totalVeDoughSupply.plus(
            participation.staker.accountVeTokenBalance,
          );
        }
      } else {
        /* istanbul ignore next */
        totalVeDoughSupply = totalVeDoughSupply.plus(
          participation.staker.accountVeTokenBalance,
        );
      }
    });

    const proRata = new Decimal(sliceUnits)
      .times(this.EXPLODE_DECIMALS)
      .div(totalVeDoughSupply.toString());
    return { proRata: proRata, totalVeDoughSupply: totalVeDoughSupply };
  }

  private getUnclaimed(rewards, epoch: EpochEntity): any {
    const claims = epoch.merkleTree.claims;

    let unclaimedTokens = new Decimal(0);
    const unclaimed = [];

    Object.keys(claims).forEach((address) => {
      const hasClaimed = rewards.find((reward) => reward.account === address);
      /* istanbul ignore next */
      if (!hasClaimed) {
        unclaimed.push({
          address: address,
          amount: claims[address].amount,
        });
        unclaimedTokens = unclaimedTokens.plus(claims[address].amount);
      }
    });

    return {
      addresses: unclaimed,
      total: unclaimed.length,
      tokens: unclaimedTokens,
    };
  }

  private buildNotVotingAddresses(
    participations: Participation[],
    windowIndex: number,
    previousEpoch: EpochEntity,
    unclaimed: any,
  ): any {
    const notVotingAddresses = {};

    participations.forEach((participation) => {
      /* istanbul ignore next */
      if (!participation.participation) {
        // if the address is inactive on this window...
        if (windowIndex != 0) {
          // ----- ACTIVE -> INACTIVE -----
          const notVotingStakerAddress =
            previousEpoch && previousEpoch.merkleTree.stats.notVotingAddresses
              ? Object.keys(
                  previousEpoch.merkleTree.stats.notVotingAddresses,
                ).find(
                  (address) =>
                    ethers.utils.getAddress(address) ==
                    ethers.utils.getAddress(participation.address),
                )
              : null;

          // if the address is inactive for the very first time, we add it...
          if (!notVotingStakerAddress) {
            notVotingAddresses[ethers.utils.getAddress(participation.address)] =
              {
                amount: 0,
                windowIndex: [Number(windowIndex)],
              };
          }
          // ----- INACTIVE -> INACTIVE -----
          else {
            const notVotingStaker =
              previousEpoch.merkleTree.stats.notVotingAddresses[
                notVotingStakerAddress
              ];
            notVotingStaker.windowIndex.push(Number(windowIndex));
            notVotingAddresses[notVotingStakerAddress] = notVotingStaker;
          }
        }
      }
    });

    return notVotingAddresses;
  }

  private compoundNotVotingAddresses(
    calculations: any,
    participations: Participation[],
    windowIndex: number,
    previousEpoch: EpochEntity,
    claims: any,
    unclaimed: any,
  ): any {
    const notVotingAddresses = {};

    participations.forEach((participation) => {
      /* istanbul ignore next */
      if (!participation.participation) {
        if (windowIndex != 0) {
          const stakerBalance = new Decimal(
            participation.staker.accountVeTokenBalance,
          );
          let stakerProRata = stakerBalance
            .times(calculations.proRata)
            .div(this.EXPLODE_DECIMALS)
            .truncated();

          // let's check if there is any unclaimed amount that must be accrued...
          const unclaimedAddress = unclaimed
            ? unclaimed.addresses.find(
                (element) =>
                  ethers.utils.getAddress(participation.address) ===
                  ethers.utils.getAddress(element.address),
              )
            : null;

          if (unclaimedAddress) {
            stakerProRata = stakerProRata.plus(unclaimedAddress.amount);
          }

          const notVotingStakerAddress = Object.keys(
            claims.stats.notVotingAddresses,
          ).find(
            (address) =>
              ethers.utils.getAddress(address) ==
              ethers.utils.getAddress(participation.address),
          );

          if (notVotingStakerAddress) {
            const notVotingStaker =
              claims.stats.notVotingAddresses[notVotingStakerAddress];
            notVotingStaker.amount = stakerProRata.plus(notVotingStaker.amount);
            notVotingAddresses[notVotingStakerAddress] = notVotingStaker;
          }
        }
      }
    });

    return notVotingAddresses;
  }

  private distributeRewards(
    totalRewardsDistributed: string,
    calculations: any,
    participations: Participation[],
    windowIndex: number,
  ): any {
    let totalCalculatedRewards = new Decimal(0);
    const sliceUnits = new Decimal(totalRewardsDistributed).times(
      this.EXPLODE_DECIMALS,
    );
    let minRewarded = sliceUnits;
    let minRewardedStaker = null;
    const recipients = {};

    // distributing the rewards to all the users...
    participations.forEach((participation) => {
      const stakerBalance = new Decimal(
        participation.staker.accountVeTokenBalance,
      );
      const stakerProRata = stakerBalance
        .times(calculations.proRata)
        .div(this.EXPLODE_DECIMALS)
        .truncated();

      // calculating minimum rewarded to add delta...
      if (stakerProRata.lt(minRewarded)) {
        minRewarded = stakerProRata;
        minRewardedStaker = participation.staker.id;
      }

      // keeping the total to calculate the delta later on...
      totalCalculatedRewards = totalCalculatedRewards.plus(stakerProRata);

      // refilling the recipients array...
      recipients[participation.staker.id] = {
        participation: participation.participation,
        amount: stakerProRata,
        metaData: {
          reason: [`Distribution for epoch ${windowIndex}`],
          staker: participation.staker,
        },
      };
    });

    // adding delta to the min reward item...
    /* istanbul ignore next */
    if (!minRewarded.eq(sliceUnits)) {
      const delta = new Decimal(
        sliceUnits.minus(totalCalculatedRewards).toFixed(0),
      );

      if (delta.gt(0)) {
        recipients[minRewardedStaker].amount =
          recipients[minRewardedStaker].amount.plus(delta);
      }
    }

    return recipients;
  }

  async generateMerkleTree(
    totalRewardsDistributed: string,
    windowIndex: number,
    participations: Participation[],
    previousEpoch: EpochEntity,
    rewards: any[],
  ): Promise<MerkleTree> {
    const claims = await this.generateClaims(
      totalRewardsDistributed,
      windowIndex,
      participations,
      previousEpoch,
      rewards,
    );

    const recipientsWithIndex: { [key: string]: any } = {};
    Object.keys(claims.recipients).forEach((address: string, index: number) => {
      recipientsWithIndex[address] = {
        amount: claims.recipients[address].amount.toString(),
        metaData: claims.recipients[address].metaData,
        accountIndex: index,
      };
    });

    const { recipientsDataWithProof, merkleRoot } =
      MerkleDistributorHelper.createMerkleDistributionProofs(
        recipientsWithIndex,
        claims.windowIndex,
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
    rewards: any[],
  ): Promise<Claims> {
    /*
      Unclaimed: all those addresses that 
      - were active on the previous Epoch
      - did NOT claimed their rewards
    */
    const unclaimed = previousEpoch
      ? await this.getUnclaimed(rewards, previousEpoch)
      : null;

    /*
      Inactive: all those addresses that 
      - were inactive on the previous Epoch
    */
    const inactive = previousEpoch
      ? previousEpoch.merkleTree.stats.notVotingAddresses
      : null;

    /*
      Calculating the proRata and the totalVeDoughSupply,
      by iterating the entire participations array 
      (all veDOUGH holders, active and inactive)
    */
    let calculations = this.calculateProRata(
      windowIndex,
      totalRewardsDistributed,
      participations,
    );
    /*
      Generating the empty/default claims object
    */
    const claims = {
      stats: {
        proRata: calculations.proRata.toString(),
        totalVeDoughSupply: calculations.totalVeDoughSupply.toString(),
        notVotingAddresses: {},
        toBeSlashed: {
          accounts: [],
          total: new BigNumber(0),
        },
      },
      chainId: 1,
      rewardToken: this.SLICE_ADDRESS,
      windowIndex: windowIndex,
      totalRewardsDistributed: null,
      recipients: {},
    };

    /* 
      building up the notVotingAddresses array, by including:
      - all those addresses which haven't voted in the current epoch
      - acccrueing the amount and the inactive window, from previous epoch
    */
    claims.stats.notVotingAddresses = this.buildNotVotingAddresses(
      participations,
      windowIndex,
      previousEpoch,
      unclaimed,
    );

    // ---------------------------------------------------------------------------------
    // ----- INACTIVE -> SLASHED -----
    // filtering out the notVotingAddresses, in order to grab the accounts to be slashed
    // and calculating the total amount of rewards to be slashed as well...
    Object.keys(claims.stats.notVotingAddresses).forEach((address) => {
      const holder = claims.stats.notVotingAddresses[address];

      if (holder.windowIndex.length >= 3) {
        // let's check if the latest 3 windows are in the correct sequence...
        const latest_3 = holder.windowIndex.slice(-3);
        const areInSequence = latest_3.every((window, index) => {
          if (index > 0) {
            return window == latest_3[index - 1] + 1;
          } else {
            return true;
          }
        });

        if (areInSequence) {
          claims.stats.toBeSlashed.accounts.push(address);
          claims.stats.toBeSlashed.total = claims.stats.toBeSlashed.total.plus(
            holder.amount,
          );
          // resetting the total accured so far for the slashed address...
          holder.amount = 0;
        }
      }
    });

    // if we have accounts to be slashed...
    if (claims.stats.toBeSlashed.accounts.length) {
      // then we remove the toBeSlashed.account from the participations...
      participations = participations.filter((participation) => {
        const founded = claims.stats.toBeSlashed.accounts.find(
          (x) => x.toLowerCase() == participation.address.toLocaleLowerCase(),
        );
        return !founded;
      });

      // update the orignal totalRewardsDistributed value...
      totalRewardsDistributed = claims.stats.toBeSlashed.total
        .div(this.EXPLODE_DECIMALS.toString())
        .plus(totalRewardsDistributed)
        .toString();

      // we re-calculate the proRata, using the reduced participations array...
      calculations = this.calculateProRata(
        windowIndex,
        totalRewardsDistributed,
        participations,
      );

      // updating the claims ojbect values with the new ones...
      claims.stats.proRata = calculations.proRata.toString();
      claims.stats.totalVeDoughSupply =
        calculations.totalVeDoughSupply.toString();
    }
    // ---------------------------------------------------------------------------------

    // distributing rewards to all stakers as first...
    claims.recipients = this.distributeRewards(
      totalRewardsDistributed,
      calculations,
      participations,
      windowIndex,
    );

    // compounding the notVotinAddresses...
    this.compoundNotVotingAddresses(
      calculations,
      participations,
      windowIndex,
      previousEpoch,
      claims,
      unclaimed,
    );

    // calculating the compounds for the unclaimed ones...
    // ----- ACTIVE -> ACTIVE -----
    participations.forEach((participation) => {
      const unclaimedAddress = unclaimed
        ? unclaimed.addresses.find(
            (element) =>
              ethers.utils.getAddress(participation.address) ===
              ethers.utils.getAddress(element.address),
          )
        : null;

      if (unclaimedAddress) {
        claims.recipients[participation.staker.id].amount = claims.recipients[
          participation.staker.id
        ].amount.plus(unclaimedAddress.amount);
      }
    });

    // calculating the compounds for the previous unclaimable ones...
    // ----- INACTIVE -> ACTIVE -----
    if (inactive) {
      participations.forEach((participation) => {
        const founded = Object.keys(inactive).find(
          (x) => x.toLowerCase() == participation.address.toLocaleLowerCase(),
        );

        if (founded) {
          claims.recipients[participation.staker.id].amount = claims.recipients[
            participation.staker.id
          ].amount.plus(inactive[founded].amount);
        }
      });
    }

    // finally, we re-iterate all over the claims, and we remove the not-active ones...
    let finalCalculatedRewards = new Decimal(0);
    Object.keys(claims.recipients).forEach((key) => {
      const claim = claims.recipients[key];

      if (!claim.participation) {
        delete claims.recipients[key];
      } else {
        finalCalculatedRewards = finalCalculatedRewards.plus(claim.amount);
      }
    });

    claims.totalRewardsDistributed = finalCalculatedRewards;
    return claims;
  }
}
