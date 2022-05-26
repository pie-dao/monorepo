import { Vault } from '../../store/vault/Vault';
import { Erc20, MerkleAuth, Vault as Auxo } from '../../types/artifacts/abi';
import { promiseObject } from '../../utils/promiseObject';

// ** All network calls to smart contracts **

/**
 * Vault-wide calls that do not need the user signed in.
 * These will always be available provided we have a network connection
 */
export const vaultCalls = (auxo: Auxo) => ({
  totalUnderlying: auxo.totalUnderlying(),
  lastHarvest: auxo.lastHarvest(),
  estimatedReturn: auxo.estimatedReturn(),
  batchBurnRound: auxo.batchBurnRound(),
  userDepositLimit: auxo.userDepositLimit(),
  exchangeRate: auxo.exchangeRate(),
});

/**
 * Account level on-chain information that is only available if the user is connected
 */
type AccountCallProps = {
  account: string | null | undefined;
  auxo: Auxo;
  auth: MerkleAuth;
  token: Erc20;
};
export const accountCalls = ({
  account,
  token,
  auth,
  auxo,
}: AccountCallProps) => {
  if (account)
    return {
      balanceOfUnderlying: token.balanceOf(account),
      balanceOfVault: auxo.balanceOf(account),
      balanceOfVaultUnderlying: auxo.balanceOfUnderlying(account),
      allowance: token.allowance(account, auxo.address),
      userBatchBurnReceipts: auxo.userBatchBurnReceipts(account),
      isDepositor: auth.isDepositor(auxo.address, account),
    };
};

/**
 * Batch burns rounds need to be fetched from on-chain, so no guarantee we have them during first call.
 * We also need to inspect the previous batch burn for our purposes, as that provides withdrawal data.
 */
export const batchBurnCalls = (
  auxo: Auxo,
  batchBurnRound: number | undefined,
) => {
  if (batchBurnRound && batchBurnRound > 0)
    return {
      batchBurns: auxo.batchBurns(batchBurnRound - 1),
    };
};

/**
 * Call on chain data by constructing an object of promises, depending on the
 * Available information we have on hand.
 */
type OnChainDataProps = {
  token: Erc20 | undefined;
  auxo: Auxo | undefined;
  auth: MerkleAuth | undefined;
  vault: Vault;
  batchBurnRound?: number;
  account?: string | null;
};
export async function fetchOnChainData({
  token,
  auxo,
  auth,
  vault,
  account,
  batchBurnRound,
}: OnChainDataProps) {
  if (!(auxo && token && auth)) return;
  let onChainCalls = {
    ...vaultCalls(auxo),
    ...accountCalls({ account, token, auxo, auth }),
    ...batchBurnCalls(auxo, batchBurnRound),
    // pass existing vault data for reference
    existing: vault,
  };
  const obj = await promiseObject(onChainCalls);
  return obj;
}
