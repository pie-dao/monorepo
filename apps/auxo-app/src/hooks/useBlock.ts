import { useWeb3React } from "@web3-react/core";
import { providers } from "ethers";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { LibraryProvider, SetStateType } from "../types/utilities";
import { useWeb3Cache } from "./useCachedWeb3";

type Block = {
  number: number | null | undefined;
};

export type UseBlockReturnType = {
  block: Block;
};

const getCurrentBlock = (
  library: providers.Web3Provider | providers.JsonRpcProvider,
  setBlock: SetStateType<Block>
): void => {
  library
    .getBlockNumber()
    .then((blockNumber: number) => {
      setBlock({
        number: blockNumber,
      });
    })
    .catch(() => {
      console.warn("Error getting first block");
      setBlock({
        number: null,
      });
    });
};

const updateBlockNumber = (
  blockNumber: number,
  setBlock: SetStateType<Block>,
  previousBlockNumber: MutableRefObject<number>
): void => {
  if (!blockNumber) return;
  setBlock({
    number: blockNumber,
  });
  previousBlockNumber.current = blockNumber;
};

export const useBlock = (): UseBlockReturnType => {
  const { library } = useWeb3React<LibraryProvider>();
  const { chainId } = useWeb3Cache();
  const [block, setBlock] = useState<Block>({ number: null });
  const previousBlockNumber = useRef(0);

  useEffect(() => {
    // reset previous block fetch if the chain id changes
    if (chainId) previousBlockNumber.current = 0;
  }, [chainId]);

  useEffect(() => {
    if (!library) return;

    // // get the current block to set the initial state
    getCurrentBlock(library, setBlock);

    // attach the event listener
    library.on("block", (blockNumber) => {
      // Avoid stale blocks by ensuring we only increase block count
      if (blockNumber > previousBlockNumber.current) {
        updateBlockNumber(blockNumber, setBlock, previousBlockNumber);
      }
    });

    // remove the event listener when the component unmounts
    return () => {
      library.removeListener("block", updateBlockNumber);
      setBlock({ number: undefined });
    };
  }, [library]);
  return { block };
};
