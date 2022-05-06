import { useWeb3React } from '@web3-react/core';
import { providers } from 'ethers';
import { useEffect, useState } from 'react';
import { LibraryProvider, SetStateType } from '../types/utilities';
import { useWeb3Cache } from './useCachedWeb3';

type Block = {
  number: number | null | undefined;
  chainId: number | null | undefined;
};

export type UseBlockReturnType = {
  block: Block;
};

const getCurrentBlock = (
  library: providers.Web3Provider | providers.JsonRpcProvider,
  setBlock: SetStateType<Block>,
  chainId: number,
): void => {
  library
    .getBlockNumber()
    .then((blockNumber: number) => {
      setBlock({
        number: blockNumber,
        chainId,
      });
    })
    .catch((err) => {
      if (chainId !== library._network.chainId) {
        console.warn(
          'Chain ID discrepancy between the provider and the application',
        );
        // Chain Ids can decouple when switching from an unsupported chain
        // adding this line appears to solve the issue for the time being, but we need to look
        // for a better solution
        library._network.chainId = chainId;
      }
      console.warn('Error getting first block', err);
      setBlock({
        number: null,
        chainId: null,
      });
    });
};

export const useBlock = (): UseBlockReturnType => {
  const { library } = useWeb3React<LibraryProvider>();
  const { chainId } = useWeb3Cache();
  const [block, setBlock] = useState<Block>({ number: null, chainId: null });

  useEffect(() => {
    if (!library || !chainId) return;

    console.debug({ chainId, library });

    // get the current block to set the initial state
    getCurrentBlock(library, setBlock, chainId);

    // Removing event listeners correctly requires
    // the same named function be bound to the listener as removed
    // if you don't do this, the listener will not be removed
    // when we switch networks
    const updateBlockNumber = (blockNumber: number) => {
      if (!blockNumber) return;
      setBlock({
        number: blockNumber,
        chainId,
      });
    };

    // attach the event listener
    library.on('block', updateBlockNumber);

    // remove the event listener when the component unmounts
    return () => {
      library.removeListener('block', updateBlockNumber);
      setBlock({ number: undefined, chainId: null });
    };
  }, [library, chainId]);
  return { block };
};
