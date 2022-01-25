import {
  BoostedToMax,
  Deposited,
  Ejected,
  MinLockAmountChanged,
  OwnershipTransferred,
  WhitelistedChanged,
  Withdrawn
} from "../generated/SharesTimeLock/SharesTimeLock"
import { ShareTimeLockHelper } from "../helpers/ShareTimeLockHelper"

export function handleDeposited(event: Deposited): void {
  // updating stakingData infos into Staker entity...
  let staker = ShareTimeLockHelper.updateStakingData(event.params.owner);

  let lock = ShareTimeLockHelper.depositLock(
    event.params.lockId, 
    event.params.lockDuration,
    event.block.timestamp,
    event.params.amount,
    staker.id,
    false);

  ShareTimeLockHelper.updateGlobalGlobalStats(event.block.timestamp, lock, null, 'deposited');
}

export function handleEjected(event: Ejected): void {
  let lock = ShareTimeLockHelper.withdrawLock(
    event.params.lockId, 
    event.params.owner.toHex(),
    "ejected");

    ShareTimeLockHelper.updateStakingData(event.params.owner);
    ShareTimeLockHelper.updateGlobalGlobalStats(event.block.timestamp, lock, null, 'ejected');
}

export function handleWithdrawn(event: Withdrawn): void {
  let lock = ShareTimeLockHelper.withdrawLock(
    event.params.lockId, 
    event.params.owner.toHex(),
    "withdrawn");

    ShareTimeLockHelper.updateStakingData(event.params.owner);    
    ShareTimeLockHelper.updateGlobalGlobalStats(event.block.timestamp, lock, null, 'withdrawn');
}

export function handleBoostedToMax(event: BoostedToMax): void {
  let locks = ShareTimeLockHelper.boostToMax(
    event.address,
    event.params.oldLockId,
    event.params.newLockId, 
    event.params.owner.toHex(),
    event.block.timestamp);  

    ShareTimeLockHelper.updateStakingData(event.params.owner);    
    ShareTimeLockHelper.updateGlobalGlobalStats(event.block.timestamp, locks[0], locks[1], 'boosted');
}

export function handleMinLockAmountChanged(event: MinLockAmountChanged): void {}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handleWhitelistedChanged(event: WhitelistedChanged): void {}
