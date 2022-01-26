import { Contract, ContractTransaction } from "@ethersproject/contracts";
import { Transaction } from "@ethersproject/transactions";
import { TXRejectedError } from "../errors";

export const checkForEvent = async (tx: ContractTransaction, eventName: string): Promise<boolean> => {
  const awaitedTx = await tx.wait();
  const targetEvent = awaitedTx.events?.find(({ event }) => event === eventName);
  return !!targetEvent;
}

