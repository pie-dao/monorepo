import { useEffect, useRef, useState } from 'react';
import { Dialog } from '@headlessui/react';
import useTranslation from 'next-translate/useTranslation';
import { useAppSelector, useAppDispatch } from '../../../hooks';
import Image from 'next/image';
import { useLendingPoolContract } from '../../../hooks/useContracts';
import { formatBalance } from '../../../utils/formatBalance';
import { thunkLendDeposit } from '../../../store/lending/lending.thunks';
import { useEnanchedPools } from '../../../hooks/useEnanchedPools';
import { PendingTransactionContent } from './PendingTransactionContent';
import { UseUserCanClaim, UseUserCanCompound } from '../../../hooks/useLending';

export default function LendDeposit() {
  const { t } = useTranslation();
  const { selectedPool, amount, tx } = useAppSelector(
    (state) => state.lending.lendingFlow,
  );
  const { defaultLocale } = useAppSelector((state) => state.preferences);
  const dispatch = useAppDispatch();
  const lendingPoolContract = useLendingPoolContract(selectedPool);
  const [lendingLoading, setLendingLoading] = useState(false);
  const { data } = useEnanchedPools(selectedPool);
  const canClaim = UseUserCanClaim(selectedPool);
  const canCompound = UseUserCanCompound(selectedPool);

  const isMountedRef = useRef(null);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const confirmDeposit = () => {
    setLendingLoading(true);
    dispatch(
      thunkLendDeposit({
        lendingPool: lendingPoolContract,
        deposit: amount,
        canClaim,
        canCompound,
      }),
    ).finally(() => {
      if (isMountedRef.current) {
        setLendingLoading(false);
      }
    });
  };

  return (
    <>
      {!tx?.hash ? (
        <>
          <Dialog.Title
            as="h3"
            className="font-bold text-center text-xl text-primary capitalize w-full"
          >
            {t('confirm')}
          </Dialog.Title>

          <Dialog.Description className="text-center text-base text-sub-dark w-full mt-2 font-medium [text-wrap:balance]">
            {t('confirmDepositDescription', {
              token: data?.attributes?.token?.data?.attributes?.name,
            })}
          </Dialog.Description>
          <Dialog.Description className="text-center text-base text-sub-dark w-full mt-2 font-medium [text-wrap:balance]">
            {t('depositAndClaimDisclaimer')}
          </Dialog.Description>
          <div className="overflow-hidden rounded-lg items-start w-full font-medium">
            <div className="flex flex-col px-4 py-4 w-full gap-y-3 h-full">
              <div className="flex flex-col items-center justify-center w-full gap-y-4 border-y border-custom-border py-3">
                <div className="text-2xl w-fit text-white font-medium flex items-center gap-x-2 bg-gradient-major-secondary-predominant pl-4 pr-6 py-2 rounded-lg z-10">
                  {data?.attributes?.token?.data?.attributes?.icon?.data
                    ?.attributes?.url ? (
                    <Image
                      src={
                        data?.attributes?.token?.data?.attributes?.icon?.data
                          ?.attributes?.url
                      }
                      alt={data?.attributes?.token?.data?.attributes?.name}
                      width={24}
                      height={24}
                    />
                  ) : null}
                  <span>
                    {formatBalance(amount.label, defaultLocale, 6, 'standard')}{' '}
                    <span className="uppercase">
                      {data?.attributes?.token?.data?.attributes?.name}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full flex flex-col gap-y-4 items-center mt-4">
            {!lendingLoading ? (
              <button
                type="button"
                className="w-fit px-20 py-2 text-lg font-medium text-white bg-secondary rounded-full ring-inset ring-2 ring-secondary enabled:hover:bg-transparent enabled:hover:text-secondary disabled:opacity-70"
                onClick={confirmDeposit}
              >
                {t('confirmDeposit')}
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
