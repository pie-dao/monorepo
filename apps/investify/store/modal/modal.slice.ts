import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SliceState, STEPS, Steps } from './modal.types';

const initialState: SliceState = {
  step: STEPS.APPROVE_TOKEN,
  isOpen: false,
  tx: {
    hash: null,
    status: null,
  },
  swap: {
    from: {
      amount: null,
      token: null,
    },
    to: {
      amount: null,
      token: null,
    },
    spender: null,
  },
};

export const sidebarSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    setStep: (state, action: PayloadAction<Steps>) => {
      state.step = action.payload;
    },
    setIsOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
    setSwap: (state, action: PayloadAction<{ swap: SliceState['swap'] }>) => {
      state.swap = action.payload.swap;
    },
    setTx: (state, action: PayloadAction<SliceState['tx']>) => {
      state.tx = action.payload;
    },
    setTxHash: (state, action: PayloadAction<string>) => {
      state.tx.hash = action.payload;
    },
    setTxState: (state, action: PayloadAction<SliceState['tx']['status']>) => {
      state.tx.status = action.payload;
    },
  },
});

export const { setStep, setIsOpen, setSwap, setTx, setTxHash, setTxState } =
  sidebarSlice.actions;
export default sidebarSlice.reducer;
