import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { vaultState } from './vault.state';
import { Balance, UserBalanceOnChainData, Vault, VaultOnChainData } from './Vault';
import { toBalance } from '../../utils';
import { addBalances, subBalances } from '../../utils/balances';

export const vaultSlice = createSlice({
  name: 'vault',
  initialState: vaultState,
  reducers: {
    setVaults: (state, action: PayloadAction<Vault[]>) => {
      state.vaults = action.payload;
    },
    setOnChainVaultData: (state, action: PayloadAction<VaultOnChainData>) => {
      const vault = state.vaults.find(v => v.address === action.payload.address);
      if (vault) {
        vault.stats = action.payload.stats;
        vault.token = action.payload.token;
      }
    },
    setUserBalances: (state, action: PayloadAction<UserBalanceOnChainData>) => {
      const vault = state.vaults.find(v => v.address === action.payload.address);
      if (vault) {
        vault.userBalances = action.payload.userBalances
      }
    },
    setSelectedVault: (state, action: PayloadAction<string>) => {
      state.selected = action.payload;
    },
    setApproval: (state, action: PayloadAction<Balance>) => {
      const vault = state.vaults.find(v => v.address === state.selected);
      if (vault && vault.userBalances) {
        vault.userBalances.allowance = action.payload;
      }
    },
    setNewBalances: (state, action: PayloadAction<Balance>) => {
      const vault = state.vaults.find(v => v.address === state.selected);
      if (vault && vault.userBalances && vault.token?.decimals) {
        const decimals = vault.token.decimals;
        vault.userBalances.allowance = toBalance(0, decimals);
        vault.userBalances.vaultUnderlying = addBalances(vault.userBalances.vaultUnderlying, action.payload);
        vault.userBalances.wallet = subBalances(vault.userBalances.wallet, action.payload)
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setReduceVaultTokens: (state, action: PayloadAction<Balance>) => {
      // to do - reduce the corresponding underlying balance
      const vault = state.vaults.find(v => v.address === state.selected);
      if (vault && vault.userBalances && vault.token?.decimals) {
        vault.userBalances.vault = subBalances(vault.userBalances.vault, action.payload);
      }
    },
  },
});

export const {
  setUserBalances,
  setOnChainVaultData,
  setSelectedVault,
  setApproval,
  setNewBalances,
  setReduceVaultTokens,
  setLoading,
  setVaults,
} = vaultSlice.actions;
export default vaultSlice.reducer;

