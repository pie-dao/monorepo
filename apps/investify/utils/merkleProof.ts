import { BytesLike } from 'ethers';
import MerkleProofDev from '../config/stakers-merkle-tree.dev.json';
import MerkleProofProd from '../config/stakers-merkle-tree.production.json';

const isDevEnvironment = process.env.NODE_ENV === 'development';

const MerkleProof = isDevEnvironment ? MerkleProofDev : MerkleProofProd;

export const getProof = (account?: string | null): BytesLike[] | undefined => {
  const input = MerkleProof[account as keyof typeof MerkleProof];
  return input;
};
