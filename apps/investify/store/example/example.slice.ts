import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const vaultSlice = createSlice({
  name: 'vault',

  initialState: {
    x: 'Initial state'
  },

  reducers: {
    setX: (state, action: PayloadAction<string>) => {
      state.x = action.payload;
    } 
  },
});

export const {
  setX
} = vaultSlice.actions
export default vaultSlice.reducer;

