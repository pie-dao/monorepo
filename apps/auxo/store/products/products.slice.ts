import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  thunkGetProductsData,
  thunkGetUserProductsData,
  thunkApproveToken,
  thunkStakeAuxo,
  thunkConvertXAUXO,
  thunkGetVeAUXOStakingData,
  thunkGetUserStakingData,
  thunkGetXAUXOStakingData,
  thunkIncreaseStakeAuxo,
  thunkIncreaseLockVeAUXO,
  thunkBoostToMaxVeAUXO,
  thunkWithdrawFromVeAUXO,
  thunkStakeXAUXO,
  thunkUnstakeXAUXO,
  thunkGetUserPrvWithdrawal,
  thunkEarlyTermination,
  thunkDelegateVote,
  ThunkWithdrawPrv,
} from './thunks';
import { Tokens, SliceState } from './products.types';
import { merge } from 'lodash';
import addTxNotifications from '../../utils/notifications';

const initialState: SliceState = {
  tokens: {},
  loading: false,
  stats: {
    networks: {
      tokens: 0,
      total: 0,
    },
    assets: {
      tokensUsed: 0,
      totalProductsUsed: 0,
    },
    balance: { tokens: 0, total: 0 },
  },
  increasedStakingValue: 0,
};

const appSlice = createSlice({
  name: 'dashboard',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(thunkGetProductsData.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(thunkGetProductsData.rejected, (state, action) => {
      console.error(action.error);
      state.loading = false;
    });

    builder.addCase(thunkGetProductsData.fulfilled, (state, action) => {
      appSlice.caseReducers.setProductsState(state, {
        ...action,
        payload: {
          ...action.payload,
        },
      });
      state.loading = false;
    });

    builder.addCase(thunkGetUserProductsData.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(thunkGetUserProductsData.rejected, (state, action) => {
      console.error(action.error);
      state.loading = false;
    });

    builder.addCase(thunkGetUserProductsData.fulfilled, (state, action) => {
      appSlice.caseReducers.setState(state, {
        ...action,
        payload: {
          ...action.payload,
        },
      });
      state.loading = false;
    });

    builder.addCase(thunkGetVeAUXOStakingData.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(thunkGetVeAUXOStakingData.rejected, (state, action) => {
      console.error(action.error);
      state.loading = false;
    });

    builder.addCase(thunkGetVeAUXOStakingData.fulfilled, (state, action) => {
      appSlice.caseReducers.setProductsState(state, {
        ...action,
        payload: {
          ...action.payload,
        },
      });
      state.loading = false;
    });

    builder.addCase(thunkGetXAUXOStakingData.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(thunkGetXAUXOStakingData.rejected, (state, action) => {
      console.error(action.error);
      state.loading = false;
    });

    builder.addCase(thunkGetXAUXOStakingData.fulfilled, (state, action) => {
      appSlice.caseReducers.setProductsState(state, {
        ...action,
        payload: {
          ...action.payload,
        },
      });
      state.loading = false;
    });

    builder.addCase(thunkGetUserStakingData.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(thunkGetUserStakingData.rejected, (state, action) => {
      console.error(action.error);
      state.loading = false;
    });

    builder.addCase(thunkGetUserStakingData.fulfilled, (state, action) => {
      appSlice.caseReducers.setProductsState(state, {
        ...action,
        payload: {
          ...action.payload,
        },
      });
      state.loading = false;
    });

    builder.addCase(thunkGetUserPrvWithdrawal.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(thunkGetUserPrvWithdrawal.rejected, (state, action) => {
      console.error(action.error);
      state.loading = false;
    });

    builder.addCase(thunkGetUserPrvWithdrawal.fulfilled, (state, action) => {
      appSlice.caseReducers.setPrvWithdrawal(state, {
        ...action,
        payload: {
          ...action.payload,
        },
      });
      state.loading = false;
    });

    addTxNotifications(builder, thunkApproveToken, 'approveToken');
    addTxNotifications(builder, thunkStakeAuxo, 'stakeAuxo');
    addTxNotifications(builder, thunkConvertXAUXO, 'convertXAUXO');
    addTxNotifications(builder, thunkIncreaseStakeAuxo, 'increaseStakeAuxo');
    addTxNotifications(builder, thunkIncreaseLockVeAUXO, 'increaseLockVeAuxo');
    addTxNotifications(builder, thunkBoostToMaxVeAUXO, 'boostToMaxVeAuxo');
    addTxNotifications(builder, thunkWithdrawFromVeAUXO, 'withdrawVeAuxo');
    addTxNotifications(builder, thunkStakeXAUXO, 'stakeXAUXO');
    addTxNotifications(builder, thunkUnstakeXAUXO, 'unstakeXAUXO');
    addTxNotifications(builder, thunkEarlyTermination, 'earlyTermination');
    addTxNotifications(builder, thunkDelegateVote, 'delegateVote');
    addTxNotifications(builder, ThunkWithdrawPrv, 'withdrawPrv');
  },

  reducers: {
    setState: (
      state,
      action: PayloadAction<{
        tokens: Tokens;
        uniqueNetworks: number;
        totalAssets: number;
        totalBalances: number;
      }>,
    ) => {
      state.tokens = merge({}, state.tokens, action.payload.tokens);
      state.stats.balance.tokens = action.payload.totalBalances;
      state.stats.networks.tokens = action.payload.uniqueNetworks;
      state.stats.assets.tokensUsed = action.payload.totalAssets;
      state.stats.networks.total = state.stats.networks.tokens;
      state.stats.assets.totalProductsUsed = state.stats.assets.tokensUsed;
      state.stats.balance.total = state.stats.balance.tokens;
    },
    setProductsState: (state, action: PayloadAction<Tokens>) => {
      state.tokens = merge({}, state.tokens, action.payload);
    },
    setIncreasedStakingValue: (state, action: PayloadAction<number>) => {
      state.increasedStakingValue = action.payload;
    },

    setPrvWithdrawal: (state, action: PayloadAction<Tokens>) => {
      state.tokens = merge({}, state.tokens, action.payload);
    },
  },
});

export const { setState, setIncreasedStakingValue } = appSlice.actions;

export default appSlice.reducer;
