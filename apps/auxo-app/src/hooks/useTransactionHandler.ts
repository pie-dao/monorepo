import { AnyAction } from "@reduxjs/toolkit";
import { ContractTransaction, ethers } from "ethers";
import { Dispatch, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from ".";
import { setAlert } from "../store/app/app.slice";

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


export const handleTx = async ({
  tx,
  onSuccess,
  library,
  dispatch
}: {
  tx: ContractTransaction,
  onSuccess: CallableFunction,
  library: ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider,
  dispatch: Dispatch<AnyAction>
}) => {
  
  const receipt = await library.getTransactionReceipt(tx.hash);
  if (receipt.status === 1) {
      await onSuccess()
      dispatch(
        setAlert({
          message: 'TX Success (NEW)',
          type: 'SUCCESS'
        })
      );
    } else {
      dispatch(
        setAlert({
          message: "There was a problem with the transaction",
          type: "ERROR",
        })
      );
    }
}   

export const handleTransaction = async (
  transaction: ContractTransaction | undefined,
  event: string,
  dispatch: Dispatch<AnyAction>
) => {
  const confirm = transaction && (await checkForEvent(transaction, event));
  if (confirm) {
    dispatch(
      setAlert({
        message: "Transaction Pending",
        type: "PENDING",
        name: event,
      })
    );
  } else {
    dispatch(
      setAlert({
        message: "There was a problem with the transaction",
        type: "ERROR",
      })
    );
  }
};

export const usePendingTransaction = (): boolean => {
  const alert = useAppSelector((state) => state.app.alert);
  return alert.type === "PENDING";
};

export const useAwaitPendingStateChange = (
  stateVariable: any,
  alertName: string
): boolean => {
  /**
   * useRef prevents fire on first render, and instead listens for a state change after the
   * component has first rendered
   */
  const [succeeded, setSucceeded] = useState(false);
  const dispatch = useAppDispatch();
  const currentAlert = useAppSelector((state) => state.app.alert);
  const onFirstLoad = useRef(true);

  useEffect(() => {
    if (!onFirstLoad.current && currentAlert.name === alertName) {
      dispatch(
        setAlert({
          message: "Transaction Approved",
          type: "SUCCESS",
        })
      );
      setSucceeded(true);
    } else {
      onFirstLoad.current = false;
    }
  }, [dispatch, stateVariable, currentAlert.name, alertName]);

  return succeeded;
};
