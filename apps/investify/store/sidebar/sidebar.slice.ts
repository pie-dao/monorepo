import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Step = 'quote' | 'swap' | 'approve' | 'confirm' | 'complete' | 'vault';
type SliceState = {
  step: Step;
  modalOpen: boolean;
  swap: {
    from: string;
    to: string;
  };
  vault: string;
};

const initialState: SliceState = {
  step: 'quote',
  modalOpen: false,
  swap: {
    from: '',
    to: '',
  },
  vault: '',
};

export const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    setStep: (state, action: PayloadAction<Step>) => {
      state.step = action.payload;
    },
    setOpenModal: (state, action: PayloadAction<boolean>) => {
      state.modalOpen = action.payload;
    },
    setSwap: (
      state,
      action: PayloadAction<{ step: Step; swap: SliceState['swap'] }>,
    ) => {
      state.swap = action.payload.swap;
      state.step = action.payload.step;
    },
    setSidebarVault: (state, action: PayloadAction<string>) => {
      state.vault = action.payload;
      state.step = 'vault';
    },
  },
});

export const { setStep, setOpenModal, setSwap, setSidebarVault } =
  sidebarSlice.actions;
export default sidebarSlice.reducer;
