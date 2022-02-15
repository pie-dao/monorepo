import { AnyAction } from "@reduxjs/toolkit";
import { ContractTransaction } from "ethers";
import { Dispatch, useEffect, useRef } from "react";
import { useAppDispatch } from ".";
import { setAlert } from "../store/app/app.slice";
import { checkForEvent } from "../utils/event";

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

export const useAwaitPendingStateChange = (args: any[]) => {
  /**
   * useRef prevents fire on first render, and instead listens for a state change after the
   * component has first rendered
   */
  const dispatch = useAppDispatch()
  const onFirstLoad = useRef(true);
  useEffect(() => {
      if (!onFirstLoad.current) {
          dispatch(setAlert({
              message: 'Transaction Approved',
              type: 'SUCCESS',
              show: true
          }))
      } else {
          onFirstLoad.current = false;
      }
  }, [dispatch, ...args])
}
