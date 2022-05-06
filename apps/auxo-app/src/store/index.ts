import {
  configureStore,
  ThunkAction,
  Action,
  combineReducers,
} from '@reduxjs/toolkit';
import vaultReducer from './vault/vault.slice';
import appReducer from './app/app.slice';
import memoize from 'proxy-memoize';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';

export const rootReducer = combineReducers({
  vault: vaultReducer,
  app: appReducer,
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

const createProxySelectorHook = <TState extends object = any>() => {
  const useProxySelector = <TReturnType>(
    fn: (state: TState) => TReturnType,
    deps?: any[],
  ): TReturnType => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return useSelector(useCallback(memoize(fn), deps as any));
  };
  return useProxySelector;
};

// use this when selector causes re-renders because of nested state
export const useProxySelector = createProxySelectorHook<RootState>();
