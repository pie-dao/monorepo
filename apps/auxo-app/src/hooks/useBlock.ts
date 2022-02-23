import { useWeb3React } from "@web3-react/core";
import { providers } from "ethers";
import { useEffect, useState } from "react";
import { useAppSelector } from ".";
import { useWeb3Cache } from "./useCachedWeb3";

type Block = {
  blockNumber: number | null | undefined;
  lastUpdated: Date | undefined;
};

enum TXStatus {
  FAILED,
  SUCCESS
}

export const useBlock = (): Block => {
  const queue = useAppSelector(state => state.tx.queue);
  const { library } = useWeb3React<
    providers.Web3Provider | providers.JsonRpcProvider
  >();
  const { chainId } = useWeb3Cache();
  const [block, setBlock] = useState<Block>({
    blockNumber: null,
    lastUpdated: new Date(),
  });
  // @ts-ignore
  useEffect(async () => {
    try {
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
          console.debug('caught err')
          if (!stale) {
            setBlock({
              blockNumber: null,
              lastUpdated: new Date(),
            });
          }
        });

      const updateBlockNumber = (blockNumber: number) => {
        // console.debug({ queue })
        library.getBlockWithTransactions(blockNumber).then(block => {
          block.transactions.forEach(async (tx, i) => {
            // const foundTx = queue.find(q => q.hash = tx.hash);
            // if (!foundTx) return;
            // foundTx.status
            if (i !== 0) return;
            // console.debug({tx});
            const receipt = await library.getTransactionReceipt(tx.hash);
            // console.log(receipt?.status === TXStatus.SUCCESS ? 'SUCCESS' : 'FAIL')            
          })
        }).catch(err => console.log('caught err'));
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
  } catch (Err) {
    console.debug('caught err')
  }
  }, [library, chainId]); // ensures refresh if referential identity of library doesn't change across chainIds

  return block;
};
