import { useWeb3React } from "@web3-react/core";
import { useEffect, useMemo } from "react";
import { useAppDispatch } from ".";
import {
  Erc20,
  MerkleAuth,
  Mono,
  Vault as VaultCapped,
} from "../types/artifacts/abi";
import { useContracts } from "./useContract";
import { Balance, Vault } from "../store/vault/Vault";
import { AwaitedReturn, fromScale, toBalance } from "../utils";
import { setVaults } from "../store/vault/vault.slice";
import { BigNumber } from "@ethersproject/bignumber";
import { chainMap } from "../utils/networks";
import { useProxySelector } from "../store";
import hash from "object-hash";
import { useWeb3Cache } from "./useCachedWeb3";
import { useBlock } from "./useBlock";
import { zeroBalance } from "../utils/balances";
import { promiseObject } from "../utils/promiseObject";
import { Defined } from "../types/utilities";

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
  batchBurnRound?: number;
  account?: string | null;
};
async function fetchOnChainData({
  token,
  mono,
  auth,
  cap,
  account,
  batchBurnRound,
}: OnChainDataProps) {
  if (!(mono && token && auth && cap)) return;
  let onChainCalls = {
    ...vaultCalls(mono, cap),
    ...accountCalls({ account, token, mono, auth }),
    ...batchBurnCalls(mono, batchBurnRound),
  };
  return await promiseObject(onChainCalls);
}

const calculateAvailable = ({
  shares,
  amountPerShare,
  decimals,
  batchBurnRound,
  userBatchBurnRound,
}: {
  shares: BigNumber;
  amountPerShare: BigNumber;
  decimals: number;
  batchBurnRound: number;
  userBatchBurnRound: number;
}): Balance => {
  /**
   * Amount available depends on the batch burn round
   * If the BBR === UserBBR, available === 0, else it's amount per share * shares
   */
  if (userBatchBurnRound === batchBurnRound) {
    return zeroBalance();
  }
  const scaledPerShare = fromScale(amountPerShare, decimals);
  const bigAvailable = shares.mul(scaledPerShare);
  return toBalance(bigAvailable, decimals);
};

/**
 * Add the basic per-vault level data
 */
const addVaultStats = (
  data: NonNullable<AwaitedReturn<typeof fetchOnChainData>>,
  decimals: number
): Vault["stats"] => ({
  deposits: toBalance(data.totalUnderlying, decimals),
  lastHarvest: data.lastHarvest.toNumber(),
  currentAPY: toBalance(data.estimatedReturn, decimals, 2),
  batchBurnRound: data.batchBurnRound.toNumber(),
  exchangeRate: toBalance(data.exchangeRate, decimals, 6),
});

/**
 * Take the existing state and add user level inforrmation
 */
const addUserBalanceData = (
  data: NonNullable<AwaitedReturn<typeof fetchOnChainData>>,
  currentVault: Vault,
  decimals: number
): Vault => {
  const accountLevelData = data as Defined<typeof data>;
  return {
    ...currentVault,
    auth: {
      ...currentVault.auth,
      isDepositor: accountLevelData.isDepositor,
    },
    userBalances: {
      wallet: toBalance(accountLevelData.balanceOfUnderlying, decimals),
      vault: toBalance(accountLevelData.balanceOfVault, decimals),
      vaultUnderlying: toBalance(
        accountLevelData.balanceOfVaultUnderlying,
        decimals
      ),
      allowance: toBalance(data.allowance as BigNumber, decimals),
      batchBurn: {
        round: accountLevelData.userBatchBurnReceipts[0].toNumber(),
        shares: toBalance(accountLevelData.userBatchBurnReceipts[1], decimals),
        available:
          currentVault.userBalances?.batchBurn.available ??
          toBalance(0, decimals),
      },
    },
  };
};

/**
 * Take the existing state object and add informating relating to the batchburn and withdraw process
 */
const addBatchBurn = (
  data: NonNullable<AwaitedReturn<typeof fetchOnChainData>>,
  currentVault: Vault,
  decimals: number
) => {
  console.debug({ data });
  const batchBurnLevelData = data as Defined<typeof data>;
  return {
    ...currentVault,
    userBalances: {
      ...currentVault.userBalances!,
      batchBurn: {
        ...currentVault.userBalances?.batchBurn!,
        available: calculateAvailable({
          shares: batchBurnLevelData.userBatchBurnReceipts.shares,
          amountPerShare: batchBurnLevelData.batchBurns.amountPerShare,
          decimals,
          batchBurnRound: batchBurnLevelData.batchBurnRound.toNumber(),
          userBatchBurnRound:
            batchBurnLevelData.userBatchBurnReceipts.round.toNumber(),
        }),
      },
    },
  };
};

