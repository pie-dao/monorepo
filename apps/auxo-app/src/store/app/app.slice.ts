import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AppState = {
  error: {
    message: string | undefined;
    show: boolean;
  }
  chainId: number | undefined;
}

const appSlice = createSlice({
  name: 'application',
  initialState: {
    error: {
      message: 'Problem',
      show: false
    },
    chainId: undefined
  } as AppState,
  reducers: {
    setError: (state, action: PayloadAction<AppState['error']>) => {
      state.error.message = action.payload.message;
      state.error.show = action.payload.show;
    },
    setErrorDisplay: (state, action: PayloadAction<boolean>) => {
      state.error.show = action.payload;
    },
    setChainId: (state, action: PayloadAction<number>) => {
      state.chainId = action.payload;
    }
  }
})

export const { 
  setError,
  setErrorDisplay,
  setChainId
} = appSlice.actions;

export default appSlice.reducer;