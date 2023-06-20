import { toLower } from 'lodash';
import { MerkleTreesByUser, Recipient } from '../types/merkleTree';

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
