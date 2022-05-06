import { useWeb3React } from '@web3-react/core';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useAppDispatch } from '../';
import { useContracts } from './useMultichainContract';
import { Vault } from '../../store/vault/Vault';
import { setVaults } from '../../store/vault/vault.slice';
import {
  chainMap,
  isChainSupported,
  SUPPORTED_CHAIN_ID,
} from '../../utils/networks';
import { useProxySelector } from '../../store';
import hash from 'object-hash';
import { useWeb3Cache } from '../useCachedWeb3';
import { useBlock } from '../useBlock';
import { fetchOnChainData } from '../onChainUtils/fetchOnChainData';
import { toVault } from '../onChainUtils/transformOnChainData';
import { Vault as Auxo } from '../../types/artifacts/abi';

export const hasStateChanged = (old: Vault[], change: Vault[]): boolean => {
  const oldState = hash(old, { encoding: 'base64' });
  const newState = hash(change, { encoding: 'base64' });
  return oldState !== newState;
};

// change frequency of updates based on chain to achieve a target state latency
export const getRefreshFrequency = (chainId: number | undefined): number => {
  const targetLatency = 10; // seconds
  const fallbackFrequency = 10; // blocks
  if (!isChainSupported(chainId)) return fallbackFrequency; // blocks
  const averageBlockTime = chainMap[chainId as SUPPORTED_CHAIN_ID].blockTime; // seconds

  // update each min - wont work for BTC
  return Math.round(targetLatency / averageBlockTime); // blocks
};

/**
 * Fetches onChain calldata through the provider, then compares the result to the
 * current state to see whether or not to update.
 *
 * If a multicall contract is deployed, contract calls will route through the multicall provider.
 *
 * A very big caveat with this approach is the RPC rate limits for Metamask:
 * Excessive calls will return RPC console errors as the node gets throttled and the UI will not be updated.
 *
 * Better to invoke calls less frequently, but as needed:
 * -- Invoke on first load
 * -- Invoke every X blocks
 *
 * -- Don't bother invoking if we are still awaiting the resolution of a previous call
 *  (this is useful if a large number of blocks come through at once)
 * -- Don't invoke if we have already processed data for a given blocknumber
 *  (this is useful because state changes cause a re-render of the hook)
 */
export const useChainData = (): { loading: boolean } => {
  const { account, active } = useWeb3React();
  const [loading, setLoading] = useState(false);
  const lastUpdatedBlock = useRef<null | number | undefined>(null);
  const latestRequest = useRef(0);
  const { chainId } = useWeb3Cache();
  const { block } = useBlock();
  const refreshFrequency = getRefreshFrequency(chainId);
  const dispatch = useAppDispatch();
  const vaults = useProxySelector((state) => state.vault.vaults);
  const { tokenContracts, authContracts, auxoContracts } = useContracts();

  useEffect(() => {
    // Reset last updated (force a reload) if the chain ID or account changes
    if (!chainId) return;
    lastUpdatedBlock.current = null;
  }, [account, chainId]);

  const shouldUpdate = useMemo(() => {
    // do not update state if vital data missing, account null is valid
    if (!chainId || !block || !block.number || account === undefined)
      return false;

    // Ensure we always fetch data on first load or if key variables change
    if (!lastUpdatedBlock.current) return true;

    // don't update if state is updating
    if (loading) return false;

    // don't update the state if the block number hasn't changed
    if (block.number === lastUpdatedBlock.current) return false;

    // Refresh data on an interval per X blocks
    const blockFrequencyConditionMet = block.number % refreshFrequency === 0;

    // No point updating state if any of the contracts are missing
    const contractsExist =
      tokenContracts.length > 0 &&
      auxoContracts.length > 0 &&
      authContracts.length > 0;

    return (
      active &&
      contractsExist &&
      chainMap[chainId as SUPPORTED_CHAIN_ID] &&
      blockFrequencyConditionMet
    );
  }, [
    loading,
    lastUpdatedBlock,
    block,
    refreshFrequency,
    tokenContracts,
    authContracts,
    auxoContracts,
    chainId,
    active,
    account,
  ]);

  useEffect(() => {
    if (shouldUpdate) {
      setLoading(true);
      // Capture when request sent to ensure state doesn't get overwritten with async stale data
      const thisRequest = new Date().getTime();

      // dev logging is too useful to keep adding and removing
      if (process.env.NODE_ENV === 'development')
        console.debug(
          'Network call at',
          thisRequest,
          'Last Call at',
          latestRequest.current,
          'diff',
          (thisRequest - latestRequest.current) / 1000,
        );
      latestRequest.current = thisRequest;

      // Multicall contract executes promise all as a batch request
      Promise.all(
        // Get all relevant contracts for the underlying token
        tokenContracts.map(async (token) => {
          const vault = vaults.find(
            (v) =>
              v.token.address.toLowerCase() === token.address.toLowerCase(),
          ) as Vault;
          const auxo = auxoContracts.find(
            (m) => m.address.toLowerCase() === vault?.address.toLowerCase(),
          ) as Auxo;
          const auth = authContracts.find(
            (a) =>
              a.address.toLowerCase() === vault?.auth.address.toLowerCase(),
          );
          return await fetchOnChainData({
            token,
            auxo,
            auth,
            batchBurnRound: vault.stats?.batchBurnRound,
            account,
            vault,
          });
        }),
      )
        .then((vaultChainData) => {
          // convert the vaults to a state object
          const newVaults = vaultChainData
            // filter ensures undefined responses are removed and can be safely cast
            .filter(Boolean)
            .map(
              (data) =>
                data &&
                toVault({
                  existing: data.existing,
                  data,
                  account,
                }),
            ) as Vault[];

          // discard data that has taken too long to reach us
          if (thisRequest < latestRequest.current) return;

          // Only trigger a state update if we have new data
          if (newVaults && hasStateChanged(vaults, newVaults)) {
            dispatch(setVaults(newVaults));
          }
        })
        .catch((err) => {
          console.warn('Problem fetching on chain data', err);
        })
        .finally(() => {
          lastUpdatedBlock.current = block.number;
          setLoading(false);
        });
    }
  }, [
    account,
    shouldUpdate,
    active,
    chainId,
    block.number,
    dispatch,
    auxoContracts,
    authContracts,
    tokenContracts,
    vaults,
  ]);
  return { loading };
};
