import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  thunkGetProductsData,
  thunkGetVaultsData,
  thunkGetUserVaultsData,
} from './thunks';
import {
  Products,
  SliceState,
  Vaults,
  BigNumberString,
} from './products.types';
import { merge } from 'lodash';

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
  },

  reducers: {
    setState: (
      state,
      action: PayloadAction<{
        tokens: Products;
        uniqueNetworks: number;
        totalAssets: number;
        totalBalances: number;
      }>,
    ) => {
      state.tokens = action.payload.tokens;
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
  },
});

export const { setState } = appSlice.actions;

export default appSlice.reducer;
