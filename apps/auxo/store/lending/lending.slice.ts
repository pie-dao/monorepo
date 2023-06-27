import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  thunkApproveToken,
  thunkGetLendingData,
  thunkGetUserLendingData,
  thunkLendDeposit,
  thunkRequestWithdrawal,
  thunkUnlend,
  thunkWithdraw,
} from './lending.thunks';
import { Pools, SliceState, Steps } from './lending.types';
import { merge } from 'lodash';
import { BigNumberReference } from '../products/products.types';
import { zeroBalance } from '../../utils/balances';
import addTxNotifications from '../../utils/notifications';

export const initialState: SliceState = {
  pools: {},
  loading: false,
  totalDeposited: 0,
  userTotalDeposited: 0,
  userTotalClaimable: 0,
  lendingFlow: {
    principal: null,
    step: null,
    open: false,
    tx: {
      hash: null,
      status: null,
    },
    showCompleteModal: false,
    spender: null,
    selectedPool: null,
    preference: 1,
    amount: zeroBalance,
  },
};

const appSlice = createSlice({
  name: 'lending',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(thunkGetLendingData.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(thunkGetLendingData.rejected, (state, action) => {
      console.error(action.error);
      state.loading = false;
    });

    builder.addCase(thunkGetLendingData.fulfilled, (state, action) => {
      appSlice.caseReducers.setLendingData(state, {
        ...action,
        payload: {
          ...action.payload,
        },
      });
      state.loading = false;
    });

    builder.addCase(thunkGetUserLendingData.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(thunkGetUserLendingData.rejected, (state, action) => {
      console.error(action.error);
      state.loading = false;
    });

    builder.addCase(thunkGetUserLendingData.fulfilled, (state, action) => {
      appSlice.caseReducers.setUserLendingData(state, {
        ...action,
        payload: {
          ...action.payload,
        },
      });
      state.loading = false;
    });

    addTxNotifications(builder, thunkApproveToken, 'approveToken');
    addTxNotifications(builder, thunkLendDeposit, 'lendDeposit');
    addTxNotifications(builder, thunkUnlend, 'unlend');
    addTxNotifications(builder, thunkWithdraw, 'withdraw');
    addTxNotifications(builder, thunkRequestWithdrawal, 'requestWithdrawal');
  },

  reducers: {
    setLendingData: (
      state,
      action: PayloadAction<{
        totalDeposited?: number;
        userTotalDeposited?: number;
        userTotalClaimable?: number;
        pools: Pools;
      }>,
    ) => {
      state.pools = merge({}, state.pools, action.payload.pools);
      state.totalDeposited = action.payload.totalDeposited;
    },
    setUserLendingData: (
      state,
      action: PayloadAction<{
        userTotalDeposited?: number;
        userTotalClaimable?: number;
        pools: Pools;
      }>,
    ) => {
      state.pools = merge({}, state.pools, action.payload.pools);
      state.userTotalDeposited = action.payload.userTotalDeposited;
      state.userTotalClaimable = action.payload.userTotalClaimable;
    },
    setFlowState: (state, action: PayloadAction<SliceState['lendingFlow']>) => {
      state.lendingFlow = action.payload;
    },
    setLendingStep: (state, action: PayloadAction<Steps>) => {
      state.lendingFlow.step = action.payload;
    },
    setLendingFlowOpen: (state, action: PayloadAction<boolean>) => {
      state.lendingFlow.open = action.payload;
    },
    setTx: (state, action: PayloadAction<SliceState['lendingFlow']['tx']>) => {
      state.lendingFlow.tx = action.payload;
    },
    setTxHash: (state, action: PayloadAction<string>) => {
      state.lendingFlow.tx.hash = action.payload;
    },
    setLendingFlowPool: (state, action: PayloadAction<string>) => {
      state.lendingFlow.selectedPool = action.payload;
    },
    setDepositValue: (state, action: PayloadAction<BigNumberReference>) => {
      state.lendingFlow.amount = action.payload;
    },
    setSpender: (state, action: PayloadAction<string>) => {
      state.lendingFlow.spender = action.payload;
    },
    setPrincipal: (state, action: PayloadAction<string>) => {
      state.lendingFlow.principal = action.payload;
    },
    setPreference: (state, action: PayloadAction<number>) => {
      state.lendingFlow.preference = action.payload;
    },
  },
});

export const {
  setLendingFlowOpen,
  setLendingStep,
  setTx,
  setTxHash,
  setLendingFlowPool,
  setDepositValue,
  setSpender,
  setPrincipal,
  setFlowState,
  setPreference,
} = appSlice.actions;

export default appSlice.reducer;
