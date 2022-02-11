import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type AlertTypes = 'SUCCESS' | 'PENDING' | 'ERROR' | undefined;
export type ActionTypes = 'SWITCH_NETWORK' | undefined;

export type AppState = {
  alert: {
    message: string | undefined;
    show: boolean;
    type: AlertTypes;
    action?: ActionTypes;
  }
  chainId: number | undefined;
}

const initialAlertState: AppState['alert'] = {
  message: undefined,
  show: false,
  type: undefined,
  action: undefined
}

const appSlice = createSlice({
  name: 'application',
  initialState: {
    alert: initialAlertState,
    chainId: undefined
  } as AppState,
  reducers: {
    setAlert: (state, action: PayloadAction<AppState['alert']>) => {
      state.alert = action.payload;
    },
    setAlertDisplay: (state, action: PayloadAction<boolean>) => {
      state.alert.show = action.payload;
    },
    setChainId: (state, action: PayloadAction<number>) => {
      state.chainId = action.payload;
    },
    clearAlert: (state) => {
      state.alert = initialAlertState;
    }
  }
})

export const { 
  setAlert,
  clearAlert,
  setAlertDisplay,
  setChainId
} = appSlice.actions;

export default appSlice.reducer;