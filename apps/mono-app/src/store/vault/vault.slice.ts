import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { vaultState } from './vault.state';
import { UserBalanceOnChainData, VaultOnChainData } from './Vault';


export const vaultSlice = createSlice({
  name: 'vault',
  initialState: vaultState,
  reducers: {
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
    }
  },
});

export const { setUserBalances, setOnChainVaultData, setSelectedVault } = vaultSlice.actions;
export default vaultSlice.reducer;

