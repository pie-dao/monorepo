import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type SliceState = {
  hideBalance: boolean;
  defaultCurrency: SupportedCurrencies;
  defaultLocale: SupportedLocales;
};

type SupportedCurrencies = 'USD' | 'EUR';
type SupportedLocales = 'en-US' | 'it-IT';

const initialState: SliceState = {
  hideBalance: false,
  defaultCurrency: 'USD',
  defaultLocale: 'en-US',
};

export const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    setHideBalance: (state, action: PayloadAction<boolean>) => {
      state.hideBalance = action.payload;
    },
    setDefaultCurrency: (
      state,
      action: PayloadAction<SupportedCurrencies, SupportedLocales>,
    ) => {
      state.defaultCurrency = action.payload;
    },
  },
});

export const { setHideBalance, setDefaultCurrency } = preferencesSlice.actions;
export default preferencesSlice.reducer;
