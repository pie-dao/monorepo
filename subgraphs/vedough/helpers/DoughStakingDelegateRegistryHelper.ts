import { Delegate } from "../generated/schema"
import { Address, BigInt, store } from "@graphprotocol/graph-ts"

export class DoughStakingDelegateRegistryHelper {
  constructor() {}

  static createDelegateEntity(delegator: Address, delegate: Address, timestamp: BigInt, block: BigInt): Delegate {
    // loading delegate entity, or creating if it doesn't exist yet...
    let delegateEntity = Delegate.load(delegator.toHex());

    if (delegateEntity == null) {
      delegateEntity = new Delegate(delegator.toHex());
    }
  
    // refilling the delegate entity...
    delegateEntity.delegator = delegator;
    delegateEntity.delegate = delegate;
    delegateEntity.block = block;
    delegateEntity.timestamp = timestamp;

    delegateEntity.save();
    return <Delegate>delegateEntity;
  }

  static deleteDelegateEntity(delegator: Address): void {
    store.remove('Delegate', delegator.toHex());
  }

  static updateDelegateEntity(oldOwner: Address, newOwner: Address, timestamp: BigInt, block: BigInt): void {
    // retrieving the old delegate entity...
    let oldDelegateEntity = Delegate.load(oldOwner.toHex());

    if(oldDelegateEntity) {
      // saving the new delegate entity...
      DoughStakingDelegateRegistryHelper.createDelegateEntity(
        newOwner, 
        <Address> Address.fromHexString(oldDelegateEntity.delegate.toHexString()), 
        timestamp, 
        block
      );
      // finally deleting the old one...
      DoughStakingDelegateRegistryHelper.deleteDelegateEntity(oldOwner);
    }
  }  
}