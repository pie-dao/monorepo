import {
  Approval,
  ClaimedFor,
  OwnershipTransferred,
  RewardsDistributed,
  RewardsRedistributed,
  RewardsWithdrawn,
  RoleAdminChanged,
  RoleGranted,
  RoleRevoked,
  Transfer
} from "../generated/NonTransferableRewardsOwned/NonTransferableRewardsOwned"
import { ShareTimeLockHelper } from "../helpers/ShareTimeLockHelper"

export function handleTransfer(event: Transfer): void {
  ShareTimeLockHelper.updateStakingData(event.params._to);
}

export function handleRewardsWithdrawn(event: RewardsWithdrawn): void {
  // deprecated, in favor of MerkleTreeDistributor...
}

export function handleRewardsRedistributed(event: RewardsRedistributed): void {
  // deprecated, in favor of MerkleTreeDistributor...
}

export function handleRewardsDistributed(event: RewardsDistributed): void {
  // deprecated, in favor of MerkleTreeDistributor...
}

export function handleClaimedFor(event: ClaimedFor): void {
  // deprecated, in favor of MerkleTreeDistributor...
}

export function handleApproval(event: Approval): void {}

/*
 * Not Needed Functions for now.
 */

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handleRoleAdminChanged(event: RoleAdminChanged): void {}

export function handleRoleGranted(event: RoleGranted): void {}

export function handleRoleRevoked(event: RoleRevoked): void {}
