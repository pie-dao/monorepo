import { useEffect } from 'react';
import { useAppDispatch } from '.';
import {
  thunkGetUserProductsData,
  thunkGetUserVaultsData,
} from '../store/products/thunks';

export function useUserData(account: string) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!account) return;
    dispatch(thunkGetUserProductsData(account));
    dispatch(thunkGetUserVaultsData(account));
  }, [account, dispatch]);
}
