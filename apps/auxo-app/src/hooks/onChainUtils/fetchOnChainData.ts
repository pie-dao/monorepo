import { Vault } from "../../store/vault/Vault";
import {
  Erc20,
  MerkleAuth,
  Mono,
  Vault as VaultCapped,
} from "../../types/artifacts/abi";
import { promiseObject } from "../../utils/promiseObject";

// ** All network calls to smart contracts **

/**
 * Vault-wide calls that do not need the user signed in.
 * These will always be available provided we have a network connection
 */
const vaultCalls = (mono: Mono, cap: VaultCapped) => ({
  totalUnderlying: mono.totalUnderlying(),
  lastHarvest: mono.lastHarvest(),
  estimatedReturn: mono.estimatedReturn(),
  batchBurnRound: mono.batchBurnRound(),
  userDepositLimit: cap.userDepositLimit(),
  exchangeRate: mono.exchangeRate(),
});

/**
 * Account level on-chain information that is only available if the user is connected
 */
type AccountCallProps = {
  account: string | null | undefined;
  mono: Mono;
  auth: MerkleAuth;
  token: Erc20;
};
const accountCalls = ({ account, token, auth, mono }: AccountCallProps) => {
  return (
    account && {
      balanceOfUnderlying: token.balanceOf(account),
      balanceOfVault: mono.balanceOf(account),
      balanceOfVaultUnderlying: mono.balanceOfUnderlying(account),
      allowance: token.allowance(account, mono.address),
      userBatchBurnReceipts: mono.userBatchBurnReceipts(account),
      isDepositor: auth.isDepositor(mono.address, account),
    }
  );
};

/**
 * Batch burns rounds need to be fetched from on-chain, so no guarantee we have them during first call.
 * We also need to inspect the previous batch burn for our purposes, as that provides withdrawal data.
 */
const batchBurnCalls = (mono: Mono, batchBurnRound: number | undefined) => {
  return (
    batchBurnRound &&
    batchBurnRound > 0 && {
      batchBurns: mono.batchBurns(batchBurnRound - 1),
    }
  );
};

/**
 * Call on chain data by constructing an object of promises, depending on the
 * Available information we have on hand.
 */
type OnChainDataProps = {
  token: Erc20 | undefined;
  mono: Mono | undefined;
  auth: MerkleAuth | undefined;
  cap: VaultCapped | undefined;
  vault: Vault;
  batchBurnRound?: number;
  account?: string | null;
};
export async function fetchOnChainData({
  token,
  mono,
  auth,
  cap,
  vault,
  account,
  batchBurnRound,
}: OnChainDataProps) {
  if (!(mono && token && auth && cap)) return;
  let onChainCalls = {
    ...vaultCalls(mono, cap),
    ...accountCalls({ account, token, mono, auth }),
    ...batchBurnCalls(mono, batchBurnRound),
    // pass existing vault data for reference
    existing: vault,
  };
  return await promiseObject(onChainCalls);
}
