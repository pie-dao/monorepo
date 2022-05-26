import {
  ActionReducerMapBuilder,
  AsyncThunk,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import {
  thunkApproveDeposit,
  thunkMakeDeposit,
  thunkConfirmWithdrawal,
  thunkIncreaseWithdrawal,
  thunkAuthorizeDepositor,
} from '../vault/vault.thunks';

export type AlertTypes = 'SUCCESS' | 'PENDING' | 'ERROR' | undefined;
export type ActionTypes = 'SWITCH_NETWORK' | undefined;

/**
 * Application-wide state, handling notifications and also a cached chain id to reduce network calls
 */
export type AppState = {
  alert: {
    message: string | undefined;
    type: AlertTypes;
    show?: boolean;
    action?: ActionTypes;
    name?: string | undefined;
  };
  chainId: number | undefined;
};

const initialAlertState: AppState['alert'] = {
  message: undefined,
  show: false,
  type: undefined,
  action: undefined,
  name: undefined,
};

/**
 * DRY utility function to attach user-friendly notification on Success/Pending/Error
 * The error handler will also log the specific error to the console for the developer
 * @param builder pass the builder exposed as the first arg of the extraReducers function
 * @param thunk import a thunk created with RTK's createAsyncThunk
 */
const addTxNotifications = (
  builder: ActionReducerMapBuilder<AppState>,
  // We could narrow the typedefs from any, but this adds substantial boilerplate
  // for a very simple set of functions that don't rely heavily on type inference
  thunk: AsyncThunk<any, any, {}>,
) => {
  builder.addCase(thunk.fulfilled, (state) => {
    state.alert = {
      message: 'Transaction Successful',
      type: 'SUCCESS',
      show: true,
    };
  });
  builder.addCase(thunk.pending, (state) => {
    state.alert = {
      message: 'Transaction Pending',
      type: 'PENDING',
      show: true,
    };
  });
  builder.addCase(thunk.rejected, (state, action) => {
    // log the actual error here
    console.error(action.error);
    state.alert = {
      message: 'Transaction Failed',
      type: 'ERROR',
      show: true,
    };
  });
};

const appSlice = createSlice({
  name: 'application',
  initialState: {
    alert: initialAlertState,
    chainId: undefined,
  } as AppState,
  extraReducers: (builder) => {
    addTxNotifications(builder, thunkMakeDeposit);
    addTxNotifications(builder, thunkApproveDeposit);
    addTxNotifications(builder, thunkConfirmWithdrawal);
    addTxNotifications(builder, thunkIncreaseWithdrawal);
    addTxNotifications(builder, thunkAuthorizeDepositor);
  },

  reducers: {
    setAlert: (state, action: PayloadAction<AppState['alert']>) => {
      state.alert = action.payload;
      state.alert.show = true;
    },
    setAlertDisplay: (state, action: PayloadAction<boolean>) => {
      state.alert.show = action.payload;
    },
    setChainId: (state, action: PayloadAction<number>) => {
      state.chainId = action.payload;
    },
    clearAlert: (state) => {
      state.alert = initialAlertState;
    },
  },
});

export const { setAlert, clearAlert, setAlertDisplay, setChainId } =
  appSlice.actions;

export default appSlice.reducer;
