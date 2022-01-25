import { Reward, StakersTracker } from "../generated/schema"
import { Address, BigInt, log } from "@graphprotocol/graph-ts"
import { ShareTimeLockHelper } from "./ShareTimeLockHelper"

const stakersTrackerID = "StakersTrackerID";

export class MerkleTreeDistributorHelper {
  constructor() {}

  static loadStakersTracker(): StakersTracker {
    // loading StakersTracker entity, or creating if it doesn't exist yet...
    let stakersTracker = StakersTracker.load(stakersTrackerID);

    if (stakersTracker == null) {
      stakersTracker = new StakersTracker(stakersTrackerID);
      stakersTracker.counter = BigInt.fromI32(0);
      stakersTracker.stakers = new Array<string>();
      stakersTracker.save();
    }

    return <StakersTracker>stakersTracker;
  }

  static updateAllStakingData(): void {
    let stakersTracker = MerkleTreeDistributorHelper.loadStakersTracker();
    let stakers = stakersTracker.stakers;
    
    for(let i = 0; i < stakers.length; i += 1) {
      let staker = stakers[i];
      ShareTimeLockHelper.updateStakingData(<Address>Address.fromHexString(<string>staker));
    };
  }  

  static saveRewards(
    hashID: string, 
    timestamp: BigInt, 
    amount: BigInt, 
    staker: Address, 
    rewardToken: Address, 
    type: string,
    windowIndex: BigInt, 
    accountIndex: BigInt, 
    ): Reward {
    // loading Reward entity, or creating if it doesn't exist yet...
    let reward = Reward.load(hashID);

    if (reward == null) {
      reward = new Reward(hashID);
    }

    // filling the Reward entity...
    reward.timestamp = timestamp;
    reward.amount = amount;
    reward.staker = staker.toHex();
    reward.account = staker;
    reward.type = type;
    reward.rewardToken = rewardToken;
    reward.windowIndex = windowIndex;
    reward.accountIndex = accountIndex;

    // saving lock entity...
    reward.save();   
    return <Reward>reward;
  }

}