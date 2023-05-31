import {
  configureStore,
  ThunkAction,
  Action,
  combineReducers,
  AnyAction,
} from '@reduxjs/toolkit';
import { createWrapper, HYDRATE } from 'next-redux-wrapper';
import modalReducer from './modal/modal.slice';
import preferencesReducer from './preferences/preferences.slice';
import productsReducer from './products/products.slice';
import notificationsReducer from './notifications/notifications.slice';
import migrationReducer from './migration/migration.slice';
import rewardsReducer from './rewards/rewards.slice';
import { merge } from 'lodash';
import memoize from 'proxy-memoize';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';

export const rootReducer = combineReducers({
  modal: modalReducer,
  preferences: preferencesReducer,
  dashboard: productsReducer,
  notifications: notificationsReducer,
  migration: migrationReducer,
  rewards: rewardsReducer,
});

const reducer = (state: ReturnType<typeof rootReducer>, action: AnyAction) => {
  if (action.type === HYDRATE) {
    const nextState = merge(state, action.payload);
    return nextState;
  } else {
    return rootReducer(state, action);
  }
};

export const makeStore = () =>
  configureStore({
    reducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [HYDRATE],
        },
      }),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = ReturnType<typeof makeStore>['dispatch'];
export type RootState = typeof rootReducer;
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

export const wrapper = createWrapper<AppStore>(makeStore);

// use this when selector causes re-renders because of nested state
export const useProxySelector = createProxySelectorHook<AppStore>();
