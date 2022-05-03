import { BytesLike } from "ethers";
import MerkleProofDev from "../../public/stakers-merkle-tree.dev.json";
import MerkleProofProd from "../../public/stakers-merkle-tree.production.json";

const isDevEnvironment = process.env.NODE_ENV === "development";

if (isDevEnvironment) console.log("Dev Merkle Proof Loaded");

const MerkleProof = isDevEnvironment ? MerkleProofDev : MerkleProofProd;

export const getProof = (account?: string | null): BytesLike[] | undefined => {
  const input = MerkleProof[account as keyof typeof MerkleProof];
  return input;
};
