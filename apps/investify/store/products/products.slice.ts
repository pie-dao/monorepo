import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { thunkGetProductsData } from './thunks';
import { Products, RootState } from './products.types';

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
    setState: (state, action: PayloadAction<{ newState: Products }>) => {
      state.products = action.payload.newState;
    },
  },
});

export const { setState } = appSlice.actions;

export default appSlice.reducer;
