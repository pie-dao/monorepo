import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Step = 'quote' | 'swap' | 'approve' | 'confirm' | 'complete';
type SliceState = { step: Step; modalOpen: boolean };

const initialState: SliceState = { step: 'quote', modalOpen: false };

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
  },
});

export const { setStep, setOpenModal } = sidebarSlice.actions;
export default sidebarSlice.reducer;
