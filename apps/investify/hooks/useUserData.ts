import { useEffect } from 'react';
import { useAppDispatch } from '.';
import {
  thunkGetProductsData,
  thunkGetUserVaultsData,
} from '../store/products/thunks';

export function useUserData(account: string) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!account) return;
    dispatch(thunkGetProductsData(account));
    dispatch(thunkGetUserVaultsData(account));
  }, [account, dispatch]);
}