const toState = ({
  existing,
  decimals,
  data,
  account,
}: {
  existing: Vault;
  address: string;
  decimals: number;
  data: AwaitedReturn<typeof fetchOnChainData>;
  account?: string | null;
}): Vault | undefined => {
  /**
   * Rebuilds the entire vault before making a dispatch call
   * This allows us to check we actually have changes before triggering
   * a state update. Useful for controlling re-renders and preventing
   * hammering of the node
   */
  if (!data) return;

  let returnValue: Vault = {
    ...existing,
    ...addVaultStats(data, decimals),
    cap: {
      ...existing.cap,
      underlying: toBalance(data.userDepositLimit, decimals),
    },
  };

  if (account) returnValue = addUserBalanceData(data, returnValue, decimals);
  if (data.batchBurnRound)
    returnValue = addBatchBurn(data, returnValue, decimals);

  return returnValue;
};

const hasStateChanged = (old: Vault[], change: Vault[]): boolean => {
  return (
    hash(old, { encoding: "base64" }) !== hash(change, { encoding: "base64" })
  );
};

export const useChainData = (): { loading: boolean } => {
  const { account, active } = useWeb3React();
  const { chainId } = useWeb3Cache();
  const { block, firstLoad, refreshFrequency } = useBlock();

  const dispatch = useAppDispatch();
  const vaults = useProxySelector((state) => state.vault.vaults);
  const { monoContracts, tokenContracts, authContracts, capContracts } =
    useContracts(chainId);

  const shouldUpdate = useMemo(() => {
    // do not update state if vital data missing
    if (!chainId || !block || !block.number) return false;

    // Ensure we always fetch data when the user loads the page for the first time
    if (firstLoad) return true;

    // repeated state updates can cause rpc throttling with lower block times
    const blockFrequencyConditionMet = block.number % refreshFrequency === 0;

    // No point updating state if any of the contracts are missing
    const contractsExist =
      tokenContracts.length > 0 &&
      monoContracts.length > 0 &&
      authContracts.length > 0 &&
      capContracts.length > 0;

    return (
      active &&
      contractsExist &&
      chainMap[chainId] &&
      blockFrequencyConditionMet
    );
  }, [
    active,
    tokenContracts,
    monoContracts,
    authContracts,
    capContracts,
    firstLoad,
    block,
    chainId,
    refreshFrequency,
  ]);

  useEffect(() => {
    if (shouldUpdate) {
      // Multicall contract executes promise all as a batch request
      Promise.all(
        tokenContracts.map(async (token) => {
          const vault = vaults.find(
            (v) => v.token.address.toLowerCase() === token.address.toLowerCase()
          );
          const mono = monoContracts.find(
            (m) => m.address.toLowerCase() === vault?.address.toLowerCase()
          );
          const auth = authContracts.find(
            (a) => a.address.toLowerCase() === vault?.auth.address.toLowerCase()
          );
          const cap = capContracts.find(
            (c) => c.address.toLowerCase() === vault?.cap.address.toLowerCase()
          );
          if (mono && vault) {
            const data = {
              vault,
              address: mono.address,
              data: await fetchOnChainData({
                token,
                mono,
                auth,
                cap,
                batchBurnRound: vault.stats?.batchBurnRound,
                account,
              }),
            };
            return data;
          }
        })
      )
        .then((payload) => {
          const newVaults = payload.filter(Boolean).map(
            (p) =>
              p &&
              toState({
                existing: p.vault,
                address: p.address,
                decimals: p.vault.token.decimals,
                data: p.data,
                account,
              })
          ) as Vault[];

          if (newVaults && hasStateChanged(vaults, newVaults)) {
            dispatch(setVaults(newVaults));
          }
        })
        .catch((err) => {
          console.warn("Problem fetching on chain data", err);
        });
    }
  }, [
    account,
    shouldUpdate,
    active,
    chainId,
    block.number,
    dispatch,
    monoContracts,
    capContracts,
    authContracts,
    tokenContracts,
    vaults,
  ]);
  return { loading: false };
};
