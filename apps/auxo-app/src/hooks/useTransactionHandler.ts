import { AnyAction } from "@reduxjs/toolkit";
import { ContractTransaction } from "ethers";
import { Dispatch } from "react";
import { setAlert } from "../store/app/app.slice";
import { checkForEvent } from "../utils/event";

export const handleTransaction = async (
  transaction: ContractTransaction | undefined,
  event: "string",
  dispatch: Dispatch<AnyAction>
) => {
  const confirm = transaction && (await checkForEvent(transaction, event));
  if (confirm) {
    dispatch(
      setAlert({
        message: "Transaction Approved",
        type: "PENDING",
        show: true,
      })
    );
  } else {
    dispatch(
      setAlert({
        message: "There was a problem with the transaction",
        type: "ERROR",
        show: true,
      })
    );
  }
};

type PendingTX = {
  name: string;
  previousValue: any;
  onSuccess: string;
  timeout: number;
  createdAt: number;
};

export class PendingTXHandler {
  constructor(public transactions: PendingTX[] = []) {}

  public getPendingTx(name: string): PendingTX | undefined {
    return this.transactions.find((t) => t.name === name);
  }

  public addPendingTX(tx: PendingTX): void {
    this.transactions.push(tx);
  }

  public removePendingTx(name: string): void {
    this.transactions = this.transactions.filter((t) => t.name !== name);
  }

  public confirmPendingTx(name: string, dispatch: Dispatch<AnyAction>) {
    const pendingTx = this.getPendingTx(name);
    if (pendingTx) {
      dispatch(
        setAlert({
          message: pendingTx.onSuccess,
          show: true,
          type: "SUCCESS",
        })
      );
      this.removePendingTx(name);
    }
  }

  public txHasTimedOut(tx: PendingTX): boolean {
    return tx.createdAt + tx.timeout > new Date().getTime();
  }

  public timeoutPendingTx(name: string, dispatch: Dispatch<AnyAction>) {
    const pendingTx = this.getPendingTx(name);
    if (pendingTx && this.txHasTimedOut(pendingTx)) {
      dispatch(
        setAlert({
          message: `Transaction ${pendingTx.name} has timed out after ${pendingTx.timeout}ms`,
          show: true,
          type: "ERROR",
        })
      );
      this.removePendingTx(name);
    }
  }
}
