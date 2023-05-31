import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();

// return type needed for redux wrapper
export const useAppSelector: TypedUseSelectorHook<ReturnType<RootState>> =
  useSelector;

export * from './useFormattedBalance';
export * from './useTreasury';
