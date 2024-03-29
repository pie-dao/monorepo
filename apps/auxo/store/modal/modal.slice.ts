import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SliceState, Steps } from './modal.types';
import { PrvWithdrawalRecipient } from '../../types/merkleTree';

export const initialState: SliceState = {
  step: null,
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
  isConvertAndStake: false,
  showCompleteModal: false,
  isIncreasedValue: false,
  claim: null,
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
    setShowCompleteModal: (state, action: PayloadAction<boolean>) => {
      state.showCompleteModal = action.payload;
    },
    setState: (state, action: PayloadAction<SliceState>) => {
      state.isOpen = action.payload.isOpen;
      state.step = action.payload.step;
      state.tx = action.payload.tx;
      state.swap = action.payload.swap;
      state.showCompleteModal = action.payload.showCompleteModal;
    },
    setIsConvertAndStake: (state, action: PayloadAction<boolean>) => {
      state.isConvertAndStake = action.payload;
    },
    setIsIncreasedValue: (state, action: PayloadAction<boolean>) => {
      state.isIncreasedValue = action.payload;
    },
    setClaim: (
      state,
      action: PayloadAction<
        PrvWithdrawalRecipient & {
          account: string;
        }
      >,
    ) => {
      state.claim = action.payload;
    },
  },
});

export const {
  setStep,
  setIsOpen,
  setSwap,
  setTx,
  setTxHash,
  setTxState,
  setShowCompleteModal,
  setState,
  setIsConvertAndStake,
  setIsIncreasedValue,
  setClaim,
} = sidebarSlice.actions;
export default sidebarSlice.reducer;
