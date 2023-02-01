import { useWeb3React } from '@web3-react/core';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '.';
import { setIsMigrationDeployed } from '../store/migration/migration.slice';
import { setIsOpen } from '../store/modal/modal.slice';
import { getSigner, useUpgradoor } from './useContracts';

export default function useCheckUpgradoorDeployed(): boolean | null {
  const upgradoor = useUpgradoor();
  const { library, account } = useWeb3React();
  const dispatch = useAppDispatch();
  const { isMigrationDeployed } = useAppSelector((state) => state.migration);

  useEffect(() => {
    const checkIfDeployed = async () => {
      if (!account || !library) return;
      if (!upgradoor) {
        dispatch(setIsOpen(true));
        dispatch(setIsMigrationDeployed(false));
        return;
      }
      const signer = getSigner(library, account);
      const isDeployed =
        (await signer.provider.getCode(upgradoor.address)) !== '0x';
      dispatch(setIsMigrationDeployed(isDeployed));
      !isDeployed && dispatch(setIsOpen(true));
    };
    checkIfDeployed();
  }, [upgradoor, account, library, dispatch]);
  return isMigrationDeployed;
}
