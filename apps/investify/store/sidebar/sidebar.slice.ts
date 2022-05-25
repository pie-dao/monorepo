import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Step = 'quote' | 'swap' | 'approve' | 'confirm' | 'complete';
type SliceState = { step: Step };

const initialState: SliceState = { step: 'quote' };

export const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    setStep: (state, action: PayloadAction<Step>) => {
      state.step = action.payload;
    },
  },
});

export const { setStep } = sidebarSlice.actions;
export default sidebarSlice.reducer;
