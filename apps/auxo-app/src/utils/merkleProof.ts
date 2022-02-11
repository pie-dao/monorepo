import { BytesLike } from "ethers";
// import MerkleProofs from "../static/stakers-merkle-tree.production.json";
import MerkleProofs from "../static/stakers-merkle-tree.json";

export const getProof = (account?: string | null): BytesLike[] | undefined => {
  const input = MerkleProofs[account as keyof typeof MerkleProofs];
  return input;
};
