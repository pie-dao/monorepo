import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { vaultState } from './vault.state';
import { Balance, Vault } from './Vault';
import { convertFromUnderlying, convertToUnderlying } from '../../utils';
import { addBalances, subBalances, zeroBalance } from '../../utils/balances';
import {
  thunkApproveDeposit,
  thunkMakeDeposit,
  thunkConfirmWithdrawal,
  thunkIncreaseWithdrawal,
  thunkAuthorizeDepositor,
} from './vault.thunks';

export const vaultSlice = createSlice({
  name: 'vault',
  initialState: vaultState,

  /**
   * Extra reducers here subscribe to the async thunks 'fulfilled' hook
   * and prepare the state transformations for the corresponding vault.
   * To save repeating the find and update logic, we re-use the caseReducer
   * `setVault`, which finds and updates a single vault, according to
   * the transformer function.
   */
  extraReducers: (builder) => {
    builder.addCase(thunkApproveDeposit.fulfilled, (state, action) => {
      vaultSlice.caseReducers.setVault(state, {
        type: action.type,
        payload: {
          transformer: (vault, allowance) => {
            return (
              vault &&
              vault.userBalances && {
                ...vault,
                userBalances: {
                  ...vault.userBalances,
                  allowance,
                },
              }
            );
          },
          change: action.payload.deposit,
        },
      });
    });

    builder.addCase(thunkMakeDeposit.fulfilled, (state, action) => {
      vaultSlice.caseReducers.setVault(state, {
        type: action.type,
        payload: {
          transformer: (vault, deposit) => {
            if (vault && vault.userBalances && vault.stats)
              return {
                ...vault,
                userBalances: {
                  ...vault.userBalances,
                  wallet: subBalances(vault.userBalances.wallet, deposit),
                  vaultUnderlying: addBalances(
                    vault.userBalances.vaultUnderlying,
                    deposit,
                  ),
                  vault: addBalances(
                    vault.userBalances.vault,
                    convertFromUnderlying(
                      deposit,
                      vault.stats?.exchangeRate,
                      vault.token.decimals,
                    ),
                  ),
                },
              };
          },
          change: action.payload.deposit,
        },
      });
    });

    builder.addCase(thunkConfirmWithdrawal.fulfilled, (state, action) => {
      vaultSlice.caseReducers.setVault(state, {
        type: action.type,
        payload: {
          transformer: (vault, pendingSharesUnderlying) => {
            if (vault && vault.userBalances && vault.userBalances.batchBurn)
              return {
                ...vault,
                userBalances: {
                  ...vault.userBalances,
                  wallet: addBalances(
                    vault.userBalances.wallet,
                    pendingSharesUnderlying,
                  ),
                  batchBurn: {
                    ...vault.userBalances.batchBurn,
                    available: zeroBalance(),
                    shares: zeroBalance(),
                    round: vault.userBalances.batchBurn.round + 1,
                  },
                },
              };
          },
          change: action.payload.pendingSharesUnderlying,
        },
      });
    });

    builder.addCase(thunkIncreaseWithdrawal.fulfilled, (state, action) => {
      vaultSlice.caseReducers.setVault(state, {
        type: action.type,
        payload: {
          transformer: (vault, withdraw) => {
            if (
              vault &&
              vault.userBalances &&
              vault.userBalances.batchBurn &&
              vault.stats?.exchangeRate
            )
              return {
                ...vault,
                userBalances: {
                  ...vault.userBalances,
                  vault: subBalances(vault.userBalances.vault, withdraw),
                  vaultUnderlying: subBalances(
                    vault.userBalances.vaultUnderlying,
                    convertToUnderlying(
                      withdraw,
                      vault.stats.exchangeRate,
                      vault.token.decimals,
                    ),
                  ),
                  batchBurn: {
                    ...vault.userBalances.batchBurn,
                    shares: addBalances(
                      vault.userBalances.batchBurn.shares,
                      withdraw,
                    ),
                  },
                },
              };
          },
          change: action.payload.withdraw,
        },
      });
    });

    builder.addCase(thunkAuthorizeDepositor.fulfilled, (state, action) => {
      vaultSlice.caseReducers.setVault(state, {
        type: action.type,
        payload: {
          transformer: (vault) => {
            if (
              vault &&
              vault.userBalances &&
              vault.userBalances.batchBurn &&
              vault.stats?.exchangeRate
            )
              return {
                ...vault,
                auth: {
                  ...vault.auth,
                  isDepositor: true,
                },
              };
          },
          // No change as it is auth (Hack (?))
          change: zeroBalance(),
        },
      });
    });
  },

  // reducers actually apply the state changes
  reducers: {
    // Use when setting the whole state
    setVaults: (state, action: PayloadAction<Vault[]>) => {
      state.vaults = action.payload;
    },

    // use when changing a single vault
    setVault: (
      state,
      action: PayloadAction<{
        change: Balance;
        // The transformation function to apply to the vault
        transformer: (vault: Vault, change: Balance) => Vault | undefined;
      }>,
    ) => {
      /**
       * Pass a vault transformer function, and this reducer will find and update the vault accordingly
       */
      state.vaults = state.vaults.map((originalVault) => {
        const newVault = action.payload.transformer(
          originalVault,
          action.payload.change,
        );
        return originalVault.address === state.selected
          ? (newVault as Vault)
          : originalVault;
      });
    },

    // call after sign out
    setResetUserVaultDetails: (state) => {
      state.vaults = state.vaults.map((vault) => ({
        ...vault,
        userBalances: undefined,
        auth: {
          ...vault.auth,
          isDepositor: false,
        },
      }));
    },

    // update the currently selected vault on the vault details page
    setSelectedVault: (state, action: PayloadAction<string>) => {
      state.selected = action.payload;
    },
  },
});

export const { setSelectedVault, setVaults, setResetUserVaultDetails } =
  vaultSlice.actions;
export default vaultSlice.reducer;
