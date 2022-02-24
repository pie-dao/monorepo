import { useWeb3React } from "@web3-react/core";
import { providers } from "ethers";
import { useEffect, useState } from "react";
import { SetStateType } from "../types/utilities";
import { useWeb3Cache } from "./useCachedWeb3";

// react.strict mode causes double renders which can lead to throttling in dev mode
const REFRESH_FREQUENCY = process.env.NODE_ENV === "development" ? 10 : 5;

type Block = {
  number: number | null | undefined;
  lastUpdated: Date | undefined;
};

type UseBlockReturnType = {
  block: Block;
  firstLoad: boolean;
  refreshFrequency: number;
};

const getCurrentBlock = (
  library: providers.Web3Provider | providers.JsonRpcProvider,
  setBlock: SetStateType<Block>,
  stale: boolean,
  setFirst: SetStateType<boolean>
): void => {
  library
    .getBlockNumber()
    .then((blockNumber: number) => {
      if (!stale) {
        // Ensures we can tell components to fetch chain data on first load even with a refesh cadence
        setFirst(true);
        setBlock({
          number: blockNumber,
          lastUpdated: new Date(),
        });
      }
    })
    .catch(() => {
      console.warn("Error getting first block");
      if (!stale) {
        setBlock({
          number: null,
          lastUpdated: new Date(),
        });
      }
    });
};

const updateBlockNumber = (
  blockNumber: number,
  setBlock: SetStateType<Block>,
  setFirst: SetStateType<boolean>
): void => {
  if (!blockNumber) return;
  setBlock({
    number: blockNumber,
    lastUpdated: new Date(),
  });
  // blocks after first fetch should only trigger RPC calls on interval
  setFirst(false);
};

export const useBlock = (): UseBlockReturnType => {
  const { library } =
    useWeb3React<providers.Web3Provider | providers.JsonRpcProvider>();

  const { chainId } = useWeb3Cache();
  const [first, setFirst] = useState(false);
  const [block, setBlock] = useState<Block>({
    number: null,
    lastUpdated: new Date(),
  });

  useEffect(() => {
    if (!library) return;

    let stale = false;

    // get the current block to set the initial state
    getCurrentBlock(library, setBlock, stale, setFirst);

    // attach the event listener on first mount
    library.on("block", (blockNumber) =>
      updateBlockNumber(blockNumber, setBlock, setFirst)
    );

    // remove the event listener when the component unmounts
    return () => {
      stale = true;
      library.removeListener("block", updateBlockNumber);
      setBlock({
        number: undefined,
        lastUpdated: new Date(),
      });
    };
  }, [library, chainId]);

  return { block, firstLoad: first, refreshFrequency: REFRESH_FREQUENCY };
};
