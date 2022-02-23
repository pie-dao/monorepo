import { BytesLike } from "ethers";
import MerkleProofDev from "../static/stakers-merkle-tree.dev.json";
import MerkleProofProd from "../static/stakers-merkle-tree.production.json";

const isDevEnvironment = process.env.REACT_APP_MERKLE_ROOT === "dev";

if (isDevEnvironment) console.log("Dev Merkle Proof Loaded");

const MerkleProof = isDevEnvironment ? MerkleProofDev : MerkleProofProd;

export const getProof = (account?: string | null): BytesLike[] | undefined => {
  const input = MerkleProof[account as keyof typeof MerkleProof];
  return input;
};
