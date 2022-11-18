import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  thunkGetProductsData,
  thunkGetUserProductsData,
  thunkGetVaultsData,
  thunkGetUserVaultsData,
  thunkMakeDeposit,
  thunkApproveDeposit,
  thunkApproveToken,
  thunkIncreaseWithdrawal,
  thunkConfirmWithdrawal,
  thunkAuthorizeDepositor,
  thunkStakeAuxo,
  thunkGetVeAUXOStakingData,
  thunkGetUserStakingData,
  thunkGetXAUXOStakingData,
} from './thunks';
import { Tokens, SliceState, Vaults } from './products.types';
import { merge } from 'lodash';
import addTxNotifications from '../../utils/notifications';

const initialState: SliceState = {
  tokens: {},
  vaults: {},
  loading: false,
  stats: {
    networks: {
      vaults: 0,
      tokens: 0,
      total: 0,
    },
    assets: {
      vaultsUsed: 0,
      tokensUsed: 0,
      totalProductsUsed: 0,
    },
    balance: { tokens: 0, vaults: 0, total: 0 },
  },
  activeVault: '',
  activeToken: '',
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

    builder.addCase(thunkGetVaultsData.rejected, (state, action) => {
      console.error(action.error);
      state.loading = false;
    });

    builder.addCase(thunkGetVaultsData.fulfilled, (state, action) => {
      appSlice.caseReducers.setVaultState(state, {
        ...action,
        payload: {
          ...action.payload,
        },
      });
      state.loading = false;
    });

    builder.addCase(thunkGetUserVaultsData.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(thunkGetUserVaultsData.rejected, (state, action) => {
      console.error(action.error);
      state.loading = false;
    });

    builder.addCase(thunkGetUserVaultsData.fulfilled, (state, action) => {
      appSlice.caseReducers.setUserVaultState(state, {
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

    addTxNotifications(builder, thunkMakeDeposit, 'makeDeposit');
    addTxNotifications(builder, thunkApproveDeposit, 'approveDeposit');
    addTxNotifications(builder, thunkApproveToken, 'approveToken');
    addTxNotifications(builder, thunkIncreaseWithdrawal, 'increaseWithdrawal');
    addTxNotifications(builder, thunkConfirmWithdrawal, 'confirmWithdrawal');
    addTxNotifications(builder, thunkAuthorizeDepositor, 'authorizeDepositor');
    addTxNotifications(builder, thunkStakeAuxo, 'stakeAuxo');
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
      state.stats.networks.total =
        state.stats.networks.vaults + state.stats.networks.tokens;
      state.stats.assets.totalProductsUsed =
        state.stats.assets.tokensUsed + state.stats.assets.vaultsUsed;
      state.stats.balance.total =
        state.stats.balance.tokens + state.stats.balance.vaults;
    },
    setProductsState: (
      state,
      action: PayloadAction<{
        products: Tokens;
      }>,
    ) => {
      state.tokens = merge({}, state.tokens, action.payload);
    },
    setVaultState: (
      state,
      action: PayloadAction<{
        vaults: Vaults;
      }>,
    ) => {
      state.vaults = merge({}, state.vaults, action.payload);
    },
    setUserVaultState: (
      state,
      action: PayloadAction<{
        vaults: Vaults;
        chainUsed: number;
        totalAssets: number;
        totalBalances: number;
      }>,
    ) => {
      state.vaults = merge({}, state.vaults, action.payload.vaults);
      state.stats.networks.vaults = action.payload.chainUsed;
      state.stats.balance.vaults = action.payload.totalBalances;
      state.stats.assets.vaultsUsed = action.payload.totalAssets;
      state.stats.networks.total =
        state.stats.networks.vaults + state.stats.networks.tokens;
      state.stats.assets.totalProductsUsed =
        state.stats.assets.tokensUsed + state.stats.assets.vaultsUsed;
      state.stats.balance.total =
        state.stats.balance.tokens + state.stats.balance.vaults;
    },
    setActiveVault: (state, action: PayloadAction<string>) => {
      state.activeVault = action.payload;
    },
    setActiveToken: (state, action: PayloadAction<string>) => {
      state.activeToken = action.payload;
    },
  },
});

export const { setState, setActiveVault } = appSlice.actions;

export default appSlice.reducer;
