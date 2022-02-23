import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type AlertTypes = 'SUCCESS' | 'PENDING' | 'ERROR' | undefined;
export type ActionTypes = 'SWITCH_NETWORK' | undefined;

type TX = {
  hash: string;
  status: AlertTypes;
}

export type TxState = {
  queue: TX[] | [];
}

const initialAlertState: TxState = {
  queue: []
}

const txSlice = createSlice({
  name: 'tx',
  initialState: initialAlertState,
  reducers: {
    setAddTxToQueue: (state, action: PayloadAction<TX>) => {
      state.queue = [...state.queue, action.payload];
    },
    setRemoveTxFromQueue: (state, action: PayloadAction<string>) => {
      state.queue = state.queue.filter(t => t.hash !== action.payload);
    },
    setConfirmTx: (state, action: PayloadAction<string>) => {
      const tx = state.queue.find(t => t.hash === action.payload);
      if (!tx) return;
      tx.status = 'SUCCESS';
      txSlice.caseReducers.setRemoveTxFromQueue(state, action)
    }
  }
})

export const { 
  setAddTxToQueue,
  setRemoveTxFromQueue,
  setConfirmTx
} = txSlice.actions;

export default txSlice.reducer;