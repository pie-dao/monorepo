import {
  DoughStakingDelegateRegistry,
  ClearDelegate,
  OwnershipChange,
  SetDelegate
} from "../generated/DoughStakingDelegateRegistry/DoughStakingDelegateRegistry"
import { DoughStakingDelegateRegistryHelper } from "../helpers/DoughStakingDelegateRegistryHelper"

export function handleClearDelegate(event: ClearDelegate): void {
  DoughStakingDelegateRegistryHelper.deleteDelegateEntity(
    event.params.delegator
  );
}

export function handleOwnershipChange(event: OwnershipChange): void {
  DoughStakingDelegateRegistryHelper.updateDelegateEntity(
    event.params.oldOwner,
    event.params.newOwner,
    event.block.timestamp,
    event.block.number    
  ); 
}

export function handleSetDelegate(event: SetDelegate): void {
  DoughStakingDelegateRegistryHelper.createDelegateEntity(
    event.params.delegator,
    event.params.delegate, 
    event.block.timestamp,
    event.block.number
  );  
}
