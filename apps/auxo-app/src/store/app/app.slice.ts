import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AppState = {
  error: string | undefined
  chainId: number | undefined;
}

const appSlice = createSlice({
  name: 'application',
  initialState: {
    error: undefined,
    chainId: undefined
  } as AppState,
  reducers: {
    setError: (state, action: PayloadAction<string | undefined>) => {
      state.error = action.payload;
    },
    setChainId: (state, action: PayloadAction<number>) => {
      state.chainId = action.payload;
    }
  }
})

export const { 
  setError,
  setChainId
} = appSlice.actions;

export default appSlice.reducer;