import { BytesLike } from "ethers";
import MerkleProofDev from "../static/stakers-merkle-tree.dev.json";
import MerkleProofProd from "../static/stakers-merkle-tree.production.json";

const isDevEnvironment = process.env.NODE_ENV === "development";

if (isDevEnvironment) console.log("Dev Merkle Proof Loaded");

export const getMerkleProof = () => isDevEnvironment ? MerkleProofDev : MerkleProofProd;

export const getProof = (account?: string | null): BytesLike[] | undefined => {
  const MerkleProof = getMerkleProof();
  const input = MerkleProof[account as keyof typeof MerkleProof];
  return input;
};
