import {
  ClaimedTokens,
  Transfer,
  NewCloneToken,
  Approval
} from "../generated/Dough/Dough"
import { DoughHelper } from "../helpers/DoughHelper"

export function handlerTransfer(event: Transfer): void {
  DoughHelper.transfer(event.address, event.params._from, event.params._to, event.params._amount);
}

export function handlerClaimedTokens(event: ClaimedTokens): void {}

export function handlerNewCloneToken(event: NewCloneToken): void {}

export function handlerApproval(event: Approval): void {}
