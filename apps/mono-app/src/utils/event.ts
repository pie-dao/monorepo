import { ContractTransaction } from "@ethersproject/contracts";

/**
 * Awaits the transaction confirmation to see if an event is fired
 * @param tx the transaction
 * @param eventName string name of the event
 * @returns whether or not the event was fired
 */
export const checkForEvent = async (
  tx: ContractTransaction,
  eventName: string
): Promise<boolean> => {
  const awaitedTx = await tx.wait();
  const targetEvent = awaitedTx.events?.find(
    ({ event }) => event === eventName
  );
  return !!targetEvent;
};
