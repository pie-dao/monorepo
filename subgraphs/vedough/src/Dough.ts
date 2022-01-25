import { BigInt } from "@graphprotocol/graph-ts"

import {
  Dough,
  ClaimedTokens,
  Transfer,
  NewCloneToken,
  Approval
} from "../generated/Dough/Dough"

export function handleClaimedTokens(event: ClaimedTokens): void {}

export function handleTransfer(event: Transfer): void {}

export function handleNewCloneToken(event: NewCloneToken): void {}

export function handleApproval(event: Approval): void {}
