import { useWeb3React } from "@web3-react/core";
import { useEffect } from "react";
import { useAppDispatch } from ".";
import { Erc20, Mono } from "../types/artifacts/abi";
import {
  useMultipleMerkleAuthContract,
  useMultipleMonoContract,
  useMultipleTokenContract,
} from "./useContract";
import { Balance, Vault } from "../store/vault/Vault";
import { AwaitedReturn, fromScale, toBalance } from "../utils";
import { useAddresses } from "./useAddresses";
import { setVaults } from "../store/vault/vault.slice";
import { BigNumber } from "@ethersproject/bignumber";
import { chainMap } from "../utils/networks";
import { useProxySelector } from "../store";
import hash from "object-hash";
import { useWeb3Cache } from "./useCachedWeb3";
import { useBlock } from "./useBlock";

const getAllBalances = async (
  token: Erc20,
  vault: Mono,
  batchBurnRound?: number,
  account?: string
) => {
  const calls: Promise<BigNumber | BigNumber[]>[] = [
    vault.totalUnderlying(),
    vault.lastHarvest(),
    vault.estimatedReturn(),
    vault.batchBurnRound(),
  ];

  if (account) {
    [
      token.balanceOf(account),
      vault.balanceOf(account),
      vault.balanceOfUnderlying(account),
      token.allowance(account, vault.address),
      vault.userBatchBurnReceipts(account),
    ].forEach((call) => calls.push(call));
  }

  if (batchBurnRound && batchBurnRound > 0) {
    calls.push(vault.batchBurns(batchBurnRound - 1));
  }

  return await Promise.all(calls);
};

const calculateAvailable = (
  shares: BigNumber,
  amountPerShare: BigNumber,
  decimals: number
): Balance => {
  /**
   *
   */
  const _amountPerShare = fromScale(amountPerShare, decimals);
  const bigAvailable = shares.mul(_amountPerShare);
  return toBalance(bigAvailable, decimals);
};

const toState = ({
  existing,
  address,
  decimals,
  data,
  account,
}: {
  existing: Vault;
  address: string;
  decimals: number;
  data: AwaitedReturn<typeof getAllBalances>;
  account?: string;
}): Vault => {
  /**
   * Rebuilds the entire vault before making a dispatch call
   * This allows us to check we actually have changes before triggering
   * a state update. Useful for controlling re-renders and preventing
   * hammering of the node
   *
   * @dev - clean this up a bit for multichain.
   * It works, but it's big and not easy to maintain
   */
  const toNumber = (n: BigNumber | BigNumber[]): number =>
    (n as BigNumber).toNumber();
  let returnValue = {
    ...existing,
    stats: {
      deposits: toBalance(data[0] as BigNumber, decimals),
      lastHarvest: toNumber(data[1]),
      currentAPY: toNumber(data[2]),
      batchBurnRound: toNumber(data[3]),
    },
  };
  if (account)
    returnValue = {
      ...returnValue,
      userBalances: {
        wallet: toBalance(data[4] as BigNumber, decimals),
        vault: toBalance(data[5] as BigNumber, decimals),
        vaultUnderlying: toBalance(data[6] as BigNumber, decimals),
        allowance: toBalance(data[7] as BigNumber, decimals),
        batchBurn: {
          round: (data[8] as BigNumber[])[0].toNumber(),
          shares: toBalance((data[8] as BigNumber[])[1], decimals),
          // there is a bug here whereby the available data is not computed until
          // the next block cycle. This is a problem with slower block times
          available:
            returnValue.userBalances?.batchBurn.available ??
            toBalance(0, decimals),
        },
      },
    };
  if (data[9]) {
    returnValue = {
      ...returnValue,
      userBalances: {
        ...returnValue.userBalances!,
        batchBurn: {
          ...returnValue.userBalances?.batchBurn!,
          available: calculateAvailable(
            (data[8] as BigNumber[])[1],
            (data[9] as BigNumber[])[1],
            decimals
          ),
        },
      },
    };
  }
  return returnValue;
};

const hasStateChanged = (old: Vault[], change: Vault[]): boolean => {
  const hasChanged =
    hash(old, { encoding: "base64" }) !== hash(change, { encoding: "base64" });
  return hasChanged;
};

const useTokenAddresses = () => {
  return useProxySelector((state) =>
    state.vault.vaults.map((v) => v.token.address).filter((v) => !!v)
  ) as string[];
};

const useMerkleAuthAddresses = () => {
  return useProxySelector((state) =>
    state.vault.vaults.map((v) => v.auth.address).filter((v) => !!v)
  ) as string[];
};

const useContracts = (chainId?: number) => {
  const tokenAddresses = useTokenAddresses();
  const monoAddresses = useAddresses();
  const authAddresses = useMerkleAuthAddresses();
  const monoContracts = useMultipleMonoContract(monoAddresses, true, chainId);
  const authContracts = useMultipleMerkleAuthContract(
    authAddresses,
    true,
    chainId
  );
  const tokenContracts = useMultipleTokenContract(
    tokenAddresses,
    true,
    chainId
  );
  return {
    monoContracts,
    tokenContracts,
    authContracts,
  };
};

export const useChainData = (): { loading: boolean } => {
  const { account, active } = useWeb3React();
  const { chainId } = useWeb3Cache();
  const { blockNumber } = useBlock();
  const dispatch = useAppDispatch();
  const vaults = useProxySelector((state) => state.vault.vaults);
  const { monoContracts, tokenContracts } = useContracts(chainId);

  useEffect(() => {
    if (
      account &&
      active &&
      tokenContracts.length > 0 &&
      monoContracts.length > 0 &&
      chainId &&
      chainMap[chainId]
    ) {
      // Multicall contract executes promise all as a batch request
      Promise.all(
        tokenContracts.map(async (token) => {
          const vault = vaults.find(
            async (v) => v.token?.address === token.address
          );
          const mono = monoContracts.find((m) => m.address === vault?.address);
          if (mono && vault) {
            const data = {
              vault,
              address: mono.address,
              data: await getAllBalances(
                token,
                mono,
                vault.stats?.batchBurnRound,
                account
              ),
            };
            return data;
          }
        })
      )
        .then((payload) => {
          const newVaults = payload
            .filter((p) => !!p)
            .map((p) => {
              return (
                p &&
                toState({
                  existing: p.vault,
                  address: p.address,
                  decimals: p.vault.token.decimals,
                  data: p.data,
                  account,
                })
              );
            }) as Vault[];

          if (newVaults && hasStateChanged(vaults, newVaults)) {
            dispatch(setVaults(newVaults));
          }
        })
        .catch((err) => {
          console.warn(err);
        });
    }
  }, [
    account,
    active,
    chainId,
    blockNumber,
    dispatch,
    monoContracts,
    tokenContracts,
    vaults,
  ]);
  return { loading: false };
};
