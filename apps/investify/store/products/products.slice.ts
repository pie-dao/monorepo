// @ts-ignore

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { thunkGetProductsData } from './thunks';
import { SupportedChains } from '../../utils/networks';

// alias to make it more obvious that this is a number in string repr
type BigNumberString = string;
type Product = {
  balance: [SupportedChains, BigNumberString][];
  decimals: number;
};

export type RootState = {
  products: Record<string, Product>;
  loading: boolean;
};

const initialState: RootState = {
  products: {},
  loading: false,
};

const appSlice = createSlice({
  name: 'products',
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
          newState: {
            ...action.payload,
          },
        },
      });
      state.loading = false;
    });
  },

  reducers: {
    setState: (
      state,
      action: PayloadAction<{ newState: Omit<RootState, 'loading'> }>,
    ) => {
      state.products = action.payload.newState;
    },
  },
});

export const { setState } = appSlice.actions;

export default appSlice.reducer;
