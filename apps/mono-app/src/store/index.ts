import { configureStore, ThunkAction, Action, combineReducers } from '@reduxjs/toolkit';
import vaultReducer from './vault/vault.slice';

export const rootReducer = combineReducers({
  vault: vaultReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
