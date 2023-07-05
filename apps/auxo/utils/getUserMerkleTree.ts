import { toLower } from 'lodash';
import {
  MerkleTreesByUser,
  PrvWithdrawalMerkleTree,
  PrvWithdrawalRecipient,
  Recipient,
} from '../types/merkleTree';

export default function getUserMerkleTree(
  merkletreebyuser: MerkleTreesByUser,
  userAddress: string,
): { [key: string]: { [key: string]: Recipient } } {
  for (const user in merkletreebyuser) {
    if (toLower(user) === toLower(userAddress)) {
      return merkletreebyuser[user];
    }
  }
}

export function getPRVWithdrawalMerkleTree(
  merkletreebyuser: PrvWithdrawalMerkleTree,
  account: string,
): PrvWithdrawalRecipient {
  for (const user in merkletreebyuser.recipients) {
    if (toLower(user) === toLower(account)) {
      return merkletreebyuser.recipients[user];
    }
  }
}
