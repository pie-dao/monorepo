import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import useTranslation from 'next-translate/useTranslation';
import { useAppSelector, useAppDispatch } from '../../../hooks';
import { thunkChangePreference } from '../../../store/lending/lending.thunks';
import { useLendingPoolContract } from '../../../hooks/useContracts';
import { PendingTransactionContent } from './PendingTransactionContent';
import { PREFERENCES } from '../../../utils/constants';
import { UseUserCanClaim, UseUserCanCompound } from '../../../hooks/useLending';

export default function ChangePreference() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [changePreferenceLoading, setChangePreferenceLoading] = useState(false);
  const { selectedPool, preference, tx } = useAppSelector(
    (state) => state.lending.lendingFlow,
  );
  const lendingPoolContract = useLendingPoolContract(selectedPool);

  const canClaim = UseUserCanClaim(selectedPool);
  const canCompound = UseUserCanCompound(selectedPool);

  const preferenceKey = Object.keys(PREFERENCES)
    .find((key) => PREFERENCES[key as keyof typeof PREFERENCES] === preference)
    ?.toLowerCase();

  const changePreference = () => {
    setChangePreferenceLoading(true);
    dispatch(
      thunkChangePreference({
        lendingPool: lendingPoolContract,
        preference,
        canClaim,
        canCompound,
      }),
    ).finally(() => setChangePreferenceLoading(false));
  };

  return (
    <>
      {!tx?.hash ? (
        <>
          <Dialog.Title
            as="h3"
            className="font-bold text-center text-xl text-primary capitalize w-full"
          >
            {t('requestChangePreference')}
          </Dialog.Title>
          <Dialog.Description className="text-center text-base text-sub-dark w-full font-medium [text-wrap:balance]">
            {t('requestChangePreferenceDescription', {
              preference: preferenceKey,
            })}
          </Dialog.Description>

          <div className="w-full flex flex-col gap-y-4 items-center mt-12">
            {!changePreferenceLoading ? (
              <button
                type="button"
                className="w-fit px-20 py-2 text-lg font-medium text-white bg-secondary rounded-full ring-inset ring-2 ring-secondary enabled:hover:bg-transparent enabled:hover:text-secondary disabled:opacity-70"
                onClick={changePreference}
              >
                {t('confirm')}
              </button>
            ) : (
              <div className="w-full flex justify-center">
                <p className="bg-clip-text bg-gradient-major-colors text-transparent ">
                  {t('confirmInWallet')}
                </p>
              </div>
            )}
          </div>
        </>
      ) : (
        <PendingTransactionContent />
      )}
    </>
  );
}
