import { useWeb3React } from "@web3-react/core";
import { providers } from "ethers";
import { useEffect, useState } from "react";
import { useWeb3Cache } from "./useCachedWeb3";

type Block = {
  blockNumber: number | null | undefined;
  lastUpdated: Date | undefined;
};

export const useBlock = (): Block => {
  const { library } = useWeb3React<
    providers.Web3Provider | providers.JsonRpcProvider
  >();
  const { chainId } = useWeb3Cache();
  const [block, setBlock] = useState<Block>({
    blockNumber: null,
    lastUpdated: new Date(),
  });
  useEffect(() => {
    if (!!library) {
      let stale = false;

      library
        .getBlockNumber()
        .then((blockNumber: number) => {
          if (!stale) {
            setBlock({
              blockNumber,
              lastUpdated: new Date(),
            });
          }
        })
        .catch(() => {
          if (!stale) {
            setBlock({
              blockNumber: null,
              lastUpdated: new Date(),
            });
          }
        });

      const updateBlockNumber = (blockNumber: number) => {
        setBlock({
          blockNumber,
          lastUpdated: new Date(),
        });
      };
      library.on("block", updateBlockNumber);

      return () => {
        stale = true;
        library.removeListener("block", updateBlockNumber);
        setBlock({
          blockNumber: undefined,
          lastUpdated: new Date(),
        });
      };
    }
  }, [library, chainId]); // ensures refresh if referential identity of library doesn't change across chainIds

  return block;
};
