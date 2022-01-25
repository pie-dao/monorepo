import { BigInt } from "@graphprotocol/graph-ts"
import {
  MerkleTreeDistributor,
  Claimed,
  CreatedWindow,
  DeleteWindow,
  LockSet,
  OwnershipTransferred,
  WithdrawRewards
} from "../generated/MerkleTreeDistributor/MerkleTreeDistributor"
import { MerkleTreeDistributorHelper } from "../helpers/MerkleTreeDistributorHelper"
import { ShareTimeLockHelper } from "../helpers/ShareTimeLockHelper"
import { store, log } from "@graphprotocol/graph-ts"
import { RewardDistribution } from "../generated/schema"

export function handleClaimed(event: Claimed): void {
  log.debug("HERE WE ARE - {}", [event.transaction.hash.toHex()]);
  MerkleTreeDistributorHelper.saveRewards(
    event.transaction.hash.toHex(), 
    event.block.timestamp, 
    event.params.amount,
    event.params.account,
    event.params.rewardToken,
    "claimed",
    event.params.windowIndex,
    event.params.accountIndex);

    ShareTimeLockHelper.updateStakingData(event.params.account, event.params.amount, event.params.rewardToken);
}

export function handleCreatedWindow(event: CreatedWindow): void {
  // loading RewardDistribution entity
  let hashID = event.params.windowIndex.toString();
  let rewardDistribution = RewardDistribution.load(hashID);
  // or creating if it doesn't exist yet...
  if (rewardDistribution == null) {
    rewardDistribution = new RewardDistribution(hashID);
  }

  // filling the RewardDistribution entity...
  rewardDistribution.transaction = event.transaction.hash.toHexString();
  rewardDistribution.timestamp = event.block.timestamp;
  rewardDistribution.block = event.block.number;
  rewardDistribution.windowIndex = event.params.windowIndex;
  rewardDistribution.rewardsDeposited = event.params.rewardsDeposited;
  rewardDistribution.rewardToken = event.params.rewardToken;
  rewardDistribution.owner = event.params.owner;

  // saving RewardDistribution entity...
  rewardDistribution.save();
}

export function handleDeleteWindow(event: DeleteWindow): void {
  store.remove('RewardDistribution', event.params.windowIndex.toString());
}

export function handleWithdrawRewards(event: WithdrawRewards): void {}

export function handleLockSet(event: LockSet): void {}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}
